import { NextRequest, NextResponse } from 'next/server';
import { TaskService, UserService } from '@/lib/db-service';

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { taskId, xpReward, coinReward } = await request.json();

    // Complete the task
    await TaskService.completeTask(taskId, userId);

    // Update user stats
    await UserService.updateUserStats(userId, {
      xp: xpReward,
      coins: coinReward,
      tasksCompleted: 1,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Complete task error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}