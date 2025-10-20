import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './db-schema';
import type { FirestoreBoss } from './db-schema';
import { getWeek, getYear } from 'date-fns';
import { DefaultDataService } from './default-data-service';

export class AdminService {
  // Boss management
  static async createWeeklyBoss(bossData: Omit<FirestoreBoss, 'id' | 'createdAt' | 'updatedAt' | 'weekNumber' | 'year'>): Promise<string> {
    const bossesRef = collection(db, COLLECTIONS.BOSSES);
    const bossRef = doc(bossesRef);
    const now = new Date();
    
    const boss: FirestoreBoss = {
      id: bossRef.id,
      weekNumber: getWeek(now),
      year: getYear(now),
      ...bossData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(bossRef, boss);
    return bossRef.id;
  }

  static async initializeDefaultBosses(): Promise<void> {
    const defaultBosses = [
      {
        name: 'The Procrastination Hydra',
        type: 'Aberration' as const,
        title: 'Weekly Boss',
        imageUrl: '/character1.png',
        maxHp: 2500,
        currentHp: 2500,
        timeRemaining: '7 days',
        resistances: {
          'Education': 1.5,
          'Career': 1.2,
          'Health': 0.8,
          'Mental Wellness': 0.8,
          'Finance': 1.0,
          'Social': 1.0,
          'Hobbies': 1.0,
          'Home': 1.0,
          'Reward': 1.0,
        },
        attack_pattern: [
          {
            name: "Distraction Swarm",
            description: "If any 'Hard' quest is not completed on time, you take 10 damage.",
            trigger: "On Hard quest missed",
            icon: "Skull",
          },
          {
            name: "Lethargy Poison",
            description: "If 3 or more 'Daily' quests are missed, you are afflicted with Poison, taking 5 damage per day.",
            trigger: "On 3+ dailies missed",
            icon: "Activity",
          }
        ],
        phases: [
          { name: "Phase 1: Annoyance", hpThreshold: 1500 },
          { name: "Phase 2: Desperation", hpThreshold: 500 },
          { name: "Phase 3: Final Stand", hpThreshold: 0 },
        ],
        rewards: {
          xp: 500,
          coins: 100,
          gems: 0,
        }
      },
      {
        name: 'The Gluttonous Gold Golem',
        type: 'Construct' as const,
        title: 'Weekly Boss',
        imageUrl: '/character6.png',
        maxHp: 3000,
        currentHp: 3000,
        timeRemaining: '7 days',
        resistances: {
          'Finance': 2.0,
          'Career': 1.5,
          'Social': 0.7,
          'Hobbies': 0.7,
          'Health': 1.0,
          'Education': 1.0,
          'Home': 1.0,
          'Mental Wellness': 1.0,
          'Reward': 1.0,
        },
        attack_pattern: [
          {
            name: "Coin Drain",
            description: "If any 'Finance' quest is failed, you lose 25 coins.",
            trigger: "On Finance quest missed",
            icon: "Skull",
          },
          {
            name: "Avarice Aura",
            description: "Increases the cost of all shop rewards by 20% while this boss is active.",
            trigger: "Passive",
            icon: "Activity",
          }
        ],
        phases: [
          { name: "Phase 1: Hoarding", hpThreshold: 2000 },
          { name: "Phase 2: Fortifying", hpThreshold: 800 },
          { name: "Phase 3: Golden Rage", hpThreshold: 0 },
        ],
        rewards: {
          xp: 700,
          coins: 500,
          gems: 5,
        }
      },
      {
        name: 'The Anxiety Shadow',
        type: 'Beast' as const,
        title: 'Weekly Boss',
        imageUrl: '/character1.png',
        maxHp: 2000,
        currentHp: 2000,
        timeRemaining: '7 days',
        resistances: {
          'Mental Wellness': 0.5,
          'Social': 0.8,
          'Health': 0.9,
          'Career': 1.5,
          'Education': 1.5,
          'Finance': 1.0,
          'Hobbies': 1.0,
          'Home': 1.0,
          'Reward': 1.0,
        },
        attack_pattern: [
          {
            name: "Whispers of Doubt",
            description: "If you don't complete a 'Mental Wellness' task for a day, you lose 10 health.",
            trigger: "On no Mental Wellness quest completed",
            icon: "Skull",
          },
          {
            name: "Overwhelm",
            description: "If more than 5 tasks are active at once, all tasks feel 1 level harder (no XP/coin change).",
            trigger: "On 5+ active quests",
            icon: "Activity",
          }
        ],
        phases: [
          { name: "Phase 1: Lingering Dread", hpThreshold: 1200 },
          { name: "Phase 2: Paralyzing Fear", hpThreshold: 400 },
          { name: "Phase 3: Catharsis", hpThreshold: 0 },
        ],
        rewards: {
          xp: 600,
          coins: 50,
          gems: 10,
        }
      },
    ];

    for (const bossData of defaultBosses) {
      await this.createWeeklyBoss(bossData);
    }
  }

  // Global rewards management
  static async initializeGlobalRewards(): Promise<void> {
    const globalRewards = DefaultDataService.getDefaultGlobalRewards();

    for (const rewardData of globalRewards) {
      const rewardsRef = collection(db, COLLECTIONS.REWARDS);
      const rewardRef = doc(rewardsRef);
      const now = new Date();

      await setDoc(rewardRef, {
        id: rewardRef.id,
        userId: null, // Global reward
        title: rewardData.title,
        description: rewardData.description,
        coinCost: rewardData.coinCost,
        gemCost: rewardData.gemCost,
        category: rewardData.category,
        levelRequirement: rewardData.levelRequirement,
        redeemLimit: rewardData.redeemLimit,
        redeemPeriod: rewardData.redeemPeriod,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  // Database initialization
  static async initializeDatabase(): Promise<void> {
    console.log('Initializing database with default data...');
    
    try {
      await this.initializeDefaultBosses();
      console.log('Default bosses created');
      
      await this.initializeGlobalRewards();
      console.log('Global rewards created');
      
      console.log('Database initialization completed');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Utility to check if database is initialized
  static async isDatabaseInitialized(): Promise<boolean> {
    try {
      const bossesRef = collection(db, COLLECTIONS.BOSSES);
      const bossesQuery = query(bossesRef, orderBy('createdAt', 'desc'));
      const bossesSnapshot = await getDocs(bossesQuery);
      
      return !bossesSnapshot.empty;
    } catch (error) {
      console.error('Error checking database initialization:', error);
      return false;
    }
  }
}