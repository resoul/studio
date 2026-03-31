/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export function Statistics1({}: object) {
  const items = [
    { 
      total: '1,246', 
      label: 'Total Orders',
      badgeLabel: '23.08',
      badgeColor: 'success',
      text: 'Annual trend',
      number: '',
      icon: <TrendingUp />,
    }, 
    { 
      total: '$89,378', 
      label: 'Cumulative Spend',
      badgeLabel: '3.82',
      badgeColor: 'success',
      text: 'Monthly trend',
      number: '.02',
      icon: <TrendingUp />,
    }, 
    { 
      total: '$68', 
      label: 'Avg. Order Value(AOV)',
      badgeLabel: '0.39',
      badgeColor: 'destructive',
      text: 'Weekly trend',
      number: '.50',
      icon: <TrendingDown />,
    }, 
    { 
      total: '$2,345', 
      label: 'Account Balance',
      badgeLabel: '104',
      badgeColor: 'success',
      text: 'Daily trend',
      number: '.94',
      icon: <TrendingUp />,
    }
  ];

  return (
    <Card className="rounded-md mb-5 bg-accent/70 p-1">
      <CardContent className="rounded-md p-0 bg-background border border-border">
        <div className="grid md:grid-cols-4 lg:gap-5">
          {items.map((item, index) => ( 
            <div key={index} className={`flex flex-col justify-between gap-5 p-4.5 pb-3.5 ${index > 0 ? 'md:border-s border-border' : ''}`}>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl lg:text-2xl font-semibold text-foreground">
                  {item.total}<span className="text-xl lg:text-2xl font-semibold text-secondary-foreground/30">{item.number}</span>
                </span>
                <span className="text-xs font-normal text-secondary-foreground/70">
                  {item.label}
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-1.5">
                <Badge variant={item.badgeColor as any} size="sm" appearance="light" className="w-fit">
                {item.icon} {item.badgeLabel}%
                </Badge>
                <span className="text-xs font-normal text-secondary-foreground">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
