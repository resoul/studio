'use client';

import { useState, useEffect } from 'react';
import { SquarePen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { Rating } from '@/components/ui/rating';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ProductDetailsAnalyticsSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Chart data for Recharts
  const salesPriceData = [
    { value: 30 },
    { value: 38 },
    { value: 35 },
    { value: 42 },
    { value: 40 },
    { value: 45 },
    { value: 55 },
  ];

  const salesData = [
    { value: 28 },
    { value: 50 },
    { value: 36 },
    { value: 42 },
    { value: 38 },
    { value: 45 },
    { value: 50 },
  ];

  // Variants table
  const subscriptions = [
    {
      size: '40',
      color: 'White',
      price: '$96.00',
      available: 'Yes',
      onHand: '24',
    },
    {
      size: '39',
      color: 'White',
      price: '$96.00',
      available: 'Yes',
      onHand: '18',
    },
    {
      size: '42',
      color: 'Black',
      price: '$96.00',
      available: 'Yes',
      onHand: '12',
    },
    {
      size: '41',
      color: 'White',
      price: '$96.00',
      available: 'No',
      onHand: '30',
    },
    {
      size: '44',
      color: 'Red',
      price: '$96.00',
      available: 'Yes',
      onHand: '27',
    },
    {
      size: '43',
      color: 'Black',
      price: '$96.00',
      available: 'No',
      onHand: '15',
    },
  ];

  const [selectedImage, setSelectedImage] = useState('3');

  // Prevent auto-focus when sheet opens
  useEffect(() => {
    if (open) {
      // Blur any focused element when sheet opens
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1080px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle tabIndex={0} className="focus:outline-none font-medium">Product Details & Analytics</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Cloud Shift Lightweight Runner
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Live
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-1.5 text-2sm">
                <span className="font-normal text-muted-foreground">SKU</span>
                <span className="font-medium text-foreground/80">WM-8421</span>
                <BadgeDot className="bg-muted-foreground/60 size-1 mx-1" />
                <span className="font-normal text-muted-foreground">
                  Created
                </span>
                <span className="font-medium text-foreground/80">
                  16 Jan, 2025
                </span>
                <BadgeDot className="bg-muted-foreground/60 size-1 mx-1" />
                <span className="font-normal text-muted-foreground">
                  Last Updated
                </span>
                <span className="font-medium text-foreground/80">
                  2 days ago
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost">Customer View</Button>
              <Button variant="outline">Remove</Button>
              <Button variant="mono">Edit Product</Button>
            </div>
          </div>
          <ScrollArea
            className="flex flex-col h-[calc(100dvh-15.8rem)] mx-1.5"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="grow lg:border-e border-border lg:pe-5 space-y-5 py-5">
                {/* Inventory */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start flex-wrap lg:gap-10 gap-5">
                      {[
                        { label: 'Status', value: 'In Stock' },
                        { label: 'In Stock', value: '1263' },
                        { label: 'Delta', value: '+289' },
                        { label: 'Velocity', value: '0.24 items/day' },
                        { label: 'Updated By', value: 'Jason Taytum' },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1.5">
                          <span className="text-2sm font-normal text-secondary-foreground">
                            {item.label}
                          </span>
                          <span className="text-2sm font-medium text-foreground">
                            {item.label === 'Status' ? (
                              <Badge variant="success" appearance="light">
                                {item.value}
                              </Badge>
                            ) : item.label === 'Delta' ? (
                              <Badge variant="success" appearance="light">
                                {item.value}
                              </Badge>
                            ) : (
                              item.value
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-5 lg:gap-7.5 pt-4 pb-5">
                    <div className="space-y-1">
                      <div className="text-2sm font-normal text-secondary-foreground">
                        Salesprice
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-foreground">
                          $96.23
                        </span>
                        <Badge size="xs" variant="success" appearance="light">
                          <TrendingUp />
                          3.5%
                        </Badge>
                      </div>

                      {/* Recharts Area Chart */}
                      <div className="relative">
                        <div className="h-[100px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={salesPriceData}
                              margin={{
                                top: 5,
                                right: 5,
                                left: 5,
                                bottom: 5,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="salesPriceGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#4921EA"
                                    stopOpacity={0.15}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#4921EA"
                                    stopOpacity={0.02}
                                  />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                cursor={{
                                  stroke: '#4921EA',
                                  strokeWidth: 1,
                                  strokeDasharray: '2 2',
                                }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const value = payload[0].value as number;
                                    return (
                                      <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
                                        <p className="text-sm font-semibold text-foreground">
                                          ${value}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#4921EA"
                                fill="url(#salesPriceGradient)"
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                  r: 4,
                                  fill: '#4921EA',
                                  stroke: 'white',
                                  strokeWidth: 2,
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2sm font-normal text-secondary-foreground">
                        Sales
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-foreground">
                          6346
                        </span>
                        <Badge size="xs" variant="success" appearance="light">
                          <TrendingUp />
                          18%
                        </Badge>
                        <span className="text-2sm font-normal text-secondary-foreground ps-2.5">
                          $43,784,02
                        </span>
                      </div>

                      {/* Recharts Area Chart */}
                      <div className="relative">
                        <div className="h-[100px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={salesData}
                              margin={{
                                top: 5,
                                right: 5,
                                left: 5,
                                bottom: 5,
                              }}
                            >
                              <defs>
                                <linearGradient
                                  id="salesGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#4921EA"
                                    stopOpacity={0.15}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#4921EA"
                                    stopOpacity={0.02}
                                  />
                                </linearGradient>
                              </defs>
                              <Tooltip
                                cursor={{
                                  stroke: '#4921EA',
                                  strokeWidth: 1,
                                  strokeDasharray: '2 2',
                                }}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const value = payload[0].value as number;
                                    return (
                                      <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
                                        <p className="text-sm font-semibold text-foreground">
                                          {value}
                                        </p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#4921EA"
                                fill="url(#salesGradient)"
                                strokeWidth={1}
                                dot={false}
                                activeDot={{
                                  r: 4,
                                  fill: '#4921EA',
                                  stroke: 'white',
                                  strokeWidth: 2,
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Variants table */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Analytics</CardTitle>
                    <CardToolbar>
                      <Button mode="link" className="text-primary">
                        Manage Variants
                      </Button>
                    </CardToolbar>
                  </CardHeader>

                  <CardContent className="p-0">
                    <Table className="overflow-x-auto">
                      <TableHeader>
                        <TableRow className="text-secondary-foreground font-normal text-2sm">
                          <TableHead className="w-[100px] h-8.5 border-e border-border ps-5">
                            Size
                          </TableHead>
                          <TableHead className="w-[100px] h-8.5 border-e border-border">
                            Color
                          </TableHead>
                          <TableHead className="w-[100px] h-8.5 border-e border-border">
                            Price
                          </TableHead>
                          <TableHead className="w-[100px] h-8.5 border-e border-border">
                            Available
                          </TableHead>
                          <TableHead className="w-[100px] h-8.5 border-e border-border">
                            On Hand
                          </TableHead>
                          <TableHead className="w-[50px] h-8.5"></TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {subscriptions.map((sub, index) => (
                          <TableRow
                            key={sub.size}
                            className={`text-secondary-foreground font-normal text-2sm ${index % 2 === 0 ? 'bg-accent/50' : ''}`}
                          >
                            <TableCell className="py-1 border-e border-border ps-5">
                              EU {sub.size}
                            </TableCell>
                            <TableCell className="py-1 border-e border-border">
                              {sub.color}
                            </TableCell>
                            <TableCell className="py-1 border-e border-border">
                              {sub.price}
                            </TableCell>
                            <TableCell className="py-1 border-e border-border">
                              {sub.available}
                            </TableCell>
                            <TableCell className="py-1 border-e border-border">
                              {sub.onHand}
                            </TableCell>
                            <TableCell className="text-center py-1">
                              <Button variant="ghost" mode="icon" size="sm">
                                <SquarePen />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full shrink-0 lg:w-[420px] py-5 lg:ps-5">
                <div className="mb-5">
                  <Card className="flex items-center justify-center rounded-md bg-accent/50 shadow-none shrink-0 mb-5">
                    <img
                      src={toAbsoluteUrl(
                        `/media/store/client/1200x1200/${selectedImage}.png`,
                      )}
                      className="h-[250px] shrink-0"
                      alt="Main product image"
                    />
                  </Card>

                  <ToggleGroup
                    className="grid grid-cols-5 gap-4"
                    type="single"
                    value={selectedImage}
                    onValueChange={(newValue) => {
                      if (newValue) setSelectedImage(newValue);
                    }}
                  >
                    {[
                      {
                        id: '1',
                        value: '3',
                        image: '3.png',
                        alt: 'Thumbnail 1',
                      },
                      {
                        id: '2',
                        value: '18',
                        image: '18.png',
                        alt: 'Thumbnail 2',
                      },
                      {
                        id: '3',
                        value: '19',
                        image: '19.png',
                        alt: 'Thumbnail 3',
                      },
                      {
                        id: '4',
                        value: '20',
                        image: '20.png',
                        alt: 'Thumbnail 4',
                      },
                      {
                        id: '5',
                        value: '21',
                        image: '21.png',
                        alt: 'Thumbnail 5',
                      },
                    ].map((item) => (
                      <ToggleGroupItem
                        key={item.id}
                        value={item.value}
                        className="rounded-md border border-border shrink-0 h-[50px] p-0 bg-accent/50 hover:bg-accent/50 data-[state=on]:border-zinc-950 dark:data-[state=on]:border-zinc-50"
                      >
                        <img
                          src={toAbsoluteUrl(
                            `/media/store/client/1200x1200/${item.image}`,
                          )}
                          className="h-[50px] w-[50px] object-cover rounded-md"
                          alt={item.alt}
                        />
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <p className="text-2sm font-normal text-secondary-foreground leading-5 mb-5">
                  Lightweight and stylish, these sneakers offer all-day comfort
                  with breathable mesh..
                </p>

                <div className="space-y-3">
                  <div className="flex items-center lg:gap-13 gap-5">
                    <div className="text-2sm text-secondary-foreground font-normal min-w-[60px]">
                      Category
                    </div>
                    <div className="text-2sm text-secondary-foreground font-medium">
                      Sneakers
                    </div>
                  </div>
                  <div className="flex items-center lg:gap-13 gap-5">
                    <div className="text-2sm text-secondary-foreground font-normal min-w-[60px]">
                      Fit
                    </div>
                    <div className="text-2sm text-secondary-foreground font-medium">
                      True to size
                    </div>
                  </div>
                  <div className="flex items-center lg:gap-13 gap-5">
                    <div className="text-2sm text-secondary-foreground font-normal min-w-[60px]">
                      Colors
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4.5 h-4.5 rounded-xs bg-background border border-border-input"></div>
                      <div className="w-4 h-4 rounded-xs bg-foreground"></div>
                      <div className="w-4 h-4 rounded-xs bg-destructive"></div>
                    </div>
                  </div>
                  <div className="flex items-center lg:gap-13 gap-5">
                    <div className="text-2sm text-secondary-foreground font-normal min-w-[60px]">
                      Sizes
                    </div>
                    <div className="flex items-center gap-3.5">
                      <span className="text-2sm text-secondary-foreground font-medium">
                        EU: 39-45
                      </span>
                      <span className="text-2sm text-secondary-foreground font-medium">
                        US: 6-12
                      </span>
                      <span className="text-2sm text-secondary-foreground font-medium">
                        UK: 5.5-11.5
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center lg:gap-13 gap-5">
                    <div className="text-2sm text-secondary-foreground font-normal min-w-[60px]">
                      Rating
                    </div>
                    <div className="flex items-center gap-4">
                      <Rating rating={4} size="sm" />
                      <Link
                        to="#"
                        className="hover:text-primary text-xs font-medium text-primary"
                      >
                        834 reviews
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex-row border-t pb-4 p-5 border-border gap-2.5 lg:gap-0">
          <Button variant="ghost">Customer View</Button>
          <Button variant="outline">Remove</Button>
          <Button variant="mono">Edit Product</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
