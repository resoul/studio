'use client';

import { useState } from 'react';
import { PerProductStockSheet } from '../../components/per-product-stock-sheet';
import { ProductListTable } from '../../tables/product-list';

export function PerProductStockPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  return (
    <div className="container-fluid">
      <ProductListTable />
      <PerProductStockSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
