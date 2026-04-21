"use client";

import { useState } from 'react';
import { collection, orderBy, query } from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Calendar, ChevronRight } from 'lucide-react';
import { DiagnosisDetail } from './diagnosis-detail';
import Image from 'next/image';

interface Diagnosis {
  id: string;
  imageUrl: string;
  nombrePlanta: string;
  enfermedadDetectada: string;
  fecha: any;
  estado: 'pendiente_consejos' | 'completado';
  consejosLLM: string | null;
}

export function HistoryList() {
  const { user } = useUser();
  const db = useFirestore();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);

  const diagnosticsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    // Alineado con la estructura de backend.json: /users/{userId}/diagnosticos
    return query(
      collection(db, 'users', user.uid, 'diagnosticos'),
      orderBy('fecha', 'desc')
    );
  }, [db, user]);

  const { data: diagnostics, isLoading } = useCollection<Diagnosis>(diagnosticsQuery);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="text-lg">Cargando historial...</p>
      </div>
    );
  }

  if (!diagnostics || diagnostics.length === 0) {
    return (
      <div className="text-center p-12 bg-secondary/30 rounded-2xl border-2 border-dashed border-muted">
        <p className="text-xl text-muted-foreground font-medium">Aún no tienes diagnósticos.</p>
        <p className="text-lg text-muted-foreground">Sube tu primera foto arriba.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {diagnostics.map((item) => (
        <Card 
          key={item.id} 
          className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/40 overflow-hidden"
          onClick={() => setSelectedDiagnosis(item)}
        >
          <CardContent className="p-0 flex h-40">
            <div className="relative w-1/3 min-w-[120px]">
              <Image 
                src={item.imageUrl} 
                alt={item.nombrePlanta} 
                fill 
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary truncate">{item.nombrePlanta}</h3>
                <p className="text-lg text-destructive font-medium truncate">{item.enfermedadDetectada}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <Calendar className="w-4 h-4" />
                  <span>{item.fecha?.toDate().toLocaleDateString('es-ES') || 'Reciente'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                {item.estado === 'completado' ? (
                  <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 py-1 px-3 text-sm">
                    <CheckCircle className="w-3 h-3" />
                    Completo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="animate-pulse bg-accent/10 text-accent-foreground border-accent/20 flex items-center gap-1 py-1 px-3 text-sm">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Procesando...
                  </Badge>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedDiagnosis && (
        <DiagnosisDetail 
          diagnosis={selectedDiagnosis} 
          onClose={() => setSelectedDiagnosis(null)} 
        />
      )}
    </div>
  );
}
