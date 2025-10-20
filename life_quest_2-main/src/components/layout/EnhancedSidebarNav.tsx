'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, BookOpen, GitMerge, User, Trophy, ShoppingBag, 
  Calendar, MessageSquare, Settings, Brain, Timer, Heart,
  ChevronLeft, ChevronRight, Plus, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  levelRequired?: number;
}

interface NavGroup {
  name: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    name: "Core",
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
      { href: '/tasks', label: 'Quests', icon: BookOpen },
      { href: '/dungeons', label: 'Special Quests', icon: GitMerge, levelRequired: 5 }
    ]
  },
  {
    name: "Character",
    items: [
      { href: '/character', label: 'Character', icon: User },
      { href: '/achievements', label: 'Achievements', icon: Trophy },
      { href: '/shop', label: 'Rewards', icon: ShoppingBag }
    ]
  },
  {
    name: "Progress",
    items: [
      { href: '/boss-fight', label: 'Boss Battle', icon: Zap },
      { href: '/weekly-review', label: 'Weekly Review', icon: Calendar },
      { href: '/journal', label: 'Journal', icon: MessageSquare }
    ]
  },
  {
    name: "Tools",
    items: [
      { href: '/pomodoro', label: 'Focus Timer', icon: Timer },
      { href: '/breathing', label: 'Mindfulness', icon: Heart },
      { href: '/coach', label: 'AI Coach', icon: Brain, levelRequired: 3 },
      { href: '/timetable', label: 'Timetable', icon: Calendar }
    ]
  }
];

export function EnhancedSidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const isItemUnlocked = (item: NavItem) => {
    if (!item.levelRequired) return true;
    return user ? user.level >= item.levelRequired : false;
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="relative h-full bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl border-r border-border/50"
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation Content */}
      <div className="flex flex-col h-full p-4">
        {/* User Level Badge */}
        <AnimatePresence>
          {!isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {user.level}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Level {user.level}</span>
                    <Badge variant="secondary" className="text-xs">
                      {user.xp} XP
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-6">
          {navGroups.map((group, groupIndex) => (
            <div key={group.name}>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3"
                  >
                    {group.name}
                  </motion.h3>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  const isUnlocked = isItemUnlocked(item);
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <Link
                        href={isUnlocked ? item.href : '#'}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          "hover:bg-accent/50 hover:text-accent-foreground",
                          isActive && "bg-primary/10 text-primary border border-primary/20",
                          !isUnlocked && "opacity-50 cursor-not-allowed",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                        
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              className="flex items-center justify-between flex-1"
                            >
                              <span className="truncate">{item.label}</span>
                              <div className="flex items-center gap-1">
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                {!isUnlocked && item.levelRequired && (
                                  <Badge variant="outline" className="text-xs">
                                    Lv.{item.levelRequired}
                                  </Badge>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-accent/50 hover:text-accent-foreground",
              pathname === '/settings' && "bg-primary/10 text-primary border border-primary/20",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Settings className="h-4 w-4" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="truncate"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Floating Action Button Component
export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions = [
    { label: 'Add Quest', icon: BookOpen, href: '/tasks?create=true' },
    { label: 'Start Timer', icon: Timer, href: '/pomodoro' },
    { label: 'Journal Entry', icon: MessageSquare, href: '/journal?create=true' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 px-4 py-2 bg-background/95 backdrop-blur-sm border rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl transition-all duration-200",
          "flex items-center justify-center",
          isOpen && "rotate-45"
        )}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}