'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { ThemeManager, gameThemes } from '@/lib/theme-system';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { user } = useUser();
  const [currentTheme, setCurrentTheme] = useState(ThemeManager.getCurrentTheme());
  const [unlockedThemes, setUnlockedThemes] = useState(gameThemes);

  useEffect(() => {
    if (user) {
      const unlocked = ThemeManager.getUnlockedThemes(user);
      setUnlockedThemes(unlocked);
      ThemeManager.loadSavedTheme(user);
    }

    const unsubscribe = ThemeManager.subscribe((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, [user]);

  const handleThemeSelect = (theme: typeof gameThemes[0]) => {
    if (user && ThemeManager.isThemeUnlocked(theme, user)) {
      ThemeManager.setTheme(theme);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Theme Selection</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gameThemes.map((theme, index) => {
          const isUnlocked = ThemeManager.isThemeUnlocked(theme, user);
          const isActive = currentTheme.id === theme.id;

          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg",
                  isActive && "ring-2 ring-primary",
                  !isUnlocked && "opacity-60"
                )}
                onClick={() => handleThemeSelect(theme)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{theme.name}</CardTitle>
                    {isActive && <Check className="h-4 w-4 text-primary" />}
                    {!isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Theme Preview */}
                  <div className="h-16 rounded-lg overflow-hidden relative">
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` 
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full bg-white/60"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Level {theme.unlockLevel}+
                    </Badge>
                    
                    {isUnlocked ? (
                      <Button
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleThemeSelect(theme);
                        }}
                      >
                        {isActive ? "Active" : "Select"}
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {theme.unlockCondition}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Current Theme Info */}
      <GlassCard gradient="accent">
        <CardHeader>
          <CardTitle>Current Theme: {currentTheme.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {currentTheme.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Effects</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Particles: {currentTheme.effects.particles}</li>
                <li>Pattern: {currentTheme.effects.backgroundPattern}</li>
                <li>Glow: {currentTheme.effects.glowIntensity}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Colors</h4>
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                  title="Primary"
                />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: currentTheme.colors.accent }}
                  title="Accent"
                />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: currentTheme.colors.background }}
                  title="Background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}