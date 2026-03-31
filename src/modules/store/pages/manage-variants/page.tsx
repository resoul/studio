'use client';

import { ProductListTable } from '../../tables/product-list';

export function ManageVariantsPage() {

  return (
    <div className="container-fluid">
      <ProductListTable displaySheet="manageVariants" />
    </div>
  );
}
