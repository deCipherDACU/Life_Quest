
'use client';

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { TaskItem } from "@/components/tasks/TaskItem";
import { HabitStackingSuggestions } from "@/components/tasks/HabitStackingSuggestions";
import { useUser } from "@/context/UserContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Task } from "@/lib/types";
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

const CreateTaskDialog = lazy(() => import('@/components/tasks/CreateTaskDialog').then(module => ({ default: module.CreateTaskDialog })));


type DifficultyFilter = 'all' | 'Easy' | 'Medium' | 'Hard';
type TypeFilter = 'all' | 'Daily' | 'Weekly' | 'Monthly' | 'One-time';


export default function TasksPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { tasks } = useUser();
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const incompleteTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);
  
  const completedTasks = useMemo(() => {
    return tasks.filter(task => task.completed).filter(task => {
        const difficultyMatch = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
        const typeMatch = typeFilter === 'all' || task.type === typeFilter;
        return difficultyMatch && typeMatch;
    });
  }, [tasks, difficultyFilter, typeFilter]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeekDate = startOfWeek(today);
  
  const tasksToday = incompleteTasks.filter(task => {
    if (task.type === 'Daily') return true;
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0,0,0,0);
        return isSameDay(dueDate, today);
    }
    return false;
  });

  const tasksWeek = incompleteTasks.filter(task => {
    if (task.type === 'Weekly') return true;
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate >= startOfWeekDate && dueDate < addDays(startOfWeekDate, 7);
    }
    return false;
  });

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeekDate, i));

  const tasksByDay = weekDays.map(day => ({
    date: day,
    tasks: tasksWeek.filter(task => {
        if(task.type === 'Weekly') {
            const taskDay = new Date(task.dueDate || 0).getDay();
            const currentDay = day.getDay();
            // A bit simplified: show weekly tasks every day of the week for now
            return true;
        }
        return task.dueDate && isSameDay(new Date(task.dueDate), day)
    }),
  }));
  
  return (
    <>
      <PageHeader
        title="Quest Log"
        description="Manage your daily, weekly, and one-time quests."
        className="bg-black/30 backdrop-blur-sm p-4 rounded-lg"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Quest
          </Button>
        }
      />
      {isClient && <HabitStackingSuggestions />}
      <Tabs defaultValue="today" className="w-full mt-6">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-4">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filters</h4>
                            <p className="text-sm text-muted-foreground">
                                Filter completed quests.
                            </p>
                        </div>
                        <div className="grid gap-2">
                             <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select value={difficultyFilter} onValueChange={(v) => setDifficultyFilter(v as DifficultyFilter)}>
                                    <SelectTrigger id="difficulty" className="col-span-2 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="type">Type</Label>
                                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                                    <SelectTrigger id="type" className="col-span-2 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="One-time">One-time</SelectItem>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        
        <TabsContent value="today" className="space-y-2 mt-4">
          {!isClient ? (
            <Skeleton className="w-full h-24" />
          ) : tasksToday.length > 0 ? (
            tasksToday.map(task => <TaskItem key={task.id} task={task} />)
          ) : (
            <p className="text-muted-foreground text-center py-4">No quests for today. Add one or enjoy your break!</p>
          )}
        </TabsContent>
        <TabsContent value="week" className="space-y-4 mt-4">
          {!isClient ? (
             <Skeleton className="w-full h-48" />
          ) : (
            <div className="space-y-6">
                {tasksByDay.map(({ date, tasks }) => (
                    <div key={date.toString()}>
                        <h3 className="font-headline font-bold text-lg mb-2">{format(date, 'EEEE, MMM d')}</h3>
                        {tasks.length > 0 ? (
                            <div className="space-y-2">
                                {tasks.map(task => (
                                    <TaskItem key={task.id} task={task} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm pl-2">No quests for this day.</p>
                        )}
                    </div>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="all" className="space-y-2 mt-4">
          {incompleteTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
          {incompleteTasks.length === 0 && <p className="text-muted-foreground text-center py-4">Your quest log is empty. Great job!</p>}
        </TabsContent>
        <TabsContent value="completed" className="space-y-2 mt-4">
           {completedTasks.map(task => (
             <TaskItem key={task.id} task={task} />
          ))}
          {completedTasks.length === 0 && <p className="text-muted-foreground text-center py-4">No completed quests match your filters.</p>}
        </TabsContent>
      </Tabs>

      <Suspense fallback={<div />}>
        {isCreateDialogOpen && <CreateTaskDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
      </Suspense>
    </>
  );
}
