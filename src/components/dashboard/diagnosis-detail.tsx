"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Loader2, CheckCircle2, ChevronRight, Leaf } from 'lucide-react';
import Image from 'next/image';

interface DiagnosisDetailProps {
  diagnosis: {
    id: string;
    imageUrl: string;
    nombrePlanta: string;
    enfermedadDetectada: string;
    fecha: any;
    estado: 'pendiente_consejos' | 'completado';
    consejosLLM: string | null;
  };
  onClose: () => void;
}

export function DiagnosisDetail({ diagnosis, onClose }: DiagnosisDetailProps) {
  // Parse advice into list items if it's formatted as points
  const adviceItems = diagnosis.consejosLLM?.split('\n').filter(line => line.trim().length > 0) || [];

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden flex flex-col rounded-3xl border-2 border-primary/20">
        <DialogHeader className="p-6 bg-primary text-white border-b-0">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <DialogTitle className="text-2xl font-bold">Detalle del Diagnóstico</DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8 pb-12">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src={diagnosis.imageUrl} 
                alt={diagnosis.nombrePlanta} 
                fill 
                className="object-cover"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 bg-secondary/20 rounded-xl border border-secondary">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Planta</p>
                <p className="text-2xl font-bold text-primary">{diagnosis.nombrePlanta}</p>
              </div>
              <div className="space-y-2 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Enfermedad detectada</p>
                <p className="text-2xl font-bold text-destructive">{diagnosis.enfermedadDetectada}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span className="text-lg">Realizado el {diagnosis.fecha?.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                Consejos del Experto
                {diagnosis.estado === 'completado' && <CheckCircle2 className="w-6 h-6 text-primary" />}
              </h3>

              {diagnosis.estado === 'pendiente_consejos' ? (
                <div className="bg-accent/5 p-8 rounded-2xl border-2 border-dashed border-accent/30 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                  <p className="text-xl font-bold text-accent-foreground">Generando consejos expertos...</p>
                  <p className="text-lg text-muted-foreground">Nuestra IA está analizando la mejor forma de tratar tu planta.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adviceItems.length > 0 ? (
                    <div className="space-y-4">
                      {adviceItems.map((item, index) => (
                        <div key={index} className="flex gap-4 bg-white p-5 rounded-xl shadow-sm border border-muted group hover:border-primary/30 transition-colors">
                          <div className="bg-primary/10 text-primary h-10 w-10 min-w-[40px] flex items-center justify-center rounded-full font-bold text-lg">
                            {index + 1}
                          </div>
                          <p className="text-lg leading-relaxed">{item.replace(/^(\d+\.|-|\*)\s*/, '')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-lg p-6 bg-white rounded-xl border italic text-muted-foreground">No hay consejos disponibles.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}