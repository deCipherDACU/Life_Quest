
import { Flame, Droplets, Wind, Mountain, Sun, Moon, type LucideIcon } from "lucide-react";

export const avatars: {id: string, Icon: LucideIcon, 'data-ai-hint': string}[] = [
    { id: 'fire', Icon: Flame, 'data-ai-hint': 'elemental fire' },
    { id: 'water', Icon: Droplets, 'data-ai-hint': 'elemental water' },
    { id: 'air', Icon: Wind, 'data-ai-hint': 'elemental air' },
    { id: 'earth', Icon: Mountain, 'data-ai-hint': 'elemental earth' },
    { id: 'light', Icon: Sun, 'data-ai-hint': 'elemental light' },
    { id: 'dark', Icon: Moon, 'data-ai-hint': 'elemental dark' },
];

export const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

    