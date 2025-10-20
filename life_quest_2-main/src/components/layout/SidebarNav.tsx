'use client';

import {
  BookOpen,
  LayoutGrid,
  Settings,
  Sword,
  Trophy,
  CalendarDays,
  User,
  ShoppingBag,
  Notebook,
  FileText,
  Wind,
  Timer,
  GitMerge,
  CalendarCheck,
  Bot,
  Bell,
  Music,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import AppLogo from './AppLogo';
import { useUser } from '@/context/UserContext';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/tasks', label: 'Quests', icon: BookOpen },
  { href: '/dungeons', label: 'Special Quests', icon: GitMerge },
  { href: '/coach', label: 'Coach', icon: Bot },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/character', label: 'Character', icon: User },
  { href: '/journal', label: 'Journal', icon: Notebook },
  { href: '/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { href: '/breathing', label: 'Breathing', icon: Wind },
  { href: '/weekly-review', label: 'Weekly Review', icon: CalendarCheck },
  { href: '/boss-fight', label: 'Boss Fight', icon: Sword },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/shop', label: 'Rewards', icon: ShoppingBag },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const SidebarNav = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const unreadNotifications = isClient ? user?.notifications?.filter(n => !n.read).length || 0 : 0;

  return (
    <TooltipProvider>
      <nav className="hidden md:flex w-20 bg-card/80 backdrop-blur-xl flex-col items-center py-6 space-y-4 border-r border-white/10">
        <div className="mb-4">
            <Link href="/dashboard">
              <Sword className="h-10 w-10 text-primary" />
            </Link>
        </div>
        
        {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Tooltip key={href}>
                <TooltipTrigger asChild>
                  <Link href={href} className={cn(
                      "relative p-4 border-l-4 w-full flex justify-center transition-colors duration-200",
                      isActive ? "bg-primary/20 border-primary" : "border-transparent hover:bg-primary/10"
                  )}>
                    <Icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-foreground/70")} />
                    {label === 'Notifications' && unreadNotifications > 0 && (
                        <Badge className="absolute top-2 right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                            {unreadNotifications}
                        </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            )
        })}

        <div className="mt-auto">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/settings" className={cn(
                        "p-4 border-l-4 w-full flex justify-center transition-colors duration-200",
                        pathname.startsWith('/settings') ? "bg-primary/20 border-primary" : "border-transparent hover:bg-primary/10"
                    )}>
                        <Settings className="h-6 w-6 text-foreground/70" />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Settings</p>
                </TooltipContent>
            </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default SidebarNav;
