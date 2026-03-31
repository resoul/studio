'use client';

import { useState } from 'react';
import { CreateShippingLabelSheet } from '../../components/create-shipping-label-sheet';
import { ProductListTable } from '../../tables/product-list';

export function CreateShippingLabelPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  return (
    <div className="container-fluid">
      <ProductListTable />
      <CreateShippingLabelSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
