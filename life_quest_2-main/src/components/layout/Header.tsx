
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Diamond, LogOut, Menu, User as UserIcon, Coins, Star, Trophy } from "lucide-react";
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { Skeleton } from "../ui/skeleton";
import AppLogo from "./AppLogo";
import { CircularProgress } from "../ui/circular-progress";

const Header = () => {
  const { user } = useUser();

  const levelProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 bg-transparent px-4 sm:px-6">
        <div className="md:hidden">
          <AppLogo />
        </div>
        
        <div className="flex-1"></div>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="hidden sm:flex items-center gap-3 text-sm font-semibold font-headline bg-card/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                <CircularProgress value={levelProgress} size={32} strokeWidth={4} />
                <div>
                    <span className="text-xs text-primary">AR</span>
                    <span className="font-bold text-lg text-white ml-1">{user.level}</span>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold font-headline bg-card/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg text-white">{user.coins.toLocaleString()}</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-sm font-semibold font-headline bg-card/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
              <Diamond className="h-5 w-5 text-accent" />
              <span className="font-bold text-lg text-white">{user.gems}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <div className="bg-card/80 backdrop-blur-sm p-1 rounded-full border border-white/10 cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover/80 backdrop-blur-xl border-white/20">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
