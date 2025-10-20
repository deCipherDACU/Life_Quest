
'use client';

import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from '@/lib/utils';
import { BookOpen, Briefcase, BrainCircuit, Dumbbell, Shield, Sparkles, Sword, Trophy, Film, Gamepad2, Pizza, Heart } from 'lucide-react';

const interests = [
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'health', label: 'Health', icon: Dumbbell },
    { id: 'mental_wellness', label: 'Mental Wellness', icon: BrainCircuit },
    { id: 'hobbies', label: 'Hobbies', icon: Gamepad2 },
    { id: 'social', label: 'Social', icon: Heart },
];

export default function StepInterests() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    return (
        <div className="text-center">
            <h1 className="text-3xl font-headline font-bold mb-2">What are your goals?</h1>
            <p className="text-muted-foreground mb-8">Select a few areas you want to focus on. This will help us suggest relevant quests.</p>
            
            <ToggleGroup
                type="multiple"
                variant="outline"
                value={selectedInterests}
                onValueChange={(value) => setSelectedInterests(value)}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
                {interests.map(({id, label, icon: Icon}) => (
                    <ToggleGroupItem key={id} value={id} className="h-24 flex flex-col gap-2 text-base" aria-label={`Select ${label}`}>
                        <Icon className="h-8 w-8" />
                        <span>{label}</span>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}
