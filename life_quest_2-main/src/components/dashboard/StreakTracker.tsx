
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
// Removed mock data dependency - streak data will be generated from user data

type Day = {
  date: string;
  level: number;
};

const StreakTracker = () => {
  const [days, setDays] = useState<Day[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // Generate streak data based on user's actual activity
    const generateStreakDays = () => {
      return Array.from({ length: 35 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (34 - i));
        // TODO: Calculate actual activity level from user's task completion history
        const level = 0; // Placeholder - will be calculated from real data
        return {
          date: date.toISOString().split('T')[0],
          level: level,
        };
      });
    };
    
    setDays(generateStreakDays());
  }, [user]);


  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-primary/30';
      case 2: return 'bg-primary/50';
      case 3: return 'bg-primary/80';
      case 4: return 'bg-primary';
      default: return 'bg-white/10';
    }
  };

  if (!user) {
    return (
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline">Streak Counter</CardTitle>
          <CardDescription>Your daily activity for the last 5 weeks.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-24 animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">Streak Counter</CardTitle>
        <CardDescription>Your daily activity for the last 5 weeks.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Flame className="w-10 h-10 text-orange-500" />
                    <div>
                        <div className="text-3xl font-bold font-headline">{user.streak}</div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                    </div>
                </div>
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <Flame className="w-6 h-6" />
                    <div>
                        <div className="text-xl font-bold font-headline">{user.longestStreak}</div>
                        <div className="text-xs">Longest Streak</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-[120px]">
            {days.length === 0 && [...Array(35)].map((_, index) => (
                 <div key={index} className="w-full aspect-square rounded bg-muted/20 animate-pulse" />
            ))}
            {days.map((day, index) => (
                <div
                key={index}
                className={`w-full aspect-square rounded ${getLevelColor(day.level)}`}
                title={`${day.date}: Level ${day.level}`}
                />
            ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
