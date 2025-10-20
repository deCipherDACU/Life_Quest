import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { UserService } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, userData } = await request.json();

    switch (action) {
      case 'signin':
        const signInResult = await signInWithEmailAndPassword(auth, email, password);
        return NextResponse.json({
          success: true,
          user: {
            uid: signInResult.user.uid,
            email: signInResult.user.email,
          }
        });

      case 'signup':
        const signUpResult = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document in Firestore
        await UserService.createUser(signUpResult.user.uid, {
          email: signUpResult.user.email || email,
          name: userData?.name || 'Adventurer',
          avatarUrl: userData?.avatarUrl,
        });

        return NextResponse.json({
          success: true,
          user: {
            uid: signUpResult.user.uid,
            email: signUpResult.user.email,
          }
        });

      case 'signout':
        await signOut(auth);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}