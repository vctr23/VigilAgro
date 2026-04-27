"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, Search, X, Loader2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useUser, useFirestore, useStorage, setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { genPlantTreatmentAdvice } from '@/ai/flows/gen-ai-plant-treatment-advice-flow';
import { diagnosePlantFromImage } from '@/ai/flows/diagnose-plant-image-flow';
import Image from 'next/image';

export function PlantScanner() {
  const { user } = useUser();
  const db = useFirestore();
  const storage = useStorage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const runAnalysis = async () => {
    if (!selectedImage || !user || !db || !storage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Servicios no listos. Intenta de nuevo."
      });
      return;
    }

    const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    setIsAnalyzing(true);
    try {
      // 0. Verificar límite semanal (Plan Semilla: 3 análisis/semana)
      // Los administradores se saltan este límite
      if (!isAdmin) {
        const sieteDiasAtras = new Date();
        sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

        const q = query(
          collection(db, 'users', user.uid, 'diagnosticos'),
          where('fecha', '>=', Timestamp.fromDate(sieteDiasAtras))
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.size >= 3) {
          toast({
            variant: "destructive",
            title: "Límite semanal alcanzado",
            description: "Has agotado tus 3 análisis semanales del Plan Semilla. ¡Pásate al Plan Cosecha para análisis ilimitados!",
          });
          setIsAnalyzing(false);
          return;
        }
      }

      // 1. Convertir imagen a Base64 para la IA
      const base64Image = await fileToBase64(selectedImage);

      // 2. IA Visión: Identificar Planta y Enfermedad REAL
      toast({ title: "Analizando imagen", description: "Identificando planta y síntomas..." });
      const analysisResult = await diagnosePlantFromImage({
        imageDataUri: base64Image
      });

      // 3. Subida a Firebase Storage (para persistencia)
      const diagnosticoId = `${Date.now()}-${selectedImage.name.replace(/\s+/g, '_')}`;
      const storagePath = `users/${user.uid}/diagnosticos/${diagnosticoId}`;
      const storageRef = ref(storage, storagePath);

      const uploadResult = await uploadBytes(storageRef, selectedImage);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 4. Crear documento en Firestore
      const diagnosticosCollectionRef = collection(db, 'users', user.uid, 'diagnosticos');
      const newDocRef = doc(diagnosticosCollectionRef);

      const diagnosisData = {
        userId: user.uid,
        imageUrl,
        nombrePlanta: analysisResult.plantName,
        enfermedadDetectada: analysisResult.detectedDisease,
        fecha: serverTimestamp(),
        estado: 'pendiente_consejos',
        consejosLLM: null
      };

      setDocumentNonBlocking(newDocRef, diagnosisData, { merge: true });

      // 5. Generar consejos basados en el diagnóstico REAL
      if (!analysisResult.isHealthy) {
        toast({ title: "Buscando solución", description: `Generando tratamiento para ${analysisResult.detectedDisease}...` });
        const adviceResult = await genPlantTreatmentAdvice({
          nombrePlanta: analysisResult.plantName,
          enfermedadDetectada: analysisResult.detectedDisease
        });

        updateDocumentNonBlocking(newDocRef, {
          consejosLLM: adviceResult.consejosLLM,
          estado: 'completado'
        });
      } else {
        updateDocumentNonBlocking(newDocRef, {
          consejosLLM: "Tu planta parece estar sana. Sigue cuidándola con riego y luz adecuados.",
          estado: 'completado'
        });
      }

      toast({
        title: "¡Análisis completado!",
        description: `${analysisResult.plantName}: ${analysisResult.detectedDisease}`
      });

      resetScanner();
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Error en el análisis",
        description: error.message || "Fallo al conectar con la IA de visión."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-4 border-dashed border-primary/30 rounded-3xl overflow-hidden bg-white shadow-xl hover:border-primary/50 transition-colors">
        <CardContent className="p-0">
          {!previewUrl ? (
            <div
              className="flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:bg-primary/5 transition-all h-[400px]"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-primary/10 p-8 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">Analiza tu cultivo</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-sm">Sube una foto real de tu planta para que la IA la identifique.</p>
              <Button size="lg" className="h-16 px-10 rounded-2xl text-xl font-bold shadow-lg">
                <Upload className="mr-3 w-6 h-6" />
                Seleccionar Imagen
              </Button>
            </div>
          ) : (
            <div className="relative group">
              <div className="relative h-[450px] w-full">
                <Image
                  src={previewUrl}
                  alt="Vista previa de la planta"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-14 px-8 rounded-xl shadow-2xl font-bold"
                  onClick={resetScanner}
                  disabled={isAnalyzing}
                >
                  <X className="mr-2 w-5 h-5" />
                  Cambiar Foto
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {previewUrl && (
        <Button
          className="w-full h-20 text-2xl font-bold rounded-2xl shadow-xl flex items-center justify-center gap-4 bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-[1.02] transition-all"
          onClick={runAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>La IA está mirando tu planta...</span>
            </>
          ) : (
            <>
              <Search className="w-8 h-8" />
              <span>Iniciar Diagnóstico Real</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
