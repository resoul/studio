'use client';

/* eslint-disable react-hooks/exhaustive-deps */
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
import { Link } from 'react-router';
import { toast } from 'sonner';
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
import { CreateShippingLabelSheet } from '../components/create-shipping-label-sheet';
import { TrackShippingSheet } from '../components/track-shipping-sheet';
import { PerProductStockSheet } from '../components/per-product-stock-sheet';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface OutboundStockData extends Record<string, unknown> {
  notify?: boolean;
  id: string;
  dateOrder: string;
  productInfo: {
    title: string;
    label: string;
    tooltip: string;
  };
  qty: string;
  status: {
    label: string;
    variant: string;
  };
  expDelivery: string;
  warehouse: string;
  carrier: string;
}

interface OutboundStockProps {
  mockData?: OutboundStockData[];
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

const mockData: OutboundStockData[] = [
  {
    id: '1',
    dateOrder: 'SO-TX-4587',
    productInfo: {
      title: 'Air Max 270 React Eng…',
      label: 'WM-8421',
      tooltip: 'Air Max 270 React Engineered',
    },
    qty: '10',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '18 Aug, 2025',
    warehouse: 'TX-Hub',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '2',
    dateOrder: 'SO-CA-4590',
    productInfo: {
      title: 'Trail Runner Z2',
      label: 'UC-3990',
      tooltip: '',
    },
    qty: '45',
    status: {
      label: 'Shipped',
      variant: 'success',
    },
    expDelivery: '17 Aug, 2025',
    warehouse: 'CA-Stock',
    carrier: 'UPS',
    notify: false,
  },
  {
    id: '3',
    dateOrder: 'SO-NY-4602 ',
    productInfo: {
      title: 'Urban Flex Knit Low…',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low Sneakers',
    },
    qty: '70',
    status: {
      label: 'Shipped',
      variant: 'success',
    },
    expDelivery: '15 Aug, 2025',
    warehouse: 'AMS-WH',
    carrier: 'DHL',
    notify: false,
  },
  {
    id: '4',
    dateOrder: 'SO-JPN-4611 ',
    productInfo: {
      title: 'Blaze Street Classic',
      label: 'LS-1033',
      tooltip: '',
    },
    qty: '120',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    expDelivery: '14 Aug, 2025',
    warehouse: 'JPN-DC',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '5',
    dateOrder: 'SO-AMS-4620',
    productInfo: {
      title: 'Terra Trekking Max Pro…',
      label: 'WC-5510',
      tooltip: 'Terra Trekking Max Pro Sneakers',
    },
    qty: '200',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '13 Aug, 2025',
    warehouse: 'SYD-Fulfill',
    carrier: 'USPS',
    notify: true,
  },
  {
    id: '6',
    dateOrder: 'SO-LON-4633',
    productInfo: {
      title: 'Lite Runner Evo',
      label: 'GH-7312',
      tooltip: '',
    },
    qty: '30',
    status: {
      label: 'Cancelled',
      variant: 'destructive',
    },
    expDelivery: '12 Aug, 2025',
    warehouse: 'TOR-INV',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '7',
    dateOrder: 'SO-SGP-4644',
    productInfo: {
      title: 'Classic Street Wear 2.0…',
      label: 'UH-2300',
      tooltip: 'Classic Street Wear 2.0 Collection',
    },
    qty: '100',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '11 Aug, 2025',
    warehouse: 'NY-Hub',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '8',
    dateOrder: 'SO-BER-4652 ',
    productInfo: {
      title: 'Enduro AllTerrain High…',
      label: 'MS-8702',
      tooltip: 'Enduro AllTerrain High Sneakers',
    },
    qty: '100',
    status: {
      label: 'Delivered',
      variant: 'success',
    },
    expDelivery: '10 Aug, 2025',
    warehouse: 'LON-WH',
    carrier: 'DHL',
    notify: false,
  },
  {
    id: '9',
    dateOrder: 'SO-SYD-4667 ',
    productInfo: {
      title: 'FlexRun Urban Core',
      label: 'BS-6112',
      tooltip: '',
    },
    qty: '250',
    status: {
      label: 'Cancelled',
      variant: 'destructive',
    },
    expDelivery: '09 Aug, 2025',
    warehouse: 'BER-DC',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '10',
    dateOrder: 'SO-TOR-4675',
    productInfo: {
      title: 'Aero Walk Lite',
      label: 'HC-9031',
      tooltip: '',
    },
    qty: '30',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    expDelivery: '08 Aug, 2025',
    warehouse: 'SGP-Base',
    carrier: 'USPS',
    notify: true,
  },
  {
    id: '11',
    dateOrder: 'SO-MEL-4680',
    productInfo: {
      title: 'Pro Runner Elite',
      label: 'PR-2024',
      tooltip: '',
    },
    qty: '85',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '07 Aug, 2025',
    warehouse: 'MEL-Hub',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '12',
    dateOrder: 'SO-PAR-4685',
    productInfo: {
      title: 'Comfort Plus Max',
      label: 'CP-4567',
      tooltip: '',
    },
    qty: '55',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '06 Aug, 2025',
    warehouse: 'PAR-DC',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '13',
    dateOrder: 'SO-MAD-4690',
    productInfo: {
      title: 'Speed Demon X',
      label: 'SD-7890',
      tooltip: '',
    },
    qty: '23',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    expDelivery: '05 Aug, 2025',
    warehouse: 'MAD-WH',
    carrier: 'DHL',
    notify: true,
  },
  {
    id: '14',
    dateOrder: 'SO-ROME-4695',
    productInfo: {
      title: 'Casual Street Pro',
      label: 'CS-3456',
      tooltip: '',
    },
    qty: '67',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '04 Aug, 2025',
    warehouse: 'ROME-INV',
    carrier: 'USPS',
    notify: true,
  },
  {
    id: '15',
    dateOrder: 'SO-ATH-4700',
    productInfo: {
      title: 'Mountain Trek Elite',
      label: 'MT-9012',
      tooltip: '',
    },
    qty: '34',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    expDelivery: '03 Aug, 2025',
    warehouse: 'ATH-Base',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '16',
    dateOrder: 'SO-IST-4705',
    productInfo: {
      title: 'Urban Flex Pro',
      label: 'UF-6789',
      tooltip: '',
    },
    qty: '89',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '02 Aug, 2025',
    warehouse: 'IST-WH',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '17',
    dateOrder: 'SO-DXB-4710',
    productInfo: {
      title: 'Lightweight Runner',
      label: 'LR-2345',
      tooltip: '',
    },
    qty: '12',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    expDelivery: '01 Aug, 2025',
    warehouse: 'DXB-Hub',
    carrier: 'DHL',
    notify: true,
  },
  {
    id: '18',
    dateOrder: 'SO-BOM-4715',
    productInfo: {
      title: 'Premium Comfort Max',
      label: 'PC-5678',
      tooltip: '',
    },
    qty: '56',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '31 Jul, 2025',
    warehouse: 'BOM-DC',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '19',
    dateOrder: 'SO-DEL-4720',
    productInfo: {
      title: 'Sport Performance Pro',
      label: 'SP-8901',
      tooltip: '',
    },
    qty: '78',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    expDelivery: '30 Jul, 2025',
    warehouse: 'DEL-WH',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '20',
    dateOrder: 'SO-BLR-4725',
    productInfo: {
      title: 'Classic Retro Style',
      label: 'CR-1234',
      tooltip: '',
    },
    qty: '43',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '29 Jul, 2025',
    warehouse: 'BLR-INV',
    carrier: 'USPS',
    notify: true,
  },
  {
    id: '21',
    dateOrder: 'SO-HYD-4730',
    productInfo: {
      title: 'Adventure Explorer',
      label: 'AE-4567',
      tooltip: '',
    },
    qty: '29',
    status: {
      label: 'In Transit',
      variant: 'warning',
    },
    expDelivery: '28 Jul, 2025',
    warehouse: 'HYD-Base',
    carrier: 'DHL',
    notify: true,
  },
  {
    id: '22',
    dateOrder: 'SO-CHE-4735',
    productInfo: {
      title: 'Modern Street Elite',
      label: 'MS-7890',
      tooltip: '',
    },
    qty: '91',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '27 Jul, 2025',
    warehouse: 'CHE-Hub',
    carrier: 'FedEx',
    notify: true,
  },
  {
    id: '23',
    dateOrder: 'SO-KOL-4740',
    productInfo: {
      title: 'Eco Friendly Runner',
      label: 'EF-2345',
      tooltip: '',
    },
    qty: '37',
    status: {
      label: 'Picking',
      variant: 'info',
    },
    expDelivery: '26 Jul, 2025',
    warehouse: 'KOL-DC',
    carrier: 'UPS',
    notify: true,
  },
  {
    id: '24',
    dateOrder: 'SO-MAA-4745',
    productInfo: {
      title: 'Luxury Comfort Pro',
      label: 'LC-5678',
      tooltip: '',
    },
    qty: '15',
    status: {
      label: 'Packed',
      variant: 'primary',
    },
    expDelivery: '25 Jul, 2025',
    warehouse: 'MAA-WH',
    carrier: 'USPS',
    notify: true,
  },
  {
    id: '25',
    dateOrder: 'SO-CCU-4750',
    productInfo: {
      title: 'Tech Smart Runner',
      label: 'TS-8901',
      tooltip: '',
    },
    qty: '68',
    status: {
      label: 'Allocated',
      variant: 'success',
    },
    expDelivery: '24 Jul, 2025',
    warehouse: 'CCU-INV',
    carrier: 'DHL',
    notify: true,
  },
];

export function OutboundStockTable({
  mockData: propsMockData,
}: OutboundStockProps) {
  const data = propsMockData || mockData;
  const [, setNotifyState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize notify state from data
    const initialState: Record<string, boolean> = {};
    data.forEach((item: OutboundStockData) => {
      initialState[item.id] = Boolean(item.notify); // Convert to boolean
    });
    setNotifyState(initialState);
  }, [data]);

