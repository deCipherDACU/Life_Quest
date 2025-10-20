

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Wand2, Link2 } from 'lucide-react';
import { habitStackingSuggestions, type HabitStackingSuggestionsOutput } from '@/ai/flows/habit-stacking-suggestions';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { calculateTaskCoins, calculateTaskXP } from '@/lib/formulas';
import type { Task } from '@/lib/types';


export function HabitStackingSuggestions() {
  const [suggestions, setSuggestions] = useState<HabitStackingSuggestionsOutput>([]);
  const [loading, setLoading] = useState(false);
  const { user, tasks, addTask } = useUser();

  const handleGetSuggestions = async () => {
    setLoading(true);
    setSuggestions([]);
    try {
      const existingHabits = tasks
        .filter(t => t.type === 'Daily' || t.type === 'Weekly')
        .map(t => t.title);
      const result = await habitStackingSuggestions({ existingHabits });
      setSuggestions(result);
    } catch (error) {
      console.error('Error fetching habit stacking suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuest = (suggestion: { new_habit: string; }) => {
    if (!user) return;
    const newTask: Omit<Task, 'id' | 'completed'> = {
        title: suggestion.new_habit,
        category: 'Hobbies', // Default category
        difficulty: 'Easy', // Default difficulty
        type: 'Daily', // Default type
        xp: calculateTaskXP('Easy'),
        coins: calculateTaskCoins('Easy', user.level),
    };
    addTask(newTask);
    setSuggestions(prev => prev.filter(s => s.new_habit !== suggestion.new_habit));
  }

  return (
    <Card className="mb-6 col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Habit Stacking Suggestions
          </CardTitle>
          <CardDescription>Turn completed habits into new routines.</CardDescription>
        </div>
        <Button onClick={handleGetSuggestions} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Get Suggestions
        </Button>
      </CardHeader>
        <AnimatePresence>
            { (loading || suggestions.length > 0) &&
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <CardContent>
                    {loading && (
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-pulse">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted-foreground/20 rounded w-48"></div>
                                    <div className="h-3 bg-muted-foreground/20 rounded w-64"></div>
                                </div>
                                <div className="h-8 w-8 bg-muted-foreground/20 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                    )}
                    {!loading && suggestions.length > 0 && (
                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between p-3 -mx-3 rounded-lg hover:bg-secondary/20 transition-colors">
                            <div className="space-y-1">
                                <h4 className="font-semibold font-headline text-primary">{suggestion.new_habit}</h4>
                                <p className="text-sm text-muted-foreground">
                                    After your existing habit <span className="font-semibold text-foreground">"{suggestion.anchor_habit}"</span>, try adding this new one.
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleAddQuest(suggestion)}>
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>
                        ))}
                    </div>
                    )}
                </CardContent>
            </motion.div>
            }
        </AnimatePresence>
    </Card>
  );
}
