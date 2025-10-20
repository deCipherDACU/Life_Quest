
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized notifications.
 *
 * - generatePersonalizedNotifications - The function that triggers the notification generation flow.
 * - PersonalizedNotificationsInput - The input type for the flow.
 * - PersonalizedNotificationsOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedNotificationsInputSchema = z.object({
  mbti: z.string().optional().describe("The user's MBTI personality type."),
  level: z.number().describe("The user's current level."),
  health: z.number().describe("The user's current health points."),
  gold: z.number().describe("The user's current gold amount."),
  incompleteTasks: z.array(z.string()).describe("A list of the user's incomplete tasks."),
  streak: z.number().describe("The user's current daily streak."),
  mood: z.string().optional().describe("The user's latest mood from their weekly review."),
  style: z.enum(['creative', 'funny', 'calm', 'motivational', 'random']).describe("The user's preferred notification style."),
});
export type PersonalizedNotificationsInput = z.infer<typeof PersonalizedNotificationsInputSchema>;

const notificationSchema = z.object({
    type: z.enum(['reminder', 'motivation', 'achievement', 'health_warning', 'streak_reminder', 'daily_check_in', 'generic']).describe('The type of the notification.'),
    message: z.string().describe('The content of the notification message.'),
    path: z.string().optional().describe('The in-app path the notification should link to (e.g., /tasks, /character).'),
})

const PersonalizedNotificationsOutputSchema = z.object({
  notifications: z.array(notificationSchema).describe('A list of 2-4 personalized notifications.'),
});
export type PersonalizedNotificationsOutput = z.infer<typeof PersonalizedNotificationsOutputSchema>;

export async function generatePersonalizedNotifications(input: PersonalizedNotificationsInput): Promise<PersonalizedNotificationsOutput> {
  return personalizedNotificationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedNotificationsPrompt',
  input: { schema: PersonalizedNotificationsInputSchema },
  output: { schema: PersonalizedNotificationsOutputSchema },
  prompt: `You are the AI Game Master for 'LifeQuest RPG', a productivity app that turns life into a role-playing game. Your task is to generate 2-4 personalized, actionable, and encouraging notifications for the user based on their current stats and preferred style.

  **User's Current Context:**
  - MBTI Type: {{mbti}}
  - Level: {{level}}
  - Health: {{health}}
  - Gold: {{gold}}
  - Incomplete Tasks: {{#if incompleteTasks}}{{#each incompleteTasks}}{{{this}}}; {{/each}}{{else}}None{{/if}}
  - Current Streak: {{streak}} days
  - Last Recorded Mood: {{mood}}
  - **Requested Style**: {{style}}

  **Your Directives as Game Master:**
  1.  **Adhere to the Style**: Generate all notifications in the user's requested style. If 'random', pick a mix of styles.
  2.  **Incorporate Quotes**: Seamlessly weave in a relevant quote from games, movies, anime, philosophy, or psychology that matches the notification's style and purpose. Keep it short and impactful.
  3.  **Be Contextual and Actionable**: Notifications must be relevant to the user's data. If possible, suggest a specific action and provide a relevant in-app \`path\`.
  4.  **Vary Notification Types**: Generate a mix of types like \`reminder\`, \`motivation\`, \`achievement\`, \`health_warning\`, etc.
  5.  **Use RPG Language**: Frame messages in the context of "quests" (tasks), "XP", "HP" (health), "boss fights" (challenges), etc.

  **Notification Style Guide:**

  *   **Creative Style**: Imaginative, story-driven, like a fantasy novel.
      *   *Quote Sources*: Final Fantasy, Lord of the Rings, One Piece, Nietzsche.
      *   *Example*: "A new chapter unfolds, adventurer! You've vanquished a mighty quest. As Gandalf says, 'All we have to decide is what to do with the time that is given us.' Your next epic awaits!"

  *   **Funny Style**: Humorous, light-hearted, meme-like.
      *   *Quote Sources*: Deadpool, Portal, The Hitchhiker's Guide to the Galaxy, witty philosophers.
      *   *Example*: "Warning: Your health bar is looking sadder than a dial-up modem. As Deadpool wisely noted, 'Maximum effort!' Go complete a health quest before you have to respawn."

  *   **Calm Style**: Soothing, reflective, like a meditation guide.
      *   *Quote Sources*: Lao Tzu, Iroh (Avatar: TLA), Studio Ghibli films, mindfulness experts.
      *   *Example*: "You've reached a new milestone. Pause and honor this moment. As Uncle Iroh said, 'Pride is not the opposite of shame, but its source.' True humility is the antidote."

  *   **Motivational Style**: Inspiring, empowering, like a coach's pep talk.
      *   *Quote Sources*: Rocky, Naruto, Kratos (God of War), Stoic philosophers like Marcus Aurelius.
      *   *Example*: "The path to greatness is forged in daily discipline. Your streak is a testament to your will. Remember what Naruto said: 'Hard work is worthless for those that don't believe in themselves.' Believe in your power!"


  Generate a JSON object with a "notifications" array.
  `,
});

const personalizedNotificationsFlow = ai.defineFlow(
  {
    name: 'personalizedNotificationsFlow',
    inputSchema: PersonalizedNotificationsInputSchema,
    outputSchema: PersonalizedNotificationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
