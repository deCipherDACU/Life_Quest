'use client';

import { SyncService } from './sync-service';
import { AuthService } from './auth-service';
import { MigrationService } from './migration-service';

export class BackendInitializer {
  private static initialized = false;

  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize offline detection
      SyncService.initializeOfflineDetection();

      // Set up auth state listener
      AuthService.onAuthStateChanged(async (user) => {
        if (user) {
          SyncService.setUserId(user.uid);
          
          // Check for migration
          if (MigrationService.hasLocalStorageData()) {
            await MigrationService.promptMigration(user.uid);
          }
        } else {
          SyncService.setUserId(null);
        }
      });

      this.initialized = true;
      console.log('Backend initialized successfully');
    } catch (error) {
      console.error('Failed to initialize backend:', error);
    }
  }

  static isInitialized(): boolean {
    return this.initialized;
  }
}