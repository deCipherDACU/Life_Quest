'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RadarDataPoint {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

export function RadarChart({
  data,
  size = 300,
  showGrid = true,
  showLabels = true,
  showValues = true,
  animated = true,
  className
}: RadarChartProps) {
  const center = size / 2;
  const radius = (size - 80) / 2; // Leave space for labels

  // Calculate points for the radar chart
  const points = useMemo(() => {
    return data.map((item, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
      const normalizedValue = item.value / item.maxValue;
      const x = center + Math.cos(angle) * radius * normalizedValue;
      const y = center + Math.sin(angle) * radius * normalizedValue;
      
      return {
        x,
        y,
        angle,
        normalizedValue,
        ...item
      };
    });
  }, [data, center, radius]);

  // Generate grid circles
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  // Generate axis lines
  const axisLines = data.map((_, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const endX = center + Math.cos(angle) * radius;
    const endY = center + Math.sin(angle) * radius;
    
    return { startX: center, startY: center, endX, endY, angle };
  });

  // Generate label positions
  const labelPositions = data.map((item, index) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = center + Math.cos(angle) * labelRadius;
    const y = center + Math.sin(angle) * labelRadius;
    
    return { x, y, angle, ...item };
  });

  // Create path for the filled area
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="overflow-visible">
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid circles */}
        {showGrid && gridLevels.map((level, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            opacity="0.2"
          />
        ))}

        {/* Axis lines */}
        {showGrid && axisLines.map((line, index) => (
          <line
            key={index}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Filled area */}
        <motion.path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          filter="url(#glow)"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={animated ? { duration: 1.5, ease: "easeOut" } : undefined}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth="2"
            filter="url(#glow)"
            initial={animated ? { scale: 0, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            transition={animated ? { delay: index * 0.1 + 0.5, duration: 0.3 } : undefined}
          />
        ))}

        {/* Value labels on points */}
        {showValues && points.map((point, index) => (
          <motion.text
            key={index}
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            className="text-xs font-medium fill-primary"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={animated ? { delay: index * 0.1 + 1, duration: 0.3 } : undefined}
          >
            {point.value}
          </motion.text>
        ))}
      </svg>

      {/* Labels around the chart */}
      {showLabels && labelPositions.map((label, index) => {
        const Icon = label.icon;
        return (
          <motion.div
            key={index}
            className="absolute flex items-center gap-1 text-sm font-medium"
            style={{
              left: label.x,
              top: label.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
            animate={animated ? { opacity: 1, scale: 1 } : undefined}
            transition={animated ? { delay: index * 0.1 + 1.2, duration: 0.3 } : undefined}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// Skill Progression Radar Chart Component
export function SkillProgressionRadar() {
  const { user } = useUser();

  const skillData = useMemo(() => {
    if (!user) return [];

    return user.skillTrees.map(tree => {
      const totalLevel = tree.skills.reduce((sum, skill) => sum + skill.level, 0);
      const maxLevel = tree.skills.reduce((sum, skill) => sum + skill.maxLevel, 0);
      
      return {
        label: tree.name,
        value: totalLevel,
        maxValue: maxLevel,
        color: getSkillColor(tree.name),
        icon: tree.icon
      };
    });
  }, [user]);

  const overallProgress = useMemo(() => {
    if (skillData.length === 0) return 0;
    const totalCurrent = skillData.reduce((sum, skill) => sum + skill.value, 0);
    const totalMax = skillData.reduce((sum, skill) => sum + skill.maxValue, 0);
    return Math.round((totalCurrent / totalMax) * 100);
  }, [skillData]);

  if (!user) return null;

  return (
    <GlassCard gradient="accent" className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Skill Progression</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {overallProgress}% Complete
            </Badge>
            <Badge variant="secondary">
              {user.skillPoints} SP Available
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Radar Chart */}
          <div className="flex-shrink-0">
            <RadarChart
              data={skillData}
              size={280}
              showGrid={true}
              showLabels={true}
              showValues={true}
              animated={true}
            />
          </div>

          {/* Skill Details */}
          <div className="flex-1 space-y-3">
            {skillData.map((skill, index) => {
              const Icon = skill.icon;
              const percentage = Math.round((skill.value / skill.maxValue) * 100);
              
              return (
                <motion.div
                  key={skill.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/20"
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5" style={{ color: skill.color }} />}
                    <div>
                      <div className="font-medium">{skill.label}</div>
                      <div className="text-sm text-muted-foreground">
                        Level {skill.value} / {skill.maxValue}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">{percentage}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}

// Category Performance Radar Chart
export function CategoryPerformanceRadar() {
  const { user, tasks } = useUser();

  const categoryData = useMemo(() => {
    if (!user || !tasks) return [];

    const categories = ['Education', 'Career', 'Health', 'Mental Wellness', 'Finance', 'Social', 'Hobbies', 'Home'];
    
    return categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const completedTasks = categoryTasks.filter(task => task.completed);
      const completionRate = categoryTasks.length > 0 ? (completedTasks.length / categoryTasks.length) * 100 : 0;
      
      return {
        label: category,
        value: Math.round(completionRate),
        maxValue: 100,
        color: getCategoryColor(category)
      };
    });
  }, [user, tasks]);

  if (!user) return null;

  return (
    <GlassCard gradient="success">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Category Performance
        </CardTitle>
      </CardHeader>

      <CardContent>
        <RadarChart
          data={categoryData}
          size={300}
          showGrid={true}
          showLabels={true}
          showValues={true}
          animated={true}
        />
      </CardContent>
    </GlassCard>
  );
}

// Helper functions
function getSkillColor(skillName: string): string {
  const colors = {
    'Strength': '#ef4444',
    'Endurance': '#3b82f6',
    'Agility': '#10b981',
    'Intelligence': '#8b5cf6',
    'Perception': '#f59e0b'
  };
  return colors[skillName as keyof typeof colors] || '#6b7280';
}

function getCategoryColor(category: string): string {
  const colors = {
    'Education': '#3b82f6',
    'Career': '#8b5cf6',
    'Health': '#10b981',
    'Mental Wellness': '#06b6d4',
    'Finance': '#f59e0b',
    'Social': '#ec4899',
    'Hobbies': '#84cc16',
    'Home': '#f97316'
  };
  return colors[category as keyof typeof colors] || '#6b7280';
}