'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mbtiTypes } from "./shared";

interface StepMbtiProps {
    mbti: string;
    setMbti: (mbti: string) => void;
}

export default function StepMbti({ mbti, setMbti }: StepMbtiProps) {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-headline font-bold mb-2">What's your personality type?</h1>
            <p className="text-muted-foreground mb-8">This helps the AI tailor recommendations to your style. (Optional)</p>
            
            <Select onValueChange={setMbti} value={mbti}>
                <SelectTrigger className="max-w-sm mx-auto text-lg h-12">
                    <SelectValue placeholder="Select your MBTI type..." />
                </SelectTrigger>
                <SelectContent>
                    {mbtiTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-4">Don't know your type? Take a <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noopener noreferrer" className="underline">free test</a>.</p>
        </div>
    );
}
