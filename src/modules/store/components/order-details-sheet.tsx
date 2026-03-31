'use client';

import { useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CircleCheck } from 'lucide-react';
import { Circle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Link } from 'react-router-dom';
import { Stepper, StepperItem, StepperNav, StepperTrigger } from '@/components/ui/stepper'; 

// Interface for current stock data
interface CurrentStockData {
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
  };
  stock: number;
  rsvd: number;
  tlvl: number;
  delta: {
    label: string;
    variant: string;
  };
  sum: string;
  lastMoved: string;
  handler: string;
  trend: {
    label: string;
    variant: string;
  };
}

interface Item { 
  logo: string;
  title: string;
  sku: string;
  color: string;
  weight: string;
}

interface OrderDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: CurrentStockData;
  onClose?: () => void; // Added onClose prop
  onTrackShipping?: () => void; // Optional callback for track shipping
}

export function OrderDetailsSheet({
  open,
  onOpenChange,
  onTrackShipping,
}: OrderDetailsSheetProps) {

  const [currentStep] = useState(2);

  const steps = [
    { title: "Picking" },
    { title: "Packed" },
    { title: "Shipping" },
    { title: "Delivered" },
  ];

  const items: Item[] = [
    {
      logo: '15.png',
      title: 'Nike Air Max 270 React SE',
      sku: 'WM-8421',
      color: 'Beige',
      weight: '1.2',
    },
    {
      logo: '9.png',
      title: 'Wave Strike Dynamic Boost Sneaker',
      sku: 'XR-0293',
      color: 'Red',
      weight: '0.9',
    },
  ]; 

  const prices = {
    'Subtotal': '$320.00',
    'Shipping': '$10.00',
    'Tax': '$20.00',
    'Total': '$350.00',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1080px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">Order Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Order:  SO-FL-5633
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Shipped
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-1.5 text-2sm">
                <span className="font-normal text-muted-foreground">Created</span>
                <span className="font-medium text-foreground/80">16 Jan, 2025</span>
                <BadgeDot className="bg-muted-foreground/60 size-1 mx-1" />
                <span className="font-normal text-muted-foreground">
                  Customer:
                </span>
                <span className="font-medium text-foreground/80">
                  Jeroen de Jong
                </span> 
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost">Delete</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (onTrackShipping) {
                    onTrackShipping();
                  }
                }}
              >
                Order Tracking
              </Button>
              <Button variant="mono">View Shipping Label</Button>
            </div>
          </div>
          <ScrollArea
            className="flex flex-col h-[calc(100vh-15.8rem)] mx-1.5"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="grow lg:border-e border-border lg:pe-5 space-y-5 pt-5">
                {/* Order Data */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Order Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start flex-wrap lg:gap-10 gap-5">
                      {[
                        { label: 'Items', value: '2 Items' },
                        { label: 'Total Price', value: '$320.00' },
                        { label: 'Shipping Priority', value: 'High' },
                        { label: 'Delivery Method', value: 'Express Delivery' }, 
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1.5">
                          <span className="text-2sm font-normal text-secondary-foreground">
                            {item.label}
                          </span>
                          <span className="text-2sm font-medium text-foreground">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Team</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {items.map((item, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col p-0">
                          <div className="flex items-center flex-wrap sm:flex-nowrap w-full justify-between gap-3.5">
                            <div className="flex md:items-center gap-3.5">
                              <Card className="flex items-center justify-center bg-accent/50 h-[50px] w-[60px] shadow-none shrink-0 rounded-md">
                                <img
                                  src={toAbsoluteUrl(`/media/store/client/1200x1200/${item.logo}`)}
                                  className="h-[50px]"
                                  alt="img"
                                />
                              </Card>

                              <div className="flex flex-col justify-center gap-1.5 -mt-1">
                                <Link
                                  to="#"
                                  className="hover:text-primary text-sm font-medium text-dark leading-5.5"
                                >
                                  {item.title}
                                </Link>
                                <div className="flex items-center gap-2.5">
                                  <span className="text-xs font-normal text-secondary-foreground">
                                    SKU:{' '}
                                    <span className="text-xs font-medium text-foreground">
                                      {item.sku}
                                    </span>
                                  </span>

                                  <BadgeDot className="bg-muted-foreground size-1 shrink-0" />

                                  <span className="text-xs font-normal text-secondary-foreground">
                                    Color
                                    <span className="text-xs font-medium text-secondary-foreground ms-1">
                                      {item.color}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col text-end gap-2.5">
                              <span className="text-xs font-medium text-dark">
                                Weight
                              </span>
                              <InputWrapper className="w-[66px] h-[28px]">
                                <Input
                                  type="text"
                                  defaultValue={`${item.weight}`}
                                  placeholder=""
                                />
                                <span className="text-2sm font-normal text-muted-foreground">
                                  kg
                                </span>
                              </InputWrapper>
                            </div>
                          </div>

                          {index !== items.length - 1 && (
                            <Separator className="my-3.5" />
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </CardContent>
                </Card>

                {/* Shipping Status */}
                <Card className="rounded-md">
                  <CardContent className="p-0">
                    <div className="flex items-start flex-wrap gap-5 justify-between bg-accent/50 p-5 border-b border-border">
                      <div className="relative">
                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="font-medium text-2sm text-secondary-foreground leading-3">
                            1234 Industrial Way, Dallas, TX 75201
                          </span>
                        </div>

                        <Separator
                          className="min-h-3.5 ml-[2px] top-0 bottom-0 bg-muted-foreground/30 w-0.5 mt-px"
                          orientation="vertical"
                        />

                        <div className="flex items-center space-x-2">
                          <BadgeDot className="bg-secondary-foreground size-1.5 shrink-0" />
                          <span className="font-medium text-2sm text-secondary-foreground leading-3">
                            8458 Sunset Blvd #209, Los Angeles, CA 90069
                          </span>
                        </div>
                      </div>

                      <Button variant="outline" className="shrink-0">
                        <img
                           src={toAbsoluteUrl('/media/brand-logos/ups.svg')}
                          alt="UPS"
                          className="h-4 w-4"
                        />{' '}
                        UPS Global
                      </Button>
                    </div>

                    <Stepper defaultValue={currentStep} className="w-full p-5 pt-3">
                      <StepperNav className="flex w-full flex-wrap gap-2">   
                        {steps.map((step, index) => {
                          const stepNumber = index + 1;
                          const isCompleted = stepNumber < currentStep;
                          const isActive = stepNumber === currentStep;

                          return (
                            <StepperItem
                              key={index}
                              step={stepNumber}
                              className="relative flex-1 flex items-center"
                            >
                              <StepperTrigger className="flex flex-col items-center w-full">
                                <div className="h-1.5 w-full mt-2 rounded-full bg-border relative">
                                  {index === steps.length - 2 ? (
                                    <div className="h-full w-1/2 bg-green-500 absolute top-0 left-0 rounded-l-full mb-5" />
                                  ) : index < steps.length - 2 ? (
                                    <div className="h-full w-full bg-green-500 absolute top-0 left-0 rounded-full" />
                                  ) : null}
                                </div>

                                {/* Ikonka */}
                                <div className="flex items-center gap-0.5 w-full -ms-1">
                                  <div className="flex items-center gap-1">
                                    {index === steps.length - 2 ? (
                                      <CircleCheck
                                        className="text-green-500 border-background border-2"
                                        size={18}
                                      />
                                    ) : index < steps.length - 2 ? (
                                      <CircleCheck
                                        className="fill-green-500 text-background"
                                        size={18}
                                      />
                                    ) : isActive ? (
                                      <CircleCheck
                                        className="fill-green-500 text-background"
                                        size={18}
                                      />
                                    ) : (
                                      <Circle
                                        className="text-muted-foreground border-background border-2"
                                        size={18}
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-medium ${
                                        isCompleted || isActive
                                          ? 'text-secondary-foreground/80 text-2sm'
                                          : 'text-secondary-foreground text-2sm'
                                      }`}
                                    >
                                      {step.title}
                                    </span>
                                  </div>
                                </div>
                              </StepperTrigger>
                            </StepperItem>
                          );
                        })}
                      </StepperNav>
                    </Stepper>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full shrink-0 lg:w-[320px] py-5 lg:ps-5">
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Shipping to Jeroen's Home
                      </span>
                      <span className="text-2sm font-normal text-secondary-foreground">
                        Prinsengracht 24
                      </span>
                      <span className="text-2sm font-normal text-secondary-foreground">
                        1015 DV Amsterdam, NL
                      </span>
                    </div>

                    <Separator className="mb-4 mt-4.5" />

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-foreground">
                        Price Details
                      </span>
                      {Object.entries(prices).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-2sm font-normal text-secondary-foreground">
                            {key}
                          </span>
                          <span className="text-2sm font-medium text-foreground">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-normal text-secondary-foreground">
                        Total
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        $22.99
                      </span>
                    </div>
                  </CardContent>
                </Card>  
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex items-center not-only-of-type:justify-between border-t py-5 px-5 border-border gap-2">
          <div className="text-xs font-medium text-secondary-foreground">
            Read Shipping
            <Link
              to="#"
              className="hover:text-primary text-xs font-medium text-primary ms-1"
            >
              Terms & Conditions
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost">Delete</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                if (onTrackShipping) {
                  onTrackShipping();
                }
              }}
            >
              Order Tracking
            </Button>
            <Button variant="mono">View Shipping Label</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
