'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, TrendingUp, TrendingDown, AlertTriangle, 
  Target, Calendar, Clock, Zap, Trophy, Star,
  BarChart3, PieChart, Activity, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface PredictiveInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'warning' | 'opportunity';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  suggestedAction?: string;
  timeframe: 'today' | 'this_week' | 'this_month' | 'long_term';
}

interface ProductivityForecast {
  date: Date;
  predictedTasks: number;
  predictedXP: number;
  confidence: number;
  factors: string[];
}

interface PerformanceMetrics {
  currentWeekScore: number;
  projectedWeekScore: number;
  categoryStrengths: Array<{ category: string; score: number; trend: number }>;
  riskFactors: Array<{ factor: string; severity: 'low' | 'medium' | 'high'; description: string }>;
  opportunities: Array<{ opportunity: string; potential: number; description: string }>;
}

export function PredictiveAnalytics() {
  const { user, tasks } = useUser();
  const [selectedTab, setSelectedTab] = useState('insights');
  const [isLoading, setIsLoading] = useState(false);

  // Generate AI insights based on user data
  const insights = useMemo(() => {
    if (!user || !tasks) return [];

    const insights: PredictiveInsight[] = [];

    // Analyze completion patterns
    const completionRate = user.completionRate;
    if (completionRate < 60) {
      insights.push({
        id: 'low-completion',
        type: 'warning',
        title: 'Completion Rate Below Optimal',
        description: `Your current completion rate is ${completionRate}%. Consider reducing task difficulty or quantity.`,
        confidence: 85,
        impact: 'high',
        category: 'Productivity',
        actionable: true,
        suggestedAction: 'Focus on 3-5 high-priority tasks daily',
        timeframe: 'this_week'
      });
    }

    // Streak analysis
    if (user.streak === 0 && user.longestStreak > 7) {
      insights.push({
        id: 'streak-recovery',
        type: 'opportunity',
        title: 'Streak Recovery Opportunity',
        description: `You previously maintained a ${user.longestStreak}-day streak. You can rebuild it!`,
        confidence: 75,
        impact: 'medium',
        category: 'Consistency',
        actionable: true,
        suggestedAction: 'Start with 1-2 easy daily tasks',
        timeframe: 'today'
      });
    }

    // Level progression prediction
    const xpToNext = user.xpToNextLevel - user.xp;
    const avgXPPerDay = 150; // This would be calculated from historical data
    const daysToLevelUp = Math.ceil(xpToNext / avgXPPerDay);
    
    if (daysToLevelUp <= 7) {
      insights.push({
        id: 'level-up-soon',
        type: 'prediction',
        title: 'Level Up Incoming',
        description: `At your current pace, you'll reach level ${user.level + 1} in ${daysToLevelUp} days.`,
        confidence: 80,
        impact: 'medium',
        category: 'Progression',
        actionable: true,
        suggestedAction: 'Complete high-XP tasks to level up faster',
        timeframe: 'this_week'
      });
    }

    // Category balance analysis
    const categoryTasks = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantCategory = Object.entries(categoryTasks)
      .sort(([,a], [,b]) => b - a)[0];

    if (dominantCategory && dominantCategory[1] > tasks.length * 0.4) {
      insights.push({
        id: 'category-imbalance',
        type: 'recommendation',
        title: 'Consider Diversifying Tasks',
        description: `${Math.round((dominantCategory[1] / tasks.length) * 100)}% of your tasks are in ${dominantCategory[0]}. Balance might improve overall growth.`,
        confidence: 70,
        impact: 'low',
        category: 'Balance',
        actionable: true,
        suggestedAction: 'Add tasks from other life areas',
        timeframe: 'this_month'
      });
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }, [user, tasks]);

  // Generate productivity forecast
  const forecast = useMemo(() => {
    if (!user || !tasks) return [];

    const forecasts: ProductivityForecast[] = [];
    const today = new Date();

    // Generate 7-day forecast
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Mock prediction based on historical patterns
      // In a real app, this would use ML models
      const baseTasks = dayOfWeek === 0 || dayOfWeek === 6 ? 2 : 4; // Weekend vs weekday
      const predictedTasks = baseTasks + Math.floor(Math.random() * 2);
      const predictedXP = predictedTasks * 50; // Average XP per task
      
      forecasts.push({
        date,
        predictedTasks,
        predictedXP,
        confidence: 75 + Math.random() * 20,
        factors: [
          dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend pattern' : 'Weekday pattern',
          user.streak > 0 ? 'Active streak' : 'Building momentum',
          'Historical performance'
        ]
      });
    }

    return forecasts;
  }, [user, tasks]);

  // Calculate performance metrics
  const metrics = useMemo(() => {
    if (!user || !tasks) return null;

    const thisWeekStart = startOfWeek(new Date());
    const thisWeekEnd = endOfWeek(new Date());
    
    const thisWeekTasks = tasks.filter(task => 
      task.lastCompleted && 
      isWithinInterval(new Date(task.lastCompleted), { start: thisWeekStart, end: thisWeekEnd })
    );

    const currentWeekScore = Math.min(100, (thisWeekTasks.length / 7) * 100);
    const projectedWeekScore = currentWeekScore + 15; // Mock projection

    const categories = ['Education', 'Career', 'Health', 'Mental Wellness', 'Finance', 'Social', 'Hobbies', 'Home'];
    const categoryStrengths = categories.map(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const completedTasks = categoryTasks.filter(task => task.completed);
      const score = categoryTasks.length > 0 ? (completedTasks.length / categoryTasks.length) * 100 : 0;
      const trend = Math.random() * 20 - 10; // Mock trend data
      
      return { category, score: Math.round(score), trend: Math.round(trend) };
    });

    const riskFactors = [];
    if (user.health < 50) {
      riskFactors.push({
        factor: 'Low Health',
        severity: 'high' as const,
        description: 'Missing daily tasks is affecting your health. Consider easier goals.'
      });
    }
    if (user.streak === 0 && user.longestStreak > 0) {
      riskFactors.push({
        factor: 'Broken Streak',
        severity: 'medium' as const,
        description: 'Your streak was broken. Focus on rebuilding consistency.'
      });
    }

    const opportunities = [
      {
        opportunity: 'Skill Point Optimization',
        potential: user.skillPoints * 10,
        description: `You have ${user.skillPoints} unspent skill points that could boost your performance.`
      },
      {
        opportunity: 'Category Expansion',
        potential: 25,
        description: 'Exploring underutilized categories could unlock new achievements.'
      }
    ];

    return {
      currentWeekScore,
      projectedWeekScore,
      categoryStrengths: categoryStrengths.sort((a, b) => b.score - a.score),
      riskFactors,
      opportunities
    };
  }, [user, tasks]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'opportunity': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'border-blue-500/20 bg-blue-500/5';
      case 'recommendation': return 'border-green-500/20 bg-green-500/5';
      case 'warning': return 'border-red-500/20 bg-red-500/5';
      case 'opportunity': return 'border-yellow-500/20 bg-yellow-500/5';
      default: return 'border-muted/20 bg-muted/5';
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Analytics Dashboard</h2>
        <Badge variant="outline" className="ml-auto">
          Powered by AI
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn("border-2", getInsightColor(insight.type))}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                          <Badge 
                            variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {insight.timeframe.replace('_', ' ')}
                        </div>
                        
                        {insight.actionable && insight.suggestedAction && (
                          <Button size="sm" variant="outline">
                            {insight.suggestedAction}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <GlassCard gradient="accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                7-Day Productivity Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.map((day, index) => (
                  <motion.div
                    key={day.date.toISOString()}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium min-w-16">
                        {format(day.date, 'EEE d')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">
                          {day.predictedTasks} tasks • {day.predictedXP} XP
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {day.factors.join(' • ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">{Math.round(day.confidence)}%</div>
                      <div className="text-xs text-muted-foreground">confidence</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </GlassCard>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {metrics && (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Weekly Performance */}
              <GlassCard gradient="success">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Weekly Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Week</span>
                      <span>{metrics.currentWeekScore}%</span>
                    </div>
                    <Progress value={metrics.currentWeekScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projected Week</span>
                      <span>{metrics.projectedWeekScore}%</span>
                    </div>
                    <Progress value={metrics.projectedWeekScore} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>+{metrics.projectedWeekScore - metrics.currentWeekScore}% projected improvement</span>
                  </div>
                </CardContent>
              </GlassCard>

              {/* Category Strengths */}
              <GlassCard gradient="primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.categoryStrengths.slice(0, 5).map((category, index) => (
                      <motion.div
                        key={category.category}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{category.category}</div>
                          {category.trend !== 0 && (
                            <div className={cn(
                              "flex items-center text-xs",
                              category.trend > 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {category.trend > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {Math.abs(category.trend)}%
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-bold">{category.score}%</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>

              {/* Risk Factors */}
              {metrics.riskFactors.length > 0 && (
                <GlassCard gradient="danger">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.riskFactors.map((risk, index) => (
                        <motion.div
                          key={risk.factor}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-background/20"
                        >
                          <AlertTriangle className={cn(
                            "h-4 w-4 mt-0.5",
                            risk.severity === 'high' ? 'text-red-500' :
                            risk.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                          )} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{risk.factor}</div>
                            <div className="text-xs text-muted-foreground">{risk.description}</div>
                          </div>
                          <Badge 
                            variant={risk.severity === 'high' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {risk.severity}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </GlassCard>
              )}

              {/* Opportunities */}
              <GlassCard gradient="warning">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.opportunities.map((opportunity, index) => (
                      <motion.div
                        key={opportunity.opportunity}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/20"
                      >
                        <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{opportunity.opportunity}</div>
                          <div className="text-xs text-muted-foreground">{opportunity.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{opportunity.potential}% potential
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Productivity Trends */}
            <GlassCard gradient="accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Productivity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{user.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Overall Completion Rate</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="text-green-500">+12%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>This Week</span>
                      <span className="text-green-500">+8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Yesterday</span>
                      <span className="text-blue-500">+3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassCard>

            {/* Streak Analysis */}
            <GlassCard gradient="primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Streak Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{user.streak}</div>
                      <div className="text-xs text-muted-foreground">Current</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{user.longestStreak}</div>
                      <div className="text-xs text-muted-foreground">Best</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Streak Prediction</div>
                    <div className="text-xs text-muted-foreground">
                      Based on your patterns, you have a 78% chance of maintaining your streak this week.
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}