'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FilePlus, FileMinus, Globe, Globe2 } from "lucide-react"; 
import { RiMapPinLine } from "@remixicon/react"; 
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export function TaxSettings() {
  const [taxCalculation, setTaxCalculation] = useState('inclusive');

  const taxOptions = [
    {
      id: 'inclusive',
      name: 'Inclusive',
      description: 'Tax is included in the displayed price',
      icon: <FilePlus className="size-5 text-foreground/70" />
    },
    {
      id: 'exclusive',
      name: 'Exclusive',
      description: 'Tax is added during checkout',
      icon: <FileMinus className="size-5 text-foreground/70" />
    }
  ];

  return (
    <Card className="bg-accent/70 rounded-md shadow-none h-full flex flex-col"> 
      <CardContent className="p-0 flex flex-col h-full"> 
        <h3 className="text-sm font-medium text-foreground py-2.5 ps-2">Tax Settings</h3>
        <div className="bg-background rounded-md m-1 mt-0 border border-input py-6 px-3.5 space-y-5 h-full">
          {/* Tax Rates */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Tax Rates</Label>
              <span className="text-xs font-normal text-muted-foreground">Improves search with AI understanding</span>
            </div>
            <div className="basis-2/3">
              <Select defaultValue="1" indicatorPosition="right">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Apply per country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <span className="flex items-center gap-2">
                      <Globe className="size-4 text-muted-foreground/60" />
                      <span>Apply per country</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="2">
                    <span className="flex items-center gap-2">
                      <Globe2 className="size-4 text-muted-foreground/60" />
                      <span>Apply per state</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="3">
                    <span className="flex items-center gap-2">
                      <RiMapPinLine className="size-4 text-muted-foreground/60" />
                      <span>Apply per city</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> 
          </div>

          <Separator />

          {/* Tax Calculation */}
          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-0.5 basis-1/3">
              <Label className="text-2sm font-medium shrink-0">Tax Calculation</Label>
              <span className="text-xs font-normal text-muted-foreground">Tax is included in the displayed price</span>
            </div>
            <div className="basis-2/3">
              <RadioGroup className="gap-1" value={taxCalculation} onValueChange={setTaxCalculation}>
                {taxOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    className={`py-3 px-5 border-none shadow-none cursor-pointer ${
                      option.id === 'inclusive' ? 'rounded-b-none' : 
                      option.id === 'exclusive' ? 'rounded-t-none' : 'rounded-lg'
                    } ${
                      taxCalculation === option.id ? 'bg-secondary' : 'bg-accent/50'
                    }`}
                    onClick={() => setTaxCalculation(option.id)}
                  >
                    <div className="flex items-center gap-5.5">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex items-center gap-3.5">
                        <Card className="flex items-center justify-center rounded-md size-[36px] shadow-xs shrink-0">
                          <div className="flex items-center justify-center bg-accent/70 rounded-md size-[30px]">
                            {option.icon}
                          </div>
                        </Card>
                        <div>
                          <h3 className="font-medium text-2sm text-foreground">
                            {option.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-normal">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}