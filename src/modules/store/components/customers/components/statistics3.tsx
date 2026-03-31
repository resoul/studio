'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Statistics3({}: object) {
  const items = [
    { 
      total: 'Prime Plan', 
      label: 'Good for Startups & Individuals'
    }, 
    { 
      total: '$144.00', 
      label: 'Annual Fee'
    }, 
    { 
      total: '$12.00', 
      label: 'Next Bill Amount'
    }, 
    { 
      total: '12 Dec, 25', 
      label: 'Next Bill Date'
    }
  ];

  return (
    <Card className="rounded-md mb-5 bg-accent/70 p-1">
      <CardContent className="rounded-md p-0 bg-background border border-border">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => ( 
            <div key={index} className={`${index === 0 ? 'flex-2' : 'flex-1'} flex flex-col px-4.5 py-3 gap-2 ${index > 0 ? 'sm:border-s border-border' : ''}`}>
              <div className="flex items-center flex-wrap gap-1">
                <span className={`font-semibold text-foreground ${item.total === 'Prime Plan' ? 'text-xl leading-6' : 'text-base leading-5'}`}>
                  {item.total} 
                </span>
                {item.total === 'Prime Plan' && (
                  <Badge variant="success" appearance="light" size="sm">
                    Monthly
                  </Badge>
                )}
              </div>
              <span className="text-xs font-normal text-secondary-foreground/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}