
'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
// Removed mock data dependency - chart data will be generated from user data

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "hsl(var(--primary))",
  },
  xp: {
    label: "XP",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

const WeeklyOverviewChart = () => {
  // Generate weekly chart data from user's actual task completion
  const weeklyChartData = [
    { day: 'Mon', tasks: 0, xp: 0 },
    { day: 'Tue', tasks: 0, xp: 0 },
    { day: 'Wed', tasks: 0, xp: 0 },
    { day: 'Thu', tasks: 0, xp: 0 },
    { day: 'Fri', tasks: 0, xp: 0 },
    { day: 'Sat', tasks: 0, xp: 0 },
    { day: 'Sun', tasks: 0, xp: 0 },
  ];
  // TODO: Calculate actual weekly data from user's task completion history

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-headline">Weekly Overview</CardTitle>
        <CardDescription>Tasks completed and XP earned this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={weeklyChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Tasks', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }, dy: 40 }}
            />
             <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'XP', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }, dy: -20 }}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar key="tasks" yAxisId="left" dataKey="tasks" fill="var(--color-tasks)" radius={4} />
            <Bar key="xp" yAxisId="right" dataKey="xp" fill="var(--color-xp)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverviewChart;
