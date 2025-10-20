'use server';
/**
 * @fileOverview This file defines a Genkit flow for breaking down a large task or quest into smaller, actionable sub-tasks.
 *
 * - breakdownQuest - The function that triggers the quest breakdown flow.
 * - BreakdownQuestInput - The input type for the flow.
 * - BreakdownQuestOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BreakdownQuestInputSchema = z.object({
  title: z.string().describe('The title of the large quest to be broken down.'),
});
export type BreakdownQuestInput = z.infer<typeof BreakdownQuestInputSchema>;

const BreakdownQuestOutputSchema = z.array(
    z.object({
        title: z.string().describe('The title of the sub-task.'),
        description: z.string().describe('A brief description of the sub-task.'),
    })
).describe('A list of 3-5 actionable sub-tasks for the given quest.');

export type BreakdownQuestOutput = z.infer<typeof BreakdownQuestOutputSchema>;

export async function breakdownQuest(input: BreakdownQuestInput): Promise<BreakdownQuestOutput> {
  return breakdownQuestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'breakdownQuestPrompt',
  input: { schema: BreakdownQuestInputSchema },
  output: { schema: BreakdownQuestOutputSchema },
  prompt: `You are a project management AI. Your goal is to break down a large, complex user-provided quest into 3-5 smaller, actionable sub-tasks.

  The user wants to accomplish: "{{title}}"

  Generate a list of sub-tasks that are clear, concise, and represent concrete steps toward completing the main quest.
  Each sub-task should have a title and a brief description.
  `,
});

const breakdownQuestFlow = ai.defineFlow(
  {
    name: 'breakdownQuestFlow',
    inputSchema: BreakdownQuestInputSchema,
    outputSchema: BreakdownQuestOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
