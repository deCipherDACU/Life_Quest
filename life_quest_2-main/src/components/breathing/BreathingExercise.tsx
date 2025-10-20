
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { BreathingPattern } from '@/app/(app)/breathing/page';

type BreathingExerciseProps = {
  exercise: BreathingPattern;
  onComplete: () => void;
};

export default function BreathingExercise({ exercise, onComplete }: BreathingExerciseProps) {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const totalCycleTime = exercise.pattern.reduce((sum, p) => sum + p.duration, 0);

  useEffect(() => {
    setCountdown(exercise.pattern[step].duration);
  }, [step, exercise.pattern]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setStep((prevStep) => (prevStep + 1) % exercise.pattern.length);
    }
  }, [countdown, exercise.pattern.length]);

  const currentInstruction = exercise.pattern[step].instruction;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-headline text-muted-foreground mb-4">{exercise.name}</h1>
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full rounded-full bg-primary/20"
          animate={{
            scale: currentInstruction === 'Inhale' ? 1.2 : (currentInstruction === 'Hold' ? 1.2 : 1),
          }}
          transition={{ duration: exercise.pattern[step].duration, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-primary/50 flex items-center justify-center"
           animate={{
            scale: currentInstruction === 'Inhale' ? 1.2 : (currentInstruction === 'Hold' ? 1.2 : 1),
          }}
          transition={{ duration: exercise.pattern[step].duration, ease: 'easeInOut' }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute text-center"
          >
            <p className="text-4xl font-bold font-headline text-primary-foreground">{currentInstruction}</p>
            <p className="text-6xl font-bold text-primary-foreground tabular-nums">{countdown}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <Button variant="ghost" onClick={onComplete} className="mt-12">
        End Session
      </Button>
    </div>
  );
}
