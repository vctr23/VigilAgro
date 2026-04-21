# VigilAgro

VigilAgro es una aplicación web que permite **subir una foto de una planta** para que una **IA identifique la especie y detecte posibles enfermedades**, y luego genere **consejos de tratamiento**.  
Incluye **autenticación**, persistencia de resultados y un **historial de diagnósticos** por usuario.

## Funcionalidades

- **Autenticación** de usuarios (Firebase Auth).
- **Escaneo / diagnóstico por imagen**:
  - Selección de imagen desde el dispositivo.
  - Análisis con IA para:
    - Identificar **nombre de la planta**.
    - Detectar **enfermedad/plaga/deficiencia** o marcar como **“Sana”**.
    - Entregar una **confianza** (0 a 1).
- **Consejos de tratamiento** generados por IA cuando la planta no está sana.
- **Persistencia en Firebase**:
  - Imagen subida a **Firebase Storage**.
  - Registro del diagnóstico en **Firestore**.
- **Historial de diagnósticos** por usuario.

## Tecnologías

- **Next.js** (App Router) + **React**
- **TypeScript**
- **Firebase**:
  - Authentication
  - Firestore
  - Storage
- **Tailwind CSS** + componentes UI (Radix UI)

## Estructura del proyecto (resumen)

- `src/app/page.tsx`: Decide si renderiza el **Dashboard** o el **formulario de login** según el estado del usuario.
- `src/components/dashboard/dashboard.tsx`: Pantalla principal (scanner + historial) y botón de logout.
- `src/components/dashboard/plant-scanner.tsx`: Flujo completo de:
  1) convertir imagen a base64  
  2) diagnosticar con IA  
  3) subir imagen a Storage  
  4) guardar diagnóstico en Firestore  
  5) generar consejos y actualizar el documento  
- `src/ai/flows/diagnose-plant-image-flow.ts`: Prompt/flow de Genkit para diagnóstico desde imagen.
- `src/firebase/index.ts`: Inicialización de Firebase y exports de helpers.

## Requisitos

- Node.js (recomendado: versión moderna LTS).
- Un proyecto de Firebase con **Auth**, **Firestore** y **Storage** habilitados.
- Variables/configuración necesarias para Genkit/Google GenAI (según tu setup local).

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La app corre en `http://localhost:3000`.

## Ejecutar Genkit (desarrollo)

```bash
npm run genkit:dev
```

o en modo watch:

```bash
npm run genkit:watch
```

## Build y producción

```bash
npm run build
npm run start
```

## Datos guardados (Firestore)

Los diagnósticos se guardan bajo la ruta:

- `users/{uid}/diagnosticos/{docId}`

Campos principales (según el código):

- `userId`
- `imageUrl`
- `nombrePlanta`
- `enfermedadDetectada`
- `fecha` (serverTimestamp)
- `estado` (`pendiente_consejos` | `completado`)
- `consejosLLM`

## Notas

- El diagnóstico depende del modelo/prompt de IA; úsalo como **orientación**, no como sustituto de asesoría agronómica profesional.
- La inicialización de Firebase usa un archivo de configuración (`/firebase-applet-config.json`) referenciado desde el cliente.

## Licencia

Sin licencia definida actualmente.
