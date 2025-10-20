

'use client';

import { useState, useRef, ChangeEvent, useEffect, lazy, Suspense } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Coins, Shield, Sparkles, Sword, Edit, Save, Upload, Wand2, ShieldAlert, Skull, HeartPulse, Activity } from "lucide-react";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const GenerateImageDialog = lazy(() => import('@/components/boss-fight/GenerateImageDialog').then(module => ({ default: module.GenerateImageDialog })));


export default function BossFightPage() {
    const { user, boss: initialBoss, setBoss } = useUser();
    
    // We create a local state for editing that is only committed on save
    const [nameInput, setNameInput] = useState(initialBoss?.name || '');
    const [imageUrl, setImageUrl] = useState(initialBoss?.imageUrl || '');

    const [isEditing, setIsEditing] = useState(false);
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialBoss) {
            setNameInput(initialBoss.name);
            setImageUrl(initialBoss.imageUrl);
        }
    }, [initialBoss]);

    if (!initialBoss || !user) {
        return <div>Loading boss...</div>;
    }

    // Use the initialBoss from context for display
    const boss = { ...initialBoss, name: nameInput, imageUrl: imageUrl };

    const hpPercentage = (boss.currentHp / boss.maxHp) * 100;
    
    const handleEditToggle = () => {
        if (isEditing) {
            // On save, we update the context
            setBoss(prev => prev ? ({ ...prev, name: nameInput, imageUrl: imageUrl }) : null);
        } else {
            // On edit, we populate the local state
            setNameInput(boss.name);
            setImageUrl(boss.imageUrl);
        }
        setIsEditing(!isEditing);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setImageUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageGenerated = (newImageUrl: string) => {
        setImageUrl(newImageUrl);
    }
    
    const currentPhase = (boss.phases && Array.isArray(boss.phases)) ? (boss.phases.find(p => boss.currentHp > p.hpThreshold) || boss.phases[boss.phases.length - 1]) : null;
    
    return (
        <TooltipProvider>
            <PageHeader
                title="Weekly Boss Fight"
                description={`Face the mighty ${boss.name}! Complete quests to defeat it.`}
                actions={
                    <Button onClick={handleEditToggle} variant="outline" size="sm">
                        {isEditing ? <Save className="mr-2" /> : <Edit className="mr-2" />}
                        {isEditing ? 'Save' : 'Edit'}
                    </Button>
                }
            />

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card className="overflow-hidden">
                        <div 
                            className="h-64 md:h-96 w-full relative group"
                            data-ai-hint="fantasy demon warrior anime"
                        >
                            {boss.imageUrl ? (
                                <Image src={boss.imageUrl} alt={boss.name} fill objectFit="cover" className="bg-gradient-to-t from-black/70 to-transparent" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center text-muted-foreground">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4">
                                    <Button onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2"/>
                                        Upload Image
                                    </Button>
                                    <Button variant="secondary" onClick={() => setIsGenerateDialogOpen(true)}>
                                        <Wand2 className="mr-2" />
                                        Generate Image
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 p-6">
                                {isEditing ? (
                                    <Input 
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        className="text-4xl font-bold font-headline bg-transparent text-white border-dashed h-auto p-0"
                                    />
                                ) : (
                                    <h2 className="text-4xl font-bold text-white font-headline">{boss.name}</h2>
                                )}
                                <p className="text-lg text-white/80">{boss.timeRemaining} remaining</p>
                                {currentPhase && <Badge className="mt-2 text-base" variant="destructive">{currentPhase.name}</Badge>}
                            </div>
                        </div>
                        <CardContent className="p-6">
                             <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-semibold font-headline">Boss HP</h3>
                                    <span className="font-mono text-sm">{boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()}</span>
                                </div>
                                <Progress value={hpPercentage} className="h-4" />
                            </div>
                            {boss.currentHp > 0 ? (
                                <>
                                <div className="text-muted-foreground text-sm">Damage the boss by completing quests. Exploit its weaknesses for bonus damage!</div>
                                <Button asChild size="lg" className="mt-6 w-full sm:w-auto">
                                    <Link href="/tasks">Go to Quests <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                                </>
                            ) : (
                                 <div className="text-green-400 font-bold text-center p-4 rounded-lg bg-green-500/10">
                                    Congratulations! The boss has been defeated this week!
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="md:col-span-1 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-destructive" /> Telegraphed Attacks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {boss.attack_pattern && Array.isArray(boss.attack_pattern) && boss.attack_pattern.length > 0 ? (
                            boss.attack_pattern.map((attack, index) => {
                                const Icon = typeof attack.icon === 'function' ? attack.icon : ShieldAlert;
                                return (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="p-2 bg-destructive/10 rounded-md mt-1">
                                        <Icon className="h-5 w-5 text-destructive" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{attack.name}</p>
                                        <p className="text-sm text-muted-foreground">{attack.description}</p>
                                        <p className="text-xs font-mono text-destructive/80">Triggers on: {attack.trigger}</p>
                                    </div>
                                </div>
                           )})
                           ) : (
                            <p className="text-sm text-muted-foreground">No telegraphed attacks this week.</p>
                           )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Shield className="h-5 w-5" /> Resistances & Weaknesses</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                           {boss.resistances && Object.keys(boss.resistances).length > 0 ? (
                            (Object.keys(boss.resistances) as (keyof typeof boss.resistances)[]).map((res, index) => {
                                const value = boss.resistances[res];
                                if(value === undefined) return null;
                                const isWeakness = value < 1;
                                return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Badge variant={isWeakness ? 'destructive' : 'secondary'} className={cn("text-base", !isWeakness && "opacity-70")}>
                                            {res} {isWeakness ? ' (Weak)' : '(Resist)'}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isWeakness ? `Takes ${((1 - value) * 100).toFixed(0)}% more damage` : `Takes ${((value - 1) * 100).toFixed(0)}% less damage`} from {res} quests.</p>
                                    </TooltipContent>
                                </Tooltip>
                           )})
                           ) : (
                            <p className="text-sm text-muted-foreground">No resistances or weaknesses specified.</p>
                           )}
                        </CardContent>
                    </Card>

                    {user.debuffs && user.debuffs.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline flex items-center gap-2"><HeartPulse className="h-5 w-5 text-yellow-400" /> Your Debuffs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                            {user.debuffs.map((debuff, index) => {
                                const Icon = typeof debuff.icon === 'function' ? debuff.icon : Activity;
                                return (
                                <div key={index} className="flex items-start gap-3">
                                     <div className="p-2 bg-yellow-400/10 rounded-md mt-1">
                                        <Icon className="h-5 w-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{debuff.name}</p>
                                        <p className="text-sm text-muted-foreground">{debuff.description} ({debuff.duration} days remaining)</p>
                                    </div>
                                </div>
                            )})}
                            </CardContent>
                        </Card>
                    )}
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Sword className="h-5 w-5" /> Victory Rewards</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Experience</span>
                                <span className="font-semibold">{boss.rewards.xp.toLocaleString()} XP</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><Coins className="h-4 w-4 text-yellow-500" /> Coins</span>
                                <span className="font-semibold">{boss.rewards.coins.toLocaleString()}</span>
                            </div>
                             <div className="flex items-center justify-between pt-2 border-t">
                                <span className="flex items-center gap-2 font-semibold">Exclusive Item</span>
                                <span className="font-semibold text-primary">Rare Avatar Item</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Suspense fallback={<div/>}>
              {isGenerateDialogOpen && <GenerateImageDialog
                  open={isGenerateDialogOpen}
                  onOpenChange={setIsGenerateDialogOpen}
                  onImageGenerated={handleImageGenerated}
              />}
            </Suspense>
        </TooltipProvider>
    );
}
