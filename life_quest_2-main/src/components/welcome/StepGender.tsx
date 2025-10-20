
'use client';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { User } from "@/lib/types";

interface StepGenderProps {
    gender: User['gender'];
    setGender: (gender: User['gender']) => void;
}

export default function StepGender({ gender, setGender }: StepGenderProps) {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-headline font-bold mb-2">What's your gender?</h1>
            <p className="text-muted-foreground mb-8">This helps us personalize your experience. (Optional)</p>
            
            <RadioGroup 
                value={gender} 
                onValueChange={(value) => setGender(value as User['gender'])}
                className="max-w-xs mx-auto space-y-2"
            >
                <Label className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <RadioGroupItem value="female" id="female" />
                    <span>Female</span>
                </Label>
                <Label className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <RadioGroupItem value="male" id="male" />
                    <span>Male</span>
                </Label>
                <Label className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <RadioGroupItem value="other" id="other" />
                    <span>Other</span>
                </Label>
                 <Label className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                    <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                    <span>Prefer not to say</span>
                </Label>
            </RadioGroup>
        </div>
    );
}
