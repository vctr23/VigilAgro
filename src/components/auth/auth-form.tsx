
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, initiateEmailSignIn, initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Sprout, Chrome, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function AuthForm() {
  const auth = useAuth();
  const { user } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast, dismiss } = useToast();
  const activeToastId = useRef<string | null>(null);

  // Limpiar toasts al detectar que el usuario ya entró
  useEffect(() => {
    if (user && activeToastId.current) {
      dismiss(activeToastId.current);
      activeToastId.current = null;
    }
  }, [user, dismiss]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (activeToastId.current) dismiss(activeToastId.current);
    setIsLoading(true);

    const { id } = toast({ 
      title: isLogin ? "Iniciando sesión" : "Creando cuenta", 
      description: isLogin ? "Verificando tus credenciales..." : "Registrando tus datos...",
    });
    activeToastId.current = id;

    try {
      if (isLogin) {
        await initiateEmailSignIn(auth, email, password);
      } else {
        await initiateEmailSignUp(auth, email, password);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      dismiss(id);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error de acceso",
        description: error.message || "No se pudo completar la operación."
      });
    }
  };

  const handleGoogleSignIn = async () => {
    // Evitar múltiples clics que lanzan el error auth/popup-closed-by-user
    if (isLoading) return;
    
    // Limpiar cualquier toast previo antes de abrir el popup
    if (activeToastId.current) dismiss(activeToastId.current);
    
    setIsLoading(true);
    const { id } = toast({ 
      title: "Google Auth", 
      description: "Iniciando proceso con Google...",
    });
    activeToastId.current = id;

    try {
      await initiateGoogleSignIn(auth);
      // El proceso de login exitoso será detectado por el useEffect de arriba
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      dismiss(id);
      setIsLoading(false);
      activeToastId.current = null;
      
      let errorMessage = "No se pudo conectar con Google.";
      // No loguear el error 'auth/popup-closed-by-user' como un problema grave
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "El proceso se interrumpió. Por favor, asegúrate de completar la selección de cuenta en la ventana de Google.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Error de red. Revisa tu conexión.";
      } else {
        // Loguear otros errores inesperados
        console.error('An unexpected error occurred during Google Sign-In:', error);
      }

      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMessage
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-2 border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Sprout className="w-12 h-12 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-primary">VigilAgro</CardTitle>
        <CardDescription className="text-lg">
          {isLogin ? 'Inicia sesión para cuidar tus cultivos' : 'Crea una cuenta para empezar'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">Correo electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
              className="h-12 text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" id="password-label" className="text-lg">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
              className="h-12 text-lg"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full h-14 text-xl font-bold rounded-xl shadow-md">
            <span className="flex items-center gap-2">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? <LogIn className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />)}
              {isLogin ? 'Entrar' : 'Registrarse'}
            </span>
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full h-14 text-lg font-semibold rounded-xl"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Chrome className="mr-2 h-5 w-5" />}
          Google
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col">
        <Button 
          variant="link" 
          type="button"
          disabled={isLoading}
          className="text-lg text-primary font-semibold"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
        </Button>
      </CardFooter>
    </Card>
  );
}
