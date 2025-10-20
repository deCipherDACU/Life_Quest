
// Default skill trees configuration for new users
import { Sword, Shield, Wind, Brain, Eye } from 'lucide-react';
import type { SkillTreeData } from './types';

export const defaultSkillTrees: SkillTreeData[] = [
  {
    name: 'Strength',
    icon: Sword,
    description: 'Increases physical power and damage.',
    skills: [
      { name: 'Overpower', level: 0, maxLevel: 5, cost: 1, description: '+5% damage to bosses per level.' },
      { name: 'Intimidation', level: 0, maxLevel: 3, cost: 2, description: 'Chance to get double coins from a quest.' },
    ],
  },
  {
    name: 'Endurance',
    icon: Shield,
    description: 'Boosts health and resilience to penalties.',
    skills: [
      { name: 'Toughness', level: 0, maxLevel: 5, cost: 1, description: 'Reduce HP loss from missed daily quests by 10% per level.' },
      { name: 'Willpower', level: 0, maxLevel: 3, cost: 2, description: 'Increases max HP by 5% per level.' },
    ],
  },
  {
    name: 'Agility',
    icon: Wind,
    description: 'Improves speed, efficiency, and luck.',
    skills: [
      { name: 'Quickness', level: 0, maxLevel: 5, cost: 1, description: '+2% chance per level to find a rare item.' },
      { name: 'Momentum', level: 0, maxLevel: 3, cost: 2, description: 'Completing tasks quickly grants bonus XP.' },
    ],
  },
  {
    name: 'Intelligence',
    icon: Brain,
    description: 'Enhances learning, planning, and AI interactions.',
    skills: [
      { name: 'Aptitude', level: 0, maxLevel: 5, cost: 1, description: '+5% XP from Education & Career quests per level.' },
      { name: 'Insight', level: 0, maxLevel: 3, cost: 2, description: 'AI coach provides more detailed suggestions.' },
    ],
  },
  {
    name: 'Perception',
    icon: Eye,
    description: 'Increases awareness and the ability to find rewards.',
    skills: [
      { name: 'Scavenger', level: 0, maxLevel: 5, cost: 1, description: '+2% chance per level to find extra coins.' },
      { name: 'Sixth Sense', level: 0, maxLevel: 3, cost: 2, description: 'Reveals one hidden objective in a Special Quest.' },
    ],
  },
];

// Default notification preferences for new users
export const defaultNotificationPreferences = {
  reminder: true,
  motivation: true,
  achievement: true,
  health_warning: true,
  streak_reminder: true,
  daily_check_in: true,
  ai_personalization: true,
  style: 'random' as const,
};

// Default user preferences
export const defaultUserPreferences = {
  soundEffects: false,
  backgroundMusic: false,
};
