'use client';

import React, { Fragment, useState } from 'react';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Deals pipeline data for different periods
const dealsData = {
  day: [
    { period: '00:00', deals: 2 },
    { period: '04:00', deals: 1 },
    { period: '08:00', deals: 4 },
    { period: '12:00', deals: 6 },
    { period: '16:00', deals: 5 },
    { period: '20:00', deals: 3 },
  ],
  week: [
    { period: 'Mon', deals: 8 },
    { period: 'Tue', deals: 12 },
    { period: 'Wed', deals: 9 },
    { period: 'Thu', deals: 15 },
    { period: 'Fri', deals: 11 },
    { period: 'Sat', deals: 6 },
    { period: 'Sun', deals: 8 },
  ],
  month: [
    { period: 'Week 1', deals: 45 },
    { period: 'Week 2', deals: 52 },
    { period: 'Week 3', deals: 48 },
    { period: 'Week 4', deals: 61 },
  ],
  year: [
    { period: 'Q1', deals: 189 },
    { period: 'Q2', deals: 225 },
    { period: 'Q3', deals: 198 },
    { period: 'Q4', deals: 267 },
  ],
};

const chartConfig = {
  deals: {
    label: 'Deals',
    color: 'var(--color-emerald-600)',
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-zinc-900 text-white p-3 shadow-lg">
        <div className="text-xs font-medium mb-1">Deals:</div>
        <div className="text-sm font-semibold">{payload[0].value} deals</div>
      </div>
    );
  }
  return null;
};

// Period configuration
const PERIODS = {
  day: { key: 'day', label: 'Day' },
  week: { key: 'week', label: 'Week' },
  month: { key: 'month', label: 'Month' },
  year: { key: 'year', label: 'Year' },
} as const;

type PeriodKey = keyof typeof PERIODS;

// Statistics data
const statisticsData = [
  {
    id: 'closed',
    label: 'Closed Deals',
    value: '18',
    change: '+4 deals',
    changeType: 'positive',
    icon: CheckCircle,
  },
  {
    id: 'pipeline',
    label: 'Pipeline Value',
    value: '$2.8M',
    change: '+$420K',
    changeType: 'positive',
    icon: Clock,
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: '23%',
    change: '+5%',
    changeType: 'positive',
    icon: TrendingUp,
  },
] as const;

export function DealsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('day');

  // Get data for selected period
  const currentData = dealsData[selectedPeriod];

  return (
    <Card className="">
      <CardHeader className="min-h-auto py-6 border-0">
        <CardTitle className="text-xl font-semibold">Deals Overview</CardTitle>
        <CardToolbar>
          <ToggleGroup
            type="single"
            value={selectedPeriod}
            variant="outline"
            onValueChange={(value) =>
              value && setSelectedPeriod(value as PeriodKey)
            }
            className=""
          >
            {Object.values(PERIODS).map((period) => (
              <ToggleGroupItem
                key={period.key}
                value={period.key}
                className="px-3.5 first:rounded-s-full! last:rounded-e-full!"
              >
                {period.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardToolbar>
      </CardHeader>

      <CardContent className="px-0">
        {/* Statistics Blocks */}
        <div className="flex items-center flex-wrap px-6 gap-10 mb-10">
          {statisticsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Fragment key={stat.id}>
                <div className="h-10 w-px bg-border hidden lg:block first:hidden" />
                <div key={stat.id} className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/60 border border-muted-foreground/10">
                        <IconComponent className="w-4.5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-0.5">
                          {stat.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {stat.value}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              stat.changeType === 'positive'
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>

        {/* Chart */}
        <div className="px-3.5 h-[250px] w-full">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full overflow-visible [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <AreaChart
              data={currentData}
              margin={{
                top: 15,
                right: 10,
                left: 10,
                bottom: 15,
              }}
              style={{ overflow: 'visible' }}
            >
              {/* SVG Pattern for chart area */}
              <defs>
                {/* Grid pattern */}
                <pattern
                  id="gridPattern"
                  x="0"
                  y="0"
                  width="20"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="var(--input)"
                    strokeWidth="0.5"
                    strokeOpacity="1"
                  />
                </pattern>

                {/* Area gradient fill */}
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={chartConfig.deals.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={chartConfig.deals.color}
                    stopOpacity={0.05}
                  />
                </linearGradient>

                {/* Shadow filters for dots */}
                <filter
                  id="dotShadow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="3"
                    floodColor="rgba(0,0,0,0.4)"
                  />
                </filter>
                <filter
                  id="activeDotShadow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feDropShadow
                    dx="3"
                    dy="3"
                    stdDeviation="4"
                    floodColor="rgba(0,0,0,0.5)"
                  />
                </filter>
              </defs>

              {/* Background pattern for chart area only */}
              <rect
                x="60px"
                y="-20px"
                width="calc(100% - 75px)"
                height="calc(100% - 10px)"
                fill="url(#gridPattern)"
                style={{ pointerEvents: 'none' }}
              />

              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={8}
                interval={0}
                includeHidden={true}
              />

              <YAxis
                hide={true}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${value} deals`}
                tickMargin={8}
                domain={[0, 'dataMax']}
                ticks={[0]}
              />

              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: chartConfig.deals.color,
                  strokeWidth: 1,
                  strokeDasharray: 'none',
                }}
              />

              <Area
                type="monotone"
                dataKey="deals"
                stroke={chartConfig.deals.color}
                strokeWidth={2}
                fill="url(#areaGradient)"
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  // Show dots only for specific periods based on selected time range
                  const showDot =
                    (selectedPeriod === 'day' &&
                      (payload.period === '08:00' ||
                        payload.period === '16:00')) ||
                    (selectedPeriod === 'week' &&
                      (payload.period === 'Thu' || payload.period === 'Sat')) ||
                    (selectedPeriod === 'month' &&
                      payload.period === 'Week 2') ||
                    (selectedPeriod === 'year' && payload.period === 'Q2');

                  if (showDot) {
                    return (
                      <circle
                        key={`dot-${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r={4}
                        fill={chartConfig.deals.color}
                        stroke="white"
                        strokeWidth={2}
                        filter="url(#dotShadow)"
                      />
                    );
                  }
                  return <g key={`dot-${cx}-${cy}`} />; // Return empty group for other points
                }}
                activeDot={{
                  r: 6,
                  fill: chartConfig.deals.color,
                  stroke: 'white',
                  strokeWidth: 2,
                  filter: 'url(#dotShadow)',
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
