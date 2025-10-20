
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating insights from weekly reviews.
 *
 * - weeklyReviewInsights - The function that triggers the insight generation flow.
 * - WeeklyReviewInsightsInput - The input type for the flow.
 * - WeeklyReviewInsightsOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { WeeklyReview } from '@/lib/types';

const WeeklyReviewInsightsInputSchema = z.object({
  reviews: z.array(
    z.object({
      weekNumber: z.number(),
      year: z.number(),
      wins: z.string(),
      challenges: z.string(),
      learnings: z.string(),
      nextWeekGoals: z.string(),
      mood: z.string(),
    })
  ).describe('An array of past weekly reviews.'),
});
export type WeeklyReviewInsightsInput = z.infer<typeof WeeklyReviewInsightsInputSchema>;

const WeeklyReviewInsightsOutputSchema = z.object({
  keyObservation: z.string().describe('A key, overarching observation from the provided reviews.'),
  actionableSuggestion: z.string().describe('A concrete, actionable suggestion for the user for the upcoming week.'),
  emergingTheme: z.string().describe('An emerging theme or recurring pattern noticed across the reviews.'),
});
export type WeeklyReviewInsightsOutput = z.infer<typeof WeeklyReviewInsightsOutputSchema>;

export async function weeklyReviewInsights(input: WeeklyReviewInsightsInput): Promise<WeeklyReviewInsightsOutput> {
  return weeklyReviewInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weeklyReviewInsightsPrompt',
  input: { schema: WeeklyReviewInsightsInputSchema },
  output: { schema: WeeklyReviewInsightsOutputSchema },
  prompt: `You are an insightful life coach AI. Your task is to analyze a user's past weekly reviews and provide one key observation, one actionable suggestion, and identify one emerging theme.

  **User's Weekly Reviews:**
  {{#each reviews}}
  - **Week {{weekNumber}}, {{year}} (Mood: {{mood}})**
    - **Wins:** {{wins}}
    - **Challenges:** {{challenges}}
    - **Learnings:** {{learnings}}
    - **Goals for Next Week:** {{nextWeekGoals}}
  {{/each}}

  **Your Analysis:**
  Based on the reviews provided, generate a concise analysis.
  - **Key Observation:** What is the single most important thing to notice? (e.g., "You consistently overestimate how much you can do on weekends.")
  - **Actionable Suggestion:** What is one specific thing the user can do next week? (e.g., "Try scheduling only one major task for next Saturday.")
  - **Emerging Theme:** What is a recurring pattern or topic? (e.g., "The theme of 'finding work-life balance' appears frequently in your challenges and goals.")

  Be supportive, insightful, but direct.
  `,
});

const weeklyReviewInsightsFlow = ai.defineFlow(
  {
    name: 'weeklyReviewInsightsFlow',
    inputSchema: WeeklyReviewInsightsInputSchema,
    outputSchema: WeeklyReviewInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
