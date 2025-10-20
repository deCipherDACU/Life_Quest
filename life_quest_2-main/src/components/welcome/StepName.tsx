'use client';

import { Input } from "@/components/ui/input";

interface StepNameProps {
    name: string;
    setName: (name: string) => void;
}

export default function StepName({ name, setName }: StepNameProps) {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-headline font-bold mb-2">What is your name, adventurer?</h1>
            <p className="text-muted-foreground mb-8">This will be your name throughout your journey in LifeQuest.</p>
            <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Sarah the Brave"
                className="max-w-sm mx-auto text-center text-lg h-12 bg-white/5 border-white/20"
            />
        </div>
    );
}
