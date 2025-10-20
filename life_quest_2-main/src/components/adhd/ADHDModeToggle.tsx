'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Brain, Timer, Focus, Bell, Zap, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ADHDModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function ADHDModeToggle({ isEnabled, onToggle }: ADHDModeToggleProps) {
  const [showDetails, setShowDetails] = useState(false);

  const adhdFeatures = [
    {
      icon: <Timer className="w-4 h-4" />,
      title: "Focus Timer",
      description: "Pomodoro technique with ADHD-friendly intervals"
    },
    {
      icon: <Bell className="w-4 h-4" />,
      title: "Break Reminders",
      description: "Regular prompts to take movement and hydration breaks"
    },
    {
      icon: <Focus className="w-4 h-4" />,
      title: "Simplified Interface",
      description: "Reduced visual clutter and clearer task prioritization"
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: "Hyperfocus Protection",
      description: "Gentle alerts when you've been on a task too long"
    },
    {
      icon: <Eye className="w-4 h-4" />,
      title: "Distraction Blocker",
      description: "Hide non-essential elements during focus sessions"
    }
  ];

  return (
    <Card className={`transition-all duration-300 ${
      isEnabled ? 'border-purple-500 shadow-purple-500/20' : 'border-border'
    }`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className={`w-5 h-5 ${
              isEnabled ? 'text-purple-500' : 'text-muted-foreground'
            }`} />
            <CardTitle className="flex items-center gap-2">
              ADHD Mode
              {isEnabled && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Active
                </Badge>
              )}
            </CardTitle>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-purple-500"
          />
        </div>
        <CardDescription>
          Specialized interface and features designed for ADHD brains
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between p-0 h-auto font-normal"
          >
            <span className="text-sm text-muted-foreground">
              {showDetails ? 'Hide' : 'Show'} ADHD Features
            </span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </Button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {adhdFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className={`mt-0.5 ${
                      isEnabled ? 'text-purple-500' : 'text-muted-foreground'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {isEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
            >
              <p className="text-xs text-purple-700">
                💜 ADHD Mode is now active. The interface will adapt to reduce
                cognitive load and support your focus patterns.
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}