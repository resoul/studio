'use client';
import { ProductInfoSheet } from '../../components/product-info-sheet';

export function ProductInfoPage() {
  return (
    <div className="container-fluid"> 
      <ProductInfoSheet mockData={[]} />
    </div>
  );
}
