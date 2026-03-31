'use client';

import { useId, useState } from 'react';
import { Star, TrendingUp } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

export function CategoryDetailsEditSheet({
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
  const tableData = [
    {
      productInfo: {
        image: '11.png',
        title: 'Air Max 270 React Eng…',
        label: 'WM-8421',
      },
      totalSales: '$4,283.00',
      lastMoved: '18 Aug, 2025',
    },
    {
      productInfo: {
        image: '1.png',
        title: 'Trail Runner Z2',
        label: 'UC-3990',
      },
      totalSales: '$923.00',
      lastMoved: '17 Aug, 2025',
    },
    {
      productInfo: {
        image: '2.png',
        title: 'Urban Flex Knit Low…',
        label: 'KB-8820',
      },
      totalSales: '$1,097.50 ',
      lastMoved: '15 Aug, 2025',
    },
    {
      productInfo: {
        image: '14.png',
        title: 'Blaze Street Classic',
        label: 'LS-1033',
      },
      totalSales: '$0.00',
      lastMoved: '14 Aug, 2025',
    },
    {
      productInfo: {
        image: '13.png',
        title: 'Terra Trekking Max Pro…',
        label: 'WC-5510',
      },
      totalSales: '$6,412.75',
      lastMoved: '13 Aug, 2025',
    },
  ];

  const id = useId();
  const [checked, setChecked] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>(
    toAbsoluteUrl('/media/store/client/icons/light/running-shoes.svg')
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // If selected image points to icons path, extract file name for light/dark rendering
  const iconFileName: string | null = selectedImage.includes('/icons/')
    ? (selectedImage.split('/').pop() as string)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1080px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">Category Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between flex-wrap gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Running Shoes
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Active
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 text-2sm">
                <span className="font-normal text-muted-foreground">
                  Running Shoes
                </span>
                <span className="font-medium text-foreground">WM-8421</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Created
                </span>
                <span className="font-medium text-foreground">
                  16 Jan, 2025
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Last Updated
                </span>
                <span className="font-medium text-foreground">2 days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost">Close</Button>
              <Button variant="outline">Delete</Button>
              <Button variant="mono">Save</Button>
            </div>
          </div>
          <ScrollArea
            className="flex flex-col h-[calc(100dvh-15.8rem)] mx-1.5"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="grow lg:border-e border-border lg:pe-5 space-y-5 py-5">
                {/* Metrics */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start lg:gap-10 gap-5">
                      {[
                        { label: 'Total Qty', value: '78' },
                        { label: 'Earning', value: '$43,784.02' },
                        { label: 'Return Rate', value: '+1.3%' },
                        { label: 'Avg. Margin', value: '38%' },
                        { label: 'Avg. Rating', value: '5.0' },
                      ].map((item) => (
                        <div key={item.label} className="flex flex-col gap-1.5">
                          <span className="text-2sm font-normal text-secondary-foreground">
                            {item.label}
                          </span>
                          <span className="text-2sm font-medium text-foreground">
                            {item.label?.includes('Avg. Rating') ? (
                              <Badge
                                size="sm"
                                variant="warning"
                                appearance="outline"
                              >
                                <Star
                                  className="text-[#FEC524]"
                                  fill="#FEC524"
                                />
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
                  <CardContent className="grid lg:grid-cols-2 gap-5 lg:gap-7.5 pt-4 pb-5">
                    <div className="space-y-1">
                      <div className="text-2sm font-normal text-secondary-foreground">
                        Avg. Product Price
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
                        <div className="h-[90px] w-full">
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
                                    stopOpacity={0.1}
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
                        Category Product Sales
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-semibold text-foreground">
                          12,346
                        </span>
                        <Badge size="xs" variant="success" appearance="light">
                          <TrendingUp />
                          4%
                        </Badge>
                        <span className="text-2sm font-normal text-secondary-foreground ps-2.5">
                          $243,784,02
                        </span>
                      </div>

                      {/* Recharts Area Chart */}
                      <div className="relative">
                        <div className="h-[90px] w-full">
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
                                    stopOpacity={0.1}
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

                {/* Category Items table */}
                <Card className="rounded-md">
                  <CardHeader className="min-h-[34px] bg-accent/50">
                    <CardTitle className="text-2sm">Category Items</CardTitle>
                    <CardToolbar>
                      <Button mode="link" className="text-primary">
                        Select All
                      </Button>
                    </CardToolbar>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow className="text-secondary-foreground font-normal text-2sm bg-accent/50">
                            <TableHead className="w-[200px] h-8.5 border-e border-border ps-3.5">
                              Product Info
                            </TableHead>
                            <TableHead className="w-[120px] h-8.5 border-e border-border">
                              Total Sales
                            </TableHead>
                            <TableHead className="w-[120px] h-8.5">
                              Last Moved
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {tableData.map((item, index) => (
                            <TableRow key={index} className="">
                              <TableCell className="py-1 border-e border-border ps-3.5 py-2.5">
                                <div className="flex items-center gap-2.5">
                                  <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-none shrink-0">
                                    <img
                                      src={toAbsoluteUrl(
                                        `/media/store/client/1200x1200/${item.productInfo.image}`,
                                      )}
                                      className="cursor-pointer h-[40px] object-cover rounded"
                                      alt="image"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = toAbsoluteUrl('/media/store/client/placeholder.png');
                                      }}
                                    />
                                  </Card>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-2sm font-medium text-foreground leading-3.5">
                                      {item.productInfo.title}
                                    </span>
                                    <span className="text-xs text-muted-foreground uppercase font-normal">
                                      sku:{' '}
                                      <span className="text-xs font-medium text-secondary-foreground">
                                        {item.productInfo.label}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-1 border-e border-border">
                                {item.totalSales}
                              </TableCell>
                              <TableCell className="py-1">
                                {item.lastMoved}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full shrink-0 lg:w-[420px] py-5 lg:ps-5 space-y-4">
                <div className="">
                  <div className="relative">
                    <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[200px] shadow-none shrink-0">
                      {iconFileName ? (
                        <>
                          <img
                            src={toAbsoluteUrl(`/media/store/client/icons/light/${iconFileName}`)}
                            className="cursor-pointer h-[200px] object-contain dark:hidden"
                            alt="image"
                          />
                          <img
                            src={toAbsoluteUrl(`/media/store/client/icons/dark/${iconFileName}`)}
                            className="cursor-pointer h-[200px] object-contain light:hidden"
                            alt="image"
                          />
                        </>
                      ) : (
                        <img
                          src={selectedImage}
                          className="cursor-pointer h-[200px] object-contain"
                          alt="image"
                        />
                      )}
                    </Card>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label htmlFor="category-image-upload" className="absolute bottom-3 right-3">
                      <Button size="sm" variant="outline" asChild>
                        <span>Change</span>
                      </Button>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Label className="text-xs">Category Name</Label>
                  <Input defaultValue="Running Shoes" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-xs">Status</Label>
                  <Select defaultValue="active" indicatorPosition="right">
                    <SelectTrigger>
                      <SelectValue placeholder="Active" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    className="h-[100px]"
                    placeholder="Category Description"
                  />
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
                  <Label>Featured</Label>
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
