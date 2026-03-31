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
  EllipsisVertical,
  Filter,
  Info,
  Search,
  Settings,
  Star,
  Trash,
  X,
  Layers,
} from 'lucide-react';
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
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProductFormSheet } from '../components/product-form-sheet';
import { ProductDetailsAnalyticsSheet } from '../components/product-details-analytics-sheet';
import { ManageVariantsSheet } from '../components/manage-variants';
import { cn } from '@/lib/utils';

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
  status: {
    label: string;
    variant: string;
  };
  created: string;
  updated: string;
}

interface ProductListProps {
  mockData?: IData[];
  onRowClick?: (productId: string) => void;
  displaySheet?: "productDetails" | "createProduct" | "editProduct" | "manageVariants";
}

const mockData: IData[] = [
  {
    id: '1',
    productInfo: {
      image: '11.png',
      title: 'Nike Air Max 270 React Engineered',
      label: 'WM-8421',
      tooltip: 'Air Max 270 React Engineered',
    },
    category: 'Sneakers',
    price: '$83.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '18 Aug, 2025',
    updated: '18 Aug, 2025',
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
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '17 Aug, 2025',
    updated: '17 Aug, 2025',
  },
  {
    id: '3',
    productInfo: {
      image: '2.png',
      title: 'Nike Urban Flex Knit Low-Top Sneaker',
      label: 'KB-8820',
      tooltip: 'Urban Flex Knit Low Sneakers',
    },
    category: 'Runners',
    price: '$76.50',
    status: {
      label: 'Draft',
      variant: 'warning',
    },
    created: '15 Aug, 2025',
    updated: '15 Aug, 2025',
  },
  {
    id: '4',
    productInfo: {
      image: '15.png',
      title: 'Blaze Street Classic',
      label: 'LS-1033',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$69.99',
    status: {
      label: 'Must Act',
      variant: 'destructive',
    },
    created: '14 Aug, 2025',
    updated: '14 Aug, 2025',
  },
  {
    id: '5',
    productInfo: {
      image: '13.png',
      title: 'Adidas Terra Trekking Max Pro Hiking Boot',
      label: 'WC-5510',
      tooltip: 'Terra Trekking Max Pro Boots',
    },
    category: 'Outdoor',
    price: '$129.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '13 Aug, 2025',
    updated: '13 Aug, 2025',
  },
  {
    id: '6',
    productInfo: {
      image: '7.png',
      title: 'Lite Runner Evo',
      label: 'GH-7312',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$59.00',
    status: {
      label: 'Archived',
      variant: 'info',
    },
    created: '12 Aug, 2025',
    updated: '12 Aug, 2025',
  },
  {
    id: '7',
    productInfo: {
      image: '10.png',
      title: 'Puma Classic Street Wear 2.0 Running Shoe',
      label: 'UH-2300',
      tooltip: 'Classic Street Wear 2.0 Collection',
    },
    category: 'Runners',
    price: '$72.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '11 Aug, 2025',
    updated: '11 Aug, 2025',
  },
  {
    id: '8',
    productInfo: {
      image: '3.png',
      title: 'Salomon Enduro All-Terrain High-Performance Trail Shoe',
      label: 'MS-8702',
      tooltip: 'Enduro All-Terrain High Sneakers',
    },
    category: 'Sneakers',
    price: '$119.50',
    status: {
      label: 'Archived',
      variant: 'info',
    },
    created: '10 Aug, 2025',
    updated: '10 Aug, 2025',
  },
  {
    id: '9',
    productInfo: {
      image: '8.png',
      title: 'FlexRun Urban Core',
      label: 'BS-6112',
      tooltip: '',
    },
    category: 'Outdoor',
    price: '$98.75',
    status: {
      label: 'Draft',
      variant: 'warning',
    },
    created: '9 Aug, 2025',
    updated: '9 Aug, 2025',
  },
  {
    id: '10',
    productInfo: {
      image: '5.png',
      title: 'Aero Walk Lite',
      label: 'HC-9031',
      tooltip: '',
    },
    category: 'Runners',
    price: '$45.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '8 Aug, 2025',
    updated: '8 Aug, 2025',
  },
  {
    id: '11',
    productInfo: {
      image: '12.png',
      title: 'Pro Runner Elite',
      label: 'PR-2024',
      tooltip: '',
    },
    category: 'Runners',
    price: '$95.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '7 Aug, 2025',
    updated: '7 Aug, 2025',
  },
  {
    id: '12',
    productInfo: {
      image: '14.png',
      title: 'Comfort Plus Max',
      label: 'CP-4567',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$67.50',
    status: {
      label: 'Draft',
      variant: 'warning',
    },
    created: '6 Aug, 2025',
    updated: '6 Aug, 2025',
  },
  {
    id: '13',
    productInfo: {
      image: '16.png',
      title: 'Speed Demon X',
      label: 'SD-7890',
      tooltip: '',
    },
    category: 'Runners',
    price: '$88.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '5 Aug, 2025',
    updated: '5 Aug, 2025',
  },
  {
    id: '14',
    productInfo: {
      image: '17.png',
      title: 'Casual Street Pro',
      label: 'CS-3456',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$54.99',
    status: {
      label: 'Archived',
      variant: 'info',
    },
    created: '4 Aug, 2025',
    updated: '4 Aug, 2025',
  },
  {
    id: '15',
    productInfo: {
      image: '11.png',
      title: 'Mountain Trek Elite',
      label: 'MT-9012',
      tooltip: '',
    },
    category: 'Outdoor',
    price: '$135.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '3 Aug, 2025',
    updated: '3 Aug, 2025',
  },
  {
    id: '16',
    productInfo: {
      image: '1.png',
      title: 'Urban Flex Pro',
      label: 'UF-6789',
      tooltip: '',
    },
    category: 'Runners',
    price: '$72.50',
    status: {
      label: 'Draft',
      variant: 'warning',
    },
    created: '2 Aug, 2025',
    updated: '2 Aug, 2025',
  },
  {
    id: '17',
    productInfo: {
      image: '2.png',
      title: 'Lightweight Runner',
      label: 'LR-2345',
      tooltip: '',
    },
    category: 'Runners',
    price: '$49.99',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '1 Aug, 2025',
    updated: '1 Aug, 2025',
  },
  {
    id: '18',
    productInfo: {
      image: '3.png',
      title: 'Premium Comfort Max',
      label: 'PC-5678',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$89.00',
    status: {
      label: 'Must Act',
      variant: 'destructive',
    },
    created: '31 Jul, 2025',
    updated: '31 Jul, 2025',
  },
  {
    id: '19',
    productInfo: {
      image: '5.png',
      title: 'Sport Performance Pro',
      label: 'SP-8901',
      tooltip: '',
    },
    category: 'Outdoor',
    price: '$112.50',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '30 Jul, 2025',
    updated: '30 Jul, 2025',
  },
  {
    id: '20',
    productInfo: {
      image: '7.png',
      title: 'Classic Retro Style',
      label: 'CR-1234',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$63.75',
    status: {
      label: 'Archived',
      variant: 'info',
    },
    created: '29 Jul, 2025',
    updated: '29 Jul, 2025',
  },
  {
    id: '21',
    productInfo: {
      image: '8.png',
      title: 'Adventure Explorer',
      label: 'AE-4567',
      tooltip: '',
    },
    category: 'Outdoor',
    price: '$98.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '28 Jul, 2025',
    updated: '28 Jul, 2025',
  },
  {
    id: '22',
    productInfo: {
      image: '10.png',
      title: 'Modern Street Elite',
      label: 'MS-7890',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$76.25',
    status: {
      label: 'Draft',
      variant: 'warning',
    },
    created: '27 Jul, 2025',
    updated: '27 Jul, 2025',
  },
  {
    id: '23',
    productInfo: {
      image: '11.png',
      title: 'Eco Friendly Runner',
      label: 'EF-2345',
      tooltip: '',
    },
    category: 'Runners',
    price: '$82.50',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '26 Jul, 2025',
    updated: '26 Jul, 2025',
  },
  {
    id: '24',
    productInfo: {
      image: '13.png',
      title: 'Luxury Comfort Pro',
      label: 'LC-5678',
      tooltip: '',
    },
    category: 'Sneakers',
    price: '$145.00',
    status: {
      label: 'Live',
      variant: 'success',
    },
    created: '25 Jul, 2025',
    updated: '25 Jul, 2025',
  },
  {
    id: '25',
    productInfo: {
      image: '15.png',
      title: 'Tech Smart Runner',
      label: 'TS-8901',
      tooltip: '',
    },
    category: 'Runners',
    price: '$91.99',
    status: {
      label: 'Must Act',
      variant: 'destructive',
    },
    created: '24 Jul, 2025',
    updated: '24 Jul, 2025',
  },
];

export function ProductListTable({
  mockData: propsMockData,
  onRowClick,
  displaySheet,
}: ProductListProps) {
  const data = propsMockData || mockData;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Search input state
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created', desc: true },
  ]);
  const [selectedLastMoved] = useState<string[]>([]);

  // Modal state
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isManageVariantsOpen, setIsManageVariantsOpen] = useState(false);

  // Auto-open sheet based on displaySheet prop
  useEffect(() => {
    if (displaySheet) {
      switch (displaySheet) {
        case 'productDetails':
          setIsProductDetailsOpen(true);
          break;
        case 'createProduct':
          setIsCreateProductOpen(true);
          break;
        case 'editProduct':
          setIsEditProductOpen(true);
          break;
        case 'manageVariants':
          setIsManageVariantsOpen(true);
          break;
      }
    }
  }, [displaySheet]);

  const handleEditProduct = (product: IData) => {
    // You can add logic here to handle the selected product data
    console.log('Editing product:', product);
    setIsEditProductOpen(true);
  };

  const handleManageVariants = (product: IData) => {
    // You can add logic here to handle the selected product data
    console.log('Managing variants for product:', product);
    setIsManageVariantsOpen(true);
  };

  const handleViewDetails = (product: IData) => {
    // You can add logic here to handle the selected product data
    console.log('Viewing details for product:', product);
    setIsProductDetailsOpen(true);
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
                {productInfo.title.length > 20 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="text-sm font-medium text-foreground leading-3.5 truncate max-w-[180px] cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setIsProductDetailsOpen(true)}
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
                    onClick={() => setIsProductDetailsOpen(true)}
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
        size: 260,
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
          return (
            <div>{info.row.original.category}</div>
          );
        },
        enableSorting: true,
        size: 110,
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
          return <div className="text-center">{info.row.original.price}</div>;
        },
        enableSorting: true,
        size: 80,
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
            <Badge
              variant={variant}
              appearance="light"
              className="rounded-full"
            >
              {status.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 90,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'rating',
        accessorFn: () => {},
        header: ({ column }) => (
          <DataGridColumnHeader title="Rating" column={column} />
        ),
        cell: () => {
          return (
            <Badge
              size="sm"
              variant="warning"
              appearance="outline"
              className="rounded-full"
            >
              <Star className="text-[#FEC524]" fill="#FEC524" />
              5.0
            </Badge>
          );
        },
        enableSorting: true,
        size: 85,
        meta: {
          cellClassName: 'text-center',
        },
      },
      {
        id: 'created',
        accessorFn: (row) => row.created,
        header: ({ column }) => (
          <DataGridColumnHeader title="Created" column={column} />
        ),
        cell: (info) => {
          return info.row.original.created;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'updated',
        accessorFn: (row) => row.updated,
        header: ({ column }) => (
          <DataGridColumnHeader title="Updated" column={column} />
        ),
        cell: (info) => {
          return info.row.original.updated;
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" mode="icon" size="sm" className="">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem onClick={() => handleEditProduct(row.original)}>
                    <Settings className="size-4" />
                    Edit Product
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleManageVariants(row.original)}>
                    <Layers className="size-4" />
                    Manage Variants
                  </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                      <Info className="size-4" />
                      View Details
                    </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <Trash className="size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 80,
      },
    ],
    [], // Same columns for all tabs
  );

  // Apply search, tab, and last moved filters
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply tab filter based on tabs array ids
    if (activeTab === 'all') {
      result = result; // No filter, show all data
    } else if (activeTab === 'live') {
      result = result.filter((item) => item.status.label === 'Live');
    } else if (activeTab === 'draft') {
      result = result.filter((item) => item.status.label === 'Draft');
    } else if (activeTab === 'archived') {
      result = result.filter((item) => item.status.label === 'Archived');
    } else if (activeTab === 'actionNeeded') {
      result = result.filter((item) => item.created > '2023-01-01');
    }

    // Apply search filter - only search in product title
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.productInfo.title.toLowerCase().includes(query),
      );
    }

    return result;
  }, [data, activeTab, searchQuery]);

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

  // Reset pagination when filters change
  useEffect(() => {
    table.setPageIndex(0);
  }, [searchQuery, selectedLastMoved, activeTab]);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  }, [activeTab, searchQuery, selectedLastMoved]);

  // Sync inputValue with searchQuery when searchQuery changes externally
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: 10, // Fixed 10 items per page
      },
      sorting,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const tabs = [
    { id: 'all', label: 'All', badge: 1424 },
    { id: 'live', label: 'Live', badge: 1267 },
    { id: 'draft', label: 'Draft', badge: 63 },
    { id: 'archived', label: 'Archived', badge: 185 },
    { id: 'actionNeeded', label: 'Action Needed', badge: 49 },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Reset to first page when changing tabs
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  // Search input handlers
  const handleClearInput = () => {
    setInputValue('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  return (
    <div>
      <Card>
        <CardHeader className="py-3 flex-nowrap">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="m-0 p-0 w-full"
          >
            <TabsList className="h-auto p-0 bg-transparent border-b-0 border-border rounded-none -ms-[3px] w-full">
              <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "relative text-foreground px-2 hover:text-primary data-[state=active]:text-primary data-[state=active]:shadow-none", 
                      activeTab === tab.id ? 'font-medium' : 'font-normal')
                    }
                  >
                    <div className="flex items-center gap-2">
                      {tab.label}
                      <Badge
                        size="sm"
                        variant={activeTab === tab.id ? 'primary' : 'outline'}
                        appearance="outline"
                        className={cn("rounded-full", activeTab === tab.id ? '' : 'bg-muted/60')}
                      >
                        {tab.badge}
                      </Badge>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary -mb-[14px]" />
                    )}
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>
          <CardToolbar className="flex items-center gap-2">
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

            {/* Filter */}
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant="outline">
                  <Filter className="size-3.5" />
                  Filters
                </Button>
              }
            />
          </CardToolbar>
        </CardHeader>

        {/* Tab Contents */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {tabs.map((tab) => (
            <TabsContent
              key={`content-${tab.id}`}
              value={tab.id}
              className="mt-0"
            >
              <DataGrid
                table={table}
                recordCount={filteredData?.length || 0}
                onRowClick={
                  onRowClick ? (row: IData) => onRowClick(row.id) : undefined
                }
                tableLayout={{
                  columnsPinnable: true,
                  columnsMovable: true,
                  columnsVisibility: true,
                  cellBorder: true,
                }}
              >
                <CardTable>
                  <ScrollArea>
                    <DataGridTable />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardTable>
                <CardFooter>
                  <DataGridPagination />
                </CardFooter>
              </DataGrid>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Product Details Modal */}
      <ProductDetailsAnalyticsSheet
        open={isProductDetailsOpen}
        onOpenChange={setIsProductDetailsOpen}
      />

      {/* Edit Product Modal */}
      <ProductFormSheet
        mode="edit"
        open={isEditProductOpen}
        onOpenChange={setIsEditProductOpen}
      />

      {/* Create Product Modal */}
      <ProductFormSheet
        mode="new"  
        open={isCreateProductOpen}
        onOpenChange={setIsCreateProductOpen}
      />

      {/* Manage Variants Modal */}
      <ManageVariantsSheet
        open={isManageVariantsOpen}
        onOpenChange={setIsManageVariantsOpen}
      />
    </div>
  );
}
