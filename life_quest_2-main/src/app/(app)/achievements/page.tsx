import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultDataService } from "@/lib/default-data-service";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AchievementsPage() {
    // TODO: Load user's actual achievement progress from backend
    const achievements = DefaultDataService.getDefaultAchievements();
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    const rarityColors = {
        'Common': 'bg-gray-200 text-gray-800',
        'Rare': 'bg-blue-200 text-blue-800',
        'Epic': 'bg-purple-200 text-purple-800',
        'Legendary': 'bg-yellow-200 text-yellow-800',
    };
    
    return (
        <>
            <PageHeader
                title="Achievements"
                description={`You have unlocked ${unlockedAchievements.length} of ${achievements.length} achievements.`}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {unlockedAchievements.map(ach => (
                    <Card key={ach.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <ach.icon className="h-10 w-10 text-primary" />
                                <Badge className={cn(rarityColors[ach.rarity])}>{ach.rarity}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <h3 className="font-bold font-headline text-lg">{ach.title}</h3>
                            <p className="text-sm text-muted-foreground">{ach.description}</p>
                        </CardContent>
                        {ach.unlockedDate &&
                            <div className="px-6 pb-4 text-xs text-muted-foreground">Unlocked on {format(ach.unlockedDate, 'P')}</div>
                        }
                    </Card>
                ))}
                {lockedAchievements.map(ach => (
                    <Card key={ach.id} className="flex flex-col bg-card/50 opacity-60">
                         <CardHeader>
                            <div className="flex items-start justify-between">
                                <ach.icon className="h-10 w-10 text-muted-foreground" />
                                <Badge variant="outline">{ach.rarity}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <h3 className="font-bold font-headline text-lg text-muted-foreground">{ach.title}</h3>
                            <p className="text-sm text-muted-foreground">{ach.description}</p>
                        </CardContent>
                        <div className="px-6 pb-4 text-xs text-muted-foreground font-semibold">LOCKED</div>
                    </Card>
                ))}
            </div>
        </>
    );
}
