'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard, AnimatedBackground } from '@/components/ui/glass-card';
import { AchievementUnlock } from '@/components/ui/advanced-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Crown, Zap, Target, Medal, 
  Award, Gem, Shield, Flame, Lock, CheckCircle,
  Calendar, TrendingUp, Users, BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Achievement categories and data
const achievementCategories = {
  progress: {
    name: 'Progress',
    icon: TrendingUp,
    color: 'blue',
    achievements: [
      {
        id: 'first_task',
        name: 'First Steps',
        description: 'Complete your first task',
        icon: Target,
        rarity: 'common' as const,
        requirement: 1,
        type: 'tasks_completed',
        reward: { xp: 50, coins: 10 }
      },
      {
        id: 'task_streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day task completion streak',
        icon: Flame,
        rarity: 'rare' as const,
        requirement: 7,
        type: 'streak',
        reward: { xp: 200, coins: 50 }
      },
      {
        id: 'level_10',
        name: 'Rising Star',
        description: 'Reach level 10',
        icon: Star,
        rarity: 'epic' as const,
        requirement: 10,
        type: 'level',
        reward: { xp: 500, coins: 100, skillPoints: 2 }
      },
      {
        id: 'task_master',
        name: 'Task Master',
        description: 'Complete 1000 tasks',
        icon: Crown,
        rarity: 'legendary' as const,
        requirement: 1000,
        type: 'tasks_completed',
        reward: { xp: 2000, coins: 500, skillPoints: 10 }
      }
    ]
  },
  skills: {
    name: 'Skills',
    icon: Zap,
    color: 'purple',
    achievements: [
      {
        id: 'first_skill',
        name: 'Skill Seeker',
        description: 'Upgrade your first skill',
        icon: Zap,
        rarity: 'common' as const,
        requirement: 1,
        type: 'skills_upgraded',
        reward: { xp: 100, coins: 25 }
      },
      {
        id: 'skill_tree_master',
        name: 'Tree Master',
        description: 'Max out an entire skill tree',
        icon: Trophy,
        rarity: 'epic' as const,
        requirement: 1,
        type: 'skill_trees_maxed',
        reward: { xp: 1000, coins: 200, skillPoints: 5 }
      },
      {
        id: 'polymath',
        name: 'Polymath',
        description: 'Have at least 5 levels in all skill trees',
        icon: BookOpen,
        rarity: 'legendary' as const,
        requirement: 5,
        type: 'min_skill_level_all_trees',
        reward: { xp: 3000, coins: 750, skillPoints: 15 }
      }
    ]
  },
  social: {
    name: 'Social',
    icon: Users,
    color: 'green',
    achievements: [
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Join your first team challenge',
        icon: Users,
        rarity: 'common' as const,
        requirement: 1,
        type: 'team_challenges_joined',
        reward: { xp: 150, coins: 30 }
      },
      {
        id: 'mentor',
        name: 'Mentor',
        description: 'Help 10 other users complete tasks',
        icon: Award,
        rarity: 'rare' as const,
        requirement: 10,
        type: 'users_helped',
        reward: { xp: 500, coins: 100 }
      }
    ]
  },
  special: {
    name: 'Special',
    icon: Crown,
    color: 'gold',
    achievements: [
      {
        id: 'perfect_week',
        name: 'Perfect Week',
        description: 'Complete all planned tasks for 7 consecutive days',
        icon: Medal,
        rarity: 'epic' as const,
        requirement: 7,
        type: 'perfect_days_streak',
        reward: { xp: 1500, coins: 300, skillPoints: 3 }
      },
      {
        id: 'legend',
        name: 'Legend',
        description: 'Reach the maximum level',
        icon: Crown,
        rarity: 'legendary' as const,
        requirement: 100,
        type: 'level',
        reward: { xp: 10000, coins: 2000, skillPoints: 50 }
      }
    ]
  }
};

const rarityStyles = {
  common: {
    border: 'border-gray-400/50',
    bg: 'from-gray-400/20 to-gray-600/20',
    glow: 'shadow-gray-400/25',
    text: 'text-gray-400'
  },
  rare: {
    border: 'border-blue-400/50',
    bg: 'from-blue-400/20 to-blue-600/20',
    glow: 'shadow-blue-400/25',
    text: 'text-blue-400'
  },
  epic: {
    border: 'border-purple-400/50',
    bg: 'from-purple-400/20 to-purple-600/20',
    glow: 'shadow-purple-400/25',
    text: 'text-purple-400'
  },
  legendary: {
    border: 'border-yellow-400/50',
    bg: 'from-yellow-400/20 to-orange-500/20',
    glow: 'shadow-yellow-400/25',
    text: 'text-yellow-400'
  }
};

interface AchievementCardProps {
  achievement: any;
  isUnlocked: boolean;
  progress: number;
  onClick: () => void;
}

