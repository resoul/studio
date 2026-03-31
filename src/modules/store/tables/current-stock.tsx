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
import { addDays, format, isWithinInterval, parse } from 'date-fns';
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
import { DateRange } from 'react-day-picker';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PerProductStockSheet } from '../components/per-product-stock-sheet';

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
  sum: string;
  lastMoved: string;
  handler: string;
  trend: {
    label: string;
    variant: string;
  };
}

interface CurrentStockProps {
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
      label: '+28',
      variant: 'success',
    },
    sum: '$4,283.00',
    lastMoved: '18 Aug, 2025',
    handler: 'Jordan M.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
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
    tlvl: 25,
    delta: {
      label: '-238',
      variant: 'destructive',
    },
    sum: '$923.00',
    lastMoved: '17 Aug, 2025',
    handler: 'Alexa R.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
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
    sum: '$1,097.50 ',
    lastMoved: '15 Aug, 2025',
    handler: 'Chris T.',
    trend: {
      label: 'Clearance',
      variant: 'warning',
    },
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
    sum: '$0.00',
    lastMoved: '14 Aug, 2025',
    handler: 'Dana L.',
    trend: {
      label: 'Slow Moving',
      variant: 'destructive',
    },
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
    sum: '$6,412.75',
    lastMoved: '13 Aug, 2025',
    handler: 'Kevin J.',
    trend: {
      label: 'Seasonal',
      variant: 'info',
    },
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
    rsvd: 20,
    tlvl: 30,
    delta: {
      label: '+3',
      variant: 'warning',
    },
    sum: '$3,145.20 ',
    lastMoved: '12 Aug, 2025',
    handler: 'Priya S.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
  {
    id: '7',
    productInfo: {
      image: '10.png',
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
    sum: '$560.00 ',
    lastMoved: '11 Aug, 2025',
    handler: 'Marcus B.',
    trend: {
      label: 'Promo',
      variant: 'primary',
    },
  },
  {
    id: '8',
    productInfo: {
      image: '3.png',
      title: 'Enduro AllTerrain High…',
      label: 'MS-8702',
      tooltip: 'Enduro All-Terrain High Sneakers',
    },
    stock: 64,
    rsvd: 90,
    tlvl: 50,
    delta: {
      label: '+14',
      variant: 'success',
    },
    sum: '$2,199.00 ',
    lastMoved: '10 Aug, 2025',
    handler: 'Zoe K.',
    trend: {
      label: 'Clearance',
      variant: 'warning',
    },
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
    sum: '$7,009.99',
    lastMoved: '9 Aug, 2025',
    handler: 'Lee A.',
    trend: {
      label: 'Seasonal',
      variant: 'info',
    },
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
    sum: '$0.00',
    lastMoved: '8 Aug, 2025',
    handler: 'Nina V.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
  {
    id: '11',
    productInfo: {
      image: '4.png',
      title: 'Pro Runner Elite',
      label: 'PR-2024',
      tooltip: '',
    },
    stock: 78,
    rsvd: 15,
    tlvl: 45,
    delta: {
      label: '+34',
      variant: 'success',
    },
    sum: '$11,310.00',
    lastMoved: '7 Aug, 2025',
    handler: 'Mike R.',
    trend: {
      label: 'Seasonal',
      variant: 'info',
    },
  },
  {
    id: '12',
    productInfo: {
      image: '6.png',
      title: 'Comfort Plus Max',
      label: 'CP-4567',
      tooltip: '',
    },
    stock: 45,
    rsvd: 8,
    tlvl: 35,
    delta: {
      label: '+15',
      variant: 'success',
    },
    sum: '$4,049.55',
    lastMoved: '6 Aug, 2025',
    handler: 'Sarah L.',
    trend: {
      label: 'Clearance',
      variant: 'warning',
    },
  },
  {
    id: '13',
    productInfo: {
      image: '9.png',
      title: 'Speed Demon X',
      label: 'SD-7890',
      tooltip: '',
    },
    stock: 23,
    rsvd: 5,
    tlvl: 20,
    delta: {
      label: '-12',
      variant: 'destructive',
    },
    sum: '$4,577.00',
    lastMoved: '5 Aug, 2025',
    handler: 'Tom H.',
    trend: {
      label: 'Promo',
      variant: 'info',
    },
  },
  {
    id: '14',
    productInfo: {
      image: '12.png',
      title: 'Casual Street Pro',
      label: 'CS-3456',
      tooltip: '',
    },
    stock: 67,
    rsvd: 12,
    tlvl: 55,
    delta: {
      label: '+28',
      variant: 'success',
    },
    sum: '$5,058.50',
    lastMoved: '4 Aug, 2025',
    handler: 'Emma W.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
  {
    id: '15',
    productInfo: {
      image: '14.png',
      title: 'Mountain Trek Elite',
      label: 'MT-9012',
      tooltip: '',
    },
    stock: 34,
    rsvd: 6,
    tlvl: 25,
    delta: {
      label: '+7',
      variant: 'success',
    },
    sum: '$5,610.00',
    lastMoved: '3 Aug, 2025',
    handler: 'David K.',
    trend: {
      label: 'Slow Moving',
      variant: 'destructive',
    },
  },
  {
    id: '16',
    productInfo: {
      image: '16.png',
      title: 'Urban Flex Pro',
      label: 'UF-6789',
      tooltip: '',
    },
    stock: 89,
    rsvd: 18,
    tlvl: 65,
    delta: {
      label: '+42',
      variant: 'success',
    },
    sum: '$8,455.00',
    lastMoved: '2 Aug, 2025',
    handler: 'Lisa M.',
    trend: {
      label: 'Seasonal',
      variant: 'info',
    },
  },
  {
    id: '17',
    productInfo: {
      image: '1.png',
      title: 'Lightweight Runner',
      label: 'LR-2345',
      tooltip: '',
    },
    stock: 12,
    rsvd: 2,
    tlvl: 15,
    delta: {
      label: '-8',
      variant: 'destructive',
    },
    sum: '$780.00',
    lastMoved: '1 Aug, 2025',
    handler: 'John D.',
    trend: {
      label: 'Clearance',
      variant: 'warning',
    },
  },
  {
    id: '18',
    productInfo: {
      image: '2.png',
      title: 'Premium Comfort Max',
      label: 'PC-5678',
      tooltip: '',
    },
    stock: 56,
    rsvd: 10,
    tlvl: 40,
    delta: {
      label: '+23',
      variant: 'success',
    },
    sum: '$7,000.00',
    lastMoved: '31 Jul, 2025',
    handler: 'Anna B.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
  {
    id: '19',
    productInfo: {
      image: '3.png',
      title: 'Sport Performance Pro',
      label: 'SP-8901',
      tooltip: '',
    },
    stock: 78,
    rsvd: 16,
    tlvl: 50,
    delta: {
      label: '+38',
      variant: 'success',
    },
    sum: '$12,090.00',
    lastMoved: '30 Jul, 2025',
    handler: 'Carl F.',
    trend: {
      label: 'Promo',
      variant: 'info',
    },
  },
  {
    id: '20',
    productInfo: {
      image: '4.png',
      title: 'Classic Retro Style',
      label: 'CR-1234',
      tooltip: '',
    },
    stock: 43,
    rsvd: 7,
    tlvl: 30,
    delta: {
      label: '+19',
      variant: 'success',
    },
    sum: '$3,655.00',
    lastMoved: '29 Jul, 2025',
    handler: 'Grace T.',
    trend: {
      label: 'Slow Moving',
      variant: 'destructive',
    },
  },
  {
    id: '21',
    productInfo: {
      image: '5.png',
      title: 'Adventure Explorer',
      label: 'AE-4567',
      tooltip: '',
    },
    stock: 29,
    rsvd: 4,
    tlvl: 20,
    delta: {
      label: '-5',
      variant: 'destructive',
    },
    sum: '$3,915.00',
    lastMoved: '28 Jul, 2025',
    handler: 'Paul S.',
    trend: {
      label: 'Seasonal',
      variant: 'info',
    },
  },
  {
    id: '22',
    productInfo: {
      image: '6.png',
      title: 'Modern Street Elite',
      label: 'MS-7890',
      tooltip: '',
    },
    stock: 91,
    rsvd: 20,
    tlvl: 70,
    delta: {
      label: '+51',
      variant: 'success',
    },
    sum: '$15,925.00',
    lastMoved: '27 Jul, 2025',
    handler: 'Rachel L.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
  {
    id: '23',
    productInfo: {
      image: '7.png',
      title: 'Eco Friendly Runner',
      label: 'EF-2345',
      tooltip: '',
    },
    stock: 37,
    rsvd: 6,
    tlvl: 25,
    delta: {
      label: '+14',
      variant: 'success',
    },
    sum: '$3,885.00',
    lastMoved: '26 Jul, 2025',
    handler: 'Mark W.',
    trend: {
      label: 'Clearance',
      variant: 'warning',
    },
  },
  {
    id: '24',
    productInfo: {
      image: '8.png',
      title: 'Luxury Comfort Pro',
      label: 'LC-5678',
      tooltip: '',
    },
    stock: 15,
    rsvd: 3,
    tlvl: 10,
    delta: {
      label: '-3',
      variant: 'destructive',
    },
    sum: '$3,375.00',
    lastMoved: '25 Jul, 2025',
    handler: 'Sophie K.',
    trend: {
      label: 'Promo',
      variant: 'info',
    },
  },
  {
    id: '25',
    productInfo: {
      image: '9.png',
      title: 'Tech Smart Runner',
      label: 'TS-8901',
      tooltip: '',
    },
    stock: 68,
    rsvd: 14,
    tlvl: 45,
    delta: {
      label: '+32',
      variant: 'success',
    },
    sum: '$12,580.00',
    lastMoved: '24 Jul, 2025',
    handler: 'Alex M.',
    trend: {
      label: 'Fast Moving',
      variant: 'success',
    },
  },
];

const CurrentStockTable = ({ mockData: propsMockData }: CurrentStockProps) => {
  const data = propsMockData || mockData;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lastMoved', desc: true },
  ]);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedHandlers, setSelectedHandlers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IData | undefined>(
    undefined,
  );

  // Date range picker state
  const today = new Date();
  const defaultDateRange: DateRange = {
    from: addDays(today, -999), // Show last 30 days by default
    to: today,
  };
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const isApplyingRef = useRef(false);

  // Unique trends and handlers with counts
  const uniqueTrends = useMemo(() => {
    const trends = new Set<string>();
    data.forEach((row) => {
      trends.add(row.trend.label);
    });
    return Array.from(trends).map((id) => ({
      id,
      name: id,
      variant:
        data.find((row) => row.trend.label === id)?.trend.variant ||
        'secondary',
    }));
  }, [data]);

  const uniqueHandlers = useMemo(() => {
    const handlers = new Set<string>();
    data.forEach((row) => {
      handlers.add(row.handler);
    });
    return Array.from(handlers).map((name) => ({
      id: name,
      name,
    }));
  }, [data]);

  const trendCounts = useMemo(() => {
    return data.reduce(
      (acc, row) => {
        acc[row.trend.label] = (acc[row.trend.label] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  const handlerCounts = useMemo(() => {
    return data.reduce(
      (acc, row) => {
        acc[row.handler] = (acc[row.handler] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [data]);

  const handleTrendChange = (isChecked: boolean, trend: string) => {
    if (isChecked) {
      setSelectedTrends((prev) => [...prev, trend]);
    } else {
      setSelectedTrends((prev) => prev.filter((t) => t !== trend));
    }
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleHandlerChange = (isChecked: boolean, handler: string) => {
    if (isChecked) {
      setSelectedHandlers((prev) => [...prev, handler]);
    } else {
      setSelectedHandlers((prev) => prev.filter((h) => h !== handler));
    }
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleProductClick = (product: IData) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Search input handlers
  const handleClearInput = () => {
    setInputValue('');
    setSearchQuery('');
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Sync inputValue with searchQuery when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Update search query when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, searchQuery]);

  // Date range picker handlers
  const handleDateRangeApply = () => {
    isApplyingRef.current = true;
    if (tempDateRange) {
      setDateRange(tempDateRange);
    }
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeReset = () => {
    isApplyingRef.current = true;
    setTempDateRange(defaultDateRange);
    setDateRange(defaultDateRange);
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeCancel = () => {
    isApplyingRef.current = true;
    // Reset temp state to actual state when canceling
    setTempDateRange(dateRange);
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeSelect = (selected: DateRange | undefined) => {
    setTempDateRange({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
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
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 40,
        meta: {
          cellClassName: '',
        },
      },
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
                  src={toAbsoluteUrl(
                    `/media/store/client/1200x1200/${productInfo.image}`,
                  )}
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
                      <p>{productInfo.tooltip.replace(/[….]/g, '')}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    to="#"
                    onClick={() => handleProductClick(info.row.original)}
                    className="text-sm font-medium text-foreground hover:text-primary leading-3.5 text-left"
                  >
                    {productInfo.title}
                  </Link>
                )}
              </div>
            </div>
          );
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
        cell: (info) => {
          return <div className="text-center">{info.row.original.stock}</div>;
        },
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
        cell: (info) => {
          return <div className="text-center">{info.row.original.rsvd}</div>;
        },
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
        cell: (info) => {
          return <div className="text-center">{info.row.original.tlvl}</div>;
        },
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'delta',
        accessorFn: (row) => row.delta,
        header: ({ column }) => (
          <DataGridColumnHeader title="Delta" column={column} />
        ),
        cell: (info) => {
          const delta = info.row.original.delta;
          const variant = delta.variant as keyof BadgeProps['variant'];
          return (
            <Badge variant={variant} appearance="light">
              {delta.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 80,
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'sum',
        accessorFn: (row) => row.sum,
        header: ({ column }) => (
          <DataGridColumnHeader title="Sum" column={column} />
        ),
        cell: (info) => {
          return info.row.original.sum;
        },
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'lastMoved',
        accessorFn: (row) => row.lastMoved,
        header: ({ column }) => (
          <DataGridColumnHeader title="Last Moved" column={column} />
        ),
        cell: (info) => {
          return info.row.original.lastMoved;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'handler',
        accessorFn: (row) => row.handler,
        header: ({ column }) => (
          <DataGridColumnHeader title="Handler" column={column} />
        ),
        cell: (info) => {
          return info.row.original.handler;
        },
        enableSorting: true,
        size: 100,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'trend',
        accessorFn: (row) => row.trend,
        header: ({ column }) => (
          <DataGridColumnHeader title="Trend" column={column} />
        ),
        cell: (info) => {
          const trend = info.row.original.trend;
          const variant = trend.variant as keyof BadgeProps['variant'];
          return (
            <Badge variant={variant} appearance="light">
              {trend.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 130,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: (info) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" mode="icon" size="sm">
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
              <DropdownMenuItem
                onClick={() => handleProductClick(info.row.original)}
              >
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
        ),
        size: 60,
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        result = result.filter((item) => {
          // Search in multiple fields
          return (
            item.productInfo.title.toLowerCase().includes(query) ||
            item.productInfo.label?.toLowerCase().includes(query) ||
            item.handler?.toLowerCase().includes(query) ||
            item.lastMoved?.toLowerCase().includes(query) ||
            item.trend?.label.toLowerCase().includes(query) ||
            item.sum?.toLowerCase().includes(query) ||
            item.id?.toLowerCase().includes(query)
          );
        });
      }
    }

    // Apply other filters
    result = result.filter((row) => {
      const matchesTrends =
        selectedTrends.length === 0 || selectedTrends.includes(row.trend.label);
      const matchesHandlers =
        selectedHandlers.length === 0 || selectedHandlers.includes(row.handler);

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange && (dateRange.from || dateRange.to)) {
        try {
          // Parse the date from "DD MMM, YYYY" format
          const rowDate = parse(row.lastMoved, 'dd MMM, yyyy', new Date());

          if (dateRange.from && dateRange.to) {
            matchesDateRange = isWithinInterval(rowDate, {
              start: dateRange.from,
              end: dateRange.to,
            });
          } else if (dateRange.from) {
            matchesDateRange = rowDate >= dateRange.from;
          } else if (dateRange.to) {
            matchesDateRange = rowDate <= dateRange.to;
          }
        } catch {
          // If date parsing fails, include the row
          matchesDateRange = true;
        }
      }

      return matchesTrends && matchesHandlers && matchesDateRange;
    });

    return result;
  }, [data, searchQuery, selectedTrends, selectedHandlers, dateRange]);

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
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
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

            {/* Date Range Filter */}
            <Popover
              open={isDatePickerOpen}
              onOpenChange={(open) => {
                if (open) {
                  // Sync temp state with actual state when opening
                  setTempDateRange(dateRange);
                  setIsDatePickerOpen(open);
                } else if (!isApplyingRef.current) {
                  // Only handle cancel if we're not in the middle of applying/resetting
                  setTempDateRange(dateRange);
                  setIsDatePickerOpen(open);
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button type="button" variant="outline">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'MMM dd')} -{' '}
                        {format(dateRange.to, 'MMM dd, yyyy')}
                      </>
                    ) : (
                      format(dateRange.from, 'MMM dd, yyyy')
                    )
                  ) : (
                    <span>Pick date range</span>
                  )}
                  <ChevronDown className="size-4 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={tempDateRange?.from || dateRange?.from}
                  showOutsideDays={false}
                  selected={tempDateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
                <div className="flex items-center justify-between border-t border-border p-3">
                  <Button variant="outline" onClick={handleDateRangeReset}>
                    Reset
                  </Button>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" onClick={handleDateRangeCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleDateRangeApply}>Apply</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Trends Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  Trends
                  {selectedTrends.length > 0 && (
                    <Badge variant="outline" size="sm" className="ml-1.5">
                      {selectedTrends.length}
                    </Badge>
                  )}
                  <ChevronDown className="size-5 pt-0.5 -m-0.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search trends..." />
                  <CommandList>
                    <CommandEmpty>No trends found.</CommandEmpty>
                    <CommandGroup>
                      {uniqueTrends.map((trend) => {
                        const count = trendCounts[trend.id] || 0;
                        return (
                          <CommandItem
                            key={trend.id}
                            value={trend.id}
                            className="flex items-center gap-2.5 bg-transparent!"
                            onSelect={() => {}}
                            data-disabled="true"
                          >
                            <Checkbox
                              id={trend.id}
                              checked={selectedTrends.includes(trend.id)}
                              onCheckedChange={(checked) =>
                                handleTrendChange(checked === true, trend.id)
                              }
                              size="sm"
                            />
                            <Label
                              htmlFor={trend.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <Badge
                                variant={
                                  trend.variant as
                                    | 'primary'
                                    | 'secondary'
                                    | 'success'
                                    | 'warning'
                                    | 'info'
                                    | 'outline'
                                    | 'destructive'
                                }
                                appearance="light"
                              >
                                {trend.name}
                              </Badge>
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

            {/* Handler Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  Handler
                  {selectedHandlers.length > 0 && (
                    <Badge variant="outline" size="sm" className="ml-1.5">
                      {selectedHandlers.length}
                    </Badge>
                  )}
                  <ChevronDown className="size-5 pt-0.5 -m-0.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search handler..." />
                  <CommandList>
                    <CommandEmpty>No handler found.</CommandEmpty>
                    <CommandGroup>
                      {uniqueHandlers.map((handler) => {
                        const count = handlerCounts[handler.id] || 0;
                        return (
                          <CommandItem
                            key={handler.id}
                            value={handler.id}
                            className="flex items-center gap-2.5 bg-transparent!"
                            onSelect={() => {}}
                            data-disabled="true"
                          >
                            <Checkbox
                              id={handler.id}
                              checked={selectedHandlers.includes(handler.id)}
                              onCheckedChange={(checked) =>
                                handleHandlerChange(
                                  checked === true,
                                  handler.id,
                                )
                              }
                              size="sm"
                            />
                            <Label
                              htmlFor={handler.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <span>{handler.name}</span>
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
          <CardToolbar>
            <Link to="/store-inventory/stock-planner">
              <Button variant="mono">Stock Planner</Button>
            </Link>
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

      {/* Per Product Stock Modal */}
      <PerProductStockSheet
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedProduct}
      />
    </DataGrid>
  );
};

export { CurrentStockTable };
