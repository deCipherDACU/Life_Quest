'use client';

import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard, AnimatedBackground } from '@/components/ui/glass-card';
import { RadialProgress, Progress3D, XPGainAnimation, MicroInteractionButton } from '@/components/ui/advanced-progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, Trophy, Coins, Gem, Heart, Target, 
  TrendingUp, Calendar, Clock, Star,
  Sword, Shield, Brain, Eye, Wind
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeatmapCalendar } from '@/components/analytics/HeatmapCalendar';
import { CompactTimeline } from '@/components/analytics/TimelineView';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

function EnhancedStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  gradient = 'primary',
  onClick 
}: StatCardProps) {
  return (
    <GlassCard 
      gradient={gradient} 
      glow={!!trend && trend > 0}
      className="cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs mt-1",
            trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            <TrendingUp className={cn(
              "h-3 w-3 mr-1",
              trend < 0 && "rotate-180"
            )} />
            {Math.abs(trend)}% from last week
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
}

function CharacterOverview() {
  const { user } = useUser();
  
  if (!user) return null;

  const skillTrees = [
    { name: 'Strength', icon: Sword, color: 'text-red-500' },
    { name: 'Endurance', icon: Shield, color: 'text-blue-500' },
    { name: 'Agility', icon: Wind, color: 'text-green-500' },
    { name: 'Intelligence', icon: Brain, color: 'text-purple-500' },
    { name: 'Perception', icon: Eye, color: 'text-yellow-500' },
  ];

  return (
    <GlassCard gradient="accent" className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
            {user.level}
          </div>
          Character Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experience</span>
            <span>{user.xp} / {user.xpToNextLevel} XP</span>
          </div>
          <Progress3D 
            value={user.xp} 
            max={user.xpToNextLevel} 
            height={12}
          />
        </div>

        {/* Health */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              Health
            </span>
            <span>{user.health} / {user.maxHealth}</span>
          </div>
          <Progress3D 
            value={user.health} 
            max={user.maxHealth} 
            height={8}
          />
        </div>

        {/* Skill Trees Preview */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {skillTrees.map((skill, index) => {
            const userSkill = user.skillTrees.find(s => s.name === skill.name);
            const totalLevel = userSkill?.skills.reduce((sum, s) => sum + s.level, 0) || 0;
            const Icon = skill.icon;
            
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-1",
                  skill.color
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium">{totalLevel}</div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
}

function QuickActions() {
  const quickActions = [
    { label: 'Add Quest', icon: Target, href: '/tasks?create=true', gradient: 'primary' as const },
    { label: 'Boss Fight', icon: Zap, href: '/boss-fight', gradient: 'danger' as const },
    { label: 'Focus Timer', icon: Clock, href: '/pomodoro', gradient: 'accent' as const },
    { label: 'Journal', icon: Calendar, href: '/journal', gradient: 'success' as const },
  ];

  return (
    <GlassCard gradient="secondary" className="col-span-1 lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-3"
                asChild
              >
                <a href={action.href}>
                  <Icon className="h-4 w-4" />
                  {action.label}
                </a>
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
    </GlassCard>
  );
}

function AchievementShowcase() {
  const { user } = useUser();
  
  if (!user) return null;

  // Mock recent achievements - in real app, this would come from user data
  const recentAchievements = [
    { id: 'q1', title: 'First Step', rarity: 'Common', unlockedDate: new Date() },
    { id: 'l1', title: 'Novice', rarity: 'Common', unlockedDate: new Date() },
  ];

  return (
    <GlassCard gradient="warning" className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAchievements.length > 0 ? (
          <div className="space-y-2">
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center gap-3 p-2 rounded-lg bg-background/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{achievement.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.rarity}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Complete quests to unlock achievements!</p>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
}

export function EnhancedDashboard() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      
      <div className="relative z-10 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Ready to continue your epic journey?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedStatCard
            title="Level"
            value={user.level}
            subtitle={`${user.xp} / ${user.xpToNextLevel} XP`}
            icon={Star}
            trend={5}
            gradient="primary"
          />
          <EnhancedStatCard
            title="Coins"
            value={user.coins}
            subtitle="Spend in shop"
            icon={Coins}
            trend={12}
            gradient="warning"
          />
          <EnhancedStatCard
            title="Gems"
            value={user.gems}
            subtitle="Premium currency"
            icon={Gem}
            trend={0}
            gradient="accent"
          />
          <EnhancedStatCard
            title="Streak"
            value={user.streak}
            subtitle={`Best: ${user.longestStreak} days`}
            icon={Zap}
            trend={user.streak > 0 ? 100 : -50}
            gradient="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CharacterOverview />
          <QuickActions />
          <AchievementShowcase />
        </div>
      </div>
    </div>
  );
}