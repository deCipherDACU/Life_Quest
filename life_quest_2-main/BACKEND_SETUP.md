# LifeQuest Backend Setup Guide

This guide will help you set up the complete backend infrastructure for the LifeQuest RPG application.

## Architecture Overview

The backend consists of:
- **Firebase Authentication** - User authentication and session management
- **Firestore Database** - Real-time NoSQL database for all game data
- **Firebase Storage** - File storage for avatars, images, and audio
- **Next.js API Routes** - Server-side API endpoints
- **Real-time Sync** - Live data synchronization across devices
- **Offline Support** - Local storage fallback with sync when online

## Prerequisites

1. Node.js 18+ installed
2. A Firebase project
3. Google AI API key (for Genkit features)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Optionally enable other providers (Google, GitHub, etc.)

### 3. Set up Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll secure it later)
4. Select a location close to your users
5. Click **Done**

### 4. Configure Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select the same location as your Firestore

### 5. Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click **Add app** and select **Web**
4. Register your app with a nickname
5. Copy the configuration object

## Environment Setup

### 1. Create Environment File

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Fill in Firebase Configuration

Update `.env.local` with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google AI (for Genkit)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

### 3. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

## Database Schema

The backend uses the following Firestore collections:

### Collections Structure

```
/users/{userId}
  - User profile data, stats, preferences
  
/tasks/{taskId}
  - User tasks with userId reference
  
/bosses/{bossId}
  - Weekly boss data
  
/journalEntries/{entryId}
  - Journal entries with userId reference
  
/weeklyReviews/{reviewId}
  - Weekly review data with userId reference
  
/dungeons/{dungeonId}
  - Special quest data with userId reference
  
/notifications/{notificationId}
  - User notifications with userId reference
  
/rewards/{rewardId}
  - Custom rewards with userId reference
  
/userStats/{statId}
  - Daily user statistics
```

## Security Rules

### Firestore Security Rules

Add these rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /journalEntries/{entryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /weeklyReviews/{reviewId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /dungeons/{dungeonId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    match /rewards/{rewardId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource.data.userId == null || request.auth.uid == resource.data.userId);
      allow create: if request.auth != null && 
        (request.resource.data.userId == null || request.auth.uid == request.resource.data.userId);
    }
    
    // Bosses are readable by all authenticated users
    match /bosses/{bossId} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write bosses
    }
    
    match /userStats/{statId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Storage Security Rules

Add these rules to Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Integration with Existing Code

### 1. Update Layout to Include Auth Provider

Update `src/app/layout.tsx`:

```tsx
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Initialize Backend in App

Update your main app component to initialize the backend:

```tsx
import { useEffect } from 'react';
import { BackendInitializer } from '@/lib/backend-init';

export default function App() {
  useEffect(() => {
    BackendInitializer.initialize();
  }, []);

  // ... rest of your app
}
```

### 3. Add Authentication UI

You can use the provided `AuthModal` component or create your own authentication flow.

## Data Migration

The backend includes automatic migration from localStorage to Firebase:

1. When a user signs in for the first time, the system checks for existing localStorage data
2. If found, it prompts the user to migrate their data
3. All tasks, user progress, and settings are transferred to Firebase
4. localStorage is cleared after successful migration

## API Endpoints

The backend provides these API endpoints:

- `POST /api/auth` - Authentication (signin, signup, signout)
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `PATCH /api/user` - Update user stats
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks` - Update task
- `DELETE /api/tasks` - Delete task
- `POST /api/tasks/complete` - Complete task with rewards
- `GET /api/boss` - Get current boss
- `POST /api/boss` - Deal damage to boss

## Real-time Features

The backend supports real-time synchronization:

- **Live Updates**: Changes sync instantly across all user devices
- **Offline Support**: App works offline and syncs when connection returns
- **Conflict Resolution**: Automatic handling of data conflicts
- **Background Sync**: Pending operations execute when back online

## Testing

### 1. Test Authentication

1. Start the development server: `npm run dev`
2. Open the app and try signing up with a new account
3. Check Firebase Console to see the new user
4. Try signing in and out

### 2. Test Data Sync

1. Create some tasks while online
2. Check Firestore Console to see the data
3. Go offline and create more tasks
4. Go back online and verify sync

### 3. Test Migration

1. Use the app without authentication to create local data
2. Sign up for a new account
3. Verify migration prompt appears
4. Check that data transfers correctly

## Deployment

### 1. Production Environment

Create `.env.production`:

```env
NODE_ENV=production
# Add your production Firebase config
```

### 2. Build and Deploy

```bash
npm run build
npm start
```

### 3. Firebase Hosting (Optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Monitoring and Analytics

### 1. Firebase Analytics

Enable Analytics in Firebase Console to track:
- User engagement
- Feature usage
- Performance metrics

### 2. Error Monitoring

Consider adding error monitoring:
- Sentry for error tracking
- Firebase Crashlytics for crash reports

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Firebase config in `.env.local`
   - Verify authentication is enabled in Firebase Console
   - Check browser console for errors

2. **Data not syncing**
   - Verify Firestore rules are set correctly
   - Check network connectivity
   - Look for errors in browser console

3. **Migration failing**
   - Check localStorage data format
   - Verify user has proper permissions
   - Check Firestore write permissions

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Test with a fresh user account
4. Check Firestore security rules

The backend is now fully configured and ready to power your LifeQuest RPG application with real-time synchronization, offline support, and scalable cloud infrastructure!