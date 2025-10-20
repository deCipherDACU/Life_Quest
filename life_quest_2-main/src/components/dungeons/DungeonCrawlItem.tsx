'use client';

import type { DungeonCrawl } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/context/UserContext';
import { Star, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface DungeonCrawlItemProps {
  dungeon: DungeonCrawl;
}

function DungeonCrawlItemComponent({ dungeon }: DungeonCrawlItemProps) {
  const { toggleChallengeCompleted, completeDungeon } = useUser();
  const completedChallenges = dungeon.challenges.filter(c => c.completed).length;
  const totalChallenges = dungeon.challenges.length;
  const progress = (completedChallenges / totalChallenges) * 100;
  const allChallengesDone = completedChallenges === totalChallenges;

  return (
    <Card className={cn(dungeon.completed && "bg-black/20 border-dashed border-white/20")}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn("font-headline", dungeon.completed && "text-muted-foreground")}>{dungeon.title}</CardTitle>
            <CardDescription className={cn(dungeon.completed && "text-muted-foreground/60")}>{dungeon.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < dungeon.difficulty ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50",
                  dungeon.completed && "text-muted-foreground/30 fill-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-semibold">Challenges Completed</span>
            <span>{completedChallenges} / {totalChallenges}</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="space-y-2">
          {dungeon.challenges.map(challenge => (
            <div key={challenge.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${dungeon.id}-${challenge.id}`}
                checked={challenge.completed}
                onCheckedChange={() => toggleChallengeCompleted(dungeon.id, challenge.id)}
                disabled={dungeon.completed}
              />
              <label
                htmlFor={`${dungeon.id}-${challenge.id}`}
                className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", challenge.completed && "line-through text-muted-foreground")}
              >
                {challenge.title}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="font-bold text-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <span>{dungeon.xp} XP Reward</span>
        </div>
        {dungeon.completed ? (
            <div className="flex items-center gap-2 text-green-400 font-semibold px-4 py-2 rounded-md bg-green-500/10">
                <Check />
                Conquered
            </div>
        ) : (
            <Button
            onClick={() => completeDungeon(dungeon.id)}
            disabled={!allChallengesDone}
            >
            Conquer Dungeon
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export const DungeonCrawlItem = React.memo(DungeonCrawlItemComponent);
