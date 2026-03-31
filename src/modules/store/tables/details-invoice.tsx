'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Download, EllipsisVertical, Info, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { OrderDetailsSheet } from '../components/order-details-sheet';
import type { VariantProps } from 'class-variance-authority';
import { Settings, Pencil } from 'lucide-react';
import { DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// ---- DATA TYPE ----

export interface DetailsInvoiceData {
  invoice: string;
  date: string;
  dueDate: string;
  id: string;
  total: string;
  paymentStatus: {
    label: string;
    variant: VariantProps<typeof Badge>['variant'];
  };
}

interface DetailsInvoiceProps {
  mockData?: DetailsInvoiceData[];
  displayProducts?: boolean;
}


const mockData: DetailsInvoiceData[] = [
  {
    id: '1',
    invoice: 'INV-7845',
    date: '18 Aug, 2025',
    dueDate: '25 Aug, 2025',
    total: '$372.93',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
  },
  {
    id: '2',
    invoice: 'INV-7844',
    date: '17 Aug, 2025',
    dueDate: '24 Aug, 2025',
    total: '$245.10',
    paymentStatus: {
      label: 'Paid',
      variant: 'success',
    },
  },
  {
    id: '3',
    invoice: 'IINV-7843',
    date: '16 Aug, 2025',
    dueDate: '23 Aug, 2025',
    total: '$1,024.50',
    paymentStatus: {
      label: 'Pending',
      variant: 'info',
    },
  },
  {
    id: '4',
    invoice: 'INV-7842',
    date: '12 Aug, 2025',
    dueDate: '19 Aug, 2025',
    total: '$540.00',
    paymentStatus: {
      label: 'Overdue',
      variant: 'destructive',
    },
  },
    {
      id: '5',
      invoice: 'INV-7841',
      date: '5 Aug, 2025',
      dueDate: '12 Aug, 2025',
      total: '$120.99',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '6',
      invoice: 'INV-7840',
      date: '4 Aug, 2025',
      dueDate: '11 Aug, 2025',
      total: '$890.50',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    },
    {
      id: '7',
      invoice: 'INV-7839',
      date: '3 Aug, 2025',
      dueDate: '10 Aug, 2025',
      total: '$445.75',
      paymentStatus: {
        label: 'Overdue',
        variant: 'destructive',
      },
    },
    {
      id: '8',
      invoice: 'INV-7838',
      date: '2 Aug, 2025',
      dueDate: '9 Aug, 2025',
      total: '$1,250.00',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '9',
      invoice: 'INV-7837',
      date: '1 Aug, 2025',
      dueDate: '8 Aug, 2025',
      total: '$567.89',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    },
    {
      id: '10',
      invoice: 'INV-7836',
      date: '31 Jul, 2025',
      dueDate: '7 Aug, 2025',
      total: '$234.56',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '11',
      invoice: 'INV-7835',
      date: '30 Jul, 2025',
      dueDate: '6 Aug, 2025',
      total: '$789.25',
      paymentStatus: {
        label: 'Overdue',
        variant: 'destructive',
      },
    },
    {
      id: '12',
      invoice: 'INV-7834',
      date: '29 Jul, 2025',
      dueDate: '5 Aug, 2025',
      total: '$345.67',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '13',
      invoice: 'INV-7833',
      date: '28 Jul, 2025',
      dueDate: '4 Aug, 2025',
      total: '$1,890.25',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    },
    {
      id: '14',
      invoice: 'INV-7832',
      date: '27 Jul, 2025',
      dueDate: '3 Aug, 2025',
      total: '$678.90',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '15',
      invoice: 'INV-7831',
      date: '26 Jul, 2025',
      dueDate: '2 Aug, 2025',
      total: '$456.78',
      paymentStatus: {
        label: 'Overdue',
        variant: 'destructive',
      },
    },
    {
      id: '16',
      invoice: 'INV-7830',
      date: '25 Jul, 2025',
      dueDate: '1 Aug, 2025',
      total: '$2,100.50',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '17',
      invoice: 'INV-7829',
      date: '24 Jul, 2025',
      dueDate: '31 Jul, 2025',
      total: '$123.45',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    },
    {
      id: '18',
      invoice: 'INV-7828',
      date: '23 Jul, 2025',
      dueDate: '30 Jul, 2025',
      total: '$987.65',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '19',
      invoice: 'INV-7827',
      date: '22 Jul, 2025',
      dueDate: '29 Jul, 2025',
      total: '$543.21',
      paymentStatus: {
        label: 'Overdue',
        variant: 'destructive',
      },
    },
    {
      id: '20',
      invoice: 'INV-7826',
      date: '21 Jul, 2025',
      dueDate: '28 Jul, 2025',
      total: '$876.54',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '21',
      invoice: 'INV-7825',
      date: '20 Jul, 2025',
      dueDate: '27 Jul, 2025',
      total: '$321.09',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    },
    {
      id: '22',
      invoice: 'INV-7824',
      date: '19 Jul, 2025',
      dueDate: '26 Jul, 2025',
      total: '$654.32',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '23',
      invoice: 'INV-7823',
      date: '18 Jul, 2025',
      dueDate: '25 Jul, 2025',
      total: '$1,234.56',
      paymentStatus: {
        label: 'Overdue',
        variant: 'destructive',
      },
    },
    {
      id: '24',
      invoice: 'INV-7822',
      date: '17 Jul, 2025',
      dueDate: '24 Jul, 2025',
      total: '$789.01',
      paymentStatus: {
        label: 'Paid',
        variant: 'success',
      },
    },
    {
      id: '25',
      invoice: 'INV-7821',
      date: '16 Jul, 2025',
      dueDate: '23 Jul, 2025',
      total: '$456.78',
      paymentStatus: {
        label: 'Pending',
        variant: 'info',
      },
    }
];


// ---- MAIN TABLE COMPONENT ----
export function DetailsInvoiceTable({ mockData: propsMockData, displayProducts = false }: DetailsInvoiceProps & { displayProducts?: boolean }) {
  const rawData = propsMockData || mockData;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const [trackShippingSheetOpen, setTrackShippingSheetOpen] = useState(false);
  const [orderDetailsSheetOpen, setOrderDetailsSheetOpen] = useState(false);

  const [createShippingSheetOpen, setCreateShippingSheetOpen] = useState(false);


  const [createModalData] = useState<DetailsInvoiceData | null>(null);

  // Use raw data directly without filtering
  const filteredData = rawData;


  // --- COLUMNS ---
  const columns = useMemo<ColumnDef<DetailsInvoiceData>[]>(
    () => [
      {
        id: 'invoice',
        accessorFn: (row) => row.invoice,
        header: ({ column }) => (
          <DataGridColumnHeader title="InvoiceID" column={column} />
        ),
        cell: (info) => (
          <Link to="#" className="text-2sm text-primary font-normal" onClick={() => setOrderDetailsSheetOpen(true)}>
            {info.row.original.invoice}
          </Link>
        ),
        enableSorting: true,
        size: 100,
      },
      {
        id: 'date',
        accessorFn: (row) => row.date,
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        cell: (info) => info.row.original.date,
        enableSorting: true,
        size: 110,
      },
      {
        id: 'dueDate',
        accessorFn: (row) => row.dueDate,
        header: ({ column }) => (
          <DataGridColumnHeader title="Due Date" column={column} />
        ),
        cell: (info) => info.row.original.dueDate,
        enableSorting: true,
        size: 110,
      },
      {
        id: 'total',
        accessorFn: (row) => row.total,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total" column={column} />
        ),
        cell: (info) => info.row.original.total,
        enableSorting: true,
        size: 90,
      },
      {
        id: 'paymentStatus',
        accessorFn: (row) => row.paymentStatus,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
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
        size: 80,
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="" column={column} />
        ),
        enableSorting: false,
        cell: () => (
          <div className="flex grow justify-center items-center gap-1.5">
              <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleView}
                 title="View category"
               >
                 <Download />
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
        size: 60,
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
    },
    getRowId: (row: DetailsInvoiceData) => row.id,
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


function handleView(): void {
  throw new Error('Function not implemented.');
}

