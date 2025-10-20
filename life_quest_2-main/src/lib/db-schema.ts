// Firestore collection names and document structure
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  BOSSES: 'bosses',
  ACHIEVEMENTS: 'achievements',
  JOURNAL_ENTRIES: 'journalEntries',
  WEEKLY_REVIEWS: 'weeklyReviews',
  DUNGEONS: 'dungeons',
  NOTIFICATIONS: 'notifications',
  REWARDS: 'rewards',
  USER_STATS: 'userStats',
} as const;

// Firestore document interfaces
export interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  health: number;
  maxHealth: number;
  coins: number;
  gems: number;
  skillPoints: number;
  equipment: {
    weapon: string | null;
    armor: string | null;
    helmet: string | null;
    shield: string | null;
  };
  inventory: string[]; // Item IDs
  streak: number;
  longestStreak: number;
  tasksCompleted: number;
  memberSince: Date;
  completionRate: number;
  skillTrees: any[];
  redeemedRewards: Array<{
    rewardId: string;
    timestamps: Date[];
  }>;
  mbti?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  lastLogin: Date;
  customRewards: string[]; // Reward IDs
  notificationPreferences: {
    reminder: boolean;
    motivation: boolean;
    achievement: boolean;
    health_warning: boolean;
    streak_reminder: boolean;
    daily_check_in: boolean;
    ai_personalization: boolean;
    style: 'creative' | 'funny' | 'calm' | 'motivational' | 'random';
  };
  preferences: {
    soundEffects: boolean;
    backgroundMusic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreTask {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'Education' | 'Career' | 'Health' | 'Mental Wellness' | 'Finance' | 'Social' | 'Hobbies' | 'Home' | 'Reward';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'N/A';
  type: 'Daily' | 'Weekly' | 'Monthly' | 'One-time';
  dueDate?: Date;
  completed: boolean;
  xp: number;
  coins: number;
  streak?: number;
  lastCompleted?: Date;
  intention?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreBoss {
  id: string;
  name: string;
  type: 'Aberration' | 'Beast' | 'Construct';
  title: string;
  imageUrl: string;
  maxHp: number;
  currentHp: number;
  timeRemaining: string;
  resistances: Record<string, number>;
  attack_pattern: Array<{
    name: string;
    description: string;
    trigger: string;
    icon: string;
  }>;
  phases: Array<{
    name: string;
    hpThreshold: number;
  }>;
  rewards: {
    xp: number;
    coins: number;
    gems: number;
  };
  weekNumber: number;
  year: number;
  lastDefeated?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreJournalEntry {
  id: string;
  userId: string;
  date: Date;
  text?: string;
  imageUrl?: string;
  voiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreWeeklyReview {
  id: string;
  userId: string;
  date: Date;
  weekNumber: number;
  year: number;
  wins: string;
  challenges: string;
  learnings: string;
  nextWeekGoals: string;
  mood: 'Great' | 'Good' | 'Okay' | 'Bad' | 'Awful';
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreDungeon {
  id: string;
  userId: string;
  title: string;
  description: string;
  difficulty: number;
  challenges: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  completed: boolean;
  xp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreNotification {
  id: string;
  userId: string;
  type: 'reminder' | 'motivation' | 'achievement' | 'health_warning' | 'streak_reminder' | 'daily_check_in' | 'generic';
  message: string;
  date: Date;
  read: boolean;
  path?: string;
  createdAt: Date;
}

export interface FirestoreReward {
  id: string;
  userId?: string; // null for global rewards, userId for custom rewards
  title: string;
  description: string;
  coinCost?: number;
  gemCost?: number;
  category: 'Entertainment' | 'Relaxation' | 'Treat' | 'Item' | 'Boost' | 'Custom';
  levelRequirement: number;
  redeemLimit?: number;
  redeemPeriod?: 'daily' | 'weekly' | 'monthly';
  itemId?: string; // Reference to item if reward gives an item
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FirestoreUserStats {
  id: string;
  userId: string;
  date: Date; // Daily stats
  tasksCompleted: number;
  xpEarned: number;
  coinsEarned: number;
  timeSpent: number; // in minutes
  categoriesActive: string[];
  streakMaintained: boolean;
  createdAt: Date;
}