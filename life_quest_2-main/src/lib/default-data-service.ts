import type { User, Achievement, RewardItem } from './types';
import { defaultSkillTrees, defaultNotificationPreferences, defaultUserPreferences } from './data';
import { xpForLevel } from './formulas';
import { 
  BookOpen, Briefcase, Brain, Dumbbell, Shield, Sparkles, Sword, Trophy, Film, Gamepad2, Pizza, 
  Diamond, Zap, Box, Image, Star, Repeat, CalendarCheck, Timer, Wind, Notebook, GitMerge, Bot, 
  Flame, Sun, Moon, ShoppingBag, Heart, FileText, Palette, Coins, Crown, Anchor, Aperture, Eye, Gem
} from 'lucide-react';

export class DefaultDataService {
  static createDefaultUser(id: string, email: string, name?: string): User {
    const now = new Date();
    
    return {
      id,
      name: name || 'Adventurer',
      avatarUrl: 'https://picsum.photos/seed/avatar-placeholder/200/200',
      level: 1,
      xp: 0,
      xpToNextLevel: xpForLevel(2),
      health: 100,
      maxHealth: 100,
      debuffs: [],
      coins: 50,
      gems: 5,
      skillPoints: 5,
      equipment: {
        weapon: null,
        armor: null,
        helmet: null,
        shield: null,
      },
      inventory: [],
      streak: 0,
      longestStreak: 0,
      tasksCompleted: 0,
      memberSince: now,
      completionRate: 0,
      mbti: undefined,
      gender: 'prefer-not-to-say',
      lastLogin: now,
      skillTrees: defaultSkillTrees,
      redeemedRewards: [],
      customRewards: [],
      notifications: [
        { 
          id: '1', 
          type: 'generic', 
          message: 'Welcome to LifeQuest! Your adventure begins now.', 
          date: now, 
          read: false, 
          path: '/dashboard' 
        },
      ],
      notificationPreferences: defaultNotificationPreferences,
      preferences: defaultUserPreferences,
    };
  }

  static getDefaultAchievements(): Achievement[] {
    return [
      // Quest Completion
      { id: 'q1', title: 'First Step', description: 'Complete your first quest', icon: Sword, rarity: 'Common', unlocked: false },
      { id: 'q2', title: 'Quest Apprentice', description: 'Complete 10 quests', icon: Sword, rarity: 'Common', unlocked: false },
      { id: 'q3', title: 'Quest Journeyman', description: 'Complete 25 quests', icon: Sword, rarity: 'Common', unlocked: false },
      { id: 'q4', title: 'Quest Adept', description: 'Complete 50 quests', icon: Shield, rarity: 'Rare', unlocked: false },
      { id: 'q5', title: 'Centurion', description: 'Complete 100 quests', icon: Shield, rarity: 'Rare', unlocked: false },
      { id: 'q6', title: 'Quest Master', description: 'Complete 250 quests', icon: Shield, rarity: 'Epic', unlocked: false },
      { id: 'q7', title: 'Quest Grandmaster', description: 'Complete 500 quests', icon: Trophy, rarity: 'Epic', unlocked: false },
      { id: 'q8', title: 'Millennium', description: 'Complete 1,000 quests', icon: Trophy, rarity: 'Legendary', unlocked: false },
      { id: 'q9', title: 'Tenacious', description: 'Complete a Hard quest', icon: Zap, rarity: 'Common', unlocked: false },
      { id: 'q10', title: 'Unstoppable', description: 'Complete 10 Hard quests', icon: Zap, rarity: 'Rare', unlocked: false },

      // Leveling
      { id: 'l1', title: 'Novice', description: 'Reach level 5', icon: Sparkles, rarity: 'Common', unlocked: false },
      { id: 'l2', title: 'Adept', description: 'Reach level 10', icon: Sparkles, rarity: 'Common', unlocked: false },
      { id: 'l3', title: 'Expert', description: 'Reach level 25', icon: Star, rarity: 'Rare', unlocked: false },
      { id: 'l4', title: 'Master', description: 'Reach level 50', icon: Star, rarity: 'Epic', unlocked: false },
      { id: 'l5', title: 'Grandmaster', description: 'Reach level 75', icon: Trophy, rarity: 'Epic', unlocked: false },
      { id: 'l6', title: 'Legend', description: 'Reach level 99', icon: Trophy, rarity: 'Legendary', unlocked: false },

      // Streaks
      { id: 's1', title: 'Getting Started', description: 'Maintain a 3-day streak', icon: Flame, rarity: 'Common', unlocked: false },
      { id: 's2', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, rarity: 'Common', unlocked: false },
      { id: 's3', title: 'Fortnight Fighter', description: 'Maintain a 14-day streak', icon: Flame, rarity: 'Rare', unlocked: false },
      { id: 's4', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: Sun, rarity: 'Rare', unlocked: false },
      { id: 's5', title: 'Seasoned Pro', description: 'Maintain a 60-day streak', icon: Sun, rarity: 'Epic', unlocked: false },
      { id: 's6', title: 'True Dedication', description: 'Maintain a 90-day streak', icon: Sun, rarity: 'Epic', unlocked: false },
      { id: 's7', title: 'The Centenarian', description: 'Maintain a 100-day streak', icon: Diamond, rarity: 'Legendary', unlocked: false },
      { id: 's8', title: 'Year of Power', description: 'Maintain a 365-day streak', icon: Diamond, rarity: 'Legendary', unlocked: false },

      // Category Specific
      { id: 'c1', title: 'Scholar', description: 'Complete 10 Education quests', icon: BookOpen, rarity: 'Common', unlocked: false },
      { id: 'c2', title: 'Bookworm', description: 'Complete 50 Education quests', icon: BookOpen, rarity: 'Rare', unlocked: false },
      { id: 'c3', title: 'Career Climber', description: 'Complete 10 Career quests', icon: Briefcase, rarity: 'Common', unlocked: false },
      { id: 'c4', title: 'Professional', description: 'Complete 50 Career quests', icon: Briefcase, rarity: 'Rare', unlocked: false },
      { id: 'c5', title: 'Healthy Habit', description: 'Complete 10 Health quests', icon: Dumbbell, rarity: 'Common', unlocked: false },
      { id: 'c6', title: 'Fitness Fanatic', description: 'Complete 50 Health quests', icon: Dumbbell, rarity: 'Rare', unlocked: false },
      { id: 'c7', title: 'Mindful Moment', description: 'Complete 10 Mental Wellness quests', icon: Brain, rarity: 'Common', unlocked: false },
      { id: 'c8', title: 'Zen Master', description: 'Complete 50 Mental Wellness quests', icon: Brain, rarity: 'Rare', unlocked: false },
      { id: 'c9', title: 'Hobbyist', description: 'Complete 10 Hobbies quests', icon: Gamepad2, rarity: 'Common', unlocked: false },
      { id: 'c10', title: 'Artisan', description: 'Complete 50 Hobbies quests', icon: Gamepad2, rarity: 'Rare', unlocked: false },
      { id: 'c11', title: 'Homebody', description: 'Complete 10 Home quests', icon: Box, rarity: 'Common', unlocked: false },
      { id: 'c12', title: 'Homemaker', description: 'Complete 50 Home quests', icon: Box, rarity: 'Rare', unlocked: false },
      { id: 'c13', title: 'Social Butterfly', description: 'Complete 10 Social quests', icon: Wind, rarity: 'Common', unlocked: false },
      { id: 'c14', title: 'Networker', description: 'Complete 50 Social quests', icon: Wind, rarity: 'Rare', unlocked: false },
      { id: 'c15', title: 'Financier', description: 'Complete 10 Finance quests', icon: Diamond, rarity: 'Common', unlocked: false },
      { id: 'c16', title: 'Treasurer', description: 'Complete 50 Finance quests', icon: Diamond, rarity: 'Rare', unlocked: false },
      { id: 'c17', title: 'Well-Rounded', description: 'Complete 10 quests in every category', icon: Star, rarity: 'Epic', unlocked: false },

      // Boss Fights
      { id: 'b1', title: 'First Victory', description: 'Defeat your first boss', icon: Sword, rarity: 'Common', unlocked: false },
      { id: 'b2', title: 'Boss Slayer', description: 'Defeat 5 weekly bosses', icon: Sword, rarity: 'Rare', unlocked: false },
      { id: 'b3', title: 'Boss Hunter', description: 'Defeat 10 weekly bosses', icon: Sword, rarity: 'Epic', unlocked: false },
      { id: 'b4', title: 'Legendary Hunter', description: 'Defeat 25 weekly bosses', icon: Trophy, rarity: 'Legendary', unlocked: false },
      { id: 'b5', title: 'Critical Hit', description: 'Exploit a boss\'s weakness', icon: Zap, rarity: 'Common', unlocked: false },

      // Feature Engagement
      { id: 'f1', title: 'Chronicler', description: 'Write your first journal entry', icon: Notebook, rarity: 'Common', unlocked: false },
      { id: 'f2', title: 'Diarist', description: 'Write 10 journal entries', icon: Notebook, rarity: 'Common', unlocked: false },
      { id: 'f3', title: 'Historian', description: 'Write 50 journal entries', icon: Notebook, rarity: 'Rare', unlocked: false },
      { id: 'f4', title: 'Time Bender', description: 'Use the Pomodoro timer for the first time', icon: Timer, rarity: 'Common', unlocked: false },
      { id: 'f5', title: 'Focused', description: 'Complete 10 Pomodoro sessions', icon: Timer, rarity: 'Common', unlocked: false },
      { id: 'f6', title: 'In The Zone', description: 'Complete 50 Pomodoro sessions', icon: Timer, rarity: 'Rare', unlocked: false },
      { id: 'f7', title: 'Just Breathe', description: 'Complete a breathing exercise', icon: Wind, rarity: 'Common', unlocked: false },
      { id: 'f8', title: 'Inner Peace', description: 'Complete 25 breathing exercises', icon: Wind, rarity: 'Rare', unlocked: false },
      { id: 'f9', title: 'Introspective', description: 'Complete your first weekly review', icon: CalendarCheck, rarity: 'Common', unlocked: false },
      { id: 'f10', title: 'Reflective', description: 'Complete 4 weekly reviews', icon: CalendarCheck, rarity: 'Rare', unlocked: false },
      { id: 'f11', title: 'Special Quest Delver', description: 'Complete your first Special Quest', icon: GitMerge, rarity: 'Common', unlocked: false },
      { id: 'f12', title: 'Special Quest Master', description: 'Complete 10 Special Quests', icon: GitMerge, rarity: 'Rare', unlocked: false },
      { id: 'f13', title: 'AI Consultant', description: 'Chat with the AI coach for the first time', icon: Bot, rarity: 'Common', unlocked: false },
      { id: 'f14', title: 'Student of the Machine', description: 'Get AI task recommendations', icon: Bot, rarity: 'Common', unlocked: false },
      { id: 'f15', title: 'Skill Up', description: 'Spend your first skill point', icon: Zap, rarity: 'Common', unlocked: false },
      { id: 'f16', title: 'Specialized', description: 'Reach level 5 in any skill', icon: Star, rarity: 'Rare', unlocked: false },
      { id: 'f17', title: 'Jack of All Trades', description: 'Put at least one point in every skill tree', icon: Star, rarity: 'Rare', unlocked: false },

      // Shop & Economy
      { id: 'e1', title: 'Window Shopper', description: 'Visit the rewards shop', icon: ShoppingBag, rarity: 'Common', unlocked: false },
      { id: 'e2', title: 'Treat Yourself', description: 'Redeem your first reward', icon: Pizza, rarity: 'Common', unlocked: false },
      { id: 'e3', title: 'Spender', description: 'Redeem 10 rewards', icon: Pizza, rarity: 'Rare', unlocked: false },
      { id: 'e4', title: 'Big Spender', description: 'Spend 10,000 coins', icon: Coins, rarity: 'Rare', unlocked: false },
      { id: 'e5', title: 'High Roller', description: 'Spend 100,000 coins', icon: Coins, rarity: 'Epic', unlocked: false },
      { id: 'e6', title: 'Gem Collector', description: 'Acquire 100 gems', icon: Diamond, rarity: 'Rare', unlocked: false },
      { id: 'e7', title: 'Personal Touch', description: 'Create your first custom reward', icon: Star, rarity: 'Common', unlocked: false },

      // Character & Customization
      { id: 'p1', title: 'New Look', description: 'Change your avatar', icon: Palette, rarity: 'Common', unlocked: false },
      { id: 'p2', title: 'Identity', description: 'Set your MBTI type', icon: Brain, rarity: 'Common', unlocked: false },
      { id: 'p3', title: 'New Gear', description: 'Equip a new weapon or armor', icon: Shield, rarity: 'Common', unlocked: false },
      { id: 'p4', title: 'Well-Equipped', description: 'Equip a weapon and armor', icon: Shield, rarity: 'Rare', unlocked: false },

      // Miscellaneous / Fun
      { id: 'm1', title: 'Night Owl', description: 'Complete a quest after midnight', icon: Moon, rarity: 'Common', unlocked: false },
      { id: 'm2', title: 'Early Bird', description: 'Complete a quest before 7 AM', icon: Sun, rarity: 'Common', unlocked: false },
      { id: 'm3', title: 'Oops!', description: 'Uncheck a completed task', icon: Repeat, rarity: 'Common', unlocked: false },
      { id: 'm4', title: 'Perfect Week', description: 'Complete all your quests for 7 days straight', icon: Trophy, rarity: 'Epic', unlocked: false },
      { id: 'm5', title: 'Completionist', description: 'Unlock all other achievements', icon: Diamond, rarity: 'Legendary', unlocked: false },
      { id: 'm6', title: 'Back from the Brink', description: 'Recover from 1 HP', icon: Heart, rarity: 'Epic', unlocked: false },
      { id: 'm7', title: 'Hoarder', description: 'Accumulate 10,000 coins without spending any', icon: Box, rarity: 'Epic', unlocked: false },
      { id: 'm8', title: 'Boss Rematcher', description: 'Fight the same boss twice', icon: Repeat, rarity: 'Rare', unlocked: false },
      { id: 'm9', title: 'Task Juggler', description: 'Complete 5 tasks in one day', icon: Zap, rarity: 'Common', unlocked: false },
      { id: 'm10', title: 'Productivity Powerhouse', description: 'Complete 10 tasks in one day', icon: Zap, rarity: 'Rare', unlocked: false },
      { id: 'm11', title: 'Marathoner', description: 'Log 5 hours of focus time in a single day', icon: Timer, rarity: 'Epic', unlocked: false },
      { id: 'm12', title: 'Collector', description: 'Own 10 different rewards in your inventory', icon: ShoppingBag, rarity: 'Rare', unlocked: false },
      { id: 'm13', title: 'The Phoenix', description: 'Recover from a broken streak', icon: Flame, rarity: 'Rare', unlocked: false },
      { id: 'm14', title: 'First Special Quest', description: 'Generate your first Special Quest', icon: GitMerge, rarity: 'Common', unlocked: false },
      { id: 'm15', title: 'Scribe', description: 'Write a note over 1000 characters', icon: FileText, rarity: 'Rare', unlocked: false },
    ];
  }

