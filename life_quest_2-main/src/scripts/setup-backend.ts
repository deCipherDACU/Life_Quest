#!/usr/bin/env tsx

/**
 * Backend Setup Script for LifeQuest RPG
 * 
 * This script initializes the Firebase backend with default data.
 * Run with: npx tsx src/scripts/setup-backend.ts
 */

import { AdminService } from '../lib/admin-service';

async function setupBackend() {
  console.log('🚀 Setting up LifeQuest Backend...\n');

  try {
    // Check if already initialized
    const isInitialized = await AdminService.isDatabaseInitialized();
    
    if (isInitialized) {
      console.log('✅ Database already initialized!');
      console.log('   If you want to reinitialize, please clear your Firestore data first.');
      return;
    }

    // Initialize database
    console.log('📊 Initializing database with default data...');
    await AdminService.initializeDatabase();

    console.log('\n✅ Backend setup completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   • Default weekly bosses');
    console.log('   • Global reward items');
    console.log('   • Database collections structure');
    
    console.log('\n🔧 Next steps:');
    console.log('   1. Set up your Firebase security rules (see BACKEND_SETUP.md)');
    console.log('   2. Configure your environment variables');
    console.log('   3. Test authentication and data sync');
    console.log('   4. Deploy to production when ready');

  } catch (error) {
    console.error('❌ Backend setup failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Check your Firebase configuration in .env.local');
    console.log('   2. Ensure Firestore is enabled in your Firebase project');
    console.log('   3. Verify your Firebase project permissions');
    console.log('   4. Check the BACKEND_SETUP.md guide for detailed instructions');
    process.exit(1);
  }
}

// Run the setup
setupBackend();