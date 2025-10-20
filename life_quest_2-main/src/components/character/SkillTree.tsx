
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";
import { Plus, Zap, Dumbbell, BrainCircuit, Briefcase, Sword, Shield, Wind, Eye, Brain } from "lucide-react";

// Map tree names to their icon components
const skillTreeIcons = {
    'Strength': Sword,
    'Endurance': Shield,
    'Agility': Wind,
    'Intelligence': Brain,
    'Perception': Eye,
};

const SkillTree = () => {
  const { user, levelUpSkill } = useUser();
  if (!user) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {user.skillTrees.map((tree) => {
        const Icon = skillTreeIcons[tree.name];
        return (
            <Card key={tree.name}>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                {Icon && <Icon className="h-6 w-6 text-primary" />}
                {tree.name}
                </CardTitle>
                <CardDescription>{tree.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {tree.skills.map((skill) => {
                const canLevelUp = user.skillPoints >= skill.cost && skill.level < skill.maxLevel;
                return (
                    <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold font-headline">{skill.name}</h4>
                        <Badge variant="secondary">Lvl {skill.level} / {skill.maxLevel}</Badge>
                    </div>
                    <Progress value={(skill.level / skill.maxLevel) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 min-h-[2.5rem]">{skill.description}</p>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2 w-full"
                        disabled={!canLevelUp}
                        onClick={() => levelUpSkill(tree.name, skill.name)}
                    >
                        <Plus className="mr-2"/>
                        Upgrade
                        <span className="ml-auto flex items-center gap-1">
                        {skill.cost} <Zap className="h-3 w-3 text-yellow-400" />
                        </span>
                    </Button>
                    </div>
                );
                })}
            </CardContent>
            </Card>
        );
      })}
    </div>
  );
};

export default SkillTree;

    