function AchievementCard({ achievement, isUnlocked, progress, onClick }: AchievementCardProps) {
  const rarity = rarityStyles[achievement.rarity];
  const Icon = achievement.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <GlassCard
        variant={isUnlocked ? 'gaming' : 'crystal'}
        glow={isUnlocked}
        particles={isUnlocked}
        className={cn(
          'relative overflow-hidden transition-all duration-300 p-6',
          rarity.border,
          isUnlocked ? rarity.glow : 'opacity-60'
        )}
      >
        {/* Rarity Background */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-30',
          rarity.bg
        )} />
        
        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-full',
                isUnlocked ? rarity.bg : 'bg-muted/50'
              )}>
                {isUnlocked ? (
                  <Icon className={cn('h-6 w-6', rarity.text)} />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{achievement.name}</h3>
                <Badge variant="outline" className={cn('text-xs', rarity.text)}>
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
            </div>
            {isUnlocked && (
              <CheckCircle className="h-6 w-6 text-green-500" />
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>

          {/* Progress */}
          {!isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{Math.min(progress, achievement.requirement)}/{achievement.requirement}</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <motion.div
                  className={cn('h-2 rounded-full bg-gradient-to-r', rarity.bg)}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((progress / achievement.requirement) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Rewards */}
          <div className="flex flex-wrap gap-2">
            {achievement.reward.xp && (
              <Badge variant="secondary" className="text-xs">
                +{achievement.reward.xp} XP
              </Badge>
            )}
            {achievement.reward.coins && (
              <Badge variant="secondary" className="text-xs">
                +{achievement.reward.coins} Coins
              </Badge>
            )}
            {achievement.reward.skillPoints && (
              <Badge variant="secondary" className="text-xs">
                +{achievement.reward.skillPoints} SP
              </Badge>
            )}
          </div>
        </div>

        {/* Unlock Animation Overlay */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br', rarity.bg)} />
          </motion.div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function AchievementShowcase() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof achievementCategories>('progress');
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  if (!user) return null;

  // Calculate achievement progress and unlock status
  const getAchievementProgress = (achievement: any) => {
    switch (achievement.type) {
      case 'tasks_completed':
        return user.tasksCompleted || 0;
      case 'level':
        return user.level || 1;
      case 'streak':
        return user.streak || 0;
      case 'skills_upgraded':
        return Object.values(user.skills || {}).reduce((sum: number, level: any) => sum + level, 0);
      default:
        return 0;
    }
  };

  const isAchievementUnlocked = (achievement: any) => {
    const progress = getAchievementProgress(achievement);
    return progress >= achievement.requirement;
  };

  // Calculate statistics
  const totalAchievements = Object.values(achievementCategories).reduce(
    (sum, category) => sum + category.achievements.length, 0
  );
  
  const unlockedAchievements = Object.values(achievementCategories).reduce(
    (sum, category) => sum + category.achievements.filter(isAchievementUnlocked).length, 0
  );

  const completionPercentage = (unlockedAchievements / totalAchievements) * 100;

  return (
    <div className="space-y-6 relative">
      {/* Animated Background */}
      <AnimatedBackground variant="aurora" intensity="low" />
      
      {/* Header */}
      <GlassCard variant="gaming" glow className="text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Achievement Gallery
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Showcase your accomplishments and track your progress
          </p>
          
          {/* Statistics */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{unlockedAchievements}</div>
              <div className="text-sm text-muted-foreground">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totalAchievements}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{completionPercentage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </motion.div>
      </GlassCard>

      {/* Achievement Categories */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as keyof typeof achievementCategories)}>
        <TabsList className="grid w-full grid-cols-4 bg-background/50 backdrop-blur-sm">
          {Object.entries(achievementCategories).map(([key, category]) => {
            const Icon = category.icon;
            const categoryUnlocked = category.achievements.filter(isAchievementUnlocked).length;
            const categoryTotal = category.achievements.length;
            
            return (
              <TabsTrigger key={key} value={key} className="flex flex-col items-center gap-1 p-3">
                <Icon className="h-5 w-5" />
                <span className="text-xs">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {categoryUnlocked}/{categoryTotal}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(achievementCategories).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-6">
            {/* Category Header */}
            <GlassCard variant="crystal" className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-${category.color}-500/20`}>
                  <category.icon className={`h-8 w-8 text-${category.color}-500`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{category.name} Achievements</h3>
                  <p className="text-muted-foreground">
                    {category.achievements.filter(isAchievementUnlocked).length} of {category.achievements.length} unlocked
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Achievements Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.achievements.map((achievement) => {
                const progress = getAchievementProgress(achievement);
                const unlocked = isAchievementUnlocked(achievement);
                
                return (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={unlocked}
                    progress={progress}
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <GlassCard variant="gaming" glow className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-3 rounded-full',
                      rarityStyles[selectedAchievement.rarity].bg
                    )}>
                      <selectedAchievement.icon className={cn(
                        'h-8 w-8',
                        rarityStyles[selectedAchievement.rarity].text
                      )} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedAchievement.name}</h3>
                      <Badge variant="outline" className={cn(
                        'text-xs',
                        rarityStyles[selectedAchievement.rarity].text
                      )}>
                        {selectedAchievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground">
                    {selectedAchievement.description}
                  </p>

                  {/* Rewards */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Rewards:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAchievement.reward.xp && (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          +{selectedAchievement.reward.xp} XP
                        </Badge>
                      )}
                      {selectedAchievement.reward.coins && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          +{selectedAchievement.reward.coins} Coins
                        </Badge>
                      )}
                      {selectedAchievement.reward.skillPoints && (
                        <Badge className="bg-purple-500/20 text-purple-400">
                          +{selectedAchievement.reward.skillPoints} SP
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <Button
                    onClick={() => setSelectedAchievement(null)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}