'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { EllipsisVertical, Info, SquareMinus, SquarePlus, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Card,
  CardFooter,
  CardTable,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CreateShippingLabelSheet } from '../components/create-shipping-label-sheet';
import { TrackShippingSheet } from '../components/track-shipping-sheet';
import { ProductInfoSheet } from '../components/product-info-sheet';
import { OrderDetailsSheet } from '../components/order-details-sheet';
import type { VariantProps } from 'class-variance-authority';
import { Settings, Pencil } from 'lucide-react';
import { DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

// ---- DATA TYPE ----
export interface OrderItemData {
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
    tooltip: string;
  };
  category: string;
  price: string;
  trends: {
    label: string;
    variant: VariantProps<typeof Badge>['variant'];
  };
  stock: number;
  reserved: number;
  thresholdLevel: number;
  supplier: {
    name: string;
    logo: string;
  };
}

export interface DetailsOrdersData {
  date: string;
  order: string;
  id: string;
  total: string;
  paymentStatus: {
    label: string;
    variant: VariantProps<typeof Badge>['variant'];
  };
  items: number;
  carrier: {
    name: string;
    logo: string;
  };
  category: string;
}

interface DetailsOrdersProps {
  mockData?: DetailsOrdersData[];
  displayProducts?: boolean;
}

// ---- MOCK DATA ----
const orderItemsMockData: OrderItemData[] = [
  {
    id: '1',
    productInfo: {
      image: '11.png',
      title: 'Air Max 270 React Eng...',
      label: 'WM-8421',
      tooltip: 'Air Max 270 React Engineered - Premium sneakers with advanced cushioning technology',
    },
    category: 'Sneakers',
    price: '$83.00',
    trends: {
      label: 'Fast Moving',
      variant: 'success',
    },
    stock: 92,
    reserved: 5,
    thresholdLevel: 110,
    supplier: {
      name: 'SwiftStock',
      logo: 'clusterhq.svg',
    },
  },
  {
    id: '2',
    productInfo: {
      image: '10.png',
      title: 'Trail Runner Z2',
      label: 'UC-3990',
      tooltip: 'Trail Runner Z2 - High-performance outdoor running shoes with superior grip',
    },
    category: 'Outdoor',
    price: '$110.00',
    trends: {
      label: 'Promo',
      variant: 'info',
    },
    stock: 12,
    reserved: 3,
    thresholdLevel: 250,
    supplier: {
      name: 'NexaSource',
      logo: 'coinhodler.svg',
    },
  },
  {
    id: '3',
    productInfo: {
      image: '9.png',
      title: 'Urban Flex Knit Low...',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low - Comfortable urban running shoes with flexible knit upper',
    },
    category: 'Runners',
    price: '$76.50',
    trends: {
      label: 'Clearance',
      variant: 'warning',
    },
    stock: 47,
    reserved: 9,
    thresholdLevel: 40,
    supplier: {
      name: 'CoreMart',
      logo: 'infography.svg',
    },
  },
  {
    id: '4',
    productInfo: {
      image: '8.png',
      title: 'Blaze Street Classic',
      label: 'LS-1033',
      tooltip: 'Blaze Street Classic - Timeless street style sneakers with modern comfort',
    },
    category: 'Sneakers',
    price: '$69.99',
    trends: {
      label: 'Slow Moving',
      variant: 'destructive',
    },
    stock: 0,
    reserved: 0,
    thresholdLevel: 100,
    supplier: {
      name: 'StockLab',
      logo: 'clusterhq.svg',
    },
  },
];

const mockData: DetailsOrdersData[] = [
  {
    id: '1',
    order: 'SO-TX-4587',
    date: '18 Aug, 2025',
    total: '$372.93',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
  {
    id: '2',
    order: 'SO-TX-4590',
    date: '17 Aug, 2025',
    total: '$245.10',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 1,
    carrier: {
      name: 'FedEx Standard',
      logo: 'fedEx.svg',
    },
    category: 'Clothing',
  },
  {
    id: '3',
    order: 'SO-CA-1254',
    date: '16 Aug, 2025',
    total: '$1,024.50',
    paymentStatus: {
      label: 'Pending',
      variant: 'info',
    },
    items: 3,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Home & Garden',
  },
  {
    id: '4',
    order: 'SO-NY-8874',
    date: '12 Aug, 2025',
    total: '$540.00',
    paymentStatus: {
      label: 'Failed',
      variant: 'destructive',
    },
    items: 2,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
  {
    id: '5',
    order: 'SO-FL-5633',
    date: '5 Aug, 2025',
    total: '$120.99',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 3,
    carrier: {
      name: 'DHL Express',
      logo: 'dhl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '6',
    order: 'SO-WA-3321',
    date: '17 Jul, 2025',
    total: '$620.00',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
  {
    id: '7',
    order: 'SO-CA-1255',
    date: '23 Jul, 2025',
    total: '$215.75',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 1,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '8',
    order: 'SO-NV-7755',
    date: '20 Jul, 2025',
    total: '$430.20',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 4,
    carrier: {
      name: 'In-Store Pickup',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '9',
    order: 'SO-WA-3321',
    date: '17 Jul, 2025',
    total: '$620.00',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
  {
    id: '10',
    order: 'SO-IL-9912',
    date: '11 Jul, 2025',
    total: '$980.49',
    paymentStatus: {
      label: 'Pending',
      variant: 'info',
    },
    items: 8,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '11',
    order: 'SO-CA-1256',
    date: '8 Jul, 2025',
    total: '$345.67',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'FedEx Standard',
      logo: 'fedEx.svg',
    },
    category: 'Clothing',
  },
  {
    id: '12',
    order: 'SO-TX-4594',
    date: '5 Jul, 2025',
    total: '$1,250.00',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 5,
    carrier: {
      name: 'DHL Express',
      logo: 'dhl.svg',
    },
    category: 'Home & Garden',
  },
  {
    id: '13',
    order: 'SO-NY-8875',
    date: '2 Jul, 2025',
    total: '$89.99',
    paymentStatus: {
      label: 'Failed',
      variant: 'destructive',
    },
    items: 1,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
  {
    id: '14',
    order: 'SO-FL-5634',
    date: '29 Jun, 2025',
    total: '$567.89',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 3,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '15',
    order: 'SO-TX-4595',
    date: '26 Jun, 2025',
    total: '$2,100.50',
    paymentStatus: {
      label: 'Cancelled',
      variant: 'warning',
    },
    items: 7,
    carrier: {
      name: 'FedEx Standard',
      logo: 'fedEx.svg',
    },
    category: 'Electronics',
  },
  {
    id: '16',
    order: 'SO-CA-1257',
    date: '23 Jun, 2025',
    total: '$445.75',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'DHL Express',
      logo: 'dhl.svg',
    },
    category: 'Clothing',
  },
  {
    id: '17',
    order: 'SO-NV-7756',
    date: '20 Jun, 2025',
    total: '$789.25',
    paymentStatus: {
      label: 'Pending',
      variant: 'info',
    },
    items: 4,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Home & Garden',
  },
  {
    id: '18',
    order: 'SO-WA-3322',
    date: '17 Jun, 2025',
    total: '$156.00',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 1,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '19',
    order: 'SO-IL-9913',
    date: '14 Jun, 2025',
    total: '$890.30',
    paymentStatus: {
      label: 'Failed',
      variant: 'destructive',
    },
    items: 3,
    carrier: {
      name: 'FedEx Standard',
      logo: 'fedEx.svg',
    },
    category: 'Electronics',
  },
  {
    id: '20',
    order: 'SO-CA-1258',
    date: '11 Jun, 2025',
    total: '$1,450.00',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 6,
    carrier: {
      name: 'DHL Express',
      logo: 'dhl.svg',
    },
    category: 'Home & Garden',
  },
  {
    id: '21',
    order: 'SO-TX-4596',
    date: '8 Jun, 2025',
    total: '$234.56',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 2,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Clothing',
  },
  {
    id: '22',
    order: 'SO-NY-8876',
    date: '5 Jun, 2025',
    total: '$678.90',
    paymentStatus: {
      label: 'Cancelled',
      variant: 'warning',
    },
    items: 4,
    carrier: {
      name: 'PostNL',
      logo: 'postNl.svg',
    },
    category: 'Electronics',
  },
  {
    id: '23',
    order: 'SO-FL-5635',
    date: '2 Jun, 2025',
    total: '$345.67',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 1,
    carrier: {
      name: 'FedEx Standard',
      logo: 'fedEx.svg',
    },
    category: 'Clothing',
  },
  {
    id: '24',
    order: 'SO-TX-4597',
    date: '30 May, 2025',
    total: '$1,890.25',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
    items: 8,
    carrier: {
      name: 'DHL Express',
      logo: 'dhl.svg',
    },
    category: 'Home & Garden',
  },
  {
    id: '25',
    order: 'SO-CA-1259',
    date: '27 May, 2025',
    total: '$567.89',
    paymentStatus: {
      label: 'Pending',
      variant: 'info',
    },
    items: 3,
    carrier: {
      name: 'UPS Global',
      logo: 'ups.svg',
    },
    category: 'Electronics',
  },
];


// ---- MAIN TABLE COMPONENT ----
export function DetailsOrdersTable({ mockData: propsMockData, displayProducts = false }: DetailsOrdersProps & { displayProducts?: boolean }) {
  const rawData = propsMockData || mockData;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({});

  const [trackShippingSheetOpen, setTrackShippingSheetOpen] = useState(false);
  const [orderDetailsSheetOpen, setOrderDetailsSheetOpen] = useState(false);

  const [createShippingSheetOpen, setCreateShippingSheetOpen] = useState(false);

  const [productInfoSheetOpen, setProductInfoSheetOpen] = useState(false);

  const [createModalData] = useState<DetailsOrdersData | null>(null);

  // --- DATA ---
  const filteredData = rawData;

  // Auto-expand first row when displayProducts is true
  useEffect(() => {
    if (displayProducts && filteredData.length > 0) {
      setExpandedRows({ [filteredData[0].id]: true });
    } else if (!displayProducts) {
      // Clear expanded rows when displayProducts is false
      setExpandedRows({});
    }
  }, [displayProducts, filteredData]);

  // --- COLUMNS ---
  const columns = useMemo<ColumnDef<DetailsOrdersData>[]>(
    () => [
      {
        id: 'order',
        accessorFn: (row) => row.order,
        header: ({ column }) => (
          <DataGridColumnHeader title="OrderID" column={column} />
        ),
        cell: (info) => (
          <Link to="#" className="text-2sm text-primary font-normal" onClick={() => setOrderDetailsSheetOpen(true)}>
            {info.row.original.order}
          </Link>
        ),
        enableSorting: true,
        size: 120,
      },
      {
        id: 'date',
        accessorFn: (row) => row.date,
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        cell: (info) => info.row.original.date,
        enableSorting: true,
        size: 120,
      },
      {
        id: 'total',
        accessorFn: (row) => row.total,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total" column={column} />
        ),
        cell: (info) => info.row.original.total,
        enableSorting: true,
        size: 100,
      },
      {
        id: 'paymentStatus',
        accessorFn: (row) => row.paymentStatus,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payment St." column={column} />
        ),
        cell: (info) => {
          const ps = info.row.original.paymentStatus;
          return (
            <Badge variant={ps.variant} appearance="light">
              {ps.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 100,
      },
      {
        id: 'items',
        accessorFn: (row) => row.items,
        header: ({ column }) => (
          <DataGridColumnHeader title="Items" column={column} />
        ),
        cell: (info) => (
          <div 
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={() => info.row.getToggleExpandedHandler()()}
          >
            {info.row.original.items} items
          </div>
        ),
        enableSorting: true,
        size: 100,
      },
      {
        id: 'carrier',
        accessorFn: (row) => row.carrier,
        header: ({ column }) => (
          <DataGridColumnHeader title="Carrier" column={column} />
        ),
        cell: (info) => (
          <Button variant="outline" size="sm" onClick={() => setTrackShippingSheetOpen(true)}>
            <img
              src={toAbsoluteUrl(`/media/brand-logos/${info.row.original.carrier.logo}`)}
              className="h-3.5 rounded-full"
              alt={info.row.original.carrier.name}
            />
            
            {info.row.original.carrier.name}
          </Button>
        ),
        enableSorting: true,
        size: 140,
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="Actions" column={column} />
        ),
        enableSorting: false,
        cell: ({row}) => (
          <div className="flex grow justify-center items-center gap-1.5">
            <Button
                className="size-6 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  row.getToggleExpandedHandler()();
                }}
                variant="ghost" 
                mode="icon" 
                size="sm"
            >
              {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" mode="icon" size="sm" >
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOrderDetailsSheetOpen(true)}>
                  <Info />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTrackShippingSheetOpen(true)}>
                  <Pencil />
                  Track Shipping
                </DropdownMenuItem>
                {displayProducts && (
                  <DropdownMenuItem onClick={() => setProductInfoSheetOpen(true)}>
                    <SquarePlus />
                    View Products
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings />
                  Edit Order
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 80,
          meta: {
           expandedContent: (row) => <OrderListTable rowData={row} />,
         },
      },
    ],
    [displayProducts],
  );

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      toast.custom(
        (t) => (
          <Alert
            variant="mono"
            icon="success"
            close={true}
            onClose={() => toast.dismiss(t)}
          >
            <AlertIcon>
              <Info />
            </AlertIcon>
            <AlertTitle>
              Selected row IDs: {selectedRowIds.join(', ')}
            </AlertTitle>
          </Alert>
        ),
        {
          duration: 5000,
        },
      );
    }
  }, [rowSelection]);

  const table = useReactTable({ 
    data: filteredData,
    columns,
    state: {
      pagination,
      sorting,
      rowSelection,
      expanded: expandedRows,
    },
    getRowId: (row: DetailsOrdersData) => row.id,
    getRowCanExpand: (row) => Boolean(row.original.id),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpandedRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <TrackShippingSheet
        open={trackShippingSheetOpen}
        onOpenChange={setTrackShippingSheetOpen}
      />

      {createModalData && (
        <CreateShippingLabelSheet
          open={createShippingSheetOpen}
          onOpenChange={setCreateShippingSheetOpen}
          data={createModalData}
        />
      )}

      {productInfoSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="rounded-lg p-6 w-full mx-4 overflow-y-auto bg-[#FAFAFA]">
            <ProductInfoSheet
              mockData={[]}
            />
          </div>
        </div>
      )}

      {orderDetailsSheetOpen && (
        <OrderDetailsSheet
          open={orderDetailsSheetOpen}
          onOpenChange={setOrderDetailsSheetOpen}
          onTrackShipping={() => {
            setOrderDetailsSheetOpen(false);
            setTrackShippingSheetOpen(true);
          }}
        />
      )}

      <Card>

        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}

// ---- ORDER ITEMS SUB TABLE COMPONENT ----
interface OrderListTableProps {
  rowData?: unknown;
}

function OrderListTable({}: OrderListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<OrderItemData>[]>(
    () => [
      {
        id: 'productInfo',
        accessorFn: (row) => row.productInfo,
        header: ({ column }) => (
          <DataGridColumnHeader title="Product Info" column={column} />
        ),
        cell: (info) => {
          const productInfo = info.row.getValue('productInfo') as {
            image: string;
            title: string;
            label: string;
            tooltip: string;
          };

          return (
            <div className="flex items-center gap-2.5">
              <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-none shrink-0">
                <img
                  src={toAbsoluteUrl(
                    `/media/store/client/1200x1200/${productInfo.image}`,
                  )}
                  className="cursor-pointer h-[40px]"
                  alt="image"
                />
              </Card>
              <div className="flex flex-col gap-1">
                {productInfo.title.length > 20 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="text-sm font-medium text-foreground leading-3.5 truncate max-w-[180px] cursor-pointer hover:text-primary transition-colors"
                        >
                          {productInfo.title}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{productInfo.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span
                    className="text-sm font-medium text-foreground leading-3.5 cursor-pointer hover:text-primary transition-colors"
                  >
                    {productInfo.title}
                  </span>
                )}
                <span className="text-xs text-muted-foreground uppercase">
                  sku:{' '}
                  <span className="text-xs font-medium text-secondary-foreground">
                    {productInfo.label}
                  </span>
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 250,
      },
      {
        id: 'category',
        accessorFn: (row) => row.category,
        header: ({ column }) => (
          <DataGridColumnHeader title="Category" column={column} />
        ),
        cell: (info) => info.row.original.category,
        enableSorting: true,
        size: 100,
      },
      {
        id: 'price',
        accessorFn: (row) => row.price,
        header: ({ column }) => (
          <DataGridColumnHeader title="Price" column={column} />
        ),
        cell: (info) => info.row.original.price,
        enableSorting: true,
        size: 80,
      },
      {
        id: 'trends',
        accessorFn: (row) => row.trends,
        header: ({ column }) => (
          <DataGridColumnHeader title="Trends" column={column} />
        ),
        cell: (info) => {
          const trends = info.row.original.trends;
          return (
            <Badge variant={trends.variant} appearance="light">
              {trends.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 125,
      },
      {
        id: 'stock',
        accessorFn: (row) => row.stock,
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: (info) => info.row.original.stock,
        enableSorting: true,
        size: 80,
      },
      {
        id: 'reserved',
        accessorFn: (row) => row.reserved,
        header: ({ column }) => (
          <DataGridColumnHeader title="Rsvd" column={column} />
        ),
        cell: (info) => info.row.original.reserved,
        enableSorting: true,
        size: 80,
      },
      {
        id: 'thresholdLevel',
        accessorFn: (row) => row.thresholdLevel,
        header: ({ column }) => (
          <DataGridColumnHeader title="T-Lvl" column={column} />
        ),
        cell: (info) => info.row.original.thresholdLevel,
        enableSorting: true,
        size: 80,
      },
      {
        id: 'supplier',
        accessorFn: (row) => row.supplier,
        header: ({ column }) => (
          <DataGridColumnHeader title="Supplier" column={column} />
        ),
        cell: (info) => {
          return (
            <div className="flex items-center gap-1.5">
              <img
                src={toAbsoluteUrl(
                  `/media/brand-logos/${info.row.original.supplier.logo}`,
                )}
                className="h-6 rounded-full"
                alt="image"
              />
              <span className="leading-none text-secondary-foreground">
                {info.row.original.supplier.name}
              </span>
            </div>
          );
        },
        enableSorting: true,
        size: 160,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: orderItemsMockData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row: OrderItemData) => row.id,
  });

  return (
    <div className="bg-muted/30 p-5">
      <div className="bg-card rounded-lg border border-muted-foreground/22 overflow-x-auto">
        <DataGrid
          table={table}
          recordCount={orderItemsMockData.length}
          tableLayout={{
            cellBorder: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
          }}
        >
          <DataGridTable />
        </DataGrid>
      </div>
    </div>
  );
}

