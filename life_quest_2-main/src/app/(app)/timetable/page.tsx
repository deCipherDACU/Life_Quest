
'use client';

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Brain, LayoutGrid, Kanban, Save, Trash2 } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { smartTimetableGeneration, SmartTimetableInput, SmartTimetableOutput } from "@/ai/flows/smart-timetable-generation";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mbtiTypes } from "@/components/welcome/shared";
import NotionTable from "@/components/timetable/NotionTable";
import type { NotionTableData } from "@/components/timetable/NotionTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/timetable/KanbanBoard";
import type { KanbanData } from "@/components/timetable/KanbanBoard";
import { Separator } from "@/components/ui/separator";

type FormValues = Omit<SmartTimetableInput, 'availableHours'> & {
    dayStart: string;
    dayEnd: string;
};

type ScheduleItem = SmartTimetableOutput['schedule'][0];

type Preset = {
    name: string;
    values: FormValues;
    schedule: ScheduleItem[] | null;
};


const scheduleToNotionTableData = (schedule: ScheduleItem[]): NotionTableData => {
    if (!schedule || !Array.isArray(schedule)) {
        return { columns: [], rows: [] };
    }
    const columns = [
        { id: 'time', name: 'Time', type: 'text' as const },
        { id: 'task', name: 'Task', type: 'text' as const },
        { id: 'category', name: 'Category', type: 'select' as const, options: ['Education', 'Career', 'Health', 'Mental Wellness', 'Finance', 'Social', 'Hobbies', 'Home', 'Break', 'Commitment'] },
        { id: 'difficulty', name: 'Difficulty', type: 'select' as const, options: ['Easy', 'Medium', 'Hard', 'N/A'] },
    ];

    const rows = schedule.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        values: {
            time: item.time,
            task: item.task,
            category: item.category,
            difficulty: item.difficulty,
        }
    }));

    return { columns, rows };
}

const scheduleToKanbanData = (schedule: ScheduleItem[]): KanbanData => {
    if (!schedule || !Array.isArray(schedule)) {
        return { columns: [] };
    }

    const columnOrder: Array<ScheduleItem['category']> = ['Education', 'Career', 'Health', 'Mental Wellness', 'Finance', 'Social', 'Hobbies', 'Home', 'Break', 'Commitment'];
    
    const columns = columnOrder.map(category => ({
        id: category,
        title: category,
        cards: schedule
            .filter(item => item.category === category)
            .map(item => ({
                id: item.time,
                title: item.task,
                description: item.time,
                difficulty: item.difficulty,
            }))
    })).filter(col => col.cards.length > 0);

    return { columns };
}


export default function TimetablePage() {
    const { user } = useUser();
    const { toast } = useToast();
    const { register, handleSubmit, control, formState: { errors }, reset, getValues } = useForm<FormValues>({
        defaultValues: {
            dayStart: '09:00',
            dayEnd: '22:00',
            breakPreferences: '15-minute breaks every 2 hours, 1-hour lunch break',
            fixedCommitments: 'Class from 10 AM - 11:30 AM, Team meeting at 2 PM',
            tasksToSchedule: 'Study for exam, Work on project, Go to the gym, Read a book',
            chronotype: 'morning',
            workStyle: 'hybrid',
            mbti: user?.mbti
        }
    });
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [presetName, setPresetName] = useState("");

    useEffect(() => {
        try {
            const savedScheduleRaw = localStorage.getItem('timetable-schedule');
            if (savedScheduleRaw) {
                const savedData = JSON.parse(savedScheduleRaw);
                // Handle both old (object) and new (array) format
                if (Array.isArray(savedData)) {
                    setSchedule(savedData);
                } else if (savedData && Array.isArray(savedData.schedule)) {
                    setSchedule(savedData.schedule);
                }
            }
            const savedPresets = localStorage.getItem('timetable-presets');
            if (savedPresets) {
                setPresets(JSON.parse(savedPresets));
            }
        } catch (error) {
            console.error("Failed to load data from local storage", error);
        }
    }, []);

    const tableData = useMemo(() => schedule ? scheduleToNotionTableData(schedule) : null, [schedule]);
    const kanbanData = useMemo(() => schedule ? scheduleToKanbanData(schedule) : null, [schedule]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        setSchedule(null);
        
        const formatTime = (time: string) => {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10));
            date.setMinutes(parseInt(minutes, 10));
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        };
        
        const availableHours = `${formatTime(data.dayStart)} - ${formatTime(data.dayEnd)}`;

        try {
            const result = await smartTimetableGeneration({ ...data, availableHours });
            if (result && result.schedule) {
                setSchedule(result.schedule);
                localStorage.setItem('timetable-schedule', JSON.stringify(result.schedule));
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to generate schedule. Please try again.",
                variant: "destructive"
            });
        }
        setLoading(false);
    };

    const savePreset = () => {
        if (!presetName.trim()) {
            toast({ title: "Preset name cannot be empty", variant: "destructive"});
            return;
        }
        const newPreset: Preset = {
            name: presetName,
            values: getValues(),
            schedule: schedule
        };
        const updatedPresets = [...presets.filter(p => p.name !== presetName), newPreset];
        setPresets(updatedPresets);
        localStorage.setItem('timetable-presets', JSON.stringify(updatedPresets));
        setPresetName("");
        toast({ title: `Preset "${presetName}" saved!`});
    };

    const loadPreset = (name: string) => {
        const preset = presets.find(p => p.name === name);
        if (preset) {
            reset(preset.values);
            setSchedule(preset.schedule);
            if (preset.schedule) {
                localStorage.setItem('timetable-schedule', JSON.stringify(preset.schedule));
            }
            toast({ title: `Preset "${name}" loaded!`});
        }
    };
    
    const deletePreset = (name: string) => {
        const updatedPresets = presets.filter(p => p.name !== name);
        setPresets(updatedPresets);
        localStorage.setItem('timetable-presets', JSON.stringify(updatedPresets));
        toast({ title: `Preset "${name}" deleted.`, variant: "destructive"});
    };

    return (
        <>
            <PageHeader
                title="Smart Timetable Generator"
                description="Let our AI craft the perfect, optimized schedule for your day."
            />
            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="font-headline">Your Preferences</CardTitle>
                        <CardDescription>Provide details for the AI to generate your schedule.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dayStart" className="text-accent">Day Start</Label>
                                    <Input id="dayStart" type="time" {...register("dayStart", { required: true })} className="[color-scheme:dark]" style={{ accentColor: 'hsl(var(--accent))' }} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="dayEnd" className="text-accent">Day End</Label>
                                    <Input id="dayEnd" type="time" {...register("dayEnd", { required: true })} className="[color-scheme:dark]" style={{ accentColor: 'hsl(var(--accent))' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tasksToSchedule">Tasks to Schedule</Label>
                                <Textarea id="tasksToSchedule" {...register("tasksToSchedule", { required: true })} placeholder="List tasks, separated by commas" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fixedCommitments">Fixed Commitments</Label>
                                <Textarea id="fixedCommitments" {...register("fixedCommitments")} placeholder="e.g., Classes, meetings, appointments" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="breakPreferences">Break Preferences</Label>
                                <Input id="breakPreferences" {...register("breakPreferences")} />
                            </div>

                            <div className="space-y-2">
                                <Label>Chronotype</Label>
                                <Controller
                                    name="chronotype"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="morning" id="morning" className="text-accent" /><Label htmlFor="morning">Morning</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="evening" id="evening" className="text-accent" /><Label htmlFor="evening">Evening</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="flexible" id="flexible" className="text-accent" /><Label htmlFor="flexible">Flexible</Label></div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>Work Style</Label>
                                <Controller
                                    name="workStyle"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="deep_focus" id="deep_focus" className="text-accent" /><Label htmlFor="deep_focus">Deep Focus</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="multitask" id="multitask" className="text-accent" /><Label htmlFor="multitask">Multitask</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="hybrid" id="hybrid" className="text-accent" /><Label htmlFor="hybrid">Hybrid</Label></div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="char-mbti" className="flex items-center gap-2"><Brain /> MBTI Type (Optional)</Label>
                                <Controller
                                    name="mbti"
                                    control={control}
                                    render={({ field }) => (
                                         <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger id="char-mbti">
                                                <SelectValue placeholder="Select your MBTI type..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mbtiTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-headline font-semibold">Presets</h4>
                                 <div className="space-y-2">
                                    <Label>Manage Presets</Label>
                                    <Select onValueChange={loadPreset} disabled={presets.length === 0}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Load a preset..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {presets.map(p => (
                                                <SelectItem key={p.name} value={p.name}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{p.name}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto hover:bg-destructive/20 group" onClick={(e) => { e.stopPropagation(); deletePreset(p.name); }}>
                                                            <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                                                        </Button>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="preset-name">Save Current as Preset</Label>
                                    <div className="flex gap-2">
                                        <Input id="preset-name" placeholder="Preset name..." value={presetName} onChange={e => setPresetName(e.target.value)} />
                                        <Button type="button" variant="outline" size="icon" onClick={savePreset}><Save /></Button>
                                    </div>
                                 </div>
                            </div>
                            
                            <Separator />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                Generate Schedule
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    {loading && <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
                    {!loading && !schedule && <div className="text-center text-muted-foreground py-16 bg-card rounded-lg h-full flex items-center justify-center">Your generated schedule will appear here.</div>}
                    
                    {schedule && (
                        <Tabs defaultValue="kanban">
                            <div className="flex justify-end bg-black/10 backdrop-blur-sm p-1 rounded-md">
                                <TabsList>
                                    <TabsTrigger value="kanban"><Kanban /></TabsTrigger>
                                    <TabsTrigger value="table"><LayoutGrid /></TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="kanban" className="mt-4">
                                {kanbanData && <KanbanBoard data={kanbanData} />}
                            </TabsContent>
                            <TabsContent value="table" className="mt-4">
                                {tableData && (
                                    <NotionTable
                                        storageKey="timetable-schedule"
                                        columns={tableData.columns}
                                        rows={tableData.rows}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    )}
                </div>
            </div>
        </>
    );
}
