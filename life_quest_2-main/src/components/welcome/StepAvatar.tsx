'use client';

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { avatars } from "./shared";

interface StepAvatarProps {
    avatar: string;
    setAvatar: (avatar: string) => void;
}

export default function StepAvatar({ avatar, setAvatar }: StepAvatarProps) {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-headline font-bold mb-2">Choose Your Symbol</h1>
            <p className="text-muted-foreground mb-8">Select an element to represent you in your adventure.</p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {avatars.map(({ id, Icon }) => (
                    <div key={id} className="relative" onClick={() => setAvatar(id)}>
                        <div className={cn(
                            "h-24 w-24 border-4 border-transparent cursor-pointer transition-all hover:scale-105 hover:border-primary rounded-full flex items-center justify-center bg-muted/50",
                            avatar === id && "border-primary bg-primary/20"
                        )}>
                            <Icon className="h-12 w-12 text-foreground/80" />
                        </div>
                        {avatar === id && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
