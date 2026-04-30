'use server';
/**
 * @fileOverview A Genkit flow that generates personalized treatment advice for plant diseases.
 *
 * - genPlantTreatmentAdvice - A function that handles the generation of plant treatment advice.
 * - PlantTreatmentAdviceInput - The input type for the genPlantTreatmentAdvice function.
 * - PlantTreatmentAdviceOutput - The return type for the genPlantTreatmentAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PlantTreatmentAdviceInputSchema = z.object({
  nombrePlanta: z.string().describe('The name of the plant.'),
  enfermedadDetectada: z.string().describe('The detected disease of the plant.'),
});
export type PlantTreatmentAdviceInput = z.infer<typeof PlantTreatmentAdviceInputSchema>;

const PlantTreatmentAdviceOutputSchema = z.object({
  consejosLLM: z.string().describe('Practical, personalized treatment advice for the plant disease.'),
});
export type PlantTreatmentAdviceOutput = z.infer<typeof PlantTreatmentAdviceOutputSchema>;

export async function genPlantTreatmentAdvice(input: PlantTreatmentAdviceInput): Promise<PlantTreatmentAdviceOutput> {
  return genPlantTreatmentAdviceFlow(input);
}

const genPlantTreatmentAdvicePrompt = ai.definePrompt({
  name: 'genPlantTreatmentAdvicePrompt',
  input: { schema: PlantTreatmentAdviceInputSchema },
  output: { schema: PlantTreatmentAdviceOutputSchema },
  prompt: "Soy un agricultor experimentado. Dame 3 consejos MUY BREVES (máximo 15-20 palabras cada uno), prácticos y realistas para tratar la {{enfermedadDetectada}} en {{nombrePlanta}}. Usa un tono directo y sencillo. IMPORTANTE: Devuelve únicamente texto plano sin ningún tipo de formato Markdown (sin negritas, sin cursivas, sin asteriscos). Si necesitas enumerar, usa números normales (1., 2., 3.) y saltos de línea simples.",
});

const genPlantTreatmentAdviceFlow = ai.defineFlow(
  {
    name: 'genPlantTreatmentAdviceFlow',
    inputSchema: PlantTreatmentAdviceInputSchema,
    outputSchema: PlantTreatmentAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await genPlantTreatmentAdvicePrompt(input);
    if (!output) {
      throw new Error('Failed to generate treatment advice.');
    }
    return { ...output };
  }
);
