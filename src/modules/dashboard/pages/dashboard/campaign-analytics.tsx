'use client';

import React, { useState } from 'react';
import { ChartNoAxesCombined, Info, TrendingUp } from 'lucide-react';
import { Area, AreaChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Lead generation data for different periods
const leadsData = {
  '5D': [
    { period: 'Mon', leads: 24 },
    { period: 'Tue', leads: 31 },
    { period: 'Wed', leads: 28 },
    { period: 'Thu', leads: 35 },
    { period: 'Fri', leads: 42 },
  ],
  '2W': [
    { period: 'W1', leads: 156 },
    { period: 'W2', leads: 189 },
    { period: 'W3', leads: 167 },
    { period: 'W4', leads: 203 },
    { period: 'W5', leads: 178 },
    { period: 'W6', leads: 234 },
  ],
  '1M': [
    { period: 'W1', leads: 156 },
    { period: 'W2', leads: 189 },
    { period: 'W3', leads: 167 },
    { period: 'W4', leads: 203 },
    { period: 'W5', leads: 178 },
    { period: 'W6', leads: 234 },
    { period: 'W7', leads: 198 },
    { period: 'W8', leads: 245 },
  ],
  '6M': [
    { period: 'Jan', leads: 678 },
    { period: 'Feb', leads: 723 },
    { period: 'Mar', leads: 689 },
    { period: 'Apr', leads: 756 },
    { period: 'May', leads: 712 },
    { period: 'Jun', leads: 789 },
  ],
};

const chartConfig = {
  leads: {
    label: 'Leads',
    color: 'var(--color-violet-500)',
  },
} satisfies ChartConfig;

// Period configuration
const PERIODS = {
  '5D': { key: '5D', label: '5D' },
  '2W': { key: '2W', label: '2W' },
  '1M': { key: '1M', label: '1M' },
  '6M': { key: '6M', label: '6M' },
} as const;

type PeriodKey = keyof typeof PERIODS;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
        {value} leads
      </div>
    );
  }
  return null;
};

export function LeadAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('5D');

  // Get data for selected period
  const currentData = leadsData[selectedPeriod];

  // Calculate total leads for the selected period
  const totalLeads = currentData.reduce((sum, item) => sum + item.leads, 0);

  return (
    <Card className="h-full">
      <CardHeader className="min-h-auto flex-nowrap! border-b border-border pt-6 pb-1 border-0">
        <CardHeading className="flex items-center gap-2.5 space-y-0">
          <div className="flex items-center justify-center size-10 rounded-full bg-muted/80">
            <ChartNoAxesCombined className="size-5" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <CardTitle className="text-base font-semibold text-foreground leading-none">
              Lead Analytics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Lead generation and conversion
            </p>
          </div>
        </CardHeading>
        <CardToolbar>
          <Tooltip>
            <TooltipTrigger>
              <span>
                <Info className="size-4 fill-muted/60 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lead analytics by period</p>
            </TooltipContent>
          </Tooltip>
        </CardToolbar>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        {/* Period Selector */}
        <div className="space-y-6">
          {/* Main Metric */}
          <div className="space-y-1">
            <div className="text-3xl font-semibold text-foreground">
              {totalLeads}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="size-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+18%</span>
              <span className="text-gray-600">
                compared to last {selectedPeriod === '5D' ? 'week' : 'period'}
              </span>
            </div>
          </div>

          {/* Toggle Group */}
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            onValueChange={(value) =>
              value && setSelectedPeriod(value as PeriodKey)
            }
            variant="outline"
            className="w-full shadow-none!"
          >
            {Object.values(PERIODS).map((period) => (
              <ToggleGroupItem
                key={period.key}
                value={period.key}
                className="flex-1 shadow-none data-[state=on]:bg-muted/60"
              >
                {period.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Chart */}
        <div className="grow h-32 w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full rounded-b-3xl overflow-hidden [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <AreaChart
              data={currentData}
              margin={{
                top: 10,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.leads.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.leads.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <filter
                  id="activeDotShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="4"
                    floodColor={chartConfig.leads.color}
                    floodOpacity="0.6"
                  />
                </filter>
              </defs>

              <XAxis dataKey="period" hide />

              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  strokeWidth: 1,
                  strokeDasharray: '2 2',
                  stroke: chartConfig.leads.color,
                  strokeOpacity: 1,
                }}
              />

              <Area
                dataKey="leads"
                type="natural"
                fill="url(#leadsGradient)"
                stroke={chartConfig.leads.color}
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: chartConfig.leads.color,
                  stroke: 'white',
                  strokeWidth: 2,
                  filter: 'url(#activeDotShadow)',
                }}
                activeDot={{
                  r: 6,
                  fill: chartConfig.leads.color,
                  stroke: 'white',
                  strokeWidth: 2,
                  filter: 'url(#activeDotShadow)',
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