  const handleNotifyChange = (id: string, value: boolean) => {
    setNotifyState((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Show toaster notification with custom Alert style
    if (value) {
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
              Client notifications enabled for shipping and status updates.
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
              Client notifications disabled for this order.
            </AlertTitle>
          </Alert>
        ),
        {
          duration: 5000,
        },
      );
    }
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ]);

  const [trackShippingSheetOpen, setTrackShippingSheetOpen] = useState(false);
  const [modalData, setModalData] = useState<OutboundStockData | null>(null);
  const onTrackShippingSheetOpenChange = (open: boolean) => {
    setTrackShippingSheetOpen(open);
    if (!open) {
      setModalData(null);
    }
  };

  const [createShippingSheetOpen, setCreateShippingSheetOpen] = useState(false);
  const [createModalData, setCreateModalData] =
    useState<OutboundStockData | null>(null);
  const onCreateShippingSheetOpenChange = (open: boolean) => {
    setCreateShippingSheetOpen(open);
    if (!open) {
      setCreateModalData(null);
    }
  };

  // PerProductStockSheet modal state
  const [isPerProductStockOpen, setIsPerProductStockOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<MappedStockData | undefined>(undefined);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductClick = (product: OutboundStockData) => {
    // Map OutboundStockData to MappedStockData format
    const mappedData: MappedStockData = {
      id: product.id,
      productInfo: {
        image: 'default.png', // Default image since OutboundStockData doesn't have image
        title: product.productInfo.title,
        label: product.productInfo.label,
      },
      stock: parseInt(product.qty) || 0,
      rsvd: 0, // Default value
      tlvl: 0, // Default value
      delta: {
        label: '+0',
        variant: 'success' as const,
      },
      sum: '$0.00', // Default value
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

  // Search input state
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

  const handleCarrierChange = (isChecked: boolean, carrier: string) => {
    if (isChecked) {
      setSelectedCarriers((prev) => [...prev, carrier]);
    } else {
      setSelectedCarriers((prev) => prev.filter((c) => c !== carrier));
    }
    // Reset pagination to first page when filters change
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusChange = (isSelected: boolean, status: string) => {
    setSelectedStatuses((prev) => {
      if (isSelected) {
        return [...prev, status];
      }
      return prev.filter((s) => s !== status);
    });
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

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Apply search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        row.productInfo?.title?.toLowerCase().includes(searchLower) ||
        row.id?.toLowerCase().includes(searchLower) ||
        row.carrier?.toLowerCase().includes(searchLower) ||
        row.status?.label?.toLowerCase().includes(searchLower) ||
        row.warehouse?.toLowerCase().includes(searchLower);

      // Apply other filters
      const matchesStatus =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(row.status.label);
      const matchesCarrier =
        selectedCarriers.length === 0 || selectedCarriers.includes(row.carrier);

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange && (dateRange.from || dateRange.to)) {
        try {
          // Parse the date from "DD MMM, YYYY" format
          const rowDate = parse(row.expDelivery, 'dd MMM, yyyy', new Date());

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
        matchesSearch && matchesStatus && matchesCarrier && matchesDateRange
      );
    });
  }, [data, searchQuery, selectedStatuses, selectedCarriers, dateRange]);

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

  const columns = useMemo<ColumnDef<OutboundStockData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 35,
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
                    <p>
                      {productInfo.tooltip ||
                        productInfo.title.replace(/[….]/g, '')}
                    </p>
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
                <span className="text-xs font-medium text-foreground">
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
        id: 'qty',
        accessorFn: (row) => row.qty,
        header: ({ column }) => (
          <DataGridColumnHeader title="QTY" column={column} />
        ),
        cell: (info) => {
          return <div className="text-center">{info.row.original.qty}</div>;
        },
        enableSorting: true,
        size: 75,
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
            <div className="text-center">
              <Badge variant={variant} appearance="light">
                {status.label}
              </Badge>
            </div>
          );
        },
        enableSorting: true,
        size: 110,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'expDelivery',
        accessorFn: (row) => row.expDelivery,
        header: ({ column }) => (
          <DataGridColumnHeader title="Exp. Delivery" column={column} />
        ),
        cell: (info) => {
          return info.row.original.expDelivery;
        },
        enableSorting: true,
        size: 125,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'warehouse',
        accessorFn: (row) => row.warehouse,
        header: ({ column }) => (
          <DataGridColumnHeader title="Warehouse" column={column} />
        ),
        cell: (info) => {
          return info.row.original.warehouse;
        },
        enableSorting: true,
        size: 120,
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
        cell: ({ row }) => (
          <>
            <div className="text-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setModalData(row.original);
                  setTrackShippingSheetOpen(true);
                }}
              >
                Show
              </Button>
            </div>
          </>
        ),
        size: 90,
      },
      {
        id: 'notify',
        header: ({ column }) => (
          <DataGridColumnHeader title="Notify" column={column} />
        ),
        enableSorting: true,
        cell: (info) => {
          const id = info.row.getValue('id') as string;
          return (
            <div className="flex justify-center">
              <Checkbox
                size="sm"
                id={`notify-${id}`}
                defaultChecked={!!info.row.original.notify}
                onCheckedChange={(checked) =>
                  handleNotifyChange(id, Boolean(checked))
                }
              />
            </div>
          );
        },
        size: 60,
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: () => (
          <div className="text-center">
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
          </div>
        ),
        size: 70,
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

  const Title = useMemo(() => {
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
                      (data.find((row) => row.status?.label === status)?.status
                        ?.variant as
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

        {/* Carrier Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              Carrier
              {selectedCarriers.length > 0 && (
                <Badge variant="outline" size="sm">
                  {selectedCarriers.length}
                </Badge>
              )}
              <ChevronDown className="size-5 pt-0.5 -m-0.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search carrier..." />
              <CommandList>
                <CommandEmpty>No carrier found.</CommandEmpty>
                <CommandGroup>
                  {Array.from(new Set(data.map((row) => row.carrier))).map(
                    (carrier) => {
                      const count = data.filter(
                        (row) => row.carrier === carrier,
                      ).length;
                      return (
                        <CommandItem
                          key={carrier}
                          value={carrier}
                          className="flex items-center gap-2.5 bg-transparent!"
                          onSelect={() => {}}
                          data-disabled="true"
                        >
                          <Checkbox
                            id={`carrier-${carrier}`}
                            checked={selectedCarriers.includes(carrier)}
                            onCheckedChange={() =>
                              handleCarrierChange(
                                !selectedCarriers.includes(carrier),
                                carrier,
                              )
                            }
                            size="sm"
                          />
                          <Label
                            htmlFor={`carrier-${carrier}`}
                            className="grow flex items-center justify-between font-normal gap-1.5"
                          >
                            <span>{carrier}</span>
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
      </CardHeading>
    );
  }, [
    inputValue,
    isDatePickerOpen,
    dateRange,
    tempDateRange,
    handleDateRangeReset,
    handleDateRangeCancel,
    handleDateRangeApply,
    selectedStatuses,
    selectedCarriers,
    handleStatusChange,
    handleCarrierChange,
    data,
    handleClearInput,
  ]);

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
        {modalData && (
          <TrackShippingSheet
            open={trackShippingSheetOpen}
            onOpenChange={onTrackShippingSheetOpenChange}
            data={modalData}
          />
        )}
        {createModalData && (
          <CreateShippingLabelSheet
            open={createShippingSheetOpen}
            onOpenChange={onCreateShippingSheetOpenChange}
            data={
              createModalData || (mockData.length > 0 ? mockData[0] : undefined)
            }
          />
        )}
        {selectedProductForStock && (
          <PerProductStockSheet
            open={isPerProductStockOpen}
            onOpenChange={setIsPerProductStockOpen}
            data={selectedProductForStock}
          />
        )}
        <Card>
          <CardHeader className="py-3.5">
            {Title}
            <CardToolbar>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateModalData(mockData[0]);
                  setCreateShippingSheetOpen(true);
                }}
              >
                Create Shipping Label
              </Button>
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
      </DataGrid>
    </TooltipProvider>
  );
}
