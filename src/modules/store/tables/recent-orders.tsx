'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Info, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input, InputWrapper } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface IData {
  id: string; // Use string for ID
  date: string;
  customer: string;
  orderId: string;
  paymentMethod: string;
  country: ICountry;
  label: string;
  variant: string;
  amount: string;
}

interface ICountry {
  name: string;
  flag: string;
}

const data: IData[] = [
  {
    id: '1',
    orderId: '#583920-XT',
    date: '18 Aug, 2025',
    customer: 'Mia Martinez',
    amount: '$83.00',
    paymentMethod: 'Visa',
    country: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '2',
    orderId: '#104761-BQ',
    date: '20 Jan, 2025',
    customer: 'Alice Morgan',
    amount: '$99.00',
    paymentMethod: 'Mastercard',
    country: {
      name: 'India',
      flag: 'india.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '3',
    orderId: '#847305-ZR',
    date: '19 Feb, 2025',
    customer: 'Noah Garcia',
    amount: '$120.00',
    paymentMethod: 'iDeal',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '4',
    orderId: '#229176-LK',
    date: '16 Mar, 2025',
    customer: 'Liam Brown',
    amount: '$72.00',
    paymentMethod: 'Paypal',
    country: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    label: 'Cancelled',
    variant: 'destructive',
  },
  {
    id: '5',
    orderId: '#671452-VN',
    date: '29 Mar, 2025',
    customer: 'Emma Chen',
    amount: '$169.00',
    paymentMethod: 'Mastercard',
    country: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '6',
    orderId: '#398274-JY',
    date: '9 Aug, 2025',
    customer: 'Olivia Davis',
    amount: '$110.00',
    paymentMethod: 'iDeal',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '7',
    orderId: '#750163-DP',
    date: '22 Jul, 2025',
    customer: 'Lucas Anderson',
    amount: '$49.00',
    paymentMethod: 'Mastercard',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '8',
    orderId: '#912048-MF',
    date: '28 Apr, 2025',
    customer: 'Sophia Patel',
    amount: '$230.00',
    paymentMethod: 'Visa',
    country: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '9',
    orderId: '#336791-TA',
    date: '10 Jan, 2025',
    customer: 'Ethan Wilson',
    amount: '$140.00',
    paymentMethod: 'Visa',
    country: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    label: 'Cancelled',
    variant: 'destructive',
  },
  {
    id: '10',
    orderId: '#508234-WS',
    date: '22 Jul, 2025',
    customer: 'James Liu',
    amount: '$84.00',
    paymentMethod: 'iDeal',
    country: {
      name: 'India',
      flag: 'india.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '11',
    orderId: '#792547-KP',
    date: '5 Sep, 2025',
    customer: 'Isabella Rodriguez',
    amount: '$195.00',
    paymentMethod: 'Visa',
    country: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '12',
    orderId: '#641829-MN',
    date: '12 Oct, 2025',
    customer: 'Alexander Johnson',
    amount: '$67.50',
    paymentMethod: 'Paypal',
    country: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '13',
    orderId: '#358147-QR',
    date: '28 Nov, 2025',
    customer: 'Charlotte Lee',
    amount: '$156.75',
    paymentMethod: 'Mastercard',
    country: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    label: 'Cancelled',
    variant: 'destructive',
  },
  {
    id: '14',
    orderId: '#496823-ST',
    date: '3 Dec, 2025',
    customer: 'Benjamin White',
    amount: '$89.25',
    paymentMethod: 'iDeal',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '15',
    orderId: '#715390-UV',
    date: '15 Dec, 2025',
    customer: 'Amelia Harris',
    amount: '$203.00',
    paymentMethod: 'Visa',
    country: {
      name: 'India',
      flag: 'india.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '16',
    orderId: '#824657-WX',
    date: '2 Jan, 2026',
    customer: 'Harper Clark',
    amount: '$45.80',
    paymentMethod: 'Mastercard',
    country: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '17',
    orderId: '#937164-YZ',
    date: '18 Jan, 2026',
    customer: 'Evelyn Lewis',
    amount: '$178.90',
    paymentMethod: 'Paypal',
    country: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '18',
    orderId: '#048572-AB',
    date: '25 Jan, 2026',
    customer: 'Sebastian Walker',
    amount: '$92.40',
    paymentMethod: 'iDeal',
    country: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    label: 'Cancelled',
    variant: 'destructive',
  },
  {
    id: '19',
    orderId: '#159683-CD',
    date: '8 Feb, 2026',
    customer: 'Abigail Hall',
    amount: '$134.60',
    paymentMethod: 'Visa',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '20',
    orderId: '#260794-EF',
    date: '14 Feb, 2026',
    customer: 'Henry Allen',
    amount: '$76.30',
    paymentMethod: 'Mastercard',
    country: {
      name: 'India',
      flag: 'india.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '21',
    orderId: '#371805-GH',
    date: '22 Feb, 2026',
    customer: 'Ella Young',
    amount: '$211.50',
    paymentMethod: 'Paypal',
    country: {
      name: 'Estonia',
      flag: 'estonia.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '22',
    orderId: '#482916-IJ',
    date: '5 Mar, 2026',
    customer: 'Owen Hernandez',
    amount: '$58.70',
    paymentMethod: 'iDeal',
    country: {
      name: 'Canada',
      flag: 'canada.svg',
    },
    label: 'Cancelled',
    variant: 'destructive',
  },
  {
    id: '23',
    orderId: '#593027-KL',
    date: '12 Mar, 2026',
    customer: 'Scarlett King',
    amount: '$147.25',
    paymentMethod: 'Visa',
    country: {
      name: 'Ukraine',
      flag: 'ukraine.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
  {
    id: '24',
    orderId: '#604138-MN',
    date: '20 Mar, 2026',
    customer: 'Jack Wright',
    amount: '$103.80',
    paymentMethod: 'Mastercard',
    country: {
      name: 'Malaysia',
      flag: 'malaysia.svg',
    },
    label: 'Pending',
    variant: 'warning',
  },
  {
    id: '25',
    orderId: '#715249-OP',
    date: '28 Mar, 2026',
    customer: 'Grace Lopez',
    amount: '$189.95',
    paymentMethod: 'Paypal',
    country: {
      name: 'India',
      flag: 'india.svg',
    },
    label: 'Delivered',
    variant: 'success',
  },
];

const DashboardTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const ColumnInputFilter = <TData, TValue>({
    column,
  }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        variant="sm"
        className="max-w-40"
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
        size: 48,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'orderId',
        accessorFn: (row) => row.orderId,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Order ID"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          return info.row.original.orderId;
        },
        enableSorting: true,
        size: 210,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'date',
        accessorFn: (row) => row.date,
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        cell: (info) => {
          return info.row.original.date;
        },
        enableSorting: true,
        size: 170,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'customer',
        accessorFn: (row) => row.customer,
        header: ({ column }) => (
          <DataGridColumnHeader title="Customer" column={column} />
        ),
        cell: (info) => {
          return info.row.original.customer;
        },
        enableSorting: true,
        size: 160,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'amount',
        accessorFn: (row) => row.amount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Amount" column={column} />
        ),
        cell: (info) => {
          return info.row.original.amount;
        },
        enableSorting: true,
        size: 160,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'paymentMethod',
        accessorFn: (row) => row.paymentMethod,
        header: ({ column }) => (
          <DataGridColumnHeader title="Payment Method" column={column} />
        ),
        cell: (info) => {
          return info.row.original.paymentMethod;
        },
        enableSorting: true,
        size: 160,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'country',
        accessorFn: (row) => row.country,
        header: ({ column }) => (
          <DataGridColumnHeader title="Country" column={column} />
        ),
        cell: (info) => {
          return (
            <div className="flex items-center gap-1.5">
              <img
                src={toAbsoluteUrl(
                  `/media/flags/${info.row.original.country.flag}`,
                )}
                className="h-4 rounded-full"
                alt="image"
              />
              <span className="leading-none text-secondary-foreground">
                {info.row.original.country.name}
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
      {
        id: 'label',
        accessorFn: (row) => row.label,
        header: ({ column }) => (
          <DataGridColumnHeader title="Order Status" column={column} />
        ),
        cell: (info) => {
          const variant = info.row.original
            .variant as keyof BadgeProps['variant'];

          return (
            <Badge variant={variant} appearance="light">
              {info.row.original.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 150,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: () => {
          return (
            <Button mode="link" underlined="dashed">
              Details
            </Button>
          );
        },
        size: 90,
      },
    ],
    [],
  );

  const filteredData: IData[] = useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      return item.id.toLowerCase().includes(query);
    });
  }, [searchQuery]);

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
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const [inputValue, setInputValue] = useState('');

    // Sync inputValue with searchQuery when searchQuery changes externally
    useEffect(() => {
      setInputValue(searchQuery);
    }, []);

    // Update search query when input changes
    useEffect(() => {
      const timer = setTimeout(() => {
        if (inputValue !== searchQuery) {
          setSearchQuery(inputValue);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [inputValue]);

    return (
      <CardToolbar>
        {/* Search */}
        <div className="w-full max-w-[200px]">
          <InputWrapper>
            <Search />
            <Input
              placeholder="Search by ID"
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
              onClick={() => setInputValue('')}
              variant="dim"
              className="-me-4"
              disabled={inputValue === ''}
            >
              {inputValue !== '' && <X size={16} />}
            </Button>
          </InputWrapper>
        </div>
        <Button variant="outline">Export CSV</Button>
      </CardToolbar>
    );
  };

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
          <CardTitle>Recent Orders</CardTitle>
          <Toolbar />
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
  );
};

export { DashboardTable };
