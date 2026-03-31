'use client';

import { useState } from 'react';
import { ProductFormSheet } from '../../components/product-form-sheet';
import { ProductListTable } from '../../tables/product-list';

export function CreateProductPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  return (
    <div className="container-fluid">
      <ProductListTable />
      <ProductFormSheet mode="new" open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </div>
  );
}
