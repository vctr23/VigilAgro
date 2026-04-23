import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft, Leaf, TreePine, Tractor } from 'lucide-react';

export default function PlanesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="self-start mb-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Button>
          </Link>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight">Potencia tu Cultivo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a las necesidades de tu terreno y maximiza tu cosecha con inteligencia artificial.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
            <CardHeader className="space-y-2 pb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Plan Semilla</CardTitle>
              <CardDescription>Para pequeños huertos y agricultores aficionados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold">Gratis</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Análisis de 3 plantas/semana</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Detección básica de plagas</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Historial de diagnósticos permanente</span></li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">Plan Actual</Button>
            </CardFooter>
          </Card>

          {/* Plus Plan */}
          <Card className="border-2 border-primary shadow-lg relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Más Popular
            </div>
            <CardHeader className="space-y-2 pb-4 pt-8">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <TreePine className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Plan Cosecha</CardTitle>
              <CardDescription>Para agricultores profesionales y medianos cultivos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold flex items-baseline gap-1">
                $14.99<span className="text-lg text-muted-foreground font-normal">/mes</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Análisis ilimitados</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Detección avanzada (99% precisión)</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Soporte prioritario 24/7</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Recomendaciones de tratamiento</span></li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Mejorar Plan</Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-transparent hover:border-primary/20 transition-all shadow-sm hover:shadow-md">
            <CardHeader className="space-y-2 pb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                <Tractor className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Plan Latifundio</CardTitle>
              <CardDescription>Para grandes explotaciones agrícolas y corporaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-4xl font-bold text-muted-foreground text-2xl">Personalizado</div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Todo lo del plan Cosecha Plus</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>API para integración con drones</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Reportes masivos en tiempo real</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> <span>Gestor de cuenta dedicado</span></li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="secondary">Contactar a Ventas</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
