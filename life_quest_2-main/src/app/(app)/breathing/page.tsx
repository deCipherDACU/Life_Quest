
'use client';

import { useState } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BreathingExercise from '@/components/breathing/BreathingExercise';
import { BrainCircuit, Moon, Wind, Scale, Zap, Waves } from 'lucide-react';

export type BreathingPattern = {
  name: string;
  pattern: { instruction: 'Inhale' | 'Hold' | 'Exhale'; duration: number }[];
};

const exercises = [
  {
    key: 'box',
    title: 'Box Breathing',
    description: 'Excellent for calming your nerves and improving focus.',
    icon: BrainCircuit,
    pattern: [
      { instruction: 'Inhale', duration: 4 },
      { instruction: 'Hold', duration: 4 },
      { instruction: 'Exhale', duration: 4 },
      { instruction: 'Hold', duration: 4 },
    ],
  },
  {
    key: '478',
    title: '4-7-8 Breathing',
    description: 'Known as the "relaxing breath," it helps with sleep.',
    icon: Moon,
    pattern: [
      { instruction: 'Inhale', duration: 4 },
      { instruction: 'Hold', duration: 7 },
      { instruction: 'Exhale', duration: 8 },
    ],
  },
  {
    key: 'physiologic-sigh',
    title: 'Physiological Sigh',
    description: 'A quick and effective way to reduce stress in real-time.',
    icon: Wind,
    pattern: [
        // Representing a sharp double inhale
      { instruction: 'Inhale', duration: 2.5 },
      { instruction: 'Inhale', duration: 1 },
      { instruction: 'Exhale', duration: 5 },
    ],
  },
  {
    key: 'equal-breathing',
    title: 'Equal Breathing',
    description: 'Promotes balance and calm. Good for any situation.',
    icon: Scale,
    pattern: [
      { instruction: 'Inhale', duration: 4 },
      { instruction: 'Exhale', duration: 4 },
    ],
  },
  {
    key: 'energizing-breath',
    title: 'Energizing Breath',
    description: 'A quick way to boost alertness and energy levels.',
    icon: Zap,
    pattern: [
      { instruction: 'Inhale', duration: 3 },
      { instruction: 'Exhale', duration: 3 },
      { instruction: 'Inhale', duration: 3 },
      { instruction: 'Exhale', duration: 3 },
      { instruction: 'Inhale', duration: 3 },
      { instruction: 'Exhale', duration: 3 },
    ],
  },
  {
    key: 'deep-resonance',
    title: 'Deep Resonance',
    description: 'A slow, rhythmic pattern for meditation or reaching a trance-like state.',
    icon: Waves,
    pattern: [
      { instruction: 'Inhale', duration: 5 },
      { instruction: 'Exhale', duration: 10 },
    ],
  },
];

export default function BreathingPage() {
  const [selectedExercise, setSelectedExercise] = useState<BreathingPattern | null>(null);

  if (selectedExercise) {
    return (
      <BreathingExercise
        exercise={selectedExercise}
        onComplete={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Guided Breathing"
        description="Choose an exercise to calm your mind and body."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Card key={exercise.key} className="flex flex-col">
            <CardHeader>
                <div className='flex justify-between items-start'>
                    <CardTitle className="font-headline text-xl">{exercise.title}</CardTitle>
                    <exercise.icon className="h-8 w-8 text-primary" />
                </div>
              <CardDescription>{exercise.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button className="w-full" onClick={() => setSelectedExercise({ name: exercise.title, pattern: exercise.pattern })}>
                Start Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
