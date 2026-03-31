'use client';

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
  import { CustomerDetailsOverviews } from './customers/customer-details-overviews'; 
  import { CustomerDetailsOrders } from './customers/customer-details-orders'; 
  import { CustomerDetailsInvoice } from './customers/customer-details-invoice'; 
  import { CustomerDetailsBilling } from './customers/customer-details-billing'; 
  import { CustomerDetailsReviews } from './customers/customer-details-reviews'; 
  import { CustomerDetailsActivity } from './customers/customer-details-active';
  import { Upload } from './customers/components/upload';

export function CustomerDetailsSheet({
  open,
  onOpenChange,
  onEditClick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: () => void;
}) { 

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 lg:w-[1160px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">Customer Details</SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0 grow">
          <div className="flex justify-between flex-wrap gap-2 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="lg:text-[22px] font-semibold text-foreground leading-none">
                  Jeroen de Jong
                </span>
                <Badge size="sm" variant="success" appearance="light">
                  Active
                </Badge>
              </div>
              <div className="flex items-center flex-wrap gap-2 text-2sm">
                <span className="font-normal text-muted-foreground">
                  Customer ID:
                </span>
                <span className="font-medium text-foreground">583920-XT</span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Joined
                </span>
                <span className="font-medium text-foreground">
                  16 Jan, 2022
                </span>
                <BadgeDot className="bg-muted-foreground size-1" />
                <span className="font-normal text-muted-foreground">
                  Last Visit
                </span>
                <span className="font-medium text-foreground">2 days ago</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
              <Button variant="outline">Send Email</Button>
              <Button variant="mono" onClick={onEditClick}>Edit Details</Button>
            </div>
          </div>
          <ScrollArea
            className="flex flex-col h-[calc(100dvh-15.8rem)] mx-1.5"
            viewportClassName="[&>div]:h-full [&>div>div]:h-full"
          >
            <div className="flex flex-wrap lg:flex-nowrap px-3.5 grow">
              <div className="w-full shrink-0 lg:w-[280px] py-5 lg:pe-5 space-y-4">
                <Upload />
              </div>

              <div className="grow lg:border-s border-border space-y-5 py-5 lg:ps-5">   
                <Tabs defaultValue="overview" className="w-auto text-sm text-muted-foreground">
                  <TabsList className="inline-flex w-auto grow-0 mb-2.5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="billin">Billing Details</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <CustomerDetailsOverviews />
                  </TabsContent>
                  <TabsContent value="orders">
                    <CustomerDetailsOrders />
                  </TabsContent>
                    <TabsContent value="invoices">
                      <CustomerDetailsInvoice />
                    </TabsContent>
                  <TabsContent value="billin">
                    <CustomerDetailsBilling />
                  </TabsContent>
                  <TabsContent value="reviews">
                    <CustomerDetailsReviews />
                  </TabsContent>
                  <TabsContent value="activity">
                    <CustomerDetailsActivity />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex-row border-t pb-4 p-5 border-border gap-2.5 lg:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          <Button variant="outline">Send Email</Button>
          <Button variant="mono" onClick={onEditClick}>Edit Details</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
