'use client';

import { useId, useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rating } from '@/components/ui/rating';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  label: string;
  info: string;
}

interface PerProductStockSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: CurrentStockData;
}

export function PerProductStockSheet({
  open,
  onOpenChange,
  data,
}: PerProductStockSheetProps) {
  const [items] = useState<Item[]>([
    { label: 'SKU', info: 'SH-001-BLK-42' },
    { label: 'Category', info: 'Sneakers' },
    { label: 'Rating', info: '4' },
    { label: 'Price', info: '$99.00' },
  ]);

  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[960px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">
            Per Product Stock
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow px-1.5">
          <ScrollArea
            className="flex flex-col h-[calc(100dvh-10.5rem)]"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="grow lg:border-e border-border lg:pe-5">
                {/*Cloud Shift*/}
                <div className="flex flex-col gap-2.5 py-5">
                  <div className="flex flex-col gap-2 mb-1.5">
                    <span className="lg:text-[22px] font-semibold text-foreground">
                      {data?.productInfo?.title || 'Product Title'}
                    </span>

                    <div className="flex items-center flex-wrap gap-1.5 text-2sm">
                      <span className="font-normal text-muted-foreground">
                        SKU
                      </span>
                      <span className="font-medium text-foreground/80">
                        {data?.productInfo?.label || 'SKU'}
                      </span>
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

                  <div className="flex items-end flex-wrap justify-between gap-2.5">
                    <div className="flex flex-col gap-2.5 grow">
                      <Label className="text-xs">Current Stock</Label>
                      <Input
                        defaultValue={data?.stock?.toString() || '0'}
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline">Reorder Now</Button>
                  </div>
                </div>

                {/* Inventory Rules */}
                <Card className="rounded-md mb-5">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Inventory Rules</CardTitle>
                    <div className="flex items-center gap-2.5">
                      <Label htmlFor="auto-update" className="text-xs">
                        Auto Reorder
                      </Label>
                      <Switch id="auto-update" defaultChecked size="sm" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:gap-5 gap-2 lg:mb-7 mb-5">
                      <div className="flex flex-col gap-2.5">
                        <Label className="text-xs">Threshold Qty</Label>
                        <Input type="email" defaultValue="200" />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <Label className="text-xs">Safe Stock Qty</Label>
                        <Input type="email" defaultValue="320" />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <Label className="text-xs">Reorder Qty</Label>
                        <Input type="email" defaultValue="400" />
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <Label className="text-xs">Lead Time</Label>
                        <InputWrapper>
                          <Input type="email" defaultValue="3" />
                          <span className="text-2sm font-normal text-muted-foreground">
                            days
                          </span>
                        </InputWrapper>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap lg:gap-10 gap-5">
                      {[
                        { label: 'Status', value: 'In Stock' },
                        { label: 'Delta', value: '+289' },
                        { label: 'Velocity', value: '0.24 items/day' },
                        { label: 'Next Reorder', value: '14 Sep, 2025' },
                        { label: 'Updated By', value: 'Jason Taytum' },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1.5">
                          <span className="text-2sm font-normal text-secondary-foreground">
                            {item.label}
                          </span>
                          <span className="text-2sm font-medium text-foreground shrink-0">
                            {item.label === 'Status' ? (
                              <Badge
                                variant="success"
                                appearance="light"
                                className="shrink-0"
                              >
                                {item.value}
                              </Badge>
                            ) : item.label === 'Delta' ? (
                              <Badge
                                variant="success"
                                appearance="light"
                                className="shrink-0"
                              >
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

                {/* Shipping */}
                <Card className="rounded-md lg:mb-5">
                  <Tabs defaultValue="custom" className="w-full">
                    <CardHeader className="min-h-[40px] bg-accent/50">
                      <CardTitle className="text-sm">Shipping</CardTitle>
                      <TabsList
                        size="xs"
                        className="flex gap-3.5 border-none"
                        variant="line"
                      >
                        <TabsTrigger
                          value="custom"
                          className="flex-1 pb-3 -mb-1.5 data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground border-b-[1px] hover:text-inherit"
                        >
                          Custom Package
                        </TabsTrigger>
                        <TabsTrigger
                          value="carrier"
                          className="flex-1 pb-3 -mb-1.5 gap-3 data-[state=active]:text-foreground text-muted-foreground data-[state=active]:border-foreground border-b-[1px] hover:text-inherit"
                        >
                          Carrier Package
                        </TabsTrigger>
                      </TabsList>
                    </CardHeader>

                    <CardContent className="pt-1.5">
                      <TabsContent value="custom" className="space-y-4">
                        <div className="flex flex-col gap-2.5">
                          <Label className="text-xs">Package Name</Label>
                          <Input defaultValue="Mike Anderson – Medium Box|" />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:gap-5 gap-2">
                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Package Type</Label>
                            <Select
                              defaultValue="medium-box"
                              indicatorPosition="right"
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Medium Box" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-box">
                                  Small Box
                                </SelectItem>
                                <SelectItem value="medium-box">
                                  Medium Box
                                </SelectItem>
                                <SelectItem value="large-box">
                                  Large Box
                                </SelectItem>
                                <SelectItem value="xlarge-box">
                                  Extra Large Box
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Total Weight</Label>
                            <InputWrapper>
                              <Input type="email" defaultValue="2.1" />
                              <span className="text-2sm font-normal text-muted-foreground">
                                kg
                              </span>
                            </InputWrapper>
                          </div>
                        </div>

                        <div className="flex flex-row items-center lg:gap-5 gap-2">
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Length</Label>
                            <Input type="number" defaultValue="48" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Width</Label>
                            <Input type="number" defaultValue="36" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Height</Label>
                            <Input type="number" defaultValue="20" />
                          </div>

                          <div className="flex lg:basis-1/4 flex-col gap-2.5">
                            <Label className="text-xs text-transparent">
                              Height
                            </Label>
                            <Select defaultValue="sm" indicatorPosition="right">
                              <SelectTrigger>
                                <SelectValue placeholder="cm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sm">sm</SelectItem>
                                <SelectItem value="mm">mm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(value) => {
                              console.log('Checkbox value:', value);
                              setChecked(value === true);
                            }}
                            size="sm"
                          />
                          <Label>Save package for future orders</Label>
                        </div>
                      </TabsContent>

                      <TabsContent value="carrier" className="space-y-4">
                        <div className="flex flex-col gap-2.5">
                          <Label className="text-xs">Package Name</Label>
                          <Input defaultValue="Mike Anderson – Medium Box|" />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:gap-5 gap-2">
                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Package Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Large Box" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-box">
                                  Small Box
                                </SelectItem>
                                <SelectItem value="medium-box">
                                  Medium Box
                                </SelectItem>
                                <SelectItem value="large-box">
                                  Large Box
                                </SelectItem>
                                <SelectItem value="xlarge-box">
                                  Extra Large Box
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <Label className="text-xs">Total Weight</Label>
                            <InputWrapper>
                              <Input type="email" placeholder="1.4" />
                              <span className="text-2sm font-normal text-muted-foreground">
                                kg
                              </span>
                            </InputWrapper>
                          </div>
                        </div>

                        <div className="flex flex-row items-center gap-5">
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Length</Label>
                            <Input type="email" placeholder="34" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Width</Label>
                            <Input type="email" placeholder="26" />
                          </div>
                          <div className="flex basis-2/4 flex-col gap-2.5">
                            <Label className="text-xs">Height</Label>
                            <Input type="email" placeholder="23" />
                          </div>

                          <div className="flex basis-1/4 flex-col gap-2.5">
                            <Label className="text-xs text-transparent">
                              Height
                            </Label>
                            <Select>
                              <SelectTrigger className="">
                                <SelectValue placeholder="mm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sm">sm</SelectItem>
                                <SelectItem value="mm">mm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(value) => {
                              console.log('Checkbox value:', value);
                              setChecked(value === true);
                            }}
                            size="sm"
                          />
                          <Label>This product ship internationally</Label>
                        </div>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              </div>

              <div className="w-full shrink-0 lg:w-[320px] py-5 lg:ps-5">
                <div className="mb-3">
                  <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[200px] shadow-none shrink-0">
                    <img
                      src={toAbsoluteUrl(`/media/store/client/1200x1200/3.png`)}
                      className="cursor-pointer h-[200px]"
                      alt="image"
                    />
                  </Card>
                </div>

                <h3 className="text-foreground text-md font-semibold mb-1">
                  {data?.productInfo?.title || 'Product Title'}
                </h3>

                <span className="text-secondary-foreground text-2sm font-normal leading-4">
                  Lightweight and stylish, these sneakers offer all-day comfort
                  with breathable mesh.
                </span>

                <div className="flex flex-col gap-3.5 mt-4.5">
                  {items.map((item: Item) => (
                    <div
                      key={item.label}
                      className="flex items-center lg:gap-6"
                    >
                      <span className="basis-1/4 text-secondary-foreground text-2sm font-normal">
                        {item.label}
                      </span>

                      {item.label === 'Rating' ? (
                        <div className="basis-2/4 flex items-center gap-2">
                          <Rating rating={4} />
                        </div>
                      ) : (
                        <span className="basis-2/4 text-secondary-foreground text-2sm font-medium">
                          {item.info}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex items-center not-only-of-type:justify-between border-t py-5 px-5 border-border gap-2">
          <Button variant="outline">Print Label</Button>
          <div className="flex items-center gap-2.5">
            <Button variant="outline">Cancel</Button>
            <Button variant="mono">Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
