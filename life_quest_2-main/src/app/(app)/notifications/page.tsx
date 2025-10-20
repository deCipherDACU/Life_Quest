
'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check, Loader2, Trash2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { generatePersonalizedNotifications } from '@/ai/flows/personalized-notifications';
import { useToast } from '@/hooks/use-toast';
import type { Notification as NotificationType } from '@/lib/types';

export default function NotificationsPage() {
  const { user, tasks, weeklyReviews, addNotification, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useUser();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await generatePersonalizedNotifications({
        mbti: user.mbti,
        level: user.level,
        health: user.health,
        gold: user.coins,
        incompleteTasks: tasks.filter(t => !t.completed).map(t => t.title),
        streak: user.streak,
        mood: weeklyReviews[0]?.mood,
        style: user.notificationPreferences.style,
      });

      result.notifications.forEach(notification => {
        addNotification(notification);
      });

      toast({
        title: "Notifications Generated",
        description: `${result.notifications.length} new notifications have been created for you.`,
      });

    } catch (error) {
      console.error("Failed to generate notifications", error);
      toast({
        title: "Error",
        description: "Could not generate notifications at this time.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  
  const notifications = user?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`You have ${unreadCount} unread notifications.`}
        actions={
            <Button onClick={markAllNotificationsAsRead} variant="outline" disabled={unreadCount === 0}>
                <Check className="mr-2 h-4 w-4" />
                Mark All as Read
            </Button>
        }
      />
      <Card>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-border">
              {notifications.map((notification: NotificationType) => {
                const Wrapper = notification.path ? Link : 'div';
                return (
                  <li key={notification.id} className="relative group">
                     <Wrapper
                        href={notification.path || '#'}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={cn(
                        "flex items-start gap-4 p-4 transition-colors hover:bg-secondary",
                        !notification.read && "bg-primary/10"
                      )}>
                        <div className={cn("h-2.5 w-2.5 rounded-full mt-1.5", !notification.read && "bg-primary")} />
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.message}</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                            </p>
                        </div>
                    </Wrapper>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4" />
              <h3 className="font-semibold">No notifications</h3>
              <p className="text-sm">Your new notifications will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
