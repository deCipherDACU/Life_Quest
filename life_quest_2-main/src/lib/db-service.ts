import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, type FirestoreUser, type FirestoreTask, type FirestoreBoss } from './db-schema';
import type { User, Task, Boss } from './types';

// User operations
export class UserService {
  static async createUser(userId: string, userData: Partial<FirestoreUser>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const now = new Date();
    
    const defaultUser: FirestoreUser = {
      id: userId,
      email: userData.email || '',
      name: userData.name || 'Adventurer',
      avatarUrl: userData.avatarUrl || 'https://picsum.photos/seed/avatar-placeholder/200/200',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      health: 100,
      maxHealth: 100,
      coins: 50,
      gems: 5,
      skillPoints: 5,
      equipment: {
        weapon: null,
        armor: null,
        helmet: null,
        shield: null,
      },
      inventory: [],
      streak: 0,
      longestStreak: 0,
      tasksCompleted: 0,
      memberSince: now,
      completionRate: 0,
      skillTrees: [],
      redeemedRewards: [],
      mbti: undefined,
      gender: 'prefer-not-to-say',
      lastLogin: now,
      customRewards: [],
      notificationPreferences: {
        reminder: true,
        motivation: true,
        achievement: true,
        health_warning: true,
        streak_reminder: true,
        daily_check_in: true,
        ai_personalization: true,
        style: 'random',
      },
      preferences: {
        soundEffects: false,
        backgroundMusic: false,
      },
      createdAt: now,
      updatedAt: now,
      ...userData,
    };

    await setDoc(userRef, defaultUser);
  }

  static async getUser(userId: string): Promise<FirestoreUser | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data() as FirestoreUser;
      // Convert Firestore Timestamps to Dates
      return {
        ...data,
        memberSince: data.memberSince instanceof Timestamp ? data.memberSince.toDate() : data.memberSince,
        lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : data.lastLogin,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      };
    }
    
    return null;
  }

  static async updateUser(userId: string, updates: Partial<FirestoreUser>): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async updateUserStats(userId: string, stats: {
    xp?: number;
    coins?: number;
    gems?: number;
    level?: number;
    tasksCompleted?: number;
    streak?: number;
    health?: number;
  }): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const updates: any = { updatedAt: new Date() };
    
    if (stats.xp !== undefined) updates.xp = increment(stats.xp);
    if (stats.coins !== undefined) updates.coins = increment(stats.coins);
    if (stats.gems !== undefined) updates.gems = increment(stats.gems);
    if (stats.level !== undefined) updates.level = stats.level;
    if (stats.tasksCompleted !== undefined) updates.tasksCompleted = increment(stats.tasksCompleted);
    if (stats.streak !== undefined) updates.streak = stats.streak;
    if (stats.health !== undefined) updates.health = stats.health;

    await updateDoc(userRef, updates);
  }

  static subscribeToUser(userId: string, callback: (user: FirestoreUser | null) => void): () => void {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as FirestoreUser;
        callback({
          ...data,
          memberSince: data.memberSince instanceof Timestamp ? data.memberSince.toDate() : data.memberSince,
          lastLogin: data.lastLogin instanceof Timestamp ? data.lastLogin.toDate() : data.lastLogin,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        });
      } else {
        callback(null);
      }
    });
  }
}

// Task operations
export class TaskService {
  static async createTask(userId: string, taskData: Omit<FirestoreTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const tasksRef = collection(db, COLLECTIONS.TASKS);
    const taskRef = doc(tasksRef);
    const now = new Date();
    
    const task: FirestoreTask = {
      id: taskRef.id,
      userId,
      ...taskData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(taskRef, task);
    return taskRef.id;
  }

  static async getUserTasks(userId: string): Promise<FirestoreTask[]> {
    const tasksRef = collection(db, COLLECTIONS.TASKS);
    const q = query(
      tasksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as FirestoreTask;
      return {
        ...data,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : data.dueDate,
        lastCompleted: data.lastCompleted instanceof Timestamp ? data.lastCompleted.toDate() : data.lastCompleted,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  }

  static async updateTask(taskId: string, updates: Partial<FirestoreTask>): Promise<void> {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    await deleteDoc(taskRef);
  }

  static async completeTask(taskId: string, userId: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Update task
    const taskRef = doc(db, COLLECTIONS.TASKS, taskId);
    batch.update(taskRef, {
      completed: true,
      lastCompleted: new Date(),
      updatedAt: new Date(),
    });

    // Update user stats (this will be handled by the client for now)
    await batch.commit();
  }

  static subscribeToUserTasks(userId: string, callback: (tasks: FirestoreTask[]) => void): () => void {
    const tasksRef = collection(db, COLLECTIONS.TASKS);
    const q = query(
      tasksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreTask;
        return {
          ...data,
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : data.dueDate,
          lastCompleted: data.lastCompleted instanceof Timestamp ? data.lastCompleted.toDate() : data.lastCompleted,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        };
      });
      callback(tasks);
    });
  }
}

// Boss operations
export class BossService {
  static async getCurrentBoss(): Promise<FirestoreBoss | null> {
    const bossesRef = collection(db, COLLECTIONS.BOSSES);
    const q = query(
      bossesRef,
      orderBy('createdAt', 'desc'),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    const data = doc.data() as FirestoreBoss;
    return {
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    };
  }

  static async updateBoss(bossId: string, updates: Partial<FirestoreBoss>): Promise<void> {
    const bossRef = doc(db, COLLECTIONS.BOSSES, bossId);
    await updateDoc(bossRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  static async dealDamage(bossId: string, damage: number): Promise<void> {
    const bossRef = doc(db, COLLECTIONS.BOSSES, bossId);
    await updateDoc(bossRef, {
      currentHp: increment(-damage),
      updatedAt: new Date(),
    });
  }

  static subscribeToBoss(bossId: string, callback: (boss: FirestoreBoss | null) => void): () => void {
    const bossRef = doc(db, COLLECTIONS.BOSSES, bossId);
    return onSnapshot(bossRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as FirestoreBoss;
        callback({
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        });
      } else {
        callback(null);
      }
    });
  }
}

// Utility functions
export const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date(timestamp);
};

export const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};