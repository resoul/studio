'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDown,
  EllipsisVertical,
  Info,
  Pencil,
  Search,
  Settings,
  Trash,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PerProductStockSheet } from '../components/per-product-stock-sheet';
import { ProductDetailsAnalyticsSheet } from '../components/product-details-analytics-sheet';

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
  stock: number;
  rsvd: number;
  tlvl: number;
  delta: {
    label: string;
    variant: string;
  };
  flow: number;
  reorderIn: {
    days: number;
    date: string;
  };
  reorder: number;
  leadTime: {
    days: number;
    date: string;
  };
  ar: boolean;
}

interface StockPlannerProps {
  mockData?: IData[];
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
    stock: 92,
    rsvd: 2,
    tlvl: 1,
    delta: {
      label: '+29',
      variant: 'success',
    },
    flow: 8.24,
    reorderIn: {
      days: 3,
      date: '16 Aug, 2025',
    },
    reorder: 120,
    leadTime: {
      days: 14,
      date: '27 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '2',
    productInfo: {
      image: '1.png',
      title: 'Trail Runner Z2',
      label: 'UC-3990',
      tooltip: '',
    },
    stock: 12,
    rsvd: 3,
    tlvl: 250,
    delta: {
      label: '-238',
      variant: 'destructive',
    },
    flow: 0.41,
    reorderIn: {
      days: 5,
      date: '18 Aug, 2025',
    },
    reorder: 500,
    leadTime: {
      days: 14,
      date: '27 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '3',
    productInfo: {
      image: '2.png',
      title: 'Urban Flex Knit Low…',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low Sneakers',
    },
    stock: 47,
    rsvd: 9,
    tlvl: 40,
    delta: {
      label: '+7',
      variant: 'success',
    },
    flow: 0.31,
    reorderIn: {
      days: 4,
      date: '17 Aug, 2025',
    },
    reorder: 40,
    leadTime: {
      days: 15,
      date: '28 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '4',
    productInfo: {
      image: '15.png',
      title: 'Blaze Street Classic',
      label: 'LS-1033',
      tooltip: '',
    },
    stock: 0,
    rsvd: 0,
    tlvl: 100,
    delta: {
      label: '-100',
      variant: 'destructive',
    },
    flow: 0.43,
    reorderIn: {
      days: 3,
      date: '16 Aug, 2025',
    },
    reorder: 100,
    leadTime: {
      days: 19,
      date: '01 Sep, 2025',
    },
    ar: true,
  },
  {
    id: '5',
    productInfo: {
      image: '13.png',
      title: 'Terra Trekking Max Pro…',
      label: 'WC-5510',
      tooltip: 'Terra Trekking Max Pro Hiker',
    },
    stock: 120,
    rsvd: 24,
    tlvl: 80,
    delta: {
      label: '+40',
      variant: 'success',
    },
    flow: 3.29,
    reorderIn: {
      days: 5,
      date: '18 Aug, 2025',
    },
    reorder: 240,
    leadTime: {
      days: 17,
      date: '30 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '6',
    productInfo: {
      image: '7.png',
      title: 'Lite Runner Evo',
      label: 'GH-7312',
      tooltip: '',
    },
    stock: 33,
    rsvd: 2,
    tlvl: 30,
    delta: {
      label: '+3',
      variant: 'warning',
    },
    flow: 0.36,
    reorderIn: {
      days: 3,
      date: '16 Aug, 2025',
    },
    reorder: 50,
    leadTime: {
      days: 10,
      date: '23 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '7',
    productInfo: {
      image: '17.png',
      title: 'Classic Street Wear 2.0…',
      label: 'UH-2300',
      tooltip: 'Classic Street Wear 2.0 Collection',
    },
    stock: 5,
    rsvd: 0,
    tlvl: 10,
    delta: {
      label: '-5',
      variant: 'warning',
    },
    flow: 0.3,
    reorderIn: {
      days: 4,
      date: '17 Aug, 2025',
    },
    reorder: 30,
    leadTime: {
      days: 17,
      date: '30 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '8',
    productInfo: {
      image: '3.png',
      title: 'Enduro AllTerrain High…',
      label: 'MS-8702',
      tooltip: '',
    },
    stock: 64,
    rsvd: 9,
    tlvl: 50,
    delta: {
      label: '+14',
      variant: 'success',
    },
    flow: 0.15,
    reorderIn: {
      days: 4,
      date: '17 Aug, 2025',
    },
    reorder: 100,
    leadTime: {
      days: 11,
      date: '24 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '9',
    productInfo: {
      image: '8.png',
      title: 'FlexRun Urban Core',
      label: 'BS-6112',
      tooltip: '',
    },
    stock: 89,
    rsvd: 0,
    tlvl: 70,
    delta: {
      label: '+19',
      variant: 'success',
    },
    flow: 16.44,
    reorderIn: {
      days: 3,
      date: '17 Aug, 2025',
    },
    reorder: 100,
    leadTime: {
      days: 15,
      date: '28 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '10',
    productInfo: {
      image: '5.png',
      title: 'Aero Walk Lite',
      label: 'HC-9031',
      tooltip: '',
    },
    stock: 0,
    rsvd: 0,
    tlvl: 60,
    delta: {
      label: '-60',
      variant: 'destructive',
    },
    flow: 0.21,
    reorderIn: {
      days: 7,
      date: '20 Aug, 2025',
    },
    reorder: 160,
    leadTime: {
      days: 20,
      date: '02 Sep, 2025',
    },
    ar: true,
  },
  {
    id: '11',
    productInfo: {
      image: '1.png',
      title: 'Pro Runner Elite',
      label: 'PR-2024',
      tooltip: '',
    },
    stock: 85,
    rsvd: 12,
    tlvl: 60,
    delta: {
      label: '+25',
      variant: 'success',
    },
    flow: 2.15,
    reorderIn: {
      days: 4,
      date: '19 Aug, 2025',
    },
    reorder: 180,
    leadTime: {
      days: 12,
      date: '27 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '12',
    productInfo: {
      image: '2.png',
      title: 'Comfort Plus Max',
      label: 'CP-4567',
      tooltip: '',
    },
    stock: 55,
    rsvd: 8,
    tlvl: 45,
    delta: {
      label: '+10',
      variant: 'success',
    },
    flow: 1.85,
    reorderIn: {
      days: 3,
      date: '18 Aug, 2025',
    },
    reorder: 120,
    leadTime: {
      days: 10,
      date: '25 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '13',
    productInfo: {
      image: '3.png',
      title: 'Speed Demon X',
      label: 'SD-7890',
      tooltip: '',
    },
    stock: 23,
    rsvd: 5,
    tlvl: 20,
    delta: {
      label: '+3',
      variant: 'warning',
    },
    flow: 0.95,
    reorderIn: {
      days: 5,
      date: '20 Aug, 2025',
    },
    reorder: 80,
    leadTime: {
      days: 15,
      date: '30 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '14',
    productInfo: {
      image: '4.png',
      title: 'Casual Street Pro',
      label: 'CS-3456',
      tooltip: '',
    },
    stock: 67,
    rsvd: 15,
    tlvl: 50,
    delta: {
      label: '+17',
      variant: 'success',
    },
    flow: 3.45,
    reorderIn: {
      days: 2,
      date: '17 Aug, 2025',
    },
    reorder: 150,
    leadTime: {
      days: 8,
      date: '23 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '15',
    productInfo: {
      image: '5.png',
      title: 'Mountain Trek Elite',
      label: 'MT-9012',
      tooltip: '',
    },
    stock: 34,
    rsvd: 7,
    tlvl: 25,
    delta: {
      label: '+9',
      variant: 'success',
    },
    flow: 1.25,
    reorderIn: {
      days: 6,
      date: '21 Aug, 2025',
    },
    reorder: 90,
    leadTime: {
      days: 18,
      date: '03 Sep, 2025',
    },
    ar: true,
  },
  {
    id: '16',
    productInfo: {
      image: '6.png',
      title: 'Urban Flex Pro',
      label: 'UF-6789',
      tooltip: '',
    },
    stock: 89,
    rsvd: 22,
    tlvl: 70,
    delta: {
      label: '+19',
      variant: 'success',
    },
    flow: 4.75,
    reorderIn: {
      days: 1,
      date: '16 Aug, 2025',
    },
    reorder: 200,
    leadTime: {
      days: 11,
      date: '26 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '17',
    productInfo: {
      image: '7.png',
      title: 'Lightweight Runner',
      label: 'LR-2345',
      tooltip: '',
    },
    stock: 12,
    rsvd: 3,
    tlvl: 15,
    delta: {
      label: '-3',
      variant: 'warning',
    },
    flow: 0.65,
    reorderIn: {
      days: 7,
      date: '22 Aug, 2025',
    },
    reorder: 60,
    leadTime: {
      days: 16,
      date: '31 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '18',
    productInfo: {
      image: '8.png',
      title: 'Premium Comfort Max',
      label: 'PC-5678',
      tooltip: '',
    },
    stock: 56,
    rsvd: 18,
    tlvl: 40,
    delta: {
      label: '+16',
      variant: 'success',
    },
    flow: 2.85,
    reorderIn: {
      days: 4,
      date: '19 Aug, 2025',
    },
    reorder: 140,
    leadTime: {
      days: 9,
      date: '24 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '19',
    productInfo: {
      image: '9.png',
      title: 'Sport Performance Pro',
      label: 'SP-8901',
      tooltip: '',
    },
    stock: 78,
    rsvd: 25,
    tlvl: 55,
    delta: {
      label: '+23',
      variant: 'success',
    },
    flow: 5.15,
    reorderIn: {
      days: 2,
      date: '17 Aug, 2025',
    },
    reorder: 180,
    leadTime: {
      days: 7,
      date: '22 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '20',
    productInfo: {
      image: '10.png',
      title: 'Classic Retro Style',
      label: 'CR-1234',
      tooltip: '',
    },
    stock: 43,
    rsvd: 11,
    tlvl: 35,
    delta: {
      label: '+8',
      variant: 'success',
    },
    flow: 1.95,
    reorderIn: {
      days: 5,
      date: '20 Aug, 2025',
    },
    reorder: 110,
    leadTime: {
      days: 13,
      date: '28 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '21',
    productInfo: {
      image: '11.png',
      title: 'Adventure Explorer',
      label: 'AE-4567',
      tooltip: '',
    },
    stock: 29,
    rsvd: 6,
    tlvl: 20,
    delta: {
      label: '+9',
      variant: 'success',
    },
    flow: 1.35,
    reorderIn: {
      days: 3,
      date: '18 Aug, 2025',
    },
    reorder: 75,
    leadTime: {
      days: 14,
      date: '29 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '22',
    productInfo: {
      image: '12.png',
      title: 'Modern Street Elite',
      label: 'MS-7890',
      tooltip: '',
    },
    stock: 91,
    rsvd: 28,
    tlvl: 75,
    delta: {
      label: '+16',
      variant: 'success',
    },
    flow: 6.25,
    reorderIn: {
      days: 1,
      date: '16 Aug, 2025',
    },
    reorder: 220,
    leadTime: {
      days: 6,
      date: '21 Aug, 2025',
    },
    ar: false,
  },
  {
    id: '23',
    productInfo: {
      image: '13.png',
      title: 'Eco Friendly Runner',
      label: 'EF-2345',
      tooltip: '',
    },
    stock: 37,
    rsvd: 9,
    tlvl: 30,
    delta: {
      label: '+7',
      variant: 'success',
    },
    flow: 1.75,
    reorderIn: {
      days: 4,
      date: '19 Aug, 2025',
    },
    reorder: 95,
    leadTime: {
      days: 12,
      date: '27 Aug, 2025',
    },
    ar: true,
  },
  {
    id: '24',
    productInfo: {
      image: '14.png',
      title: 'Luxury Comfort Pro',
      label: 'LC-5678',
      tooltip: '',
    },
    stock: 15,
    rsvd: 4,
    tlvl: 12,
    delta: {
      label: '+3',
      variant: 'warning',
    },
    flow: 0.85,
    reorderIn: {
      days: 6,
      date: '21 Aug, 2025',
    },
    reorder: 70,
    leadTime: {
      days: 17,
      date: '01 Sep, 2025',
    },
    ar: false,
  },
  {
    id: '25',
    productInfo: {
      image: '15.png',
      title: 'Tech Smart Runner',
      label: 'TS-8901',
      tooltip: '',
    },
    stock: 68,
    rsvd: 19,
    tlvl: 50,
    delta: {
      label: '+18',
      variant: 'success',
    },
    flow: 3.95,
    reorderIn: {
      days: 2,
      date: '17 Aug, 2025',
    },
    reorder: 160,
    leadTime: {
      days: 8,
      date: '23 Aug, 2025',
    },
    ar: true,
  },
];

const StockPlannerTable = ({ mockData: propsMockData }: StockPlannerProps) => {
  const data = propsMockData || mockData;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isStockSheetOpen, setIsStockSheetOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // Modal state
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  // Search input state
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync inputValue with searchQuery when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [selectedUpdated, setSelectedUpdated] = useState<string[]>([]);

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

  // Apply search, stock levels, and reorder filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter - only search in product title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.productInfo.title.toLowerCase().includes(query),
      );
    }

    // Apply stock level filter
    if (selectedStocks.length > 0) {
      result = result.filter((row) =>
        selectedStocks.includes(row.stock.toString()),
      );
    }

    // Apply reorder filter
    if (selectedUpdated.length > 0) {
      result = result.filter((row) =>
        selectedUpdated.includes(row.reorder.toString()),
      );
    }

    return result;
  }, [data, searchQuery, selectedStocks, selectedUpdated]);

  const columns = useMemo<ColumnDef<IData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'productInfo',
        accessorFn: (row) => row.productInfo.title,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Product Info"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          const row = info.row.original;
          const handleProductClick = () => {
            setIsProductDetailsOpen(true);
          };

          return (
            <div className="flex items-center gap-2.5">
              <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-none shrink-0">
                <img
                  src={toAbsoluteUrl(
                    `/media/store/client/1200x1200/${row.productInfo.image}`,
                  )}
                  className="cursor-pointer h-[40px]"
                  alt="image"
                />
              </Card>
              <div className="flex flex-col gap-1">
                {row.productInfo.title.includes('…') ||
                row.productInfo.title.includes('...') ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="#"
                        onClick={() => handleProductClick()}
                        className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                      >
                        {row.productInfo.title}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {row.productInfo.tooltip ||
                          row.productInfo.title.replace(/[….]/g, '')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    to="#"
                    onClick={() => handleProductClick()}
                    className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                  >
                    {row.productInfo.title}
                  </Link>
                )}
                <span className="text-xs text-muted-foreground uppercase">
                  sku:{' '}
                  <span className="text-xs font-medium text-secondary-foreground">
                    {row.productInfo.label}
                  </span>
                </span>
              </div>
            </div>
          );
        },
        filterFn: (row, filterValue) => {
          const title = row.original.productInfo.title.toLowerCase();
          const query = ((filterValue as string) || '').toLowerCase();
          if (!query) return true;
          return title.includes(query);
        },
        enableSorting: true,
        size: 260,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'stock',
        accessorFn: (row) => row.stock,
        header: ({ column }) => (
          <DataGridColumnHeader title="Stock" column={column} />
        ),
        cell: (info) => (
          <div className="text-center">{info.row.original.stock}</div>
        ),
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'rsvd',
        accessorFn: (row) => row.rsvd,
        header: ({ column }) => (
          <DataGridColumnHeader title="Rsvd" column={column} />
        ),
        cell: (info) => (
          <div className="text-center">{info.row.original.rsvd}</div>
        ),
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'tlvl',
        accessorFn: (row) => row.tlvl,
        header: ({ column }) => (
          <DataGridColumnHeader title="T-Lvl" column={column} />
        ),
        cell: (info) => (
          <div className="text-center">{info.row.original.tlvl}</div>
        ),
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'delta',
        accessorFn: (row) => row.delta.label,
        header: ({ column }) => (
          <DataGridColumnHeader title="Delta" column={column} />
        ),
        cell: (info) => {
          const delta = info.row.original.delta;
          const variant = delta.variant as keyof BadgeProps['variant'];
          return (
            <div className="text-center">
              <Badge variant={variant} appearance="light">
                {delta.label}
              </Badge>
            </div>
          );
        },
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'flow',
        accessorFn: (row) => row.flow,
        header: ({ column }) => (
          <DataGridColumnHeader title="Flow" column={column} />
        ),
        cell: (info) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-normal text-foreground">
              {info.row.original.flow}
            </span>
            <span className="text-xs font-normal text-secondary-foreground/60">
              items/day
            </span>
          </div>
        ),
        enableSorting: true,
        size: 85,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'reorderIn',
        accessorFn: (row) => row.reorderIn.days,
        header: ({ column }) => (
          <DataGridColumnHeader title="Reorder In" column={column} />
        ),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm font-normal text-foreground">
              {info.row.original.reorderIn.days} days
            </span>
            <span className="text-xs font-normal text-secondary-foreground/60">
              {info.row.original.reorderIn.date}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'reorder',
        accessorFn: (row) => row.reorder,
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <DataGridColumnHeader title="Reorder" column={column} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reorder Quantity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: (info) => (
          <div className="text-center">{info.row.original.reorder}</div>
        ),
        enableSorting: true,
        size: 90,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'leadTime',
        accessorFn: (row) => row.leadTime.days,
        header: ({ column }) => (
          <DataGridColumnHeader title="Lead Time" column={column} />
        ),
        cell: (info) => (
          <div className="flex flex-col">
            <span className="text-sm font-normal text-foreground">
              {info.row.original.leadTime.days} days
            </span>
            <span className="text-xs font-normal text-secondary-foreground">
              {info.row.original.leadTime.date}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'ar',
        accessorFn: (row) => row.ar,
        header: ({ column }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <DataGridColumnHeader title="AR" column={column} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Automatic Reorder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
        cell: (info) => (
          <div className="text-center">
            <Switch
              id="size-sm"
              size="sm"
              defaultChecked={info.row.original.ar}
              onCheckedChange={(checked) => {
                if (checked) {
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
                          Auto-reorder enabled for this product.
                        </AlertTitle>
                      </Alert>
                    ),
                    {
                      duration: 5000,
                    },
                  );
                } else {
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
                          Auto-reorder disabled for this product.
                        </AlertTitle>
                      </Alert>
                    ),
                    {
                      duration: 5000,
                    },
                  );
                }
              }}
            />
          </div>
        ),
        enableSorting: true,
        size: 70,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: () => (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="dim" mode="icon" size="sm" className="">
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 60,
      },
    ],
    [],
  );

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);
    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds.join(', ')}`,
        action: {
          label: 'Undo',
          onClick: () => setRowSelection({}),
        },
      });
    }
  }, [rowSelection]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Title = useMemo(() => {
    const handleStockChange = (isChecked: boolean, stock: string) => {
      setSelectedStocks((prev) =>
        isChecked ? [...prev, stock] : prev.filter((s) => s !== stock),
      );
      // Reset pagination to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleUpdatedChange = (isChecked: boolean, updated: string) => {
      setSelectedUpdated((prev) =>
        isChecked ? [...prev, updated] : prev.filter((u) => u !== updated),
      );
      // Reset pagination to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    // Search input handlers
    const handleClearInput = () => {
      setInputValue('');
      setSearchQuery('');
      // Reset pagination to first page when filters change
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      inputRef.current?.focus();
    };

    return (
      <CardHeading className="flex items-center flex-wrap gap-2.5 space-y-0">
        {/* Search */}
        <div className="w-full max-w-[200px]">
          <InputWrapper>
            <Search />
            <Input
              placeholder="Search..."
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSearchQuery(e.target.value);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button
              onClick={handleClearInput}
              variant="dim"
              className="-me-4"
              disabled={inputValue === ''}
            >
              {inputValue !== '' && <X size={16} />}
            </Button>
          </InputWrapper>
        </div>

        {/* Reorder In Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              Reorder In: 7 days
              {selectedUpdated.length > 0 && (
                <Badge variant="outline" size="sm">
                  {selectedUpdated.length}
                </Badge>
              )}
              <ChevronDown className="size-5 pt-0.5 -m-0.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search Reorder In..." />
              <CommandList>
                <CommandEmpty>No Reorder In found.</CommandEmpty>
                <CommandGroup>
                  {Array.from(new Set(data.map((row) => row.reorder))).map(
                    (reorder) => {
                      const reorderObj = data.find(
                        (row) => row.reorder === reorder,
                      );
                      const reorderIn = reorderObj?.reorderIn;
                      const count = data.filter(
                        (row) => row.reorder === reorder,
                      ).length;
                      return (
                        <CommandItem
                          key={reorder}
                          value={reorder.toString()}
                          className="flex items-center gap-2.5 bg-transparent!"
                          onSelect={() => {}}
                          data-disabled="true"
                        >
                          <Checkbox
                            id={reorder.toString()}
                            checked={selectedUpdated.includes(
                              reorder.toString(),
                            )}
                            onCheckedChange={(checked) =>
                              handleUpdatedChange(
                                checked === true,
                                reorder.toString(),
                              )
                            }
                            size="sm"
                          />
                          <Label
                            htmlFor={reorder.toString()}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-normal text-foreground">
                                {reorderIn?.days} days
                              </span>
                              <span className="text-xs font-normal text-secondary-foreground">
                                {reorderIn?.date}
                              </span>
                            </div>
                            <span className="text-muted-foreground font-semibold me-2.5">
                              {count}
                            </span>
                          </Label>
                        </CommandItem>
                      );
                    },
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Stock Level Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              Stock Level
              {selectedStocks.length > 0 && (
                <Badge variant="outline" size="sm">
                  {selectedStocks.length}
                </Badge>
              )}
              <ChevronDown className="size-5 pt-0.5 -m-0.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search stock levels..." />
              <CommandList>
                <CommandEmpty>No stock levels found.</CommandEmpty>
                <CommandGroup>
                  {Array.from(
                    new Set(data.map((row) => row.stock.toString())),
                  ).map((stock) => {
                    const count = data.filter(
                      (row) => row.stock.toString() === stock,
                    ).length;
                    return (
                      <CommandItem
                        key={stock}
                        value={stock}
                        className="flex items-center gap-2.5 bg-transparent!"
                        onSelect={() => {}}
                        data-disabled="true"
                      >
                        <Checkbox
                          id={stock}
                          checked={selectedStocks.includes(stock)}
                          onCheckedChange={(checked) =>
                            handleStockChange(checked === true, stock)
                          }
                          size="sm"
                        />
                        <Label
                          htmlFor={stock}
                          className="grow flex items-center justify-between font-normal gap-1.5"
                        >
                          <span className="text-xs font-medium">{stock}</span>
                          <span className="text-muted-foreground font-semibold me-2.5">
                            {count}
                          </span>
                        </Label>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardHeading>
    );
  }, [
    inputValue,
    selectedStocks,
    selectedUpdated,
    data,
    setPagination,
    setInputValue,
    setSearchQuery,
  ]);

  return (
    <TooltipProvider>
      <>
        <DataGrid
          table={table}
          recordCount={filteredData?.length || 0}
          tableLayout={{
            columnsPinnable: true,
            columnsMovable: true,
            columnsVisibility: true,
            cellBorder: true,
          }}
        >
          <Card>
            <CardHeader className="py-3.5">
              {Title}
              <CardToolbar>
                <Button
                  variant="outline"
                  onClick={() => setIsStockSheetOpen(true)}
                >
                  Reports
                </Button>
              </CardToolbar>
            </CardHeader>
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
        <PerProductStockSheet
          open={isStockSheetOpen}
          onOpenChange={setIsStockSheetOpen}
        />

        {/* Product Details Analytics Modal */}
        <ProductDetailsAnalyticsSheet
          open={isProductDetailsOpen}
          onOpenChange={setIsProductDetailsOpen}
        />
      </>
    </TooltipProvider>
  );
};

export { StockPlannerTable };
