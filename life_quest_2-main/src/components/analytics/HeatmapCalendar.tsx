'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, subDays, isToday, isSameDay } from 'date-fns';

interface ActivityData {
  date: Date;
  count: number;
  level: number; // 0-4 intensity levels
  tasks: Array<{
    id: string;
    title: string;
    category: string;
    xp: number;
  }>;
}

interface HeatmapCalendarProps {
  year?: number;
  showStats?: boolean;
  compact?: boolean;
}

export function HeatmapCalendar({ year = new Date().getFullYear(), showStats = true, compact = false }: HeatmapCalendarProps) {
  const { user, tasks } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Generate activity data for the year
  const activityData = useMemo(() => {
    if (!user || !tasks) return [];

    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 11, 31));
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return allDays.map(date => {
      // Find tasks completed on this date
      const dayTasks = tasks.filter(task => 
        task.completed && 
        task.lastCompleted && 
        isSameDay(new Date(task.lastCompleted), date)
      );

      const count = dayTasks.length;
      const totalXP = dayTasks.reduce((sum, task) => sum + task.xp, 0);
      
      // Calculate intensity level (0-4)
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;

      return {
        date,
        count,
        level,
        tasks: dayTasks.map(task => ({
          id: task.id,
          title: task.title,
          category: task.category,
          xp: task.xp
        }))
      };
    });
  }, [user, tasks, year]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = activityData.length;
    const activeDays = activityData.filter(day => day.count > 0).length;
    const totalTasks = activityData.reduce((sum, day) => sum + day.count, 0);
    const maxStreak = calculateMaxStreak(activityData);
    const currentStreak = calculateCurrentStreak(activityData);
    
    return {
      totalDays,
      activeDays,
      totalTasks,
      maxStreak,
      currentStreak,
      consistency: Math.round((activeDays / totalDays) * 100)
    };
  }, [activityData]);

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-muted/30', // Level 0 - no activity
      'bg-primary/30', // Level 1 - light activity
      'bg-primary/50', // Level 2 - moderate activity
      'bg-primary/70', // Level 3 - high activity
      'bg-primary/90', // Level 4 - very high activity
    ];
    return colors[level] || colors[0];
  };

  const renderCalendarGrid = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for the first week if needed
    const firstDay = activityData[0];
    if (firstDay) {
      const dayOfWeek = getDay(firstDay.date);
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    activityData.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    // Add the last partial week if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return (
      <div className="space-y-1">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center">
              {compact ? day[0] : day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  whileHover={{ scale: 1.2 }}
                  className={cn(
                    "w-3 h-3 rounded-sm cursor-pointer transition-all duration-200",
                    day ? getLevelColor(day.level) : 'bg-transparent',
                    day && isToday(day.date) && 'ring-2 ring-primary ring-offset-1',
                    hoveredDate && day && isSameDay(hoveredDate, day.date) && 'ring-1 ring-white/50'
                  )}
                  onMouseEnter={() => day && setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => day && setSelectedDate(day.date)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTooltip = () => {
    const day = hoveredDate ? activityData.find(d => isSameDay(d.date, hoveredDate)) : null;
    if (!day || !hoveredDate) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute z-50 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl pointer-events-none"
        style={{
          left: '50%',
          top: '-100%',
          transform: 'translateX(-50%)'
        }}
      >
        <div className="text-sm font-medium">{format(hoveredDate, 'MMM d, yyyy')}</div>
        <div className="text-xs text-muted-foreground">
          {day.count === 0 ? 'No activity' : `${day.count} task${day.count === 1 ? '' : 's'} completed`}
        </div>
        {day.tasks.length > 0 && (
          <div className="mt-2 space-y-1 max-w-48">
            {day.tasks.slice(0, 3).map(task => (
              <div key={task.id} className="text-xs">
                <span className="font-medium">{task.title}</span>
                <span className="text-primary ml-1">+{task.xp} XP</span>
              </div>
            ))}
            {day.tasks.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{day.tasks.length - 3} more tasks
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <GlassCard gradient="primary" className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Activity Calendar {year}</CardTitle>
          </div>
          {showStats && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {stats.currentStreak} day streak
              </Badge>
              <Badge variant="secondary">
                {stats.consistency}% consistency
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="relative">
          {renderCalendarGrid()}
          {renderTooltip()}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={cn("w-3 h-3 rounded-sm", getLevelColor(level))}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* Statistics */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold">{stats.totalTasks}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.activeDays}</div>
              <div className="text-xs text-muted-foreground">Active Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.maxStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.consistency}%</div>
              <div className="text-xs text-muted-foreground">Consistency</div>
            </div>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
}

// Helper functions
function calculateMaxStreak(activityData: ActivityData[]): number {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of activityData) {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
}

function calculateCurrentStreak(activityData: ActivityData[]): number {
  let streak = 0;
  const today = new Date();

  // Start from today and go backwards
  for (let i = activityData.length - 1; i >= 0; i--) {
    const day = activityData[i];
    if (day.date > today) continue; // Skip future dates
    
    if (day.count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}