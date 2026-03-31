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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TrackShippingSheet } from '../components/track-shipping-sheet';
import { PerProductStockSheet } from '../components/per-product-stock-sheet';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface IData {
  id: string;
  productInfo: {
    title: string;
    label: string;
    tooltip: string;
  };
  dateOrder: string;
  qty: number;
  stock: string;
  status: {
    label: string;
    variant: string;
  };
  arrivalDate: string;
  carrier: string;
  supplier: {
    logo: string;
    name: string;
  };
}

interface AllStockProps {
  mockData?: IData[];
}

// Type for mapped data to match PerProductStockSheet requirements
interface MappedStockData {
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
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

const mockData: IData[] = [
  {
    id: '1',
    productInfo: {
      title: 'Air Max 270 React Eng…',
      label: 'WM-842',
      tooltip: 'Air Max 270 React Engineered',
    },
    dateOrder: '18 Aug, 2025',
    qty: 10,
    stock: '$1100.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '18 Aug, 2025',
    supplier: {
      name: 'SwiftStock',
      logo: 'clusterhq.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '2',
    productInfo: {
      title: 'Trail Runner Z2',
      label: 'UC-3990',
      tooltip: '',
    },
    dateOrder: '17 Aug, 2025',
    qty: 45,
    stock: '$9230.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '17 Aug, 2025',
    supplier: {
      name: 'NexaSource',
      logo: 'coinhodler.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '3',
    productInfo: {
      title: 'Urban Flex Knit Low…',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low Sneakers',
    },
    dateOrder: '15 Aug, 2025',
    qty: 70,
    stock: '$12,970.50 ',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '15 Aug, 2025',
    supplier: {
      name: 'CoreMart',
      logo: 'infography.svg',
    },
    carrier: 'DHL',
  },
  {
    id: '4',
    productInfo: {
      title: 'Blaze Street Classic',
      label: 'LS-1033',
      tooltip: '',
    },
    dateOrder: '14 Aug, 2025',
    qty: 120,
    stock: '$9270.00',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    arrivalDate: '14 Aug, 2025',
    supplier: {
      name: 'StockLab',
      logo: 'clusterhq.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '5',
    productInfo: {
      title: 'Terra Trekking Max Pro…',
      label: 'WC-5510',
      tooltip: 'Terra Trekking Max Pro Sneakers',
    },
    dateOrder: '13 Aug, 2025',
    qty: 200,
    stock: '$24,940.00',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '13 Aug, 2025',
    supplier: {
      name: 'PrimeStock',
      logo: 'telcoin.svg',
    },
    carrier: 'USPS',
  },
  {
    id: '6',
    productInfo: {
      title: 'Lite Runner Evo',
      label: 'GH-7312',
      tooltip: '',
    },
    dateOrder: '12 Aug, 2025',
    qty: 30,
    stock: '$1,220.00 ',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    arrivalDate: '12 Aug, 2025',
    supplier: {
      name: 'NexaSource',
      logo: 'coinhodler.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '7',
    productInfo: {
      title: 'Classic Street Wear 2.0…',
      label: 'UH-2300',
      tooltip: 'Classic Street Wear 2.0 Collection',
    },
    dateOrder: '11 Aug, 2025',
    qty: 100,
    stock: '$15,900.00 ',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '11 Aug, 2025',
    supplier: {
      name: 'NexaSource',
      logo: 'coinhodler.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '8',
    productInfo: {
      title: 'Enduro All-Terrain High…',
      label: 'MS-8702',
      tooltip: 'Enduro All-Terrain High Sneakers',
    },
    dateOrder: '10 Aug, 2025',
    qty: 100,
    stock: '$21000.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '10 Aug, 2025',
    supplier: {
      name: 'VeloSource',
      logo: 'equacoin.svg',
    },
    carrier: 'DHL',
  },
  {
    id: '9',
    productInfo: {
      title: 'FlexRun Urban Core',
      label: 'BS-6112',
      tooltip: '',
    },
    dateOrder: '09 Aug, 2025',
    qty: 250,
    stock: '$34,900.00',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    arrivalDate: '09 Aug, 2025',
    supplier: {
      name: 'StockLab',
      logo: 'clusterhq.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '10',
    productInfo: {
      title: 'Aero Walk Lite',
      label: 'HC-9031',
      tooltip: '',
    },
    dateOrder: '8 Aug, 2025',
    qty: 30,
    stock: '$2,400.00',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    arrivalDate: '8 Aug, 2025',
    supplier: {
      name: 'SwiftStock',
      logo: 'quickbooks.svg',
    },
    carrier: 'USPS',
  },
  {
    id: '11',
    productInfo: {
      title: 'Pro Runner Elite',
      label: 'PR-2024',
      tooltip: '',
    },
    dateOrder: '7 Aug, 2025',
    qty: 85,
    stock: '$12,325.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '7 Aug, 2025',
    supplier: {
      name: 'EliteSupply',
      logo: 'telcoin.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '12',
    productInfo: {
      title: 'Comfort Plus Max',
      label: 'CP-4567',
      tooltip: '',
    },
    dateOrder: '6 Aug, 2025',
    qty: 55,
    stock: '$4,949.45',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '6 Aug, 2025',
    supplier: {
      name: 'ComfortCorp',
      logo: 'infography.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '13',
    productInfo: {
      title: 'Speed Demon X',
      label: 'SD-7890',
      tooltip: '',
    },
    dateOrder: '5 Aug, 2025',
    qty: 23,
    stock: '$4,577.00',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    arrivalDate: '5 Aug, 2025',
    supplier: {
      name: 'SpeedSource',
      logo: 'clusterhq.svg',
    },
    carrier: 'DHL',
  },
  {
    id: '14',
    productInfo: {
      title: 'Casual Street Pro',
      label: 'CS-3456',
      tooltip: '',
    },
    dateOrder: '4 Aug, 2025',
    qty: 67,
    stock: '$5,058.50',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '4 Aug, 2025',
    supplier: {
      name: 'StreetStyle',
      logo: 'coinhodler.svg',
    },
    carrier: 'USPS',
  },
  {
    id: '15',
    productInfo: {
      title: 'Mountain Trek Elite',
      label: 'MT-9012',
      tooltip: '',
    },
    dateOrder: '3 Aug, 2025',
    qty: 34,
    stock: '$5,610.00',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    arrivalDate: '3 Aug, 2025',
    supplier: {
      name: 'MountainGear',
      logo: 'equacoin.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '16',
    productInfo: {
      title: 'Urban Flex Pro',
      label: 'UF-6789',
      tooltip: '',
    },
    dateOrder: '2 Aug, 2025',
    qty: 89,
    stock: '$8,455.00',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '2 Aug, 2025',
    supplier: {
      name: 'UrbanSupply',
      logo: 'quickbooks.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '17',
    productInfo: {
      title: 'Lightweight Runner',
      label: 'LR-2345',
      tooltip: '',
    },
    dateOrder: '1 Aug, 2025',
    qty: 12,
    stock: '$780.00',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    arrivalDate: '1 Aug, 2025',
    supplier: {
      name: 'LightCorp',
      logo: 'telcoin.svg',
    },
    carrier: 'DHL',
  },
  {
    id: '18',
    productInfo: {
      title: 'Premium Comfort Max',
      label: 'PC-5678',
      tooltip: '',
    },
    dateOrder: '31 Jul, 2025',
    qty: 56,
    stock: '$7,000.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '31 Jul, 2025',
    supplier: {
      name: 'PremiumStock',
      logo: 'infography.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '19',
    productInfo: {
      title: 'Sport Performance Pro',
      label: 'SP-8901',
      tooltip: '',
    },
    dateOrder: '30 Jul, 2025',
    qty: 78,
    stock: '$12,090.00',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    arrivalDate: '30 Jul, 2025',
    supplier: {
      name: 'SportSource',
      logo: 'clusterhq.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '20',
    productInfo: {
      title: 'Classic Retro Style',
      label: 'CR-1234',
      tooltip: '',
    },
    dateOrder: '29 Jul, 2025',
    qty: 43,
    stock: '$3,655.00',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '29 Jul, 2025',
    supplier: {
      name: 'RetroSupply',
      logo: 'coinhodler.svg',
    },
    carrier: 'USPS',
  },
  {
    id: '21',
    productInfo: {
      title: 'Adventure Explorer',
      label: 'AE-4567',
      tooltip: '',
    },
    dateOrder: '28 Jul, 2025',
    qty: 29,
    stock: '$3,915.00',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    arrivalDate: '28 Jul, 2025',
    supplier: {
      name: 'AdventureGear',
      logo: 'equacoin.svg',
    },
    carrier: 'DHL',
  },
  {
    id: '22',
    productInfo: {
      title: 'Modern Street Elite',
      label: 'MS-7890',
      tooltip: '',
    },
    dateOrder: '27 Jul, 2025',
    qty: 91,
    stock: '$15,925.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '27 Jul, 2025',
    supplier: {
      name: 'ModernSupply',
      logo: 'quickbooks.svg',
    },
    carrier: 'FedEx',
  },
  {
    id: '23',
    productInfo: {
      title: 'Eco Friendly Runner',
      label: 'EF-2345',
      tooltip: '',
    },
    dateOrder: '26 Jul, 2025',
    qty: 37,
    stock: '$3,885.00',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    arrivalDate: '26 Jul, 2025',
    supplier: {
      name: 'EcoCorp',
      logo: 'telcoin.svg',
    },
    carrier: 'UPS',
  },
  {
    id: '24',
    productInfo: {
      title: 'Luxury Comfort Pro',
      label: 'LC-5678',
      tooltip: '',
    },
    dateOrder: '25 Jul, 2025',
    qty: 15,
    stock: '$3,375.00',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    arrivalDate: '25 Jul, 2025',
    supplier: {
      name: 'LuxuryStock',
      logo: 'infography.svg',
    },
    carrier: 'USPS',
  },
  {
    id: '25',
    productInfo: {
      title: 'Tech Smart Runner',
      label: 'TS-8901',
      tooltip: '',
    },
    dateOrder: '24 Jul, 2025',
    qty: 68,
    stock: '$12,580.00',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    arrivalDate: '24 Jul, 2025',
    supplier: {
      name: 'TechSupply',
      logo: 'clusterhq.svg',
    },
    carrier: 'DHL',
  },
];

const InboundStockTable = ({ mockData: propsMockData }: AllStockProps) => {
  const data = propsMockData || mockData;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDateOrder] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<
    { name: string; logo: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Modal state
  const [isTrackShippingOpen, setIsTrackShippingOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IData | undefined>(
    undefined,
  );

  // PerProductStockSheet modal state
  const [isPerProductStockOpen, setIsPerProductStockOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<MappedStockData | undefined>(undefined);

  const handleStatusChange = (isChecked: boolean, status: string) => {
    if (isChecked) {
      setSelectedStatuses((prev) => [...prev, status]);
    } else {
      setSelectedStatuses((prev) => prev.filter((s) => s !== status));
    }
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSupplierChange = (
    isChecked: boolean,
    supplier: { name: string; logo: string },
  ) => {
    if (isChecked) {
      setSelectedSuppliers((prev) => [...prev, supplier]);
    } else {
      setSelectedSuppliers((prev) =>
        prev.filter((s) => s.name !== supplier.name),
      );
    }
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleShowClick = (product: IData) => {
    setSelectedProduct(product);
    setIsTrackShippingOpen(true);
  };

  const handleProductClick = (product: IData) => {
    // Map IData to CurrentStockData format
    const mappedData: MappedStockData = {
      id: product.id,
      productInfo: {
        image: 'default.png', // Default image since IData doesn't have image
        title: product.productInfo.title,
        label: product.productInfo.label,
      },
      stock: product.qty || 0,
      rsvd: 0, // Default value
      tlvl: 0, // Default value
      delta: {
        label: '+0',
        variant: 'success' as const,
      },
      sum: product.stock || '$0.00',
      lastMoved: product.dateOrder || '',
      handler: 'N/A', // Default value
      trend: {
        label: 'Normal',
        variant: 'info' as const,
      },
    };
    setSelectedProductForStock(mappedData);
    setIsPerProductStockOpen(true);
  };

  // Search input handlers
  const handleClearInput = () => {
    setInputValue('');
    setSearchQuery('');
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    inputRef.current?.focus();
  };

  // Sync inputValue with searchQuery when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

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

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Apply supplier filter
      const matchesSupplier =
        selectedSuppliers.length === 0 ||
        selectedSuppliers.some((s) => s.name === row.supplier?.name);

      // Apply status filter
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(row.status?.label);

      // Apply date order filter
      const matchesDateOrder =
        selectedDateOrder.length === 0 ||
        selectedDateOrder.includes(row.dateOrder);

      // Apply search query
      const matchesSearch =
        !searchQuery ||
        [
          row.productInfo?.title,
          row.productInfo?.label,
          row.id,
          row.carrier,
          row.supplier?.name,
          row.status?.label,
          row.stock,
          row.arrivalDate,
          row.dateOrder,
        ].some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange && (dateRange.from || dateRange.to)) {
        try {
          // Parse the date from "DD MMM, YYYY" format
          const rowDate = parse(row.arrivalDate, 'dd MMM, yyyy', new Date());

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

      return (
        matchesSupplier &&
        matchesStatus &&
        matchesDateOrder &&
        matchesSearch &&
        matchesDateRange
      );
    });
  }, [
    data,
    selectedSuppliers,
    selectedStatuses,
    selectedDateOrder,
    searchQuery,
    dateRange,
  ]);

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
        size: 50,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'productInfo',
        accessorFn: (row) => row.productInfo,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Product"
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

              <span className="text-xs text-muted-foreground uppercase">
                sku:{' '}
                <span className="text-xs font-medium text-secondary-foreground">
                  {productInfo.label}
                </span>
              </span>
            </div>
          );
        },
        enableSorting: true,
        size: 200,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'dateOrder',
        accessorFn: (row) => row.dateOrder,
        header: ({ column }) => (
          <DataGridColumnHeader title="Order Date" column={column} />
        ),
        cell: (info) => {
          return info.row.original.dateOrder;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'qty',
        accessorFn: (row) => row.qty,
        header: ({ column }) => (
          <DataGridColumnHeader title="QTY" column={column} />
        ),
        cell: (info) => {
          return info.row.original.qty;
        },
        enableSorting: true,
        size: 70,
        meta: {
          cellClassName: 'text-center',
        },
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
        size: 90,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: (info) => {
          const status = info.row.original.status;
          const variant = status.variant as keyof BadgeProps['variant'];
          return (
            <Badge variant={variant} appearance="light">
              {status.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 110,
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'arrivalDate',
        accessorFn: (row) => row.arrivalDate,
        header: ({ column }) => (
          <DataGridColumnHeader title="Arrival Date" column={column} />
        ),
        cell: (info) => {
          return info.row.original.arrivalDate;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
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
        size: 140,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'carrier',
        accessorFn: (row) => row.carrier,
        header: ({ column }) => (
          <DataGridColumnHeader title="Carrier" column={column} />
        ),
        cell: (info) => {
          return info.row.original.carrier;
        },
        enableSorting: true,
        size: 90,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'tracking',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tracking" column={column} />
        ),
        enableSorting: true,
        cell: (info) => (
          <>
            <div className="text-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShowClick(info.row.original)}
              >
                Show
              </Button>
            </div>
          </>
        ),
        size: 90,
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: () => (
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
        ),
        size: 60,
      },
    ],
    [],
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
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TooltipProvider>
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

              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge variant="outline" size="sm">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-5 pt-0.5 -m-0.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {Array.from(
                          new Set(data.map((row) => row.status?.label)),
                        ).map((status) => {
                          const count = data.filter(
                            (row) => row.status?.label === status,
                          ).length;
                          const variant =
                            (data.find((row) => row.status?.label === status)
                              ?.status?.variant as
                              | 'primary'
                              | 'secondary'
                              | 'success'
                              | 'warning'
                              | 'info'
                              | 'outline'
                              | 'destructive') || 'secondary';
                          return (
                            <CommandItem
                              key={status}
                              value={status}
                              className="flex items-center gap-2.5 bg-transparent!"
                              onSelect={() => {}}
                              data-disabled="true"
                            >
                              <Checkbox
                                id={`status-${status}`}
                                checked={selectedStatuses.includes(status)}
                                onCheckedChange={() =>
                                  handleStatusChange(
                                    !selectedStatuses.includes(status),
                                    status,
                                  )
                                }
                                size="sm"
                              />
                              <Label
                                htmlFor={`status-${status}`}
                                className="grow flex items-center justify-between font-normal gap-1.5"
                              >
                                <Badge variant={variant} appearance="light">
                                  {status}
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

              {/* Supplier Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    Supplier
                    {selectedSuppliers.length > 0 && (
                      <Badge variant="outline" size="sm">
                        {selectedSuppliers.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-5 pt-0.5 -m-0.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search supplier..." />
                    <CommandList>
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        {Array.from(
                          new Set(data.map((row) => row.supplier)),
                        ).map((supplier) => {
                          const count = data.filter(
                            (row) => row.supplier?.name === supplier.name,
                          ).length;
                          return (
                            <CommandItem
                              key={supplier.name}
                              value={supplier.name}
                              className="flex items-center gap-2.5 bg-transparent!"
                              onSelect={() => {}}
                              data-disabled="true"
                            >
                              <Checkbox
                                id={supplier.name}
                                checked={selectedSuppliers.some(
                                  (s) => s.name === supplier.name,
                                )}
                                onCheckedChange={(checked) =>
                                  handleSupplierChange(
                                    checked === true,
                                    supplier,
                                  )
                                }
                                size="sm"
                              />
                              <Label
                                htmlFor={supplier.name}
                                className="grow flex items-center justify-between font-normal gap-1.5"
                              >
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={toAbsoluteUrl(
                                      `/media/brand-logos/${supplier.logo}`,
                                    )}
                                    alt={supplier.name}
                                    className="h-4 rounded-full"
                                  />
                                  <span>{supplier.name}</span>
                                </div>
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

        {/* Track Shipping Modal */}
        <TrackShippingSheet
          open={isTrackShippingOpen}
          onOpenChange={setIsTrackShippingOpen}
          data={selectedProduct}
        />

        {/* Per Product Stock Sheet Modal */}
        <PerProductStockSheet
          open={isPerProductStockOpen}
          onOpenChange={setIsPerProductStockOpen}
          data={selectedProductForStock}
        />
      </DataGrid>
    </TooltipProvider>
  );
};

export { InboundStockTable };
