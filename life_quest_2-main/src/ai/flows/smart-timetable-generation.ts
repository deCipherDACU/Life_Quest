
'use server';

/**
 * @fileOverview An AI agent for generating a smart timetable.
 *
 * - smartTimetableGeneration - A function that handles the smart timetable generation process.
 * - SmartTimetableInput - The input type for the smartTimetableGeneration function.
 * - SmartTimetableOutput - The return type for the smartTimetableGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartTimetableInputSchema = z.object({
  availableHours: z
    .string()
    .describe('The available hours for scheduling, e.g., 9 AM - 10 PM.'),
  breakPreferences: z
    .string()
    .describe('The desired break preferences, e.g., duration and frequency.'),
  fixedCommitments: z
    .string()
    .describe('The fixed commitments for scheduling, e.g., classes, meetings.'),
  tasksToSchedule: z.string().describe('The tasks to schedule.'),
  chronotype: z.enum(['morning', 'evening', 'flexible']).describe('The user chronotype.'),
  workStyle: z.enum(['deep_focus', 'multitask', 'hybrid']).describe('The user work style.'),
  mbti: z.string().optional().describe('The user\'s MBTI personality type (e.g., INTJ, ENFP).'),
});
export type SmartTimetableInput = z.infer<typeof SmartTimetableInputSchema>;

const ScheduleItemSchema = z.object({
    time: z.string().describe("The start and end time for the schedule item. e.g., '9:00 AM - 10:30 AM'"),
    task: z.string().describe("The name of the task or event."),
    category: z.enum(['Education', 'Career', 'Health', 'Mental Wellness', 'Finance', 'Social', 'Hobbies', 'Home', 'Break', 'Commitment']).describe("The category of the schedule item."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'N/A']).describe("The difficulty of the task. 'N/A' for breaks and fixed commitments."),
});

const SmartTimetableOutputSchema = z.object({
  schedule: z.array(ScheduleItemSchema).describe('The generated optimized daily schedule as a list of events.'),
});
export type SmartTimetableOutput = z.infer<typeof SmartTimetableOutputSchema>;

export async function smartTimetableGeneration(input: SmartTimetableInput): Promise<SmartTimetableOutput> {
  return smartTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartTimetablePrompt',
  input: {schema: SmartTimetableInputSchema},
  output: {schema: SmartTimetableOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an AI assistant designed to generate an optimized, full-day schedule for a user. Your goal is to maximize productivity and well-being by intelligently arranging tasks within the user's provided constraints and preferences.

  **User Information:**
  - **Available Hours:** {{{availableHours}}}
  - **Tasks to Schedule:** {{{tasksToSchedule}}}
  - **Fixed Commitments:** {{{fixedCommitments}}}
  - **Break Preferences:** {{{breakPreferences}}}
  - **Chronotype:** {{{chronotype}}}
  - **Work Style:** {{{workStyle}}}
  {{#if mbti}}- **MBTI Type:** {{{mbti}}}{{/if}}

  **Your Task:**
  Generate a detailed, optimized daily schedule for today, which is {{currentDate}}.

  **Instructions:**
  1.  **Structure the Entire Day:** Fill the entire block of time defined by "Available Hours" with tasks, commitments, and breaks.
  2.  **Incorporate All Items:** Ensure every fixed commitment and every task from "Tasks to Schedule" is included in the final schedule.
  3.  **Respect Personality & Style:**
      -   **Chronotype:** Schedule demanding tasks during peak energy times (mornings for 'morning', evenings for 'evening').
      -   **Work Style:** For 'deep_focus', create longer, uninterrupted work blocks. For 'multitask', group smaller, related tasks together. 'hybrid' is a balance.
      -   **MBTI:** Use the MBTI type to tailor the schedule's flow. For example:
          -   **I (Introverts):** Prefer longer, solitary focus blocks.
          -   **E (Extraverts):** May thrive with more varied or social tasks.
          -   **T (Thinkers):** Appreciate logically structured and efficient schedules.
          -   **F (Feelers):** Benefit from schedules that incorporate well-being and personal values.
          -   **J (Judging):** Prefer a clear, structured plan.
          -   **P (Perceiving):** May like a more flexible schedule with buffer time.
  4.  **Categorize and Assess:**
      -   Assign each scheduled item a \`category\` from the available options.
      -   Assign a \`difficulty\` ('Easy', 'Medium', 'Hard') for tasks. Use 'N/A' for breaks and fixed commitments.
  5.  **Format the Output:** Return the schedule as a JSON object containing a 'schedule' array. Each item in the array must have 'time', 'task', 'category', and 'difficulty'. Ensure the times are precise and cover the whole day.
  `,
});

const smartTimetableFlow = ai.defineFlow(
  {
    name: 'smartTimetableFlow',
    inputSchema: SmartTimetableInputSchema,
    outputSchema: SmartTimetableOutputSchema,
  },
  async input => {
    const {output} = await prompt({...input, currentDate: new Date().toLocaleDateString()});
    return output!;
  }
);
