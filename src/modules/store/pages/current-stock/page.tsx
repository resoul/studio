import { StockNavbar } from '../../components/stock-navbar';
import { CurrentStockTable } from '../../tables/current-stock';

export function CurrentStock() {
  return (
    <>
      <StockNavbar />
      <div className="container-fluid">
        <CurrentStockTable />
      </div>
    </>
  );
}
