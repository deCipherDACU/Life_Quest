'use client';

import { useUser } from '@/context/UserContext';
import { PartyPopper } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function StepReady() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <PartyPopper className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-3xl font-headline font-bold mb-2">You're all set, {user.name}!</h1>
      <p className="text-muted-foreground mb-8">Your adventure is about to begin. Good luck!</p>
      <div className="flex justify-center items-center gap-4 bg-muted/50 p-4 rounded-lg max-w-xs mx-auto">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold font-headline text-lg">{user.name}</p>
          <p className="text-sm text-muted-foreground">Level {user.level} Adventurer</p>
        </div>
      </div>
    </div>
  );
}
