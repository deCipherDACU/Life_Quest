
'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/context/UserContext';
import { getWeek, getYear } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Loader2, Wand2, Lightbulb, TrendingUp, Target } from 'lucide-react';
import { weeklyReviewInsights, WeeklyReviewInsightsOutput } from '@/ai/flows/weekly-review-insights';
import { useToast } from '@/hooks/use-toast';
import type { WeeklyReview } from '@/lib/types';

type FormValues = Omit<WeeklyReview, 'id' | 'date' | 'weekNumber' | 'year'>;

const moods: FormValues['mood'][] = ['Great', 'Good', 'Okay', 'Bad', 'Awful'];
const moodEmoji: Record<FormValues['mood'], string> = {
    'Great': '😄',
    'Good': '😊',
    'Okay': '😐',
    'Bad': '😟',
    'Awful': '😭',
};

export default function WeeklyReviewPage() {
    const { user, weeklyReviews, addWeeklyReview } = useUser();
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>();
    const { toast } = useToast();

    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiInsights, setAiInsights] = useState<WeeklyReviewInsightsOutput | null>(null);

    const currentWeekNumber = getWeek(new Date());
    const currentYear = getYear(new Date());
    const hasCompletedThisWeek = weeklyReviews.some(
        review => review.weekNumber === currentWeekNumber && review.year === currentYear
    );

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        addWeeklyReview(data);
    };

    const handleGetInsights = async () => {
        if (weeklyReviews.length < 2) {
            toast({
                title: "Not Enough Data",
                description: "Complete at least two weekly reviews to generate AI insights.",
                variant: "destructive"
            });
            return;
        }
        setIsAiLoading(true);
        setAiInsights(null);
        try {
            const result = await weeklyReviewInsights({ reviews: weeklyReviews });
            setAiInsights(result);
        } catch (error) {
            console.error("Failed to get AI insights", error);
            toast({
                title: "Error",
                description: "Could not generate AI insights at this time.",
                variant: "destructive"
            });
        }
        setIsAiLoading(false);
    }

    return (
        <>
            <PageHeader
                title="Weekly Review"
                description="Reflect on your week to build momentum for the next one."
            />
            <Tabs defaultValue="current">
                <TabsList className="grid w-full grid-cols-3 max-w-lg">
                    <TabsTrigger value="current">This Week</TabsTrigger>
                    <TabsTrigger value="past">Past Reviews</TabsTrigger>
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>
                <TabsContent value="current" className="mt-4">
                    {hasCompletedThisWeek ? (
                        <Alert>
                            <AlertTitle className="font-headline">Review Complete!</AlertTitle>
                            <AlertDescription>
                                You've already completed your review for this week. Great job! Check back next week.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Review for Week {currentWeekNumber}, {currentYear}</CardTitle>
                                <CardDescription>Completing this review will grant you 150 XP.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="wins">What were your biggest wins this week?</Label>
                                        <Textarea id="wins" {...register('wins', { required: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="challenges">What were the biggest challenges?</Label>
                                        <Textarea id="challenges" {...register('challenges', { required: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="learnings">What did you learn?</Label>
                                        <Textarea id="learnings" {...register('learnings', { required: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nextWeekGoals">What are your main goals for next week?</Label>
                                        <Textarea id="nextWeekGoals" {...register('nextWeekGoals', { required: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Overall, how was your week?</Label>
                                        <Controller
                                            name="mood"
                                            control={control}
                                            defaultValue="Okay"
                                            render={({ field }) => (
                                                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-2">
                                                    {moods.map(mood => (
                                                        <Label key={mood} className="flex-1 min-w-[80px] text-center cursor-pointer rounded-md border-2 border-muted bg-transparent p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                                            <RadioGroupItem value={mood} className="sr-only" />
                                                            <span className="text-2xl">{moodEmoji[mood]}</span>
                                                            <span className="block mt-1 text-sm font-medium">{mood}</span>
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit">Complete Review & Claim XP</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    )}
                </TabsContent>
                <TabsContent value="past" className="mt-4">
                    <div className="space-y-4">
                        {weeklyReviews.length > 0 ? (
                            weeklyReviews.map(review => (
                                <Card key={review.id}>
                                    <CardHeader>
                                        <CardTitle className="font-headline text-lg flex justify-between">
                                            <span>Week {review.weekNumber}, {review.year} <span className="text-muted-foreground">({format(new Date(review.date), 'PP')})</span></span>
                                            <span title={review.mood}>{moodEmoji[review.mood]}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div><h4 className="font-semibold">Wins:</h4><p className="text-muted-foreground text-sm">{review.wins}</p></div>
                                        <div><h4 className="font-semibold">Challenges:</h4><p className="text-muted-foreground text-sm">{review.challenges}</p></div>
                                        <div><h4 className="font-semibold">Learnings:</h4><p className="text-muted-foreground text-sm">{review.learnings}</p></div>
                                        <div><h4 className="font-semibold">Next Week's Goals:</h4><p className="text-muted-foreground text-sm">{review.nextWeekGoals}</p></div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No past reviews yet.</p>
                        )}
                    </div>
                </TabsContent>
                 <TabsContent value="insights" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">AI-Powered Insights</CardTitle>
                            <CardDescription>Generate insights from your past reviews to identify patterns and opportunities for growth.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isAiLoading && <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                            
                            {!isAiLoading && aiInsights && (
                                <div className="space-y-6">
                                     <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/20 rounded-md"><Lightbulb className="h-6 w-6 text-primary" /></div>
                                        <div>
                                            <h4 className="font-semibold font-headline">Key Observation</h4>
                                            <p className="text-muted-foreground">{aiInsights.keyObservation}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/20 rounded-md"><Target className="h-6 w-6 text-primary" /></div>
                                        <div>
                                            <h4 className="font-semibold font-headline">Actionable Suggestion</h4>
                                            <p className="text-muted-foreground">{aiInsights.actionableSuggestion}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-start gap-4">
                                        <div className="p-2 bg-primary/20 rounded-md"><TrendingUp className="h-6 w-6 text-primary" /></div>
                                        <div>
                                            <h4 className="font-semibold font-headline">Emerging Theme</h4>
                                            <p className="text-muted-foreground">{aiInsights.emergingTheme}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isAiLoading && !aiInsights && (
                                 <div className="text-center text-muted-foreground py-8">
                                    <p>Complete at least two reviews to generate insights.</p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleGetInsights} disabled={isAiLoading || weeklyReviews.length < 2}>
                                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                {aiInsights ? "Regenerate Insights" : "Generate Insights"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
