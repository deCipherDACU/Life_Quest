
'use client';

import { useState, lazy, Suspense } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultDataService } from "@/lib/default-data-service";
import { useUser } from "@/context/UserContext";
import { Coins, Lock, Repeat, Diamond, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import type { RewardItem } from "@/lib/types";
import { Separator } from '@/components/ui/separator';

const CreateRewardDialog = lazy(() => import('@/components/shop/CreateRewardDialog').then(module => ({ default: module.CreateRewardDialog })));

export default function ShopPage() {
    const { user, redeemReward, getRedeemedCount, deleteCustomReward } = useUser();
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const handleRedeem = (reward: RewardItem) => {
        if (!user) return;

        if (reward.category !== 'Custom' && reward.levelRequirement && user.level < reward.levelRequirement) {
            toast({
                title: "Level Too Low",
                description: `You need to be level ${reward.levelRequirement} to redeem this reward.`,
                variant: 'destructive',
            });
            return;
        }

        const cost = reward.coinCost || 0;
        if (user.coins < cost) {
             toast({
                title: "Not Enough Coins",
                description: `You need ${cost} coins to redeem this.`,
                variant: 'destructive',
            });
            return;
        }

        redeemReward(reward);
    };

    if (!user) {
        return <div>Loading...</div>;
    }
    
    // TODO: Load global rewards from backend
    const globalRewards = DefaultDataService.getDefaultGlobalRewards();
    const allRewards = [...(user.customRewards || []), ...globalRewards];

    return (
        <>
            <PageHeader
                title="Rewards Shop"
                description="Redeem your coins or gems for well-deserved breaks and treats."
                actions={
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Reward
                    </Button>
                }
            />

            {user.customRewards && user.customRewards.length > 0 && (
                <div className='mb-8'>
                    <h2 className="text-2xl font-headline font-bold mb-4">Your Custom Rewards</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {user.customRewards.map(reward => {
                             const canAfford = user.coins >= (reward.coinCost || 0);

                             return (
                                <Card key={reward.id} className="flex flex-col border-primary/50">
                                    <CardHeader className="flex-row items-start justify-between">
                                        <div>
                                            <CardTitle className="font-headline text-xl">{reward.title}</CardTitle>
                                            <CardDescription>{reward.description}</CardDescription>
                                        </div>
                                        <reward.icon className={`h-10 w-10 text-primary`} />
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-2">
                                         <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Category</span>
                                            <Badge variant="secondary">Custom</Badge>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col items-stretch gap-2">
                                        <Button onClick={() => handleRedeem(reward)} disabled={!canAfford}>
                                            <Coins className="mr-2 h-4 w-4" />
                                            Redeem for {reward.coinCost}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteCustomReward(reward.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                             )
                        })}
                    </div>
                    <Separator className="my-8" />
                </div>
            )}
            
            <h2 className="text-2xl font-headline font-bold mb-4">Shop Items</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {globalRewards.map(reward => {
                    const redeemedCount = getRedeemedCount(reward);
                    const isSoldOut = reward.redeemLimit ? redeemedCount >= reward.redeemLimit : false;
                    
                    const isGemReward = reward.gemCost && !reward.coinCost;
                    const canAfford = isGemReward 
                        ? user.gems >= (reward.gemCost || 0)
                        : user.coins >= (reward.coinCost || 0);

                    const levelMet = user.level >= reward.levelRequirement;
                    const canRedeem = canAfford && levelMet && !isSoldOut;
                    const Icon = reward.icon;

                    return (
                        <Card key={reward.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start justify-between">
                                 <div>
                                    <CardTitle className="font-headline text-xl">{reward.title}</CardTitle>
                                    <CardDescription>{reward.description}</CardDescription>
                                 </div>
                                 <Icon className={`h-10 w-10 ${isGemReward ? 'text-blue-400' : 'text-primary'}`} />
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Category</span>
                                    <Badge variant="secondary">{reward.category}</Badge>
                                </div>
                                {reward.levelRequirement > 1 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Required Level</span>
                                        <Badge variant={levelMet ? "default" : "destructive"}>
                                            Lvl {reward.levelRequirement}
                                        </Badge>
                                    </div>
                                )}
                                {reward.redeemLimit && (
                                     <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Limit</span>
                                        <div className="flex items-center gap-1">
                                            <Repeat className="h-3 w-3" />
                                            <span>{redeemedCount} / {reward.redeemLimit} {reward.redeemPeriod}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col items-stretch gap-2">
                                <Button onClick={() => handleRedeem(reward)} disabled={!canRedeem} variant={isGemReward ? 'secondary' : 'default'}>
                                    {!levelMet || isSoldOut ? (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            {isSoldOut ? 'Limit Reached' : `Lvl ${reward.levelRequirement} Locked`}
                                        </>
                                    ): (
                                        <>
                                            {isGemReward ? 
                                                <Diamond className="mr-2 h-4 w-4" /> : 
                                                <Coins className="mr-2 h-4 w-4" />
                                            }
                                            Redeem for {reward.gemCost || reward.coinCost}
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Suspense fallback={<div/>}>
              {isCreateDialogOpen && <CreateRewardDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
            </Suspense>
        </>
    );
}
