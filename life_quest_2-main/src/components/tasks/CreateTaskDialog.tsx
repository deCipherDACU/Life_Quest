
'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { calculateTaskCoins, calculateTaskXP } from "@/lib/formulas";
import type { Task } from "@/lib/types";
import { Info, Loader2, Plus, Sparkles, Wand2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { breakdownQuest, BreakdownQuestOutput } from "@/ai/flows/breakdown-quest";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

type CreateTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
    title: string;
    description: string;
    category: Task['category'];
    difficulty: Task['difficulty'];
    type: Task['type'];
    intention: string;
};

export function CreateTaskDialog({ open, onOpenChange }: CreateTaskDialogProps) {
    const { user, addTask } = useUser();
    const { register, handleSubmit, control, reset, watch } = useForm<FormValues>();
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiSubtasks, setAiSubtasks] = useState<BreakdownQuestOutput>([]);

    const questTitle = watch("title");
    
    const onSubmit = (data: FormValues) => {
        if (!user) return;

        const newTask: Omit<Task, 'id' | 'completed'> = {
            ...data,
            xp: calculateTaskXP(data.difficulty),
            coins: calculateTaskCoins(data.difficulty, user.level),
        };

        addTask(newTask);
        handleClose();
    }

    const handleClose = () => {
        onOpenChange(false);
        reset();
        setAiSubtasks([]);
    }

    const handleBreakdown = async () => {
        if (!questTitle) return;
        setIsAiLoading(true);
        setAiSubtasks([]);
        try {
            const result = await breakdownQuest({ title: questTitle });
            setAiSubtasks(result);
        } catch (error) {
            console.error("Failed to break down quest:", error);
        }
        setIsAiLoading(false);
    }
    
    const handleAddSubtaskAsQuest = (subtask: BreakdownQuestOutput[number]) => {
        if (!user) return;
        const newQuest: Omit<Task, 'id' | 'completed'> = {
            title: subtask.title,
            description: subtask.description,
            category: "Hobbies", // Default
            difficulty: 'Easy', // Default
            type: 'One-time',
            xp: calculateTaskXP('Easy'),
            coins: calculateTaskCoins('Easy', user.level),
        };
        addTask(newQuest);
        setAiSubtasks(prev => prev.filter(s => s.title !== subtask.title));
    };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Create New Quest</DialogTitle>
          <DialogDescription>
            Add a new task to your quest log. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                  <Label htmlFor="title" className="text-right">
                  Title
                  </Label>
                  <div className="col-span-3">
                    <Input id="title" placeholder="E.g., Plan a week-long trip to Japan" {...register("title", { required: true })} />
                    <Button type="button" variant="link" size="sm" className="px-0 h-auto text-primary" onClick={handleBreakdown} disabled={!questTitle || isAiLoading}>
                        {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        Break Down with AI
                    </Button>
                  </div>
              </div>

              {isAiLoading && (
                <div className="col-span-4 pl-4 sm:pl-24 space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-2 rounded-lg bg-muted/50 animate-pulse">
                           <div className="space-y-2">
                                <div className="h-4 bg-muted-foreground/20 rounded w-48"></div>
                           </div>
                        </div>
                    ))}
                </div>
              )}
              {aiSubtasks.length > 0 && (
                <div className="col-span-4 pl-4 sm:pl-24 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">AI-Generated Sub-Quests:</p>
                    {aiSubtasks.map((subtask, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                            <div>
                               <p className="font-semibold">{subtask.title}</p>
                               <p className="text-sm text-muted-foreground">{subtask.description}</p>
                            </div>
                            <Button type="button" size="sm" variant="ghost" onClick={() => handleAddSubtaskAsQuest(subtask)}>
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </div>
                    ))}
                     <Separator className="my-4" />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                  Description
                  </Label>
                  <Textarea id="description" placeholder="Optional details about the quest" className="col-span-3" {...register("description")} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                  Category
                  </Label>
                  <Controller
                      name="category"
                      control={control}
                      defaultValue="Hobbies"
                      render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Education">Education</SelectItem>
                                  <SelectItem value="Career">Career</SelectItem>
                                  <SelectItem value="Health">Health</SelectItem>
                                  <SelectItem value="Mental Wellness">Mental Wellness</SelectItem>
                                  <SelectItem value="Finance">Finance</SelectItem>
                                  <SelectItem value="Social">Social</SelectItem>
                                  <SelectItem value="Hobbies">Hobbies</SelectItem>
                                  <SelectItem value="Home">Home</SelectItem>
                              </SelectContent>
                          </Select>
                      )}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                  Difficulty
                  </Label>
                  <Controller
                      name="difficulty"
                      control={control}
                      defaultValue="Easy"
                      render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                      )}
                  />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                  Type
                  </Label>
                  <Controller
                        name="type"
                        control={control}
                        defaultValue="One-time"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="One-time">One-time</SelectItem>
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                  />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="intention" className="text-right pt-2 flex items-center gap-1">
                      Plan
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-4 w-4"><Info className="h-3 w-3" /></Button>
                        </PopoverTrigger>
                        <PopoverContent className="text-sm">
                          Set an "Implementation Intention" to increase your chances of success. This is an "if-then" plan for your quest.
                        </PopoverContent>
                      </Popover>
                  </Label>
                  <Textarea id="intention" placeholder="If... (situation), then I will... (action)." className="col-span-3" {...register("intention")} />
              </div>
            </div>
            <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create Quest</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
