'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Star, Zap, Calendar, Clock, TrendingUp, 
  Sword, Shield, Brain, Target, Flame, Crown,
  ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isThisYear, isThisMonth, isThisWeek, subDays, startOfDay } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'achievement' | 'level_up' | 'streak' | 'boss_defeat' | 'milestone' | 'skill_unlock';
  title: string;
  description: string;
  date: Date;
  icon: React.ComponentType<{ className?: string }>;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  metadata?: {
    level?: number;
    xp?: number;
    coins?: number;
    streakDays?: number;
    skillName?: string;
    bossName?: string;
  };
}

interface TimelineViewProps {
  events?: TimelineEvent[];
  showFilters?: boolean;
  compact?: boolean;
  maxEvents?: number;
}

export function TimelineView({ 
  events: customEvents, 
  showFilters = true, 
  compact = false, 
  maxEvents = 50 
}: TimelineViewProps) {
  const { user, tasks } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Generate timeline events from user data
  const timelineEvents = useMemo(() => {
    if (customEvents) return customEvents;
    if (!user) return [];

    const events: TimelineEvent[] = [];

    // Add level up events (mock data - in real app this would come from user history)
    for (let level = 1; level <= user.level; level++) {
      const date = subDays(new Date(), (user.level - level) * 7); // Mock dates
      events.push({
        id: `level-${level}`,
        type: 'level_up',
        title: `Reached Level ${level}`,
        description: `Congratulations! You've grown stronger and unlocked new possibilities.`,
        date,
        icon: Star,
        rarity: level % 10 === 0 ? 'Legendary' : level % 5 === 0 ? 'Epic' : 'Common',
        metadata: { level, xp: level * 100 }
      });
    }

    // Add achievement events (mock data)
    const mockAchievements = [
      { id: 'first-task', title: 'First Step', description: 'Completed your first quest', date: subDays(new Date(), 30), rarity: 'Common' as const },
      { id: 'week-warrior', title: 'Week Warrior', description: 'Maintained a 7-day streak', date: subDays(new Date(), 20), rarity: 'Rare' as const },
      { id: 'boss-slayer', title: 'Boss Slayer', description: 'Defeated your first weekly boss', date: subDays(new Date(), 15), rarity: 'Epic' as const },
    ];

    mockAchievements.forEach(achievement => {
      events.push({
        id: achievement.id,
        type: 'achievement',
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        icon: Trophy,
        rarity: achievement.rarity
      });
    });

    // Add streak milestones
    if (user.longestStreak >= 7) {
      events.push({
        id: 'streak-7',
        type: 'streak',
        title: 'Week Streak Achieved',
        description: `Maintained consistency for ${user.longestStreak} days`,
        date: subDays(new Date(), 10),
        icon: Flame,
        rarity: 'Rare',
        metadata: { streakDays: user.longestStreak }
      });
    }

    // Add skill unlocks
    user.skillTrees.forEach(tree => {
      tree.skills.forEach(skill => {
        if (skill.level > 0) {
          events.push({
            id: `skill-${tree.name}-${skill.name}`,
            type: 'skill_unlock',
            title: `${skill.name} Unlocked`,
            description: `Learned ${skill.name} in the ${tree.name} skill tree`,
            date: subDays(new Date(), Math.random() * 20),
            icon: tree.icon,
            rarity: 'Common',
            metadata: { skillName: skill.name }
          });
        }
      });
    });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, maxEvents);
  }, [user, tasks, customEvents, maxEvents]);

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let filtered = timelineEvents;

    // Filter by time period
    if (selectedFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        switch (selectedFilter) {
          case 'week': return isThisWeek(event.date);
          case 'month': return isThisMonth(event.date);
          case 'year': return isThisYear(event.date);
          default: return true;
        }
      });
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    return filtered;
  }, [timelineEvents, selectedFilter, selectedType]);

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400/20';
      case 'Rare': return 'text-blue-400 border-blue-400/20';
      case 'Epic': return 'text-purple-400 border-purple-400/20';
      case 'Legendary': return 'text-yellow-400 border-yellow-400/20';
      default: return 'text-muted-foreground border-muted/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'level_up': return Star;
      case 'streak': return Flame;
      case 'boss_defeat': return Sword;
      case 'milestone': return Target;
      case 'skill_unlock': return Brain;
      default: return Calendar;
    }
  };

  const renderEvent = (event: TimelineEvent, index: number) => {
    const Icon = event.icon;
    const isExpanded = expandedEvent === event.id;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        {/* Timeline line */}
        {index < filteredEvents.length - 1 && (
          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
        )}

        <div className="flex gap-4">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center bg-background/50 backdrop-blur-sm",
            getRarityColor(event.rarity)
          )}>
            <Icon className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <GlassCard 
              className={cn(
                "cursor-pointer transition-all duration-200",
                isExpanded && "ring-2 ring-primary/50"
              )}
              onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      {event.rarity && (
                        <Badge variant="outline" className={cn("text-xs", getRarityColor(event.rarity))}>
                          {event.rarity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(event.date, 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="ml-2">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && event.metadata && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border/50"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {event.metadata.level && (
                          <div>
                            <span className="text-muted-foreground">Level:</span>
                            <span className="ml-2 font-medium">{event.metadata.level}</span>
                          </div>
                        )}
                        {event.metadata.xp && (
                          <div>
                            <span className="text-muted-foreground">XP Gained:</span>
                            <span className="ml-2 font-medium text-primary">+{event.metadata.xp}</span>
                          </div>
                        )}
                        {event.metadata.coins && (
                          <div>
                            <span className="text-muted-foreground">Coins:</span>
                            <span className="ml-2 font-medium text-yellow-500">+{event.metadata.coins}</span>
                          </div>
                        )}
                        {event.metadata.streakDays && (
                          <div>
                            <span className="text-muted-foreground">Streak:</span>
                            <span className="ml-2 font-medium">{event.metadata.streakDays} days</span>
                          </div>
                        )}
                        {event.metadata.skillName && (
                          <div>
                            <span className="text-muted-foreground">Skill:</span>
                            <span className="ml-2 font-medium">{event.metadata.skillName}</span>
                          </div>
                        )}
                        {event.metadata.bossName && (
                          <div>
                            <span className="text-muted-foreground">Boss:</span>
                            <span className="ml-2 font-medium">{event.metadata.bossName}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Time Period:</span>
            <Tabs value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
                <TabsTrigger value="year" className="text-xs">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Type:</span>
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="achievement" className="text-xs">Achievements</TabsTrigger>
                <TabsTrigger value="level_up" className="text-xs">Level Ups</TabsTrigger>
                <TabsTrigger value="streak" className="text-xs">Streaks</TabsTrigger>
                <TabsTrigger value="skill_unlock" className="text-xs">Skills</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => renderEvent(event, index))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              {selectedFilter !== 'all' || selectedType !== 'all' 
                ? 'Try adjusting your filters to see more events.'
                : 'Complete quests and unlock achievements to build your timeline!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Achievement Timeline Component
export function AchievementTimeline() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <GlassCard gradient="warning">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievement Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimelineView showFilters={true} maxEvents={20} />
      </CardContent>
    </GlassCard>
  );
}

// Compact Timeline for Dashboard
export function CompactTimeline() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <GlassCard gradient="secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TimelineView showFilters={false} compact={true} maxEvents={5} />
      </CardContent>
    </GlassCard>
  );
}