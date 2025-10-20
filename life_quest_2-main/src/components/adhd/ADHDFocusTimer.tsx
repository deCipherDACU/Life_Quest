'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, Coffee, Zap, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'work' | 'short-break' | 'long-break';

interface ADHDFocusTimerProps {
  onSessionComplete?: (mode: TimerMode, duration: number) => void;
  className?: string;
}

const TIMER_PRESETS = {
  'adhd-short': { work: 15, shortBreak: 5, longBreak: 15, cycles: 2 },
  'adhd-medium': { work: 25, shortBreak: 5, longBreak: 15, cycles: 3 },
  'adhd-long': { work: 45, shortBreak: 10, longBreak: 20, cycles: 2 },
  'hyperfocus': { work: 90, shortBreak: 15, longBreak: 30, cycles: 1 },
};

export default function ADHDFocusTimer({ onSessionComplete, className }: ADHDFocusTimerProps) {
  const [preset, setPreset] = useState<keyof typeof TIMER_PRESETS>('adhd-medium');
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS[preset].work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  const currentPreset = TIMER_PRESETS[preset];
  const totalTime = mode === 'work' ? currentPreset.work * 60 :
                   mode === 'short-break' ? currentPreset.shortBreak * 60 :
                   currentPreset.longBreak * 60;

  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const playNotificationSound = useCallback(() => {
    // Create a gentle notification sound for ADHD-friendly alerts
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }, []);

  const handleTimerComplete = useCallback(() => {
    playNotificationSound();
    setIsRunning(false);
    onSessionComplete?.(mode, totalTime / 60);

    if (mode === 'work') {
      setSessionsCompleted(prev => prev + 1);
      const shouldTakeLongBreak = currentCycle >= currentPreset.cycles;
      
      if (shouldTakeLongBreak) {
        setMode('long-break');
        setTimeLeft(currentPreset.longBreak * 60);
        setCurrentCycle(1);
      } else {
        setMode('short-break');
        setTimeLeft(currentPreset.shortBreak * 60);
        setCurrentCycle(prev => prev + 1);
      }
      setShowBreakReminder(true);
    } else {
      setMode('work');
      setTimeLeft(currentPreset.work * 60);
      setShowBreakReminder(false);
    }
  }, [mode, currentCycle, currentPreset, totalTime, onSessionComplete, playNotificationSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(currentPreset.work * 60);
    setCurrentCycle(1);
    setShowBreakReminder(false);
  };

  const handlePresetChange = (newPreset: keyof typeof TIMER_PRESETS) => {
    setPreset(newPreset);
    setIsRunning(false);
    setMode('work');
    setTimeLeft(TIMER_PRESETS[newPreset].work * 60);
    setCurrentCycle(1);
    setShowBreakReminder(false);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return <Zap className="w-4 h-4" />;
      case 'short-break': return <Coffee className="w-4 h-4" />;
      case 'long-break': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'text-purple-600';
      case 'short-break': return 'text-blue-600';
      case 'long-break': return 'text-green-600';
    }
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getModeIcon()}
            <span className={getModeColor()}>
              {mode === 'work' ? 'Focus Time' :
               mode === 'short-break' ? 'Short Break' : 'Long Break'}
            </span>
          </CardTitle>
          <Badge variant="outline">
            Session {sessionsCompleted + 1}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Timer Preset</label>
          <Select value={preset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adhd-short">ADHD Short (15/5/15)</SelectItem>
              <SelectItem value="adhd-medium">ADHD Medium (25/5/15)</SelectItem>
              <SelectItem value="adhd-long">ADHD Long (45/10/20)</SelectItem>
              <SelectItem value="hyperfocus">Hyperfocus (90/15/30)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-center space-y-4">
          <motion.div
            key={`${minutes}-${seconds}`}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-6xl font-mono font-bold tracking-tight"
          >
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </motion.div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              size="lg"
              className={`${mode === 'work' ? 'bg-purple-600 hover:bg-purple-700' :
                         mode === 'short-break' ? 'bg-blue-600 hover:bg-blue-700' :
                         'bg-green-600 hover:bg-green-700'}`}
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div>
            <p className="font-medium">Cycle</p>
            <p>{currentCycle}/{currentPreset.cycles}</p>
          </div>
          <div>
            <p className="font-medium">Completed</p>
            <p>{sessionsCompleted}</p>
          </div>
          <div>
            <p className="font-medium">Mode</p>
            <p className="capitalize">{mode.replace('-', ' ')}</p>
          </div>
        </div>

        <AnimatePresence>
          {showBreakReminder && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <Coffee className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800">
                    Break Time! 💜
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    Stand up, stretch, hydrate, or do some light movement.
                    Your brain needs this reset!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}