

'use client';

import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle2, Coins, Shield, Sparkles, Star, Sword, Trophy } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import WeeklyOverviewChart from "@/components/dashboard/WeeklyOverviewChart";
import StreakTracker from "@/components/dashboard/StreakTracker";
import { Progress } from "@/components/ui/progress";
import Link from 'next/link';
import { AiRecommendations } from "@/components/dashboard/AiRecommendations";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, tasks, boss } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !user || !boss) {
    return (
        <>
            <PageHeader
                title="Welcome Back!"
                description="Loading your progress summary..."
            />
            {/* You can add skeleton loaders here for a better UX */}
        </>
    );
  }

  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);
  
  const displayLevel = user.level >= 99 ? '99+' : user.level;

  const dailyTasks = tasks.filter(t => t.type === 'Daily');
  const completedDailyTasks = dailyTasks.filter(t => t.completed).length;
  const dailyProgress = dailyTasks.length > 0 ? (completedDailyTasks / dailyTasks.length) * 100 : 0;

  return (
    <>
      <PageHeader
        title={`Welcome Back, ${user.name.split(' ')[0]}!`}
        description="Here's your progress summary. Let's make today productive!"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Level" value={displayLevel} icon={<Trophy className="h-4 w-4 text-muted-foreground" />} description={user.level < 99 ? `${user.xp.toLocaleString()} / ${user.xpToNextLevel.toLocaleString()} XP` : 'Potential Reached'} />
        <StatCard title="Coins" value={user.coins.toLocaleString()} icon={<Coins className="h-4 w-4 text-muted-foreground" />} description="+0 today" />
        <StatCard title="Gems" value={user.gems} icon={<Sparkles className="h-4 w-4 text-muted-foreground" />} description="Premium Currency" />
        <StatCard title="Completion Rate" value={`${user.completionRate}%`} icon={<Shield className="h-4 w-4 text-muted-foreground" />} description="Last 30 days" />
      </div>

      <div className="grid gap-4 mt-4 grid-cols-1 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          <AiRecommendations />
          <WeeklyOverviewChart />
          <StreakTracker />
        </div>

        {/* Side column */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" /> Daily Progress</CardTitle>
               <CardDescription>Your daily quest completion.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold font-headline">Dailies Completed</h3>
                    <span className="font-mono text-sm">{completedDailyTasks} / {dailyTasks.length}</span>
                </div>
                <Progress value={dailyProgress} className="h-4" />
                <Button asChild className="w-full mt-4" variant="outline">
                    <Link href="/tasks">View Daily Quests</Link>
                </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Sword className="h-5 w-5 text-destructive" /> Weekly Boss</CardTitle>
              <CardDescription>{boss.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-40 relative rounded-lg mb-4 overflow-hidden"
                data-ai-hint="fantasy dragon"
              >
                <Image src={boss.imageUrl} alt={boss.name} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <Progress value={(boss.currentHp / boss.maxHp) * 100} className="h-3" />
              <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                <span>{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP</span>
                <span>{boss.timeRemaining} left</span>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/boss-fight">
                  Join the Fight <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Upcoming Quests</CardTitle>
              <CardDescription>Your next most important tasks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                <Link href="/tasks" key={task.id} className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-secondary/20 transition-colors">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                       <Badge variant="outline">{task.category}</Badge>
                       <Badge variant="secondary">{task.difficulty}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-sm text-primary">+{task.xp} XP</p>
                    <p className="font-semibold text-xs text-yellow-500">+{task.coins} Coins</p>
                  </div>
                </Link>
              )) : (
                <p className="text-center text-muted-foreground py-4">No upcoming quests. Enjoy your break!</p>
              )}
              {upcomingTasks.length > 0 && (
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link href="/tasks">
                    View All Quests
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}
