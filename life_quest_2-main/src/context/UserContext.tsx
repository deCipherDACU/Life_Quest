

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { DefaultDataService } from '@/lib/default-data-service';
import type { User, RewardItem, Task, Boss, DungeonCrawl, JournalEntry, WeeklyReview, ChatMessage, Item, Equipment, Notification, Debuff } from '@/lib/types';
import { xpForLevel } from '@/lib/formulas';
import { useToast } from '@/hooks/use-toast';
import { startOfDay, startOfWeek, startOfMonth, isWithinInterval, subHours, isSameDay, getWeek, getYear, subDays, differenceInDays } from 'date-fns';

type UserContextType = {
  user: User | null;
  tasks: Task[];
  boss: Boss | null;
  dungeons: DungeonCrawl[];
  journalEntries: JournalEntry[];
  weeklyReviews: WeeklyReview[];
  setUser: (user: User | ((prevUser: User | null) => User | null)) => void;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => boolean;
  addGems: (amount: number) => boolean;
  redeemReward: (reward: RewardItem) => void;
  getRedeemedCount: (reward: RewardItem) => number;
  addTask: (task: Omit<Task, 'id' | 'completed'>, silent?: boolean) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  deleteJournalEntry: (entryId: string) => void;
  incrementJournalDeletionCount: () => void;
  levelUpSkill: (treeName: string, skillName: string) => void;
  setBoss: (boss: Boss | ((prevBoss: Boss | null) => Boss | null)) => void;
  dealBossDamage: (task: Task) => void;
  addDungeon: (dungeon: Omit<DungeonCrawl, 'id' | 'completed'>) => void;
  updateDungeon: (updatedDungeon: DungeonCrawl) => void;
  toggleChallengeCompleted: (dungeonId: string, challengeId: string) => void;
  completeDungeon: (dungeonId: string) => void;
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'date' | 'weekNumber' | 'year'>) => void;
  addChatMessage: (message: ChatMessage) => void;
  addCustomReward: (reward: Omit<RewardItem, 'id' | 'levelRequirement' | 'category' | 'icon'>) => void;
  deleteCustomReward: (rewardId: string) => void;
  equipItem: (item: Item) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [boss, setBossState] = useState<Boss | null>(null);
  const [dungeons, setDungeonsState] = useState<DungeonCrawl[]>([]);
  const [journalEntries, setJournalEntriesState] = useState<JournalEntry[]>([]);
  const [weeklyReviews, setWeeklyReviewsState] = useState<WeeklyReview[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('lifequest-user');
      const savedTasks = localStorage.getItem('lifequest-tasks');
      const savedBoss = localStorage.getItem('lifequest-boss');
      const savedDungeons = localStorage.getItem('lifequest-dungeons');
      const savedJournalEntries = localStorage.getItem('journalEntries');
      const savedWeeklyReviews = localStorage.getItem('weeklyReviews');
      
      const currentWeek = getWeek(new Date()).toString();
      
      let bossToLoad = null;
      if (savedBoss) {
        const parsedBoss = JSON.parse(savedBoss);
        if(parsedBoss.lastDefeated !== currentWeek) {
            bossToLoad = parsedBoss;
        }
      } 
      
      if (!bossToLoad) {
        // No boss loaded - will be handled by backend
        bossToLoad = null;
      }


      if (savedUser) setUserState(JSON.parse(savedUser, (key, value) => {
        if (['memberSince', 'lastLogin', 'lastDeletion'].includes(key) && value) return new Date(value);
        if (key === 'timestamps' && Array.isArray(value)) return value.map((ts: string) => new Date(ts));
        if (key === 'notifications' && Array.isArray(value)) {
            return value.map(n => ({...n, date: new Date(n.date)}))
        }
        return value;
      }));
      else {
        // Create default user for new users
        const defaultUser = DefaultDataService.createDefaultUser('new-user-1', '');
        setUserState(defaultUser);
      }

      if (savedTasks) setTasksState(JSON.parse(savedTasks, (key, value) => {
        if (key === 'dueDate' || key === 'lastCompleted') return value ? new Date(value) : undefined;
        return value;
      }));
      else setTasksState([]);
      
      setBossState(bossToLoad);

      if (savedDungeons) setDungeonsState(JSON.parse(savedDungeons));
      else setDungeonsState([]);

      if (savedJournalEntries) setJournalEntriesState(JSON.parse(savedJournalEntries, (key, value) => {
        if (key === 'date') return value ? new Date(value) : new Date();
        return value;
      }));
      else setJournalEntriesState([]);

      if (savedWeeklyReviews) setWeeklyReviewsState(JSON.parse(savedWeeklyReviews, (key, value) => {
        if (key === 'date') return value ? new Date(value) : new Date();
        return value;
      }));
      else setWeeklyReviewsState([]);


    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        // Create default user for error cases
        const defaultUser = DefaultDataService.createDefaultUser('new-user-1', '');
        setUserState(defaultUser);
        setTasksState([]);
        setDungeonsState([]);
        setJournalEntriesState([]);
        setWeeklyReviewsState([]);
    }
  }, []);

  const setUser = useCallback((userOrFn: User | ((prevUser: User | null) => User | null)) => {
    setUserState(currentUser => {
        const newUser = typeof userOrFn === 'function' ? userOrFn(currentUser) : userOrFn;
        if (newUser) localStorage.setItem('lifequest-user', JSON.stringify(newUser));
        return newUser;
    });
  }, []);

  const setTasks = useCallback((tasksOrFn: Task[] | ((prevTasks: Task[]) => Task[])) => {
    setTasksState(prevTasks => {
        const newTasks = typeof tasksOrFn === 'function' ? tasksOrFn(prevTasks) : tasksOrFn;
        localStorage.setItem('lifequest-tasks', JSON.stringify(newTasks));
        return newTasks;
    });
  }, []);

  const setBoss = useCallback((bossOrFn: Boss | ((prevBoss: Boss | null) => Boss | null)) => {
    setBossState(currentBoss => {
        const newBoss = typeof bossOrFn === 'function' ? bossOrFn(currentBoss) : bossOrFn;
        if (newBoss) localStorage.setItem('lifequest-boss', JSON.stringify(newBoss));
        return newBoss;
    });
  }, []);

  const setDungeons = useCallback((dungeonsOrFn: DungeonCrawl[] | ((prevDungeons: DungeonCrawl[]) => DungeonCrawl[])) => {
    setDungeonsState(prevDungeons => {
        const newDungeons = typeof dungeonsOrFn === 'function' ? dungeonsOrFn(prevDungeons) : dungeonsOrFn;
        localStorage.setItem('lifequest-dungeons', JSON.stringify(newDungeons));
        return newDungeons;
    });
  }, []);

  const setJournalEntries = useCallback((entriesOrFn: JournalEntry[] | ((prevEntries: JournalEntry[]) => JournalEntry[])) => {
    setJournalEntriesState(prevEntries => {
        const newEntries = typeof entriesOrFn === 'function' ? entriesOrFn(prevEntries) : entriesOrFn;
        localStorage.setItem('journalEntries', JSON.stringify(newEntries));
        return newEntries;
    });
  }, []);

  const setWeeklyReviews = useCallback((reviewsOrFn: WeeklyReview[] | ((prevReviews: WeeklyReview[]) => WeeklyReview[])) => {
    setWeeklyReviewsState(prevReviews => {
        const newReviews = typeof reviewsOrFn === 'function' ? reviewsOrFn(prevReviews) : reviewsOrFn;
        localStorage.setItem('weeklyReviews', JSON.stringify(newReviews));
        return newReviews;
    });
    }, []);

  const addXp = useCallback((amount: number) => {
    setUser(currentUser => {
      if (!currentUser) return currentUser;
  
      let newXp = currentUser.xp + amount;
      let newLevel = currentUser.level;
      let newXpToNextLevel = currentUser.xpToNextLevel;
      let newSkillPoints = currentUser.skillPoints;
  
      if (amount > 0) { // Gaining XP
        while (newLevel < 99 && newXp >= newXpToNextLevel) {
          const xpOver = newXp - newXpToNextLevel;
          newLevel++;
          newSkillPoints += 3; // Grant stat points on level up
          newXp = xpOver;
          newXpToNextLevel = xpForLevel(newLevel + 1);
          setTimeout(() => {
            toast({
              title: "Level Up!",
              description: `Congratulations! You've reached level ${newLevel} and earned 3 stat points!`,
            });
          }, 0);
        }
        if (newLevel >= 99) newXp = 0;
      } else { // Losing XP
         while (newXp < 0 && newLevel > 0) {
            const xpForPrevLevel = xpForLevel(newLevel);
            newXp += xpForPrevLevel;
            newLevel--;
            newSkillPoints = Math.max(0, newSkillPoints - 3);
            newXpToNextLevel = xpForPrevLevel;
          }
      }
      return {
        ...currentUser,
        xp: Math.max(0, newXp),
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        skillPoints: newSkillPoints,
      };
    });
  }, [toast, setUser]);
  
  const addCoins = useCallback((amount: number): boolean => {
    let success = false;
    setUser(currentUser => {
        if (!currentUser) return currentUser;
        
        if (amount < 0 && currentUser.coins + amount < 0) {
            setTimeout(() => toast({
                title: "Not enough coins!",
                description: "You don't have enough coins for this action.",
                variant: "destructive",
            }), 0);
            success = false;
            return currentUser;
        }

        success = true;
        return { ...currentUser, coins: currentUser.coins + amount };
    });
    return success;
  }, [toast, setUser]);

  const addGems = useCallback((amount: number): boolean => {
    let success = false;
     setUser(currentUser => {
        if (!currentUser) { success = false; return currentUser; };
        if (currentUser.gems + amount < 0) {
            setTimeout(() => toast({ title: "Not enough gems!", variant: "destructive" }), 0);
            success = false;
            return currentUser;
        }
        success = true;
        return { ...currentUser, gems: currentUser.gems + amount };
    });
    return success;
  }, [toast, setUser]);

  const handleNewDay = useCallback((currentUser: User, currentTasks: Task[]) => {
    let healthPenalty = 0;
    
    // Process debuffs
    let activeDebuffs: Debuff[] = [];
    let debuffDamage = 0;
    (currentUser.debuffs || []).forEach(debuff => {
        if (debuff.duration > 1) {
            activeDebuffs.push({ ...debuff, duration: debuff.duration - 1 });
        }
        if (debuff.effect) {
            const effect = debuff.effect(currentUser);
            if (effect.health) {
                debuffDamage += (currentUser.health - effect.health);
            }
        }
    });
    healthPenalty += debuffDamage;

    // Handle daily task resets and penalties
    const updatedTasks = currentTasks.map(task => {
        if (task.type === 'Daily' && !task.completed) {
            healthPenalty += 10;
            return { ...task, streak: 0 };
        }
        if (task.type === 'Daily' && task.completed) {
            return { ...task, completed: false };
        }
        return task;
    });
    setTasks(updatedTasks);

    let newHealth = currentUser.health - healthPenalty;
    const dailyTasksYesterday = currentTasks.filter(t => t.type === 'Daily');
    const allDailiesCompleted = dailyTasksYesterday.every(t => t.completed);

    let newStreak = (allDailiesCompleted && dailyTasksYesterday.length > 0) ? currentUser.streak + 1 : 0;

    let newUser: User = {
        ...currentUser,
        health: newHealth,
        debuffs: activeDebuffs,
        lastLogin: new Date(),
        streak: newStreak,
        longestStreak: Math.max(currentUser.longestStreak, newStreak),
    };
    
    if (newHealth <= 0) {
        const xpPenalty = 100;
        const coinPenalty = 50;
        newUser.xp = Math.max(0, newUser.xp - xpPenalty);
        newUser.coins = Math.max(0, newUser.coins - coinPenalty);
        newUser.health = newUser.maxHealth; // Restore health after penalty
        newUser.debuffs = []; // Clear debuffs on "death"
        setTimeout(() => toast({
            title: "Exhausted!",
            description: `You entered the Penalty Zone! You lost ${xpPenalty} XP and ${coinPenalty} Coins, but are now fully rested.`,
            variant: 'destructive'
        }), 0);
    }

    if (healthPenalty > 0) {
        setTimeout(() => toast({
            title: "Daily Reset",
            description: `You took ${healthPenalty} damage from missed quests and debuffs.`,
            variant: 'destructive'
        }), 0);
    }
    
    setUser(newUser);

  }, [toast, setUser, setTasks]);

  useEffect(() => {
    if (user && !isSameDay(new Date(user.lastLogin), new Date())) {
      handleNewDay(user, tasks);
    }
  }, [user, tasks, handleNewDay]);


  const getRedeemedCount = useCallback((reward: RewardItem) => {
    if (!user || !reward.redeemLimit || !reward.redeemPeriod) return 0;
    const redeemed = user.redeemedRewards.find(r => r.rewardId === reward.id);
    if (!redeemed) return 0;
    
    const now = new Date();
    let periodStart: Date;
    switch(reward.redeemPeriod) {
        case 'daily': periodStart = startOfDay(now); break;
        case 'weekly': periodStart = startOfWeek(now); break;
        case 'monthly': periodStart = startOfMonth(now); break;
        default: return 0;
    }
    return redeemed.timestamps.filter(ts => new Date(ts) >= periodStart).length;
  }, [user]);

  const redeemReward = useCallback((reward: RewardItem) => {
    if (!user) return;
    const redeemedCount = getRedeemedCount(reward);
    if (reward.redeemLimit && redeemedCount >= reward.redeemLimit) {
        setTimeout(() => toast({ title: 'Redemption Limit Reached', variant: 'destructive' }), 0);
        return;
    }
    if ((reward.gemCost && user.gems < reward.gemCost) || (reward.coinCost && user.coins < reward.coinCost)) {
        setTimeout(() => toast({ title: `Not enough ${reward.gemCost ? 'gems' : 'coins'}!`, variant: 'destructive' }), 0);
        return;
    }
    
    setUser(currentUser => {
       if (!currentUser) return null;
       const updatedUser = { ...currentUser };
       if (reward.gemCost) updatedUser.gems -= reward.gemCost;
       else if (reward.coinCost) updatedUser.coins -= reward.coinCost;
       
       if (reward.item) {
        updatedUser.inventory = [...updatedUser.inventory, reward.item];
       }

       const newRedeemedRewards = [...currentUser.redeemedRewards];
       const redeemedIndex = newRedeemedRewards.findIndex(r => r.rewardId === reward.id);
       if (redeemedIndex > -1) newRedeemedRewards[redeemedIndex].timestamps.push(new Date());
       else newRedeemedRewards.push({ rewardId: reward.id, timestamps: [new Date()] });
       updatedUser.redeemedRewards = newRedeemedRewards;
       
       return updatedUser;
    });

    if (reward.item) {
        setTimeout(() => toast({ title: 'Item Purchased!', description: `${reward.title} has been added to your inventory.`, }), 0);
    } else {
        setTimeout(() => toast({ title: 'Reward Redeemed!', }), 0);
    }
  }, [user, getRedeemedCount, toast, setUser]);

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'completed'>, silent = false) => {
    setTasks((currentTasks) => {
      const newTask: Task = { ...taskData, id: `${Date.now()}-${Math.random()}`, completed: false };
      if (!silent) setTimeout(() => toast({ title: 'Quest Added!', description: `"${newTask.title}" added to your log.` }), 0);
      return [newTask, ...currentTasks];
    });
  }, [toast, setTasks]);

  const dealBossDamage = useCallback((task: Task) => {
    if (!boss || boss.currentHp <= 0) return;
    
    const resistance = (boss.resistances && boss.resistances[task.category]) || 1.0;
    
    let baseDamage = 0;
    switch(task.difficulty) {
        case 'Easy': baseDamage = 25; break;
        case 'Medium': baseDamage = 50; break;
        case 'Hard': baseDamage = 100; break;
        default: baseDamage = 0;
    }
    
    const isWeakness = resistance < 1.0;
    const isResistance = resistance > 1.0;
    
    const damage = Math.floor(baseDamage / resistance);

    if (isWeakness) {
        setTimeout(() => toast({ title: "Critical Hit!", description: `Dealt ${damage} bonus damage!` }), 0);
    } else if (isResistance) {
        setTimeout(() => toast({ title: "Resisted!", description: `Dealt only ${damage} damage.` }), 0);
    } else {
        setTimeout(() => toast({ title: "Boss Damaged!", description: `Dealt ${damage} damage.` }), 0);
    }

    const newHp = Math.max(0, boss.currentHp - damage);

    if (newHp === 0) {
        setTimeout(() => toast({ title: "Boss Defeated!", description: `You earned ${boss.rewards.xp} XP, ${boss.rewards.coins} Coins, and ${boss.rewards.gems} Gems!`, }), 0);
        addXp(boss.rewards.xp);
        addCoins(boss.rewards.coins);
        addGems(boss.rewards.gems);
        setBoss(b => b ? ({...b, currentHp: 0, lastDefeated: getWeek(new Date()).toString()}) : null);
    } else {
        setBoss(b => b ? ({...b, currentHp: newHp}) : null);
    }
}, [boss, toast, setBoss, addXp, addCoins, addGems]);

  const updateTask = useCallback((updatedTask: Task) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id);
    setTasks(currentTasks => currentTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    if (user && (!oldTask || !oldTask.completed) && updatedTask.completed) {
      setUser(u => u ? ({ ...u, tasksCompleted: u.tasksCompleted + 1 }) : null);
      dealBossDamage(updatedTask);
    }
  }, [tasks, user, setUser, setTasks, dealBossDamage]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    setTimeout(() => toast({ title: 'Quest Deleted' }), 0);
  }, [toast, setTasks]);

    const incrementJournalDeletionCount = useCallback(() => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const now = new Date();
            const lastDeletion = currentUser.recentJournalDeletions?.lastDeletion;
            let currentCount = currentUser.recentJournalDeletions?.count || 0;
            if (lastDeletion && !isWithinInterval(new Date(lastDeletion), {start: subHours(now, 1), end: now})) currentCount = 0;
            return { ...currentUser, recentJournalDeletions: { count: currentCount + 1, lastDeletion: now } };
        })
    }, [setUser]);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
        id: `${Date.now()}-${Math.random()}`,
        date: new Date(),
        ...entry,
    };
    addXp(25);
    addCoins(5);
    setJournalEntries(prev => [newEntry, ...prev]);
    setTimeout(() => toast({ title: "Journal entry saved!", description: "You earned 25 XP and 5 Coins." }), 0);
  }, [addXp, addCoins, setJournalEntries, toast]);

  const deleteJournalEntry = useCallback((entryId: string) => {
     const entryToDelete = journalEntries.find(entry => entry.id === entryId);
      if (!entryToDelete) return;

      const isRecent = isWithinInterval(new Date(entryToDelete.date), {
          start: subHours(new Date(), 1),
          end: new Date()
      });

      if (isRecent && user) {
          const deletionCount = user.recentJournalDeletions?.count || 0;
          const penaltyMultiplier = Math.pow(2, deletionCount);
          const xpPenalty = 25 * penaltyMultiplier;
          const coinPenalty = 5 * penaltyMultiplier;

          addXp(-xpPenalty);
          addCoins(-coinPenalty);
          incrementJournalDeletionCount();

          setTimeout(() => toast({
              title: "Journal Penalty Applied",
              description: `Entry deleted within an hour. You lost ${xpPenalty} XP and ${coinPenalty} coins.`,
              variant: 'destructive',
          }), 0);
      }
      setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
  }, [journalEntries, user, addXp, addCoins, incrementJournalDeletionCount, setJournalEntries, toast]);

  const levelUpSkill = useCallback((treeName: string, skillName: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const tree = currentUser.skillTrees.find(t => t.name === treeName);
        const skill = tree?.skills.find(s => s.name === skillName);
        if (!tree || !skill || currentUser.skillPoints < skill.cost || skill.level >= skill.maxLevel) {
            setTimeout(() => toast({ title: "Cannot upgrade stat!", variant: "destructive" }), 0);
            return currentUser;
        }
        const updatedSkillTrees = currentUser.skillTrees.map(t => t.name === treeName ? { ...t, skills: t.skills.map(s => s.name === skillName ? { ...s, level: s.level + 1 } : s) } : t);
        setTimeout(() => toast({ title: "Stat Upgraded!", }), 0);
        return { ...currentUser, skillPoints: currentUser.skillPoints - skill.cost, skillTrees: updatedSkillTrees };
    });
}, [toast, setUser]);

const addDungeon = useCallback((dungeonData: Omit<DungeonCrawl, 'id' | 'completed'>) => {
    setDungeons(currentDungeons => {
        const newDungeon: DungeonCrawl = {
            ...dungeonData,
            id: `${Date.now()}-${Math.random()}`,
            completed: false,
        };
        setTimeout(() => toast({ title: "Special Quest Started!", description: `You have entered "${newDungeon.title}".` }), 0);
        return [newDungeon, ...currentDungeons];
    });
}, [toast, setDungeons]);

const updateDungeon = useCallback((updatedDungeon: DungeonCrawl) => {
    setDungeons(currentDungeons =>
        currentDungeons.map(d => d.id === updatedDungeon.id ? updatedDungeon : d)
    );
}, [setDungeons]);

const toggleChallengeCompleted = useCallback((dungeonId: string, challengeId: string) => {
    setDungeons(currentDungeons => {
        return currentDungeons.map(dungeon => {
            if (dungeon.id === dungeonId) {
                const newChallenges = dungeon.challenges.map(challenge => {
                    if (challenge.id === challengeId) {
                        return { ...challenge, completed: !challenge.completed };
                    }
                    return challenge;
                });
                return { ...dungeon, challenges: newChallenges };
            }
            return dungeon;
        });
    });
}, [setDungeons]);

const completeDungeon = useCallback((dungeonId: string) => {
    const dungeon = dungeons.find(d => d.id === dungeonId);
    if (!dungeon || dungeon.completed) return;
    
    if (!dungeon.challenges.every(c => c.completed)) {
        setTimeout(() => toast({ title: "Challenges remain!", description: "Complete all challenges to conquer the quest.", variant: "destructive" }), 0);
        return;
    }
    
    addXp(dungeon.xp);
    setTimeout(() => toast({ title: "Special Quest Conquered!", description: `You earned ${dungeon.xp} XP!`, }), 0);

    updateDungeon({ ...dungeon, completed: true });
}, [dungeons, addXp, updateDungeon, toast]);

const addWeeklyReview = useCallback((reviewData: Omit<WeeklyReview, 'id' | 'date' | 'weekNumber' | 'year'>) => {
    const now = new Date();
    const newReview: WeeklyReview = {
        ...reviewData,
        id: now.toISOString(),
        date: now,
        weekNumber: getWeek(now),
        year: getYear(now),
    };
    addXp(150);
    setWeeklyReviews(prev => [newReview, ...prev]);
    setTimeout(() => toast({ title: 'Weekly Review Complete!', description: 'You earned 150 XP for your reflection.' }), 0);
}, [addXp, setWeeklyReviews, toast]);

const addChatMessage = useCallback((message: ChatMessage) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const currentHistory = currentUser.chatHistory || [];
        const newHistory = [...currentHistory, message].slice(-50); // Keep last 50
        return { ...currentUser, chatHistory: newHistory };
    });
}, [setUser]);

const addCustomReward = useCallback((rewardData: Omit<RewardItem, 'id'| 'levelRequirement' | 'category' | 'icon'>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const newReward: RewardItem = {
            ...rewardData,
            id: `custom-${Date.now()}`,
            levelRequirement: 0,
            category: 'Custom',
            icon: Star,
        };
        const updatedCustomRewards = [...(currentUser.customRewards || []), newReward];
        return { ...currentUser, customRewards: updatedCustomRewards };
    });
    setTimeout(() => toast({ title: "Custom reward added!" }), 0);
}, [setUser, toast]);

const deleteCustomReward = useCallback((rewardId: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedCustomRewards = (currentUser.customRewards || []).filter(r => r.id !== rewardId);
        return { ...currentUser, customRewards: updatedCustomRewards };
    });
    setTimeout(() => toast({ title: "Custom reward deleted.", variant: 'destructive' }), 0);
}, [setUser, toast]);

const equipItem = useCallback((itemToEquip: Item) => {
    setUser(currentUser => {
        if (!currentUser) return null;

        const newEquipment: Equipment = { ...currentUser.equipment };
        const itemType = itemToEquip.type.toLowerCase() as keyof Equipment;

        if (itemType === 'weapon' || itemType === 'armor' || itemType === 'helmet' || itemType === 'shield') {
            newEquipment[itemType] = itemToEquip;
            setTimeout(() => toast({ title: "Item Equipped!", description: `${itemToEquip.name} has been equipped.`}), 0);
            return { ...currentUser, equipment: newEquipment };
        }
        
        return currentUser;
    });
}, [setUser, toast]);

const addNotification = useCallback((notification: Omit<Notification, 'id'|'date'|'read'>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const newNotification: Notification = {
            id: `${Date.now()}-${Math.random()}`,
            date: new Date(),
            read: false,
            ...notification,
        };
        const updatedNotifications = [newNotification, ...(currentUser.notifications || [])].slice(0, 100);
        return { ...currentUser, notifications: updatedNotifications };
    })
}, [setUser]);

const markNotificationAsRead = useCallback((notificationId: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedNotifications = currentUser.notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
        );
        return { ...currentUser, notifications: updatedNotifications };
    });
}, [setUser]);

const markAllNotificationsAsRead = useCallback(() => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedNotifications = currentUser.notifications.map(n => ({...n, read: true}));
        return { ...currentUser, notifications: updatedNotifications };
    })
}, [setUser]);

const deleteNotification = useCallback((notificationId: string) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        const updatedNotifications = currentUser.notifications.filter(n => n.id !== notificationId);
        return { ...currentUser, notifications: updatedNotifications };
    });
}, [setUser]);

const contextValue = useMemo(() => ({
    user, 
    tasks,
    boss,
    dungeons,
    journalEntries,
    weeklyReviews,
    setUser,
    setBoss,
    dealBossDamage,
    addXp, 
    addCoins, 
    redeemReward, 
    getRedeemedCount, 
    addGems,
    addTask,
    updateTask,
    deleteTask,
    addJournalEntry,
    deleteJournalEntry,
    incrementJournalDeletionCount,
    levelUpSkill,
    addDungeon,
    updateDungeon,
    toggleChallengeCompleted,
    completeDungeon,
    addWeeklyReview,
    addChatMessage,
    addCustomReward,
    deleteCustomReward,
    equipItem,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  }), [user, tasks, boss, dungeons, journalEntries, weeklyReviews, setUser, setBoss, dealBossDamage, addXp, addCoins, redeemReward, getRedeemedCount, addGems, addTask, updateTask, deleteTask, addJournalEntry, deleteJournalEntry, incrementJournalDeletionCount, levelUpSkill, addDungeon, updateDungeon, toggleChallengeCompleted, completeDungeon, addWeeklyReview, addChatMessage, addCustomReward, deleteCustomReward, equipItem, addNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
