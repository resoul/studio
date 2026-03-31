import { ProductListTable } from "../../tables/product-list";

export function ProductDetailsPage() {
  return (
    <div className="container-fluid">
      {/* Product List Table */}
      <ProductListTable displaySheet={"productDetails"}/>
    </div>
  );
}
