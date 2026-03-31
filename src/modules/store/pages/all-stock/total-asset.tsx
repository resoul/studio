import { BadgeDot } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InventoryRow {
  name: string;
  qty: number;
}
type InventoryRows = Array<InventoryRow>;

interface InventoryItem {
  badgeColor: string;
  label: string;
  total: number;
}
type InventoryItems = Array<InventoryItem>;

type InventoryProps = object;

const Inventory = ({}: InventoryProps) => {
  const items: InventoryItems = [
    {
      badgeColor: 'opacity-100 bg-green-500 size-2',
      label: 'In stock',
      total: 1892,
    },
    {
      badgeColor: 'opacity-100 bg-yellow-500 size-2',
      label: 'Low stock',
      total: 164,
    },
    {
      badgeColor: 'opacity-100 bg-destructive size-2',
      label: 'Out of stock',
      total: 257,
    },
  ];

  const renderItem = (item: InventoryItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <BadgeDot className={item.badgeColor} />
        <span className="text-sm font-normal text-secondary-foreground">
          {item.label}:
          <span className="text-sm font-semibold text-foreground ms-1">
            {item.total}
          </span>
        </span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="flex gap-2 lg:gap-6 p-5 lg:p-7.5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-normal text-muted-foreground">
            Total Asset Value
          </span>
          <span className="text-3xl font-semibold text-foreground">
            $106,576.00
          </span>
        </div>

        <Separator className="mx-5" orientation="vertical" />

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 mb-2 -mt-1">
            <span className="text-xl font-semibold text-dark leading-0">
              2258
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              products
            </span>
          </div>
          <div className="flex items-center gap-1 mb-2.5">
            <div className="bg-green-500 h-2 w-full rounded-xs"></div>
            <div className="bg-yellow-500 h-2 w-full max-w-[90px] rounded-xs"></div>
            <div className="bg-destructive h-2 w-full max-w-[143px] rounded-xs"></div>
          </div>

          <div className="flex items-center flex-wrap gap-4 -mb-1">
            {items.map((item, index) => renderItem(item, index))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export {
  Inventory,
  type InventoryRow,
  type InventoryRows,
  type InventoryItem,
  type InventoryItems,
  type InventoryProps,
};
