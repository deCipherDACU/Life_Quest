
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatCard from "@/components/dashboard/StatCard";
import { Coins, Flame, Shield, Star, Trophy, Edit, Save, X, User as UserIcon, Brain, Palette, Upload, Heart, Zap, Package, Crown, Sword } from "lucide-react";
import { InteractiveSkillTree } from "@/components/character/InteractiveSkillTree";
import SkillTree from "@/components/character/SkillTree";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { avatars, mbtiTypes } from '@/components/welcome/shared';
import { cn } from '@/lib/utils';
import type { User, Item } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { defaultArmor, defaultHelmet, defaultShield, defaultWeapon } from '@/lib/inventory';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CharacterPage() {
    const { user, setUser, equipItem } = useUser();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatarUrl.split('element-')[1]?.split('/')[0] || '');
    const [mbti, setMbti] = useState(user?.mbti || '');
    const [gender, setGender] = useState(user?.gender || 'prefer-not-to-say');
    const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) return <div>Loading character...</div>;
    
    const displayLevel = user.level >= 99 ? '99+' : user.level;
    const hpPercentage = (user.health / user.maxHealth) * 100;

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset fields to current user state if canceled
            setName(user.name);
            setAvatar(user.avatarUrl.split('element-')[1]?.split('/')[0] || '');
            setMbti(user.mbti || '');
            setGender(user.gender || 'prefer-not-to-say');
            setCustomAvatarUrl(null);
        }
        setIsEditing(!isEditing);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCustomAvatarUrl(event.target.result as string);
                    setAvatar(''); // Deselect symbol avatars
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        let avatarUrl = user.avatarUrl;

        if (customAvatarUrl) {
            avatarUrl = customAvatarUrl;
        } else if (avatar) {
            avatarUrl = `https://picsum.photos/seed/element-${avatar}/200/200`;
        }

        setUser({ ...user, name, avatarUrl, mbti, gender: gender as User['gender'] });
        setIsEditing(false);
        setCustomAvatarUrl(null);
        toast({
            title: "Profile Updated",
            description: "Your character details have been saved.",
        });
    }

    const renderGender = (genderValue?: User['gender']) => {
        switch(genderValue) {
            case 'male': return 'Male';
            case 'female': return 'Female';
            case 'other': return 'Other';
            default: return 'Not specified';
        }
    }

    const equippedWeapon = user.equipment.weapon || defaultWeapon;
    const equippedArmor = user.equipment.armor || defaultArmor;
    const equippedHelmet = user.equipment.helmet || defaultHelmet;
    const equippedShield = user.equipment.shield || defaultShield;
    
    const equipmentSlots = [
        { name: 'Weapon', item: equippedWeapon, icon: Sword },
        { name: 'Helmet', item: equippedHelmet, icon: Crown },
        { name: 'Armor', item: equippedArmor, icon: Shield },
        { name: 'Shield', item: equippedShield, icon: Shield },
    ];

    const rarityColors = {
        'Common': 'border-gray-500/20 hover:border-gray-500/50',
        'Rare': 'border-blue-500/20 hover:border-blue-500/50',
        'Epic': 'border-purple-500/20 hover:border-purple-500/50',
        'Legendary': 'border-yellow-500/20 hover:border-yellow-500/50',
    };

    const rarityText = {
        'Common': 'text-gray-400',
        'Rare': 'text-blue-400',
        'Epic': 'text-purple-400',
        'Legendary': 'text-yellow-400',
    }

    const isEquipped = (item: Item) => {
        return Object.values(user.equipment).some(equipped => equipped?.id === item.id);
    }

    return (
        <>
            <PageHeader
                title="Your Character"
                description="View your progress, stats, and develop your skills."
                actions={
                    <Button onClick={handleEditToggle} variant={isEditing ? "ghost" : "outline"} size="sm">
                        {isEditing ? <X className="mr-2" /> : <Edit className="mr-2" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                }
            />

            {isEditing ? (
                <Card className='mb-8'>
                    <CardContent className="p-6">
                        <div className='grid sm:grid-cols-2 gap-6'>
                            <div className="space-y-4">
                                <h3 className='font-headline text-lg font-semibold flex items-center gap-2'><UserIcon /> Basic Info</h3>
                                <div className='space-y-2'>
                                    <Label htmlFor="char-name">Character Name</Label>
                                    <Input id="char-name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="char-gender">Gender</Label>
                                    <Select value={gender} onValueChange={setGender}>
                                        <SelectTrigger id="char-gender">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="char-mbti" className="flex items-center gap-2"><Brain /> MBTI Type</Label>
                                     <Select value={mbti} onValueChange={setMbti}>
                                        <SelectTrigger id="char-mbti">
                                            <SelectValue placeholder="Select your MBTI type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mbtiTypes.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className='font-headline text-lg font-semibold flex items-center gap-2'><Palette /> Avatar</h3>
                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                                
                                <p className="text-sm text-muted-foreground">Choose a symbol or upload your own picture.</p>

                                 <div className="flex items-center gap-4">
                                    <Avatar className="h-24 w-24 border-4 border-muted">
                                        <AvatarImage src={customAvatarUrl || user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid grid-cols-3 gap-2">
                                    {avatars.map(({ id, Icon }) => (
                                        <div key={id} onClick={() => { setAvatar(id); setCustomAvatarUrl(null); }} className={cn(
                                            "h-16 w-16 border-4 border-transparent cursor-pointer transition-all hover:scale-105 hover:border-primary rounded-lg flex items-center justify-center bg-muted/50",
                                            avatar === id && !customAvatarUrl && "border-primary bg-primary/20"
                                        )}>
                                            <Icon className="h-8 w-8 text-foreground/80" />
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleSave}><Save className="mr-2" />Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="mb-8 p-4 sm:p-6 bg-card rounded-lg flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-grow text-center sm:text-left'>
                        <h2 className="text-2xl sm:text-3xl font-bold font-headline">{user.name}</h2>
                        <p className="text-muted-foreground">Level {displayLevel} Adventurer</p>
                        <div className="text-xs sm:text-sm text-muted-foreground flex flex-wrap justify-center sm:justify-start gap-x-4">
                            <p>Member since {format(user.memberSince, 'P')}</p>
                            <p>Gender: {renderGender(user.gender)}</p>
                            {user.mbti && <p>MBTI: {user.mbti}</p>}
                        </div>
                    </div>
                     <div className="w-full sm:w-48">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold font-headline flex items-center gap-2"><Heart className="text-red-500" /> Health</h3>
                            <span className="font-mono text-sm">{user.health} / {user.maxHealth}</span>
                        </div>
                        <Progress value={hpPercentage} className="h-3 [&>div]:bg-red-500" />
                    </div>
                </div>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
                <StatCard title="Level" value={displayLevel} icon={<Trophy />} description={user.level < 99 ? `${user.xp.toLocaleString()} / ${user.xpToNextLevel.toLocaleString()} XP` : 'Potential Reached'} />
                <StatCard title="Stat Points" value={user.skillPoints} icon={<Zap />} description="Use to upgrade stats" />
                <StatCard title="Current Streak" value={`${user.streak} days`} icon={<Flame />} description={`Longest: ${user.longestStreak} days`} />
                <StatCard title="Total Quests" value={user.tasksCompleted} icon={<Star />} description="Completed" />
                <StatCard title="CompletionRate" value={`${user.completionRate}%`} icon={<Shield />} description="Last 30 days" />
            </div>
            
             <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Equipment & Inventory</CardTitle>
                    <CardDescription>Drag items from your inventory to an equipment slot to equip them.</CardDescription>
                </CardHeader>
                <CardContent className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h3 className="font-headline font-semibold mb-4">Equipment</h3>
                        <div className="space-y-4">
                            {equipmentSlots.map((slot) => {
                                 const IconComponent = typeof slot.item.icon === 'function' ? slot.item.icon : Shield;
                                 return (
                                    <div key={slot.name} className="flex items-center gap-4">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-secondary/20 border-2 border-dashed border-secondary/50">
                                            <slot.icon className="h-8 w-8 text-secondary"/>
                                        </div>
                                        <div className={cn("p-3 rounded-lg border-2 flex-1 flex items-center gap-3", rarityColors[slot.item.rarity])}>
                                            <IconComponent className="h-8 w-8 text-primary" />
                                            <div>
                                                <p className="font-bold">{slot.item.name}</p>
                                                <p className={cn("text-xs", rarityText[slot.item.rarity])}>{slot.item.rarity}</p>
                                                <p className="text-xs text-muted-foreground">{slot.item.bonus}</p>
                                            </div>
                                        </div>
                                    </div>
                                 )
                            })}
                        </div>
                    </div>
                     <div className="lg:col-span-2">
                        <h3 className="font-headline font-semibold mb-4">Inventory</h3>
                         {(user.inventory || []).length === 0 ? (
                            <div className="flex items-center justify-center h-full bg-secondary/10 rounded-lg">
                                <p className="text-muted-foreground text-center py-8">Your inventory is empty. Visit the shop!</p>
                            </div>
                        ) : (
                             <ScrollArea className="h-[400px] pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {(user.inventory || []).map((item) => {
                                    const equipped = isEquipped(item);
                                    const IconComponent = typeof item.icon === 'function' ? item.icon : Shield;
                                    return (
                                        <div key={item.id} className={cn("flex items-center gap-3 p-2 border-2 rounded-lg bg-secondary/50", rarityColors[item.rarity])}>
                                            <IconComponent className="h-8 w-8 text-primary" />
                                            <div className='flex-1'>
                                                <p className="font-bold">{item.name}</p>
                                                <p className={cn("text-xs", rarityText[item.rarity])}>{item.rarity}</p>
                                            </div>
                                            {item.type !== 'Collectible' && (
                                                <Button size="sm" variant="outline" onClick={() => equipItem(item)} disabled={equipped}>
                                                    {equipped ? "Equipped" : "Equip"}
                                                </Button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            </ScrollArea>
                        )}
                    </div>
                </CardContent>
            </Card>

            <InteractiveSkillTree />
        </>
    );
}
    