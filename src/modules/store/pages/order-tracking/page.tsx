import { useState } from 'react';
import { TrackShippingSheet } from '../../components/track-shipping-sheet';
import { OrderListTable } from '../../tables/order-list';
import { Button } from '@/components/ui/button';
import { PlusIcon, Upload } from 'lucide-react';  
import { ProductFormSheet } from '../../components/product-form-sheet';

export function OrderTrackingPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true); 
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);

  return (
    <>
      <div className="container-fluid space-y-5 lg:space-y-9">
        <div className="flex items-center flex-wrap gap-2.5 justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-foreground">Order List</h1>
            <span className="text-sm text-muted-foreground">
              435 orders found. 62 orders needs your attention.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button
              variant="mono"
              className="gap-2"
              onClick={() => setIsCreateProductOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Add Order
            </Button>
          </div>
        </div>

        {/* Order List Table */}
        <OrderListTable />
          <TrackShippingSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        
        {/* Create Order Modal */}
        <ProductFormSheet
          mode="new"
          open={isCreateProductOpen}
          onOpenChange={setIsCreateProductOpen}
        />
      </div>
    </>
  );
}
