import { StockNavbar } from '../../components/stock-navbar';
import { InboundStockTable } from '../../tables/inbound-stock';

export function InboundStock() {
  return (
    <>
      <StockNavbar />
      <div className="container-fluid">
        <InboundStockTable />
      </div>
    </>
  );
}
