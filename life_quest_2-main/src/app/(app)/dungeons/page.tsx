
'use client';

import { useState, useMemo, lazy, Suspense } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { DungeonCrawlItem } from '@/components/dungeons/DungeonCrawlItem';

const CreateDungeonDialog = lazy(() => import('@/components/dungeons/CreateDungeonDialog').then(module => ({ default: module.CreateDungeonDialog })));


export default function DungeonsPage() {
  const { dungeons } = useUser();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { activeDungeons, conqueredDungeons } = useMemo(() => {
    const active = dungeons.filter(d => !d.completed);
    const conquered = dungeons.filter(d => d.completed);
    return { activeDungeons: active, conqueredDungeons: conquered };
  }, [dungeons]);

  return (
    <>
      <PageHeader
        title="Special Quests"
        description="Conquer multi-task challenges for epic rewards."
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Special Quest
          </Button>
        }
      />
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="active">Active ({activeDungeons.length})</TabsTrigger>
          <TabsTrigger value="conquered">Conquered ({conqueredDungeons.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <div className="space-y-4">
            {activeDungeons.length > 0 ? (
              activeDungeons.map(dungeon => (
                <DungeonCrawlItem key={dungeon.id} dungeon={dungeon} />
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground rounded-lg bg-card">
                <p className="font-semibold text-lg">No active special quests!</p>
                <p>Start a new special quest to begin your adventure.</p>
                 <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    New Special Quest
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="conquered" className="mt-4">
           <div className="space-y-4">
            {conqueredDungeons.length > 0 ? (
              conqueredDungeons.map(dungeon => (
                <DungeonCrawlItem key={dungeon.id} dungeon={dungeon} />
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground rounded-lg bg-card">
                <p className="font-semibold text-lg">No quests conquered yet.</p>
                <p>Complete an active quest to see it here.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <Suspense fallback={<div/>}>
        {isCreateDialogOpen && <CreateDungeonDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />}
      </Suspense>
    </>
  );
}
