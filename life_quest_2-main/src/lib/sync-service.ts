'use client';

import { TaskService, UserService } from './db-service';
import type { User, Task } from './types';
import type { FirestoreUser, FirestoreTask } from './db-schema';

export class SyncService {
  private static userId: string | null = null;
  private static isOnline = true;
  private static pendingOperations: Array<() => Promise<void>> = [];

  static setUserId(userId: string | null) {
    this.userId = userId;
  }

  static setOnlineStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    if (isOnline) {
      this.processPendingOperations();
    }
  }

  private static async processPendingOperations() {
    while (this.pendingOperations.length > 0) {
      const operation = this.pendingOperations.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.error('Failed to process pending operation:', error);
          // Re-add to queue if it fails
          this.pendingOperations.unshift(operation);
          break;
        }
      }
    }
  }

  private static addPendingOperation(operation: () => Promise<void>) {
    this.pendingOperations.push(operation);
  }

  // User operations
  static async syncUser(user: User): Promise<void> {
    if (!this.userId) return;

    const operation = async () => {
      const firestoreUser: Partial<FirestoreUser> = {
        name: user.name,
        avatarUrl: user.avatarUrl,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        health: user.health,
        maxHealth: user.maxHealth,
        coins: user.coins,
        gems: user.gems,
        skillPoints: user.skillPoints,
        equipment: {
          weapon: user.equipment.weapon?.id || null,
          armor: user.equipment.armor?.id || null,
          helmet: user.equipment.helmet?.id || null,
          shield: user.equipment.shield?.id || null,
        },
        inventory: user.inventory.map(item => item.id),
        streak: user.streak,
        longestStreak: user.longestStreak,
        tasksCompleted: user.tasksCompleted,
        completionRate: user.completionRate,
        skillTrees: user.skillTrees,
        redeemedRewards: user.redeemedRewards,
        mbti: user.mbti,
        gender: user.gender,
        lastLogin: user.lastLogin,
        customRewards: user.customRewards.map(reward => reward.id),
        notificationPreferences: user.notificationPreferences,
        preferences: user.preferences,
      };

      await UserService.updateUser(this.userId!, firestoreUser);
    };

    if (this.isOnline) {
      try {
        await operation();
      } catch (error) {
        console.error('Failed to sync user:', error);
        this.addPendingOperation(operation);
      }
    } else {
      this.addPendingOperation(operation);
    }
  }

  // Task operations
  static async createTask(task: Omit<Task, 'id'>): Promise<string | null> {
    if (!this.userId) return null;

    const firestoreTask: Omit<FirestoreTask, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      title: task.title,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      type: task.type,
      dueDate: task.dueDate,
      completed: task.completed,
      xp: task.xp,
      coins: task.coins,
      streak: task.streak,
      lastCompleted: task.lastCompleted,
      intention: task.intention,
    };

    const operation = async () => {
      return await TaskService.createTask(this.userId!, firestoreTask);
    };

    if (this.isOnline) {
      try {
        return await operation();
      } catch (error) {
        console.error('Failed to create task:', error);
        this.addPendingOperation(async () => { await operation(); });
        return null;
      }
    } else {
      this.addPendingOperation(async () => { await operation(); });
      return null;
    }
  }

  static async updateTask(task: Task): Promise<void> {
    if (!this.userId) return;

    const firestoreTask: Partial<FirestoreTask> = {
      title: task.title,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      type: task.type,
      dueDate: task.dueDate,
      completed: task.completed,
      xp: task.xp,
      coins: task.coins,
      streak: task.streak,
      lastCompleted: task.lastCompleted,
      intention: task.intention,
    };

    const operation = async () => {
      await TaskService.updateTask(task.id, firestoreTask);
    };

    if (this.isOnline) {
      try {
        await operation();
      } catch (error) {
        console.error('Failed to update task:', error);
        this.addPendingOperation(operation);
      }
    } else {
      this.addPendingOperation(operation);
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    if (!this.userId) return;

    const operation = async () => {
      await TaskService.deleteTask(taskId);
    };

    if (this.isOnline) {
      try {
        await operation();
      } catch (error) {
        console.error('Failed to delete task:', error);
        this.addPendingOperation(operation);
      }
    } else {
      this.addPendingOperation(operation);
    }
  }

  // Real-time subscriptions
  static subscribeToUserTasks(callback: (tasks: Task[]) => void): () => void {
    if (!this.userId) return () => {};

    return TaskService.subscribeToUserTasks(this.userId, (firestoreTasks) => {
      // Convert Firestore tasks to app tasks
      const tasks: Task[] = firestoreTasks.map(firestoreTask => ({
        id: firestoreTask.id,
        title: firestoreTask.title,
        description: firestoreTask.description,
        category: firestoreTask.category,
        difficulty: firestoreTask.difficulty,
        type: firestoreTask.type,
        dueDate: firestoreTask.dueDate,
        completed: firestoreTask.completed,
        xp: firestoreTask.xp,
        coins: firestoreTask.coins,
        streak: firestoreTask.streak,
        lastCompleted: firestoreTask.lastCompleted,
        intention: firestoreTask.intention,
      }));
      
      callback(tasks);
    });
  }

  static subscribeToUser(callback: (user: User | null) => void): () => void {
    if (!this.userId) return () => {};

    return UserService.subscribeToUser(this.userId, (firestoreUser) => {
      if (!firestoreUser) {
        callback(null);
        return;
      }

      // Convert Firestore user to app user
      // This is a simplified conversion - you'd need to properly map all fields
      // including equipment, inventory, etc. based on your item system
      const user: Partial<User> = {
        id: firestoreUser.id,
        name: firestoreUser.name,
        avatarUrl: firestoreUser.avatarUrl,
        level: firestoreUser.level,
        xp: firestoreUser.xp,
        xpToNextLevel: firestoreUser.xpToNextLevel,
        health: firestoreUser.health,
        maxHealth: firestoreUser.maxHealth,
        coins: firestoreUser.coins,
        gems: firestoreUser.gems,
        skillPoints: firestoreUser.skillPoints,
        streak: firestoreUser.streak,
        longestStreak: firestoreUser.longestStreak,
        tasksCompleted: firestoreUser.tasksCompleted,
        memberSince: firestoreUser.memberSince,
        completionRate: firestoreUser.completionRate,
        skillTrees: firestoreUser.skillTrees,
        redeemedRewards: firestoreUser.redeemedRewards,
        mbti: firestoreUser.mbti,
        gender: firestoreUser.gender,
        lastLogin: firestoreUser.lastLogin,
        notificationPreferences: firestoreUser.notificationPreferences,
        preferences: firestoreUser.preferences,
      };

      callback(user as User);
    });
  }

  // Offline detection
  static initializeOfflineDetection() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setOnlineStatus(true);
      });

      window.addEventListener('offline', () => {
        this.setOnlineStatus(false);
      });

      this.setOnlineStatus(navigator.onLine);
    }
  }
}