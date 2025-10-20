'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Sword } from 'lucide-react';
import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-6">
          <AppLogo />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary tracking-tighter mb-4">
          LifeQuest RPG
        </h1>
        <p className="text-lg md:text-xl font-headline text-muted-foreground mb-8">
          Level Up Your Life, One Quest at a Time
        </p>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
        >
        <Card className="mb-8 shadow-glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 font-headline text-2xl">
              <Sparkles className="text-primary" />
              Transform Your To-Do List
            </CardTitle>
            <CardDescription className="font-body">
              Stop surviving, start thriving. Turn your daily tasks into epic quests, gain experience, and build the ultimate version of yourself.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/welcome">
                  <Sword className="mr-2 h-5 w-5" />
                  Begin Your Quest
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/20 hover:text-primary">
                <Link href="/dashboard">
                  Continue Adventure
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>
        
        <div className="text-xs text-muted-foreground font-body">
          <p>This is a fictional application created for demonstration purposes.</p>
          <p>Click any button to enter the app experience.</p>
        </div>
      </motion.div>
    </main>
  );
}
