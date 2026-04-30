'use server';
/**
 * @fileOverview Flow to identify plant species and diseases from an image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiagnosePlantImageInputSchema = z.object({
  imageDataUri: z.string().describe("A photo of a plant as a base64 data URI."),
});
export type DiagnosePlantImageInput = z.infer<typeof DiagnosePlantImageInputSchema>;

const DiagnosePlantImageOutputSchema = z.object({
  plantName: z.string().describe('The identified plant species (e.g., Tomate, Patata).'),
  detectedDisease: z.string().describe('The name of the detected disease, or "Sana" if no disease is found.'),
  isHealthy: z.boolean().describe('Whether the plant appears healthy.'),
  confidence: z.number().describe('Confidence score between 0 and 1.'),
});
export type DiagnosePlantImageOutput = z.infer<typeof DiagnosePlantImageOutputSchema>;

export async function diagnosePlantFromImage(input: DiagnosePlantImageInput): Promise<DiagnosePlantImageOutput> {
  return diagnosePlantImageFlow(input);
}

const diagnosePlantImagePrompt = ai.definePrompt({
  name: 'diagnosePlantImagePrompt',
  input: { schema: DiagnosePlantImageInputSchema },
  output: { schema: DiagnosePlantImageOutputSchema },
  prompt: `Actúa como un experto fitopatólogo y botánico. 
Analiza la siguiente imagen de una planta:
1. Identifica la especie de la planta (nombre común en español).
2. Determina si la planta muestra signos de alguna enfermedad, plaga o deficiencia nutricional.
3. Si está enferma, indica el nombre de la enfermedad. Si no, indica "Sana".

Imagen: {{media url=imageDataUri}}`,
});

const diagnosePlantImageFlow = ai.defineFlow(
  {
    name: 'diagnosePlantImageFlow',
    inputSchema: DiagnosePlantImageInputSchema,
    outputSchema: DiagnosePlantImageOutputSchema,
  },
  async (input) => {
    const { output } = await diagnosePlantImagePrompt(input);
    if (!output) {
      throw new Error('No se pudo analizar la imagen.');
    }
    return { ...output };
  }
);
