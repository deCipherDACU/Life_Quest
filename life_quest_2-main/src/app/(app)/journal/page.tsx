'use client';

import { useState } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { JournalEditor } from '@/components/journal/JournalEditor';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import type { JournalEntry } from '@/lib/types';
import { Trash2, FileText, ImageIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '@/context/UserContext';

export default function JournalPage() {
    const { journalEntries, addJournalEntry, deleteJournalEntry } = useUser();

    return (
        <>
            <PageHeader
                title="Advanced Journal"
                description="Capture your thoughts, ideas, and memories. Use text, voice, or images."
            />

            <JournalEditor onSave={addJournalEntry} />

            <div className="mt-8">
                <h2 className="text-2xl font-headline font-bold mb-4">Your Entries</h2>
                <div className="space-y-4">
                    {journalEntries.length > 0 ? (
                        journalEntries.map(entry => (
                            <Card key={entry.id}>
                                <CardHeader className="flex-row justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-headline">{format(new Date(entry.date), 'PPPP p')}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            {entry.text && <Badge variant="secondary"><FileText className="mr-1 h-3 w-3" /> Text</Badge>}
                                            {entry.imageUrl && <Badge variant="secondary"><ImageIcon className="mr-1 h-3 w-3" /> Image</Badge>}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {entry.text && <p className="whitespace-pre-wrap">{entry.text}</p>}
                                    {entry.imageUrl && (
                                        <div className="relative w-full max-w-sm h-64 rounded-lg overflow-hidden">
                                            <Image src={entry.imageUrl} alt="Journal entry" layout="fill" objectFit="contain" />
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this journal entry. Deleting recent entries may incur a penalty.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteJournalEntry(entry.id)}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-8">Your journal is empty. Add your first entry!</p>
                    )}
                </div>
            </div>
        </>
    );
}
