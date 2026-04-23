"use client";

import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { LogOut, Sprout, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { PlantScanner } from './plant-scanner';
import { HistoryList } from './history-list';

export function Dashboard() {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <header className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">VigilAgro</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/planes">
            <Button variant="outline" className="flex items-center gap-2 font-medium">
              <CreditCard className="w-4 h-4" />
              <span>Ver Planes</span>
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 font-medium text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      <section aria-labelledby="scanner-title">
        <h2 id="scanner-title" className="sr-only">Escáner de Plantas</h2>
        <PlantScanner />
      </section>

      <section aria-labelledby="history-title" className="pt-8">
        <h2 id="history-title" className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          Historial de Diagnósticos
        </h2>
        <HistoryList />
      </section>
    </div>
  );
}
