'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { Loader2, Wand2, Star } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { GenerateDungeonCrawlOutput, generateDungeonCrawl } from '@/ai/flows/generate-dungeon-crawl';
import { DungeonCrawl } from '@/lib/types';

type CreateDungeonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
  theme: string;
  difficulty: number;
  goal: string;
};

export function CreateDungeonDialog({ open, onOpenChange }: CreateDungeonDialogProps) {
  const { addDungeon } = useUser();
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
        theme: 'The Goblin Mines of Productivity',
        difficulty: 3,
        goal: '',
    }
  });
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedDungeon, setGeneratedDungeon] = useState<GenerateDungeonCrawlOutput | null>(null);

  const difficulty = watch('difficulty');

  const handleGenerate = async ({ theme, difficulty, goal }: FormValues) => {
    setIsAiLoading(true);
    setGeneratedDungeon(null);
    try {
        const result = await generateDungeonCrawl({ theme, difficulty, goal });
        setGeneratedDungeon(result);
    } catch (error) {
        console.error("Failed to generate dungeon:", error);
    } finally {
        setIsAiLoading(false);
    }
  }

  const handleCreateDungeon = () => {
    if (!generatedDungeon) return;

    const newDungeon: Omit<DungeonCrawl, 'id' | 'completed'> = {
        title: generatedDungeon.title,
        description: generatedDungeon.description,
        difficulty: difficulty,
        xp: generatedDungeon.xp,
        challenges: generatedDungeon.challenges.map(c => ({ id: crypto.randomUUID(), title: c.title, completed: false }))
    }
    addDungeon(newDungeon);
    handleClose();
  }

  const handleClose = () => {
    onOpenChange(false);
    setGeneratedDungeon(null);
    setIsAiLoading(false);
    setValue('theme', 'The Goblin Mines of Productivity');
    setValue('difficulty', 3);
    setValue('goal', '');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Special Quest</DialogTitle>
          <DialogDescription>
            Use AI to generate a themed set of challenges.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleGenerate)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal">What do you want to accomplish?</Label>
            <Textarea id="goal" placeholder="E.g., 'Learn the basics of React' or 'Get in shape for summer'" {...register("goal")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Quest Theme</Label>
            <Input id="theme" placeholder="E.g., The Procrastination Pit" {...register("theme", { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty ({difficulty} / 5)</Label>
            <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => <Star key={i} className={i < difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'} />)}
            </div>
            <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                    <Slider
                        id="difficulty"
                        min={1}
                        max={5}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                    />
                )}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isAiLoading}>
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate with AI
          </Button>
        </form>

        {generatedDungeon && (
            <div className="mt-4 space-y-4 p-4 border rounded-lg bg-secondary/50">
                <h3 className="font-bold font-headline">{generatedDungeon.title}</h3>
                <p className="text-sm text-muted-foreground">{generatedDungeon.description}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {generatedDungeon.challenges.map((c, i) => <li key={i}>{c.title}</li>)}
                </ul>
                <p className="font-bold text-primary">Reward: {generatedDungeon.xp} XP</p>
            </div>
        )}

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button type="button" onClick={handleCreateDungeon} disabled={!generatedDungeon || isAiLoading}>
            Start Quest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
