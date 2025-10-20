

'use client';

import { useState, useEffect } from 'react';
import { FilePlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Note } from '@/lib/types';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '@/components/ui/scroll-area';

const useNotes = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedNotes = localStorage.getItem('notes-vault');
            const parsedNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
            if (parsedNotes.length > 0) {
                setNotes(parsedNotes);
                if (!activeNoteId) {
                    setActiveNoteId(parsedNotes[0].id);
                }
            } else {
                 const demoNote: Note = {
                    id: 'welcome-note',
                    title: 'Welcome to Your Notes Vault!',
                    content: `This is your personal space to capture ideas, thoughts, and quests. Here’s a quick guide on how to use it:\n\n## Basic Formatting\n\nUse Markdown to format your text. It's simple and intuitive.\n\n- **Bold text** is written as \`**Bold text**\`\n- *Italic text* is written as \`*Italic text*\`\n- \`inline code\` is wrapped in backticks.\n\n## Headings\n\nOrganize your notes with headings.\n\n# Heading 1 (\`# Heading 1\`)\n## Heading 2 (\`## Heading 2\`)\n### Heading 3 (\`### Heading 3\`)\n\n## Lists\n\nCreate lists to keep things tidy.\n\n### Bulleted List\n- An item\n- Another item\n  - A nested item\n\n### Numbered List\n1. First item\n2. Second item\n3. Third item\n\n### To-Do List (Checkboxes)\n- [x] A completed task\n- [ ] An incomplete task\n\n## Blockquotes\n\n> To quote someone or emphasize a block of text, use the > symbol. It's great for highlighting important information.\n\n## Code Blocks\n\nShowcase your code with syntax highlighting. Just wrap it in triple backticks.\n\n\`\`\`javascript\nfunction greet() {\n  console.log("Hello, World!");\n}\n\`\`\`\n\n## Getting Started\n\n1.  **Create a new note** using the '+' icon in the top left.\n2.  **Select a note** from the list to start editing.\n3.  **Your work is saved automatically** as you type!\n\nHappy note-taking!`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    tags: ['welcome', 'guide'],
                };
                setNotes([demoNote]);
                setActiveNoteId(demoNote.id);
            }
        } catch (error) {
            console.error("Failed to load notes from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            if (notes.length > 0) {
                localStorage.setItem('notes-vault', JSON.stringify(notes));
            }
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
    }, [notes]);

    const createNote = () => {
        const newNote: Note = {
            id: new Date().toISOString(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: [],
        };
        setNotes(prev => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
    };

    const updateNote = (id: string, content: string, title?: string) => {
        setNotes(prev => prev.map(note =>
            note.id === id ? {
                ...note,
                title: title !== undefined ? title : note.title,
                content,
                updatedAt: new Date().toISOString()
            } : note
        ));
    };

    const activeNote = notes.find(note => note.id === activeNoteId);

    return { notes, activeNote, setActiveNoteId, createNote, updateNote };
}

export default function NotesPage() {
    const { notes, activeNote, setActiveNoteId, createNote, updateNote } = useNotes();
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');

    useEffect(() => {
        if (activeNote) {
            setNoteContent(activeNote.content);
            setNoteTitle(activeNote.title);
        } else {
            setNoteContent('');
            setNoteTitle('');
        }
    }, [activeNote]);

    useEffect(() => {
        if (!activeNote) return;

        const handler = setTimeout(() => {
             if (noteContent !== activeNote.content || noteTitle !== activeNote.title) {
                updateNote(activeNote.id, noteContent, noteTitle);
             }
        }, 500); // Debounce save

        return () => {
            clearTimeout(handler);
        };
    }, [noteContent, noteTitle, activeNote, updateNote]);

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] bg-card rounded-lg overflow-hidden">
            {/* File Explorer */}
            <div className="w-full md:w-1/4 md:min-w-[250px] border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-bold font-headline text-lg">Notes Vault</h2>
                    <Button variant="ghost" size="icon" onClick={createNote}>
                        <FilePlus className="h-5 w-5" />
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-3 cursor-pointer border-l-4 ${activeNote?.id === note.id ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-white/5'}`}
                        >
                            <h3 className="font-semibold truncate">{note.title}</h3>
                            <p className="text-xs text-muted-foreground">{format(new Date(note.updatedAt), 'PPp')}</p>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Editor & Preview */}
            <div className="flex-1 flex flex-col">
                {activeNote ? (
                    <>
                        <div className="p-2 border-b border-white/10">
                            <Input
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                className="text-xl font-bold font-headline border-none focus-visible:ring-0 bg-transparent h-auto"
                                placeholder="Note Title"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 h-full overflow-hidden">
                            <Textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="Start writing..."
                                className="flex-1 w-full h-full p-4 text-base bg-transparent border-r border-white/10 rounded-none resize-none focus-visible:ring-0"
                            />
                             <ScrollArea className="h-full hidden md:block">
                                <article className="prose dark:prose-invert p-4">
                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {noteContent}
                                    </ReactMarkdown>
                                </article>
                             </ScrollArea>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <FileText className="h-16 w-16 mb-4" />
                        <h2 className="text-xl font-semibold">Select a note to view</h2>
                        <p>Or create a new one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
