
'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI Productivity Coach.
 *
 * The flow takes the user's chat history and contextual data to provide personalized coaching.
 *
 * - aiCoachChat - The function that triggers the chat flow.
 * - AiCoachChatInput - The input type for the flow.
 * - AiCoachChatOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiCoachChatInputSchema = z.object({
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe("The user's conversation history with the AI coach."),
  mbti: z.string().optional().describe("The user's MBTI personality type."),
  recentTasks: z.array(z.object({
    title: z.string(),
    completed: z.boolean(),
  })).optional().describe("A list of the user's most recent tasks."),
  recentReviews: z.array(z.object({
    mood: z.string(),
    wins: z.string(),
    challenges: z.string(),
  })).optional().describe("A summary of the user's recent weekly reviews."),
});
export type AiCoachChatInput = z.infer<typeof AiCoachChatInputSchema>;

const AiCoachChatOutputSchema = z.object({
    role: z.enum(['model']),
    content: z.string().describe('The AI coach\'s response.'),
});
export type AiCoachChatOutput = z.infer<typeof AiCoachChatOutputSchema>;


export async function aiCoachChat(input: AiCoachChatInput): Promise<AiCoachChatOutput> {
  return aiCoachChatFlow(input);
}

const prompt = ai.definePrompt({
    name: 'aiCoachChatPrompt',
    input: { schema: AiCoachChatInputSchema },
    output: { schema: AiCoachChatOutputSchema },
    prompt: `You are an expert life and productivity coach named 'LifeQuest Coach'. Your tone is supportive, insightful, and motivating.
You are speaking to a user of a gamified productivity app. Use their data to provide personalized advice.

**Your response MUST be formatted using markdown and include relevant emojis.** Each key point should be a separate bullet point.
For example:
*   🌟 It looks like you had a great week! Keep up the momentum.
*   🎯 I see you're focusing on your career. Have you considered breaking down that big project?
*   🤔 It seems like 'Task X' was a challenge. Let's think about a new strategy for that.

USER'S CONTEXT:
- MBTI Personality: {{mbti}}
- Recent Weekly Review Moods: {{#each recentReviews}} {{mood}}; {{/each}}
- Recent Wins: {{#each recentReviews}} {{wins}}; {{/each}}
- Recent Challenges: {{#each recentReviews}} {{challenges}}; {{/each}}
- Recent Tasks: {{#each recentTasks}} {{title}} ({{#if completed}}Done{{else}}Not Done{{/if}}); {{/each}}

CONVERSATION HISTORY:
{{#each chatHistory}}
**{{role}}**: {{content}}
{{/each}}

Based on the full context and conversation history, provide your next response as the model, following the markdown and emoji format strictly.
`,
});


const aiCoachChatFlow = ai.defineFlow(
  {
    name: 'aiCoachChatFlow',
    inputSchema: AiCoachChatInputSchema,
    outputSchema: AiCoachChatOutputSchema
  },
  async (input) => {
    
    const { output } = await prompt(input);
    
    if (!output) {
      return {
        role: 'model',
        content: "I'm sorry, I couldn't generate a response. Please try again."
      };
    }

    return output;
  }
);
