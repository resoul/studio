import { AllStockTable } from '../../tables/all-stock';
import { Inventory } from './total-asset';

export function AllStock() {
  return (
    <div className="container-fluid">
      <div className="grid gap-5 lg:gap-7.5">
        <Inventory />
        <AllStockTable />
      </div>
    </div>
  );
}
