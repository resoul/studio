import { Button } from '@/components/ui/button';
import { StockPlannerTable } from '../../tables/stock-planner';

export function StockPlanner() {
  return (
    <div className="container-fluid space-y-5 lg:space-y-9">
      <div className="flex items-center flex-wrap dap-2.5 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Stock Planner</h1>
          <span className="text-sm text-muted-foreground">
            Smart planning for stock and reorders.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            Reports
          </Button>
          <Button variant="mono" className="gap-2">
            Start New Order
          </Button>
        </div>
      </div>
      <StockPlannerTable />
    </div>
  );
}