  static getDefaultGlobalRewards(): RewardItem[] {
    return [
      { id: 'reward-1', title: 'Watch a Movie', description: 'Relax and watch one movie.', coinCost: 200, icon: Film, category: 'Entertainment', levelRequirement: 5, redeemLimit: 1, redeemPeriod: 'weekly' },
      { id: 'reward-2', title: 'Gaming Session', description: 'Play video games for one hour.', coinCost: 150, icon: Gamepad2, category: 'Entertainment', levelRequirement: 1, redeemLimit: 2, redeemPeriod: 'daily' },
      { id: 'reward-3', title: 'Order Takeout', description: 'Get your favorite food delivered.', coinCost: 300, icon: Pizza, category: 'Treat', levelRequirement: 10, redeemLimit: 2, redeemPeriod: 'weekly' },
      { id: 'reward-4', title: 'Sleep In', description: 'Skip your morning alarm, one time.', coinCost: 400, icon: Film, category: 'Relaxation', levelRequirement: 15, redeemLimit: 1, redeemPeriod: 'monthly' },
      { id: 'reward-5', title: 'Social Media Hour', description: 'One hour of guilt-free scrolling.', coinCost: 100, icon: Gamepad2, category: 'Entertainment', levelRequirement: 1, redeemLimit: 3, redeemPeriod: 'daily' },
      { id: 'reward-6', title: 'Your Favorite Snack', description: 'Indulge in a tasty treat.', coinCost: 50, icon: Pizza, category: 'Treat', levelRequirement: 1 },
      { id: 'gem-reward-1', title: 'Rare Avatar Frame', description: 'An exclusive frame for your avatar.', gemCost: 25, icon: Image, category: 'Item', levelRequirement: 10 },
      { id: 'gem-reward-2', title: 'Boss Fight Bonus', description: '+25% damage against the next boss.', gemCost: 50, icon: Zap, category: 'Boost', levelRequirement: 20, redeemLimit: 1, redeemPeriod: 'weekly' },
      { id: 'gem-reward-3', title: 'Common Loot Box', description: 'A chance to get common items or currency.', gemCost: 10, icon: Box, category: 'Item', levelRequirement: 5 },
      { id: 'coin-reward-1', title: 'Legendary Loot Box', description: 'Guaranteed rare item, with a chance for legendary!', coinCost: 1000, icon: Box, category: 'Item', levelRequirement: 25, redeemLimit: 1, redeemPeriod: 'weekly' },
      { id: 'gem-reward-4', title: 'Character Rename Token', description: 'Change your adventurer\'s name.', gemCost: 100, icon: Star, category: 'Item', levelRequirement: 1 },
    ];
  }
}