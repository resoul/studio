'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskData {
  progress: number;
  tasksDone: number;
  backlog: number;
  inProgress: number;
  inReview: number;
  prediction: string;
}

const taskDataByRange: Record<string, TaskData> = {
  'this-month': {
    progress: 72,
    tasksDone: 18,
    backlog: 15,
    inProgress: 8,
    inReview: 4,
    prediction: '1w 2d 6h',
  },
  'last-month': {
    progress: 68,
    tasksDone: 22,
    backlog: 12,
    inProgress: 6,
    inReview: 8,
    prediction: '1w 5d 3h',
  },
  'this-year': {
    progress: 58,
    tasksDone: 156,
    backlog: 89,
    inProgress: 45,
    inReview: 23,
    prediction: '2m 1w 4d',
  },
  'last-year': {
    progress: 75,
    tasksDone: 298,
    backlog: 67,
    inProgress: 34,
    inReview: 18,
    prediction: '1m 2w 6d',
  },
};

export function TasksOverview() {
  const [selectedRange, setSelectedRange] = useState('this-month');
  const [progress, setProgress] = useState(
    taskDataByRange['this-month'].progress,
  );

  const currentData = taskDataByRange[selectedRange];

  useEffect(() => {
    const timer = setTimeout(() => setProgress(currentData.progress), 800);
    return () => clearTimeout(timer);
  }, [currentData.progress]);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    setProgress(0); // Reset progress for animation
    setTimeout(() => setProgress(taskDataByRange[value].progress), 300);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
        <CardToolbar>
          <Select value={selectedRange} onValueChange={handleRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </CardToolbar>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Progress bar and done tasks */}
        <div className="grow mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-foreground">
              Tasks Done
            </span>
            <span className="text-sm font-semibold text-success">
              {currentData.tasksDone}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Task summary */}
        <div className="space-y-6">
          {/* Tasks list */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
              <span className="text-lg font-bold text-green-500">
                {currentData.backlog}
              </span>
              <span className="text-xs text-accent-foreground">Follow-ups</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
              <span className="text-lg font-bold text-yellow-500">
                {currentData.inProgress}
              </span>
              <span className="text-xs text-accent-foreground">
                In Progress
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/60 rounded-lg py-3.5 px-2 gap-1">
              <span className="text-lg font-bold text-violet-500">
                {currentData.inReview}
              </span>
              <span className="text-xs text-accent-foreground">Pending</span>
            </div>
          </div>

          {/* AI prediction footer */}
          <div className="text-xs text-muted-foreground text-center">
            AI prediction to complete all tasks:{' '}
            <span className="font-semibold text-foreground">
              {currentData.prediction}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
