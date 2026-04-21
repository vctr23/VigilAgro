"use client";

import { useUser } from '@/firebase';
import { AuthForm } from '@/components/auth/auth-form';
import { Dashboard } from '@/components/dashboard/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout } from 'lucide-react';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Sprout className="w-16 h-16 text-primary animate-pulse mb-4" />
        <Skeleton className="h-10 w-64 rounded-full" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {user ? (
        <Dashboard />
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <AuthForm />
        </div>
      )}
    </main>
  );
}
