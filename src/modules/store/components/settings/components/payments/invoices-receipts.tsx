'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input, InputAddon, InputGroup } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { useState } from "react";

export function InvoicesReceipts() {
  const [automaticInvoice, setAutomaticInvoice] = useState(false);

  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Invoices & Receipts</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input p-5 space-y-5 h-full">
          
          {/* Automatic Invoice Generation */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium text-foreground">Automatic Invoice Generation</Label>
              <span className="text-xs text-muted-foreground">Improves search with AI understanding</span>
            </div>
            <div className="flex flex-col gap-1.5 basis-2/3">
              <div className="flex items-center gap-1.5">
                <Switch
                  checked={automaticInvoice}
                  onCheckedChange={setAutomaticInvoice}
                  size="sm"
                />
                <Label htmlFor="size-sm">Inactive</Label>
              </div>
              <span className="text-xs text-muted-foreground font-normal">
                AI-powered search is disabled; only basic keyword matching is used.
              </span>
            </div> 
          </div>

          <Separator />

          {/* Invoice Templates */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium text-foreground">Invoice Templates</Label>
              <span className="text-xs text-muted-foreground">Provides AI-driven analytics and trends</span>
            </div>
            <div className="basis-2/3"> 
              <Button variant="outline">
                Customize Invoice layout & info
              </Button>
            </div>
          </div>

          <Separator />

          {/* No-reply Email Address */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium text-foreground">No-reply Email Address</Label>
              <span className="text-xs text-muted-foreground">Improves search with AI understanding</span>
            </div>
            <div className="basis-2/3"> 
              <InputGroup>
                <InputAddon mode="icon">
                  <Mail />
                </InputAddon>
                <Input type="email" placeholder="no-reply@mystore.io" />
              </InputGroup>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}