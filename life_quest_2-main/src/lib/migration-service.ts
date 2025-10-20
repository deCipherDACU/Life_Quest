'use client';

import { UserService, TaskService } from './db-service';
import type { User, Task } from './types';
import type { FirestoreUser, FirestoreTask } from './db-schema';

export class MigrationService {
  static async migrateLocalStorageToFirebase(userId: string): Promise<void> {
    try {
      // Check if user already exists in Firestore
      const existingUser = await UserService.getUser(userId);
      if (existingUser) {
        console.log('User already exists in Firestore, skipping migration');
        return;
      }

      // Migrate user data
      const savedUser = localStorage.getItem('lifequest-user');
      if (savedUser) {
        const localUser: User = JSON.parse(savedUser, (key, value) => {
          if (['memberSince', 'lastLogin', 'lastDeletion'].includes(key) && value) return new Date(value);
          if (key === 'timestamps' && Array.isArray(value)) return value.map((ts: string) => new Date(ts));
          if (key === 'notifications' && Array.isArray(value)) {
            return value.map(n => ({ ...n, date: new Date(n.date) }));
          }
          return value;
        });

        // Convert local user to Firestore format
        const firestoreUser: Partial<FirestoreUser> = {
          id: userId,
          email: '', // Will be set by auth
          name: localUser.name,
          avatarUrl: localUser.avatarUrl,
          level: localUser.level,
          xp: localUser.xp,
          xpToNextLevel: localUser.xpToNextLevel,
          health: localUser.health,
          maxHealth: localUser.maxHealth,
          coins: localUser.coins,
          gems: localUser.gems,
          skillPoints: localUser.skillPoints,
          equipment: {
            weapon: localUser.equipment.weapon?.id || null,
            armor: localUser.equipment.armor?.id || null,
            helmet: localUser.equipment.helmet?.id || null,
            shield: localUser.equipment.shield?.id || null,
          },
          inventory: localUser.inventory.map(item => item.id),
          streak: localUser.streak,
          longestStreak: localUser.longestStreak,
          tasksCompleted: localUser.tasksCompleted,
          memberSince: localUser.memberSince,
          completionRate: localUser.completionRate,
          skillTrees: localUser.skillTrees,
          redeemedRewards: localUser.redeemedRewards,
          mbti: localUser.mbti,
          gender: localUser.gender,
          lastLogin: localUser.lastLogin,
          customRewards: localUser.customRewards?.map(reward => reward.id) || [],
          notificationPreferences: localUser.notificationPreferences,
          preferences: localUser.preferences || { soundEffects: false, backgroundMusic: false },
        };

        await UserService.createUser(userId, firestoreUser);
        console.log('User data migrated successfully');
      }

      // Migrate tasks
      const savedTasks = localStorage.getItem('lifequest-tasks');
      if (savedTasks) {
        const localTasks: Task[] = JSON.parse(savedTasks, (key, value) => {
          if (key === 'dueDate' || key === 'lastCompleted') return value ? new Date(value) : undefined;
          return value;
        });

        for (const task of localTasks) {
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

          await TaskService.createTask(userId, firestoreTask);
        }
        console.log(`${localTasks.length} tasks migrated successfully`);
      }

      // Clear localStorage after successful migration
      localStorage.removeItem('lifequest-user');
      localStorage.removeItem('lifequest-tasks');
      localStorage.removeItem('lifequest-boss');
      localStorage.removeItem('lifequest-dungeons');
      localStorage.removeItem('journalEntries');
      localStorage.removeItem('weeklyReviews');

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  static hasLocalStorageData(): boolean {
    return !!(
      localStorage.getItem('lifequest-user') ||
      localStorage.getItem('lifequest-tasks')
    );
  }

  static async promptMigration(userId: string): Promise<boolean> {
    if (!this.hasLocalStorageData()) {
      return false;
    }

    const shouldMigrate = window.confirm(
      'We found existing data in your browser. Would you like to migrate it to your account? This will sync your progress across devices.'
    );

    if (shouldMigrate) {
      try {
        await this.migrateLocalStorageToFirebase(userId);
        alert('Migration completed successfully! Your data is now synced to your account.');
        return true;
      } catch (error) {
        console.error('Migration failed:', error);
        alert('Migration failed. Your local data is still available, but it won\'t sync across devices.');
        return false;
      }
    }

    return false;
  }
}