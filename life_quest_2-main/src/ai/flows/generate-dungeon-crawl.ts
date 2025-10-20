'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a "Dungeon Crawl".
 * A Dungeon Crawl is a multi-step challenge with a cohesive theme.
 *
 * - generateDungeonCrawl - The function that triggers the generation flow.
 * - GenerateDungeonCrawlInput - The input type for the flow.
 * - GenerateDungeonCrawlOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDungeonCrawlInputSchema = z.object({
  theme: z.string().describe('The theme for the dungeon crawl (e.g., "The Goblin Mines", "The Enchanted Library").'),
  difficulty: z.number().min(1).max(5).describe('The difficulty level of the dungeon, from 1 (easiest) to 5 (hardest).'),
  goal: z.string().optional().describe('An optional goal the user wants to accomplish, which should influence the theme and challenges.'),
});
export type GenerateDungeonCrawlInput = z.infer<typeof GenerateDungeonCrawlInputSchema>;

const GenerateDungeonCrawlOutputSchema = z.object({
  title: z.string().describe('A creative and engaging title for the dungeon.'),
  description: z.string().describe('A short, thematic description of the dungeon.'),
  xp: z.number().describe('The total XP reward for completing the dungeon, scaled by difficulty.'),
  challenges: z.array(z.object({
    title: z.string().describe('The title of the individual challenge.'),
  })).min(3).max(5).describe('A list of 3-5 challenges that fit the dungeon theme.'),
});
export type GenerateDungeonCrawlOutput = z.infer<typeof GenerateDungeonCrawlOutputSchema>;

export async function generateDungeonCrawl(input: GenerateDungeonCrawlInput): Promise<GenerateDungeonCrawlOutput> {
  return generateDungeonCrawlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDungeonCrawlPrompt',
  input: { schema: GenerateDungeonCrawlInputSchema },
  output: { schema: GenerateDungeonCrawlOutputSchema },
  prompt: `You are an AI Dungeon Master for a productivity app that gamifies life. Your task is to create a "Dungeon Crawl," which is a mini-project consisting of 3-5 related tasks (challenges).

  Generate a Dungeon Crawl based on the following user-provided details:
  - Theme: "{{theme}}"
  - Difficulty: {{difficulty}} out of 5
  {{#if goal}}- User's Goal: "{{goal}}" - Use this goal to make the theme and challenges more relevant and motivating.{{/if}}

  **Instructions:**
  1.  **Title:** Create a cool, thematic title for the dungeon.
  2.  **Description:** Write a brief, immersive description that sets the scene.
  3.  **Challenges:** Design 3 to 5 challenges (sub-tasks) that are actionable and fit the theme and difficulty. The number of challenges and their complexity should reflect the difficulty level. If the user provided a goal, the challenges should be steps towards achieving it.
  4.  **XP Reward:** Determine an appropriate XP reward. Use the difficulty as a guide:
      - 1 Star: ~100-150 XP
      - 2 Stars: ~200-250 XP
      - 3 Stars: ~300-400 XP
      - 4 Stars: ~450-550 XP
      - 5 Stars: ~600-750 XP

  The challenges should be real-world tasks disguised in a fantasy theme. For example, if the theme is "The Scholar's Sanctum," and the goal is "learn a new skill," challenges could be "Decipher the Ancient Text (Read a challenging chapter)" or "Brew an Elixir of Knowledge (Research a new topic)."

  Return the result as a JSON object.
  `,
});

const generateDungeonCrawlFlow = ai.defineFlow(
  {
    name: 'generateDungeonCrawlFlow',
    inputSchema: GenerateDungeonCrawlInputSchema,
    outputSchema: GenerateDungeonCrawlOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
