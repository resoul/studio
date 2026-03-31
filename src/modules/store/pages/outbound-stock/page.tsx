import { StockNavbar } from '../../components/stock-navbar';
import { OutboundStockTable } from '../../tables/outbound-stock';

export function OutboundStock() {
  return (
    <>
      <StockNavbar />
      <div className="container-fluid">
        <OutboundStockTable />
      </div>
    </>
  );
}
