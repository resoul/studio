/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import {
  Card,
  CardTable,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface IData {
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
    variant: string;
  };
  stock: number;
  rsvd: number;
  tlvl: number;
  supplier: {
    logo: string;
    name: string;
  }; 
}

interface ProductInfoSheetProps {
  mockData?: IData[];
  onClose?: () => void;
}

const mockData: IData[] = [
  {
    id: '1',
    productInfo: {
      image: '11.png',
      title: 'Air Max 270 React Eng…',
      label: 'WM-8421',
      tooltip: 'Air Max 270 React Engineered',
    },
    category: 'Sneakers',
    price: '$83.00',
    trends: {
      label: 'Fast Moving',
      variant: 'success',
    },
    stock: 92,
    rsvd: 5,
    tlvl: 10,
    supplier: {
      name: 'SwiftStock',
      logo: 'clusterhq.svg',
    }
  },
  {
    id: '2',
    productInfo: {
      image: '1.png',
      title: 'Trail Runner Z2',
      label: 'UC-3990',
      tooltip: '',
    },
    category: 'Outdoor',
    price: '$110.00',
    trends: {
      label: 'Promo',
      variant: 'info',
    },
    stock: 12,
    rsvd: 3,
    tlvl: 250,
    supplier: {
      name: 'SwiftStock',
      logo: 'quickbooks.svg',
    }
  },
  {
    id: '3',
    productInfo: {
      image: '2.png',
      title: 'Urban Flex Knit Low…',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low Sneakers',
    },
    category: 'Runners',
    price: '$76.50',
    trends: {
      label: 'Clearance',
      variant: 'warning',
    },
    stock: 47,
    rsvd: 9,
    tlvl: 40,
    supplier: {
      name: 'VeloSource',
      logo: 'equacoin.svg',
    }
  }, 
  {
    id: '4',
    productInfo: {
      image: '13.png',
      title: 'Terra Trekking Max Pro…',
      label: 'WC-5510',
      tooltip: 'Terra Trekking Max Pro Hiker',
    },
    category: 'Sneakers',
    price: '$69.99',
    trends: {
      label: 'Slow Moving',
      variant: 'destructive',
    },
    stock: 0,
    rsvd: 0,
    tlvl: 100,
    supplier: {
      name: 'NexaSource',
      logo: 'coinhodler.svg',
    },
  },  
];

const ProductInfoSheet = ({ onClose }: ProductInfoSheetProps) => {
  // Always use local mockData for now
  const data = mockData; 
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [, setSorting] = useState<SortingState>([]);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSelectedProduct] = useState<IData | undefined>(
    undefined,
  );

  const handleProductClick = (product: IData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };


  const ColumnInputFilter = <TData, TValue>({
    column,
  }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        variant="sm"
        className="w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        id: 'productInfo',
        accessorFn: (row) => row.productInfo,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Product Info"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
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
                  src={`/media/store/client/1200x1200/${productInfo.image}`}
                  className="cursor-pointer h-[40px]"
                  alt="image"
                />
              </Card>

              <div className="flex flex-col gap-1">
                {productInfo.title.includes('…') ||
                productInfo.title.includes('...') ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Link
                        to="#"
                        onClick={() => handleProductClick(info.row.original)}
                        className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                      >
                        {productInfo.title}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {productInfo.tooltip ||
                          productInfo.title.replace(/[….]/g, '')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    to="#"
                    className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                  >
                    {productInfo.title}
                  </Link>
                )}

                <span className="inline-flex items-center gap-0.5">
                  <span className="text-xs text-muted-foreground uppercase">
                    sku:
                  </span>{' '}
                  <span className="text-xs font-medium text-secondary-foreground">
                    {productInfo.label}
                  </span>
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 270,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'category',
        accessorFn: (row) => row.category,
        header: ({ column }) => (
          <DataGridColumnHeader title="Category" column={column} />
        ),
        cell: (info) => {
          return info.row.original.category;
        },
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'price',
        accessorFn: (row) => row.price,
        header: ({ column }) => (
          <DataGridColumnHeader title="Price" column={column} />
        ),
        cell: (info) => {
          return info.row.original.price;
        },
        enableSorting: true,
        size: 90, 
      },
      {
        id: 'trends',
        accessorFn: (row) => row.trends,
        header: ({ column }) => (
          <DataGridColumnHeader title="Trends" column={column} />
        ),
        cell: (info) => {
          const trends = info.row.original.trends;
          const variant = trends.variant as keyof BadgeProps['variant'];
          return (
            <Badge variant={variant} appearance="light">
              {trends.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 90, 
      },
      {
        id: 'stock',
        accessorFn: (row) => row.stock,
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: (info) => {
          return info.row.original.stock;
        },
        enableSorting: true,
        size: 70,
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'rsvd',
        accessorFn: (row) => row.rsvd,
        header: ({ column }) => (
          <DataGridColumnHeader title="Rsvd" column={column} />
        ),
        cell: (info) => {
          return info.row.original.rsvd;
        },
        enableSorting: true,
        size: 70,
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'tlvl',
        accessorFn: (row) => row.tlvl,
        header: ({ column }) => (
          <DataGridColumnHeader title="T-Lvl" column={column} />
        ),
        cell: (info) => {
          return info.row.original.tlvl;
        },
        enableSorting: true,
        size: 70,
        meta: {
          cellClassName: 'text-center',
        },
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
                src={toAbsoluteUrl(`/media/brand-logos/${info.row.original.supplier.logo}`)}
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
        meta: {
          cellClassName: '',
        },
      },
    ],
    []
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
    data: data,
    columns, 
    columnResizeMode: 'onChange', 
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleBackgroundClick = () => {
    // Close the sheet when clicking outside
    if (onClose) {
      onClose();
    }
  };

  return (
    <div onClick={handleBackgroundClick} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <DataGrid
          table={table}
          recordCount={data.length}
          tableLayout={{
            columnsPinnable: true,
            columnsMovable: true,
            columnsVisibility: true,
            cellBorder: true,
          }}
        >
          <Card>
            <CardTable>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardTable>
          </Card>
        </DataGrid>
      </div>
    </div>
  );
};

export { ProductInfoSheet };
