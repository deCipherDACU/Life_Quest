import { Sword } from 'lucide-react';

export default function StepWelcome() {
    return (
        <div className="text-center py-8">
            <div className="flex justify-center mb-6">
                <Sword className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-bold mb-2">Welcome to LifeQuest RPG!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
                Get ready to turn your daily tasks into epic quests, level up your skills, and conquer your goals. Let's set up your character to begin your adventure.
            </p>
        </div>
    );
}
