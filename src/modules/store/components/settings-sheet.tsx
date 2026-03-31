'use client';
import { useState } from 'react';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';  
import { GeneralSettings } from './settings/general-settings';
import { Payments } from './settings/payments';
import { Checkout } from './settings/checkout';

export function SettingsSheet({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
}) { 
  const [activeTab, setActiveTab] = useState('general-settings');

  const handleTabChange = (value: string) => {
    // Prevent switching to disabled tabs
    if (value === 'checkout' || value === 'shipping-delivery' || value === 'reviews' || value === 'security' || value === 'notification') {
      return;
    }
    setActiveTab(value);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1000px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">Settings</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between flex-wrap gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Bob’s Shoes Store
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Live
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 text-2sm">
                <span className="font-normal text-muted-foreground">
                  Store ID:
                </span>
                <span className="font-medium text-foreground">583920-XT</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Established
                </span>
                <span className="font-medium text-foreground">
                  16 Jan, 2022
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Last Order
                </span>
                <span className="font-medium text-foreground">19 minutes ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
              <Button variant="outline">Cancel</Button>
              <Button variant="mono">Save</Button>
            </div>
          </div>
          <div className="flex flex-col h-[calc(100dvh-22rem)]">
            <div className="flex flex-wrap lg:flex-nowrap py-5 px-2 grow"> 
              <Tabs value={activeTab} onValueChange={handleTabChange} className="text-2sm text-muted-foreground w-full space-y-3">
                <div className="px-3">
                  <div className="overflow-x-auto">
                    <TabsList className="inline-flex whitespace-nowrap border border-border/80 bg-muted/80 [&_[data-slot=tabs-trigger]]:text-foreground [&_[data-slot=tabs-trigger]]:font-normal [&_[data-slot=tabs-trigger][data-state=active]]:shadow-lg">
                      <TabsTrigger value="general-settings">General Settings</TabsTrigger>
                      <TabsTrigger value="payments" >Payments</TabsTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="checkout" className="opacity-50">Checkout</TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="shipping-delivery" className="opacity-50">Shipping & Delivery</TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="reviews" className="opacity-50">Locations</TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="security" className="opacity-50">Security</TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild >
                            <TabsTrigger value="notification" className="opacity-50">Notification</TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Coming Soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TabsList>
                  </div>
                </div>
               
                <ScrollArea className="px-3">
                  <TabsContent value="general-settings" className="lg:h-[calc(100dvh-22.5rem)] h-[calc(100dvh-27.2rem)]">
                    <GeneralSettings />
                  </TabsContent>
                  <TabsContent value="payments" className="lg:h-[calc(100dvh-22.4rem)] h-[calc(100dvh-27.1rem)]">
                    <Payments />
                  </TabsContent>
                  <TabsContent value="checkout">
                    <Checkout />
                  </TabsContent> 
                </ScrollArea>
              </Tabs>
            </div>
          </div>
        </SheetBody>

        <SheetFooter className="flex-row border-t pb-4 p-5 border-border gap-2.5 lg:gap-0">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
            <Button variant="outline">Cancel</Button>
            <Button variant="mono">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
