'use client';

import { Card, CardContent } from "@/components/ui/card"; 
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { RiGatsbyLine, RiNextjsLine } from '@remixicon/react';
import { Euro, Info } from "lucide-react";
import { CardPayment } from "./components/card";
import { DigitalWallets } from "./components/digital-wallets";

export function GeneralPaymentSettings() {
  
  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Store Currency</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 space-y-5 h-full">
          {/* Store Currency */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">What do you do?</Label>
              <span className="text-xs font-normal text-muted-foreground">Tags describing store products</span>
            </div>
            <div className="basis-2/3">
              <Select defaultValue="1" indicatorPosition="right">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <span className="flex items-center gap-2">
                      <Euro className="size-4 opacity-60" />
                      <span>Euro</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="2">
                    <span className="flex items-center gap-2">
                      <RiNextjsLine className="size-4 opacity-60" />
                      <span>Next.js</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="3">
                    <span className="flex items-center gap-2">
                      <RiGatsbyLine className="size-4 opacity-60" />
                      <span>Gatsby</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> 
          </div>

          <Separator />

          {/* Store Currency */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Card & Bank Payment Methods</Label>
              <span className="text-xs font-normal text-muted-foreground">Choose methods available at checkout</span>
            </div>
            <div className="basis-2/3">
              <CardPayment />
            </div> 
          </div>

          <Separator />

          {/* Digital Wallets */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Digital Wallets</Label>
              <span className="text-xs font-normal text-muted-foreground">Enable or disable wallet-based payments</span>
            </div>
            <div className="basis-2/3">
              <DigitalWallets />
            </div> 
          </div>
        </div>
      </CardContent>

      <div className="flex items-center gap-2 pb-2.5 p-2">
        <Info className="size-5 !text-background fill-foreground"/>
        <span className="text-xs font-normal text-secondary-foreground/80">Enabling new methods may require account configuration</span>
      </div>
    </Card>
  );
}