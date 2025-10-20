'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing intelligent task recommendations to users.
 *
 * The flow takes no input, but uses the current user's task history, preferences, and goals to generate a list of suggested tasks.
 *
 * - aiTaskRecommendations - The function that triggers the task recommendation flow.
 * - AiTaskRecommendationsOutput - The output type for the aiTaskRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskRecommendationsInputSchema = z.object({
  mbti: z.string().optional().describe("The user's MBTI personality type (e.g., INTJ, ENFP)."),
  existingTasks: z.array(z.string()).optional().describe("A list of the user's current tasks."),
  skillLevels: z.object({
    physical: z.number().optional(),
    mental: z.number().optional(),
    life: z.number().optional(),
  }).optional().describe("The user's aggregate skill levels in major life domains.")
});
export type AiTaskRecommendationsInput = z.infer<typeof AiTaskRecommendationsInputSchema>;


const AiTaskRecommendationsOutputSchema = z.array(
  z.object({
    title: z.string().describe('The title of the recommended task.'),
    description: z.string().describe('A brief description of the task.'),
    category: z.string().describe('The category of the task (e.g., Work, Health, Personal).'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the task.'),
  })
).describe('A list of 3 recommended tasks based on user history and preferences.');

export type AiTaskRecommendationsOutput = z.infer<typeof AiTaskRecommendationsOutputSchema>;

export async function aiTaskRecommendations(input: AiTaskRecommendationsInput): Promise<AiTaskRecommendationsOutput> {
  return aiTaskRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskRecommendationsPrompt',
  input: { schema: AiTaskRecommendationsInputSchema },
  output: {schema: AiTaskRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide intelligent task recommendations (side quests) to users of a productivity app.

  Analyze the user's profile to suggest 3 tasks that would be beneficial. Avoid recommending tasks that are already on their list.

  USER PROFILE:
  - Existing Tasks: {{#if existingTasks}} {{#each existingTasks}} {{{this}}}; {{/each}} {{else}} None {{/if}}
  {{#if mbti}}
  - MBTI Personality Type: {{{mbti}}}. Use this to tailor recommendations.
    - 'J' types might prefer structured, planned tasks. 'P' types might like more flexible or novel tasks.
    - 'N' types might enjoy abstract or future-oriented tasks. 'S' types might prefer concrete, hands-on activities.
    - 'I' types may prefer solitary tasks, 'E' types may enjoy social ones.
    - 'T' types appreciate efficiency and logic, 'F' types value harmony and personal growth.
  {{/if}}
  {{#if skillLevels}}
  - Skill Levels:
    - Physical: {{skillLevels.physical}}
    - Mental: {{skillLevels.mental}}
    - Life Skills: {{skillLevels.life}}
  Suggest tasks that would help them improve their lowest-level skill area.
  {{/if}}

  Consider the following when making your recommendations:
  - Task categories the user has been neglecting recently (based on their existing tasks).
  - Balance of challenge and reward.

  Return the tasks as a JSON array of objects, each with a title, description, category, and difficulty.
  `,
});

const aiTaskRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiTaskRecommendationsFlow',
    inputSchema: AiTaskRecommendationsInputSchema,
    outputSchema: AiTaskRecommendationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
