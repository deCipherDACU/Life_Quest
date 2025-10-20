'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { GlassCard } from '@/components/ui/glass-card';
import { SkillNode } from '@/components/ui/advanced-progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sword, Shield, Wind, Brain, Eye, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SkillTreeData } from '@/lib/types';

interface SkillTreeLayoutProps {
  skillTree: SkillTreeData;
  onSkillUpgrade: (skillName: string) => void;
  availablePoints: number;
}

function SkillTreeLayout({ skillTree, onSkillUpgrade, availablePoints }: SkillTreeLayoutProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  // Define skill positions for visual layout
  const skillPositions = {
    [skillTree.skills[0]?.name]: { x: 150, y: 100 },
    [skillTree.skills[1]?.name]: { x: 300, y: 100 },
    // Add more positions as needed
  };

  const connections = [
    // Define connections between skills
    { from: skillTree.skills[0]?.name, to: skillTree.skills[1]?.name }
  ];

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg bg-gradient-to-br from-background/50 to-muted/20">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Skill Nodes */}
      <div className="relative w-full h-full">
        {skillTree.skills.map((skill, index) => {
          const position = skillPositions[skill.name] || { x: 100 + index * 150, y: 200 };
          const canUpgrade = availablePoints >= skill.cost && skill.level < skill.maxLevel;
          const unlocked = skill.level > 0;

          return (
            <SkillNode
              key={skill.name}
              skill={skill}
              unlocked={unlocked}
              canUpgrade={canUpgrade}
              position={position}
              onUpgrade={() => onSkillUpgrade(skill.name)}
              connections={connections
                .filter(conn => conn.from === skill.name)
                .map(conn => {
                  const targetSkill = skillTree.skills.find(s => s.name === conn.to);
                  return skillPositions[conn.to] || { x: 0, y: 0 };
                })
              }
            />
          );
        })}
      </div>

      {/* Skill Details Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 w-64"
          >
            <GlassCard>
              <CardHeader>
                <CardTitle className="text-lg">Skill Details</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Skill details would go here */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-2 right-2"
                >
                  ×
                </Button>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function InteractiveSkillTree() {
  const { user, levelUpSkill } = useUser();
  const [activeTree, setActiveTree] = useState(0);

  if (!user) return null;

  const handleSkillUpgrade = (treeName: string, skillName: string) => {
    levelUpSkill(treeName, skillName);
  };

  const skillTreeIcons = {
    'Strength': Sword,
    'Endurance': Shield,
    'Agility': Wind,
    'Intelligence': Brain,
    'Perception': Eye,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Skill Trees</h2>
          <p className="text-muted-foreground">
            Develop your character's abilities and unlock new powers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold">{user.skillPoints}</span>
          <span className="text-sm text-muted-foreground">Skill Points</span>
        </div>
      </div>

      {/* Skill Tree Tabs */}
      <Tabs value={activeTree.toString()} onValueChange={(value) => setActiveTree(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-5">
          {user.skillTrees.map((tree, index) => {
            const Icon = skillTreeIcons[tree.name as keyof typeof skillTreeIcons] || Star;
            const totalLevel = tree.skills.reduce((sum, skill) => sum + skill.level, 0);
            
            return (
              <TabsTrigger key={tree.name} value={index.toString()} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tree.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {totalLevel}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {user.skillTrees.map((tree, index) => (
          <TabsContent key={tree.name} value={index.toString()}>
            <GlassCard gradient="primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = skillTreeIcons[tree.name as keyof typeof skillTreeIcons] || Star;
                    return <Icon className="h-6 w-6 text-primary" />;
                  })()}
                  <div>
                    <CardTitle>{tree.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tree.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SkillTreeLayout
                  skillTree={tree}
                  onSkillUpgrade={(skillName) => handleSkillUpgrade(tree.name, skillName)}
                  availablePoints={user.skillPoints}
                />
                
                {/* Skill List */}
                <div className="mt-6 space-y-3">
                  {tree.skills.map((skill) => {
                    const canUpgrade = user.skillPoints >= skill.cost && skill.level < skill.maxLevel;
                    const isMaxed = skill.level >= skill.maxLevel;
                    
                    return (
                      <motion.div
                        key={skill.name}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                          canUpgrade && "border-primary/50 bg-primary/5",
                          isMaxed && "border-green-500/50 bg-green-500/5",
                          !canUpgrade && !isMaxed && "border-muted/50 bg-muted/5"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{skill.name}</h4>
                            <Badge variant={isMaxed ? "default" : "outline"}>
                              {skill.level} / {skill.maxLevel}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {!isMaxed && (
                            <div className="text-right">
                              <div className="text-sm font-medium">Cost: {skill.cost} SP</div>
                            </div>
                          )}
                          
                          <Button
                            size="sm"
                            disabled={!canUpgrade || isMaxed}
                            onClick={() => handleSkillUpgrade(tree.name, skill.name)}
                            className={cn(
                              isMaxed && "bg-green-500 hover:bg-green-600"
                            )}
                          >
                            {isMaxed ? 'Maxed' : canUpgrade ? 'Upgrade' : 'Locked'}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </GlassCard>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}