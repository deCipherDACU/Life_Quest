
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating boss images.
 *
 * - generateBossImage - The function that triggers the image generation flow.
 * - GenerateBossImageInput - The input type for the generateBossImage function.
 * - GenerateBossImageOutput - The output type for the generateBossImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBossImageInputSchema = z.object({
  prompt: z.string().describe('A detailed prompt for the boss image generation.'),
});
export type GenerateBossImageInput = z.infer<typeof GenerateBossImageInputSchema>;

const GenerateBossImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
  isPlaceholder: z.boolean().optional().describe('Indicates if the image is a placeholder due to an error.')
});
export type GenerateBossImageOutput = z.infer<typeof GenerateBossImageOutputSchema>;

const generateBossImageFlow = ai.defineFlow(
  {
    name: 'generateBossImageFlow',
    inputSchema: GenerateBossImageInputSchema,
    outputSchema: GenerateBossImageOutputSchema,
  },
  async ({ prompt }) => {
    try {
      const { media } = await ai.generate({
          model: 'googleai/imagen-4.0-fast-generate-001',
          prompt,
      });

      if (!media?.url) {
          throw new Error('Image generation failed to return a URL.');
      }

      return { imageUrl: media.url, isPlaceholder: false };
    } catch (error) {
      console.error("Failed to generate image, using placeholder.", error);
      // Fallback to a placeholder if generation fails
      const seed = Math.floor(Math.random() * 1000);
      return {
        imageUrl: `https://picsum.photos/seed/boss-${seed}/1024/768`,
        isPlaceholder: true,
      };
    }
  }
);


export async function generateBossImage(input: GenerateBossImageInput): Promise<GenerateBossImageOutput> {
  return generateBossImageFlow(input);
}
