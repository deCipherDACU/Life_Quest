
'use client';

import { useState, useRef, useEffect } from 'react';
import PageHeader from "@/components/shared/PageHeader";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/context/UserContext';
import { Bot, Loader2, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { aiCoachChat } from '@/ai/flows/ai-coach-chat';
import { Card } from '@/components/ui/card';

export default function CoachPage() {
    const { user, tasks, weeklyReviews, addChatMessage } = useUser();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const chatHistory = user?.chatHistory || [];

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chatHistory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user) return;

        const userMessage = { role: 'user' as const, content: input };
        addChatMessage(userMessage);
        setInput('');
        setLoading(true);

        try {
            const response = await aiCoachChat({
                chatHistory: [...chatHistory, userMessage],
                mbti: user.mbti,
                recentTasks: tasks.slice(0, 5).map(t => ({ title: t.title, completed: t.completed })),
                recentReviews: weeklyReviews.slice(0, 2).map(r => ({ mood: r.mood, wins: r.wins, challenges: r.challenges }))
            });
            addChatMessage(response);
        } catch (error) {
            console.error("AI chat error:", error);
            addChatMessage({
                role: 'model',
                content: "Sorry, I'm having trouble connecting right now. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <PageHeader
                title="AI Productivity Coach"
                description="Chat with your personal coach for insights and motivation."
            />
            <Card className="flex-grow flex flex-col overflow-hidden bg-transparent">
                <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {chatHistory.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'model' && (
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                                        <Bot className="h-5 w-5" />
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-lg rounded-lg p-3 text-sm backdrop-blur-sm",
                                    message.role === 'model' 
                                        ? "bg-card/70 text-card-foreground"
                                        : "bg-primary/80 text-primary-foreground"
                                )}>
                                    <article className="prose prose-sm prose-invert max-w-none">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </article>
                                </div>
                                {message.role === 'user' && user && (
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {loading && (
                            <div className="flex items-start gap-4">
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
                                    <Bot className="h-5 w-5" />
                                </Avatar>
                                <div className="max-w-lg rounded-lg p-3 bg-card/70 text-card-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-white/10">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your coach anything..."
                            disabled={loading}
                            className="bg-black/30"
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
