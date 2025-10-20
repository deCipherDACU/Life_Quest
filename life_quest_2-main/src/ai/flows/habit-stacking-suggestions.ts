
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing habit stacking suggestions.
 * The flow takes a user's existing habits and suggests new, complementary habits to "stack" on top of them.
 *
 * - habitStackingSuggestions - The function that triggers the suggestion flow.
 * - HabitStackingSuggestionsInput - The input type for the flow.
 * - HabitStackingSuggestionsOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HabitStackingSuggestionsInputSchema = z.object({
  existingHabits: z.array(z.string()).describe("A list of the user's current recurring habits (daily or weekly tasks)."),
});
export type HabitStackingSuggestionsInput = z.infer<typeof HabitStackingSuggestionsInputSchema>;

const HabitStackingSuggestionsOutputSchema = z.array(
  z.object({
    anchor_habit: z.string().describe("The existing habit to stack upon."),
    new_habit: z.string().describe("The new, complementary habit being suggested."),
    reasoning: z.string().describe("A brief explanation of why these two habits stack well together."),
  })
).describe('A list of 2-3 habit stacking suggestions.');

export type HabitStackingSuggestionsOutput = z.infer<typeof HabitStackingSuggestionsOutputSchema>;

export async function habitStackingSuggestions(input: HabitStackingSuggestionsInput): Promise<HabitStackingSuggestionsOutput> {
  return habitStackingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'habitStackingSuggestionsPrompt',
  input: { schema: HabitStackingSuggestionsInputSchema },
  output: { schema: HabitStackingSuggestionsOutputSchema },
  prompt: `You are an AI assistant specializing in behavioral science and habit formation. Your goal is to help a user build new habits by using the "habit stacking" technique.

  Analyze the user's list of existing habits and provide 2-3 suggestions for new habits that can be performed immediately after one of their current habits.

  The user's current habits are:
  {{#each existingHabits}}
  - {{{this}}}
  {{/each}}

  For each suggestion, identify an "anchor habit" from their existing list and propose a "new habit" that is short, easy to do, and logically connected to the anchor. Provide a brief "reasoning" for why the stack makes sense (e.g., same location, similar mindset).

  Example: If the user has a habit "Make coffee in the morning", a good suggestion would be:
  - anchor_habit: "Make coffee in the morning"
  - new_habit: "Do 5 minutes of stretching"
  - reasoning: "While your coffee brews, you have a few minutes of downtime, which is perfect for a quick stretch to wake up your body."

  Generate practical and actionable suggestions.
  `,
});

const habitStackingSuggestionsFlow = ai.defineFlow(
  {
    name: 'habitStackingSuggestionsFlow',
    inputSchema: HabitStackingSuggestionsInputSchema,
    outputSchema: HabitStackingSuggestionsOutputSchema,
  },
  async (input) => {
    // If the user has no habits, return an empty array to avoid errors.
    if (input.existingHabits.length === 0) {
      return [];
    }
    const { output } = await prompt(input);
    return output!;
  }
);
