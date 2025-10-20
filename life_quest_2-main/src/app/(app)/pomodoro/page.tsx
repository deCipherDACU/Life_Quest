
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Coffee, Brain, Music } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

const sessionTypes = {
  pomodoro: { duration: 25 * 60, label: 'Pomodoro', icon: Brain },
  shortBreak: { duration: 5 * 60, label: 'Short Break', icon: Coffee },
  longBreak: { duration: 15 * 60, label: 'Long Break', icon: Coffee },
};

const musicTracks = [
    '/audio/enchanted-forest.mp3',
    '/audio/rainy-tavern.mp3',
    '/audio/music1.mp3',
    '/audio/music2.mp3',
];

export default function PomodoroPage() {
  const [session, setSession] = useState<keyof typeof sessionTypes>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(sessionTypes.pomodoro.duration);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const { addXp, addCoins } = useUser();
  const { toast } = useToast();

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  const playRandomMusic = useCallback(() => {
    const nextTrackIndex = Math.floor(Math.random() * musicTracks.length);
    setCurrentTrack(nextTrackIndex);
    if(audioRef.current) {
        audioRef.current.src = musicTracks[nextTrackIndex];
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        setIsMusicPlaying(true);
    }
  }, []);

  const handleSessionEnd = useCallback(() => {
    setIsActive(false);

    toast({
      title: `Session Complete!`,
      description: `Your ${sessionTypes[session].label} session has finished.`,
    });

    if (session === 'pomodoro') {
      const xpReward = 10;
      const coinReward = 2;
      const newCycles = cycles + 1;
      setCycles(newCycles);
      addXp(xpReward);
      addCoins(coinReward);
      toast({
        title: "Rewards Earned!",
        description: `You gained ${xpReward} XP and ${coinReward} coins.`
      })
      
      if (newCycles % 4 === 0) {
        selectSession('longBreak');
      } else {
        selectSession('shortBreak');
      }
    } else {
      selectSession('pomodoro');
    }
  }, [session, cycles, addXp, addCoins, toast]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleSessionEnd();
      if (Notification.permission === "granted") {
        new Notification(`Session Complete!`, {
            body: `Your ${sessionTypes[session].label} session has finished.`,
            icon: '/logo.png'
        });
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, session, handleSessionEnd]);
  
  useEffect(() => {
    if (isActive) {
      document.title = `${formatTime(timeLeft)} - ${sessionTypes[session].label}`;
    } else {
      document.title = 'Pomodoro Timer | LifeQuest';
    }
     return () => { document.title = 'LifeQuest RPG'; }
  }, [timeLeft, isActive, session]);


  const toggleTimer = () => {
    setIsActive(!isActive);
    if(Notification.permission !== "granted") {
        Notification.requestPermission();
    }
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(sessionTypes[session].duration);
  }, [session]);

  const selectSession = (type: keyof typeof sessionTypes) => {
    setSession(type);
    setIsActive(false);
    setTimeLeft(sessionTypes[type].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMusic = () => {
      if (audioRef.current) {
          if (isMusicPlaying) {
              audioRef.current.pause();
              setIsMusicPlaying(false);
          } else {
              if (!audioRef.current.src) {
                playRandomMusic();
              } else {
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
              }
              setIsMusicPlaying(true);
          }
      }
  }

  const handleMusicEnded = () => {
    playRandomMusic();
  }

  const progress = (timeLeft / sessionTypes[session].duration) * 100;
  const circumference = 2 * Math.PI * 112; 

  return (
    <>
      <PageHeader
        title="Pomodoro Timer"
        description="Focus on your quests with timed sessions."
      />

      <Card className="flex flex-col items-center justify-center p-4 sm:p-8 text-center max-w-lg mx-auto">
         <Tabs defaultValue="pomodoro" value={session} onValueChange={(val) => selectSession(val as keyof typeof sessionTypes)} className="mb-8">
            <TabsList>
                {Object.entries(sessionTypes).map(([key, { label, icon: Icon }]) => (
                    <TabsTrigger key={key} value={key}><Icon className='mr-2' /> {label}</TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="hsl(var(--muted))"
                    strokeWidth="16"
                    fill="transparent"
                />
                <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="hsl(var(--primary))"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 linear"
                />
            </svg>
             <div className="z-10">
                <p className="text-6xl sm:text-7xl font-bold font-headline tabular-nums">{formatTime(timeLeft)}</p>
                <p className="text-muted-foreground">{sessionTypes[session].label}</p>
            </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
            <Button onClick={toggleMusic} variant="outline" size="icon" aria-label="Toggle Music">
                <Music />
            </Button>
            <Button onClick={toggleTimer} size="lg" className="w-32">
                {isActive ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button onClick={resetTimer} variant="outline" size="icon" aria-label="Reset Timer">
                <RotateCcw />
            </Button>
        </div>
        <div className='text-sm text-muted-foreground mt-6'>
            Completed cycles: {cycles}
        </div>
         <audio ref={audioRef} onEnded={handleMusicEnded} />
      </Card>
    </>
  );
}
