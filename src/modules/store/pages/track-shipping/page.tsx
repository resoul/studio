'use client';

import { useState } from 'react';
import { TrackShippingSheet } from '../../components/track-shipping-sheet';
import { ProductListTable } from '../../tables/product-list';

export function TrackShippingPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  return (
    <div className="container-fluid">
      <ProductListTable />
      <TrackShippingSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
