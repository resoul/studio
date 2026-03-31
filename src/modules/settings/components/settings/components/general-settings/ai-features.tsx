'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function AIFeatures() {
  
  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">AI Features</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 pb-3.5 space-y-5 h-full">
          {/* Inactive */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-1.5 basis-1/3">
              <Label className="text-sm font-medium tracking-[-0.13px] shrink-0">Enable AI Semantic Search</Label>
              <span className="text-xs font-normal text-muted-foreground leading-none">Improves search with AI understanding</span>
            </div>
            <div className="flex flex-col gap-2.5 basis-2/3">
              <div className="flex items-center gap-2">
                <Switch 
                  id="size-sm" 
                  size="sm"
                />
                <Label htmlFor="size-sm">Inactive</Label>
              </div> 
              <span className="text-xs font-normal text-muted-foreground leading-none">AI-powered search is disabled; only basic keyword matching is used.</span>    
            </div> 
          </div>

          <Separator />

          {/* Active */}
          <div className="flex items-start gap-5">
          <div className="flex flex-col gap-1.5 basis-1/3">
            <Label className="text-sm font-medium tracking-[-0.13px] shrink-0">Enable AI Insight</Label>
            <span className="text-xs font-normal text-muted-foreground leading-none">Provides AI-driven analytics and trends</span>
          </div>
          <div className="flex flex-col gap-2.5 basis-2/3">
            <div className="flex items-center gap-2">
              <Switch 
                id="size-sm" 
                defaultChecked
                size="sm"
              />
              <Label htmlFor="size-sm">Active</Label>
            </div> 
            <span className="text-xs font-normal text-muted-foreground leading-none">Provides real-time analytics, trends, and predictions using AI models.</span>    
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}