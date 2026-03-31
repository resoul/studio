'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState, useEffect } from 'react';
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
import { Eye, Info, Search, SquarePen, Trash, X } from 'lucide-react';
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
  CardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { CategoryDetailsEditSheet } from '../components/category-details-edit-sheet';
import { CategoryFormSheet } from '../components/category-form-sheet';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export interface IData {
  totalEarnings: string;
  productsQty: string;
  id: string;
  productInfo: {
    image: string;
    title: string;
    label: string;
  };
  status: {
    label: string;
    variant: string;
  };
  featured: boolean;
  created?: string;
  updated?: string;
}

interface CategoryListProps {
  mockData?: IData[];
  displaySheet  ?: "categoryDetails" | "createCategory" | "editCategory";
}

const mockData: IData[] = [
  {
    id: '1',
    productInfo: { image: 'running-shoes.svg', title: 'Running Shoes', label: 'WM-8421' },
    productsQty: '120',
    totalEarnings: '$2,583.00',
    status: { label: 'Active', variant: 'success' },
    featured: true,
  },
  {
    id: '2',
    productInfo: { image: 'flip-flops.svg', title: 'Flip-flops', label: 'UC-3990' },
    productsQty: '245',
    totalEarnings: '$10,110.00',
    status: { label: 'Active', variant: 'success' },
    featured: false,
  },
  {
    id: '3',
    productInfo: { image: 'slip-on-shoe.svg', title: 'Slip-on-shoe', label: 'KB-8820' },
    productsQty: '560',
    totalEarnings: '$59,476.50',
    status: { label: 'Inactive', variant: 'destructive' },
    featured: false,
  },
  {
    id: '4',
    productInfo: { image: 'sport-sneaker.svg', title: 'Sport Sneakers', label: 'LS-1033' },
    productsQty: '98',
    totalEarnings: '$102,369.99',
    status: { label: 'Active', variant: 'success' },
    featured: true,
  },
  {
    id: '5',
    productInfo: { image: 'ski-boots.svg', title: 'Ski Boots', label: 'WC-5510' },
    productsQty: '33',
    totalEarnings: '$929.00',
    status: { label: 'Active', variant: 'success' },
    featured: true,
  },
  {
    id: '6',
    productInfo: {
      image: 'stiletto-heel.svg',
      title: 'Stiletto Heels',
      label: 'GH-7312',
    },
    productsQty: '140',
    totalEarnings: '$1,659.00',
    status: {
      label: 'Inactive',
      variant: 'destructive',
    },
    featured: false,
  },
  {
    id: '7',
    productInfo: {
      image: 'football-boot.svg',
      title: 'Football Boots',
      label: 'GH-7312',
    },
    productsQty: '150',
    totalEarnings: '$7,072.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '8',
    productInfo: {
      image: 'block-heel.svg',
      title: 'Block Heels',
      label: 'MS-8702',
    },
    productsQty: '65',
    totalEarnings: '$37,119.50',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '9',
    productInfo: {
      image: 'hiking-boot.svg',
      title: 'Hiking Boots',
      label: 'BS-6112',
    },
    productsQty: '55',
    totalEarnings: '$498.75',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '10',
    productInfo: {
      image: 'ice-skate.svg',
      title: 'Ice Skates',
      label: 'HC-9031',
    },
    productsQty: '820',
    totalEarnings: '$230,445.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '11',
    productInfo: {
      image: 'ankle-boot.svg',
      title: 'Casual Loafers',
      label: 'CL-1234',
    },
    productsQty: '95',
    totalEarnings: '$8,450.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '12',
    productInfo: {
      image: 'casual-sneaker.svg',
      title: 'Formal Oxfords',
      label: 'FO-5678',
    },
    productsQty: '67',
    totalEarnings: '$12,890.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '13',
    productInfo: {
      image: 'sandals.svg',
      title: 'Sandals',
      label: 'SD-9012',
    },
    productsQty: '234',
    totalEarnings: '$15,670.00',
    status: {
      label: 'Inactive',
      variant: 'destructive',
    },
    featured: false,
  },
  {
    id: '14',
    productInfo: {
      image: 'snow-boot.svg',
      title: 'Winter Boots',
      label: 'WB-3456',
    },
    productsQty: '78',
    totalEarnings: '$22,340.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '15',
    productInfo: {
      image: 'wedge-heel.svg',
      title: 'Dance Shoes',
      label: 'DS-7890',
    },
    productsQty: '45',
    totalEarnings: '$6,780.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '16',
    productInfo: {
      image: 'wellies.svg',
      title: 'Climbing Shoes',
      label: 'CS-2345',
    },
    productsQty: '32',
    totalEarnings: '$4,560.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '17',
    productInfo: {
      image: 'block-heel.svg',
      title: 'Work Boots',
      label: 'WB-6789',
    },
    productsQty: '156',
    totalEarnings: '$28,900.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '18',
    productInfo: {
      image: 'slip-on-shoe.svg',
      title: 'Platform Heels',
      label: 'PH-0123',
    },
    productsQty: '89',
    totalEarnings: '$11,230.00',
    status: {
      label: 'Inactive',
      variant: 'destructive',
    },
    featured: false,
  },
  {
    id: '19',
    productInfo: {
      image: 'ice-skate.svg',
      title: 'Athletic Cleats',
      label: 'AC-4567',
    },
    productsQty: '112',
    totalEarnings: '$18,750.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '20',
    productInfo: {
      image: 'wellies.svg',
      title: 'Moccasins',
      label: 'MC-8901',
    },
    productsQty: '73',
    totalEarnings: '$9,420.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '21',
    productInfo: {
      image: 'heeled-boot.svg',
      title: 'Espadrilles',
      label: 'ES-2345',
    },
    productsQty: '54',
    totalEarnings: '$7,890.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '22',
    productInfo: {
      image: 'casual-sneaker.svg',
      title: 'Ballet Flats',
      label: 'BF-6789',
    },
    productsQty: '91',
    totalEarnings: '$13,450.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
  {
    id: '23',
    productInfo: {
      image: 'ankle-boot.svg',
      title: 'Wedge Heels',
      label: 'WH-0123',
    },
    productsQty: '68',
    totalEarnings: '$10,670.00',
    status: {
      label: 'Inactive',
      variant: 'destructive',
    },
    featured: false,
  },
  {
    id: '24',
    productInfo: {
      image: 'ski-boots.svg',
      title: 'Slides',
      label: 'SL-4567',
    },
    productsQty: '187',
    totalEarnings: '$16,890.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: true,
  },
  {
    id: '25',
    productInfo: {
      image: 'stiletto-heel.svg',
      title: 'Mary Janes',
      label: 'MJ-8901',
    },
    productsQty: '42',
    totalEarnings: '$5,340.00',
    status: {
      label: 'Active',
      variant: 'success',
    },
    featured: false,
  },
];

export function CategoryListTable({
  mockData: propsMockData,
  displaySheet,
}: CategoryListProps) {
  const data = propsMockData || mockData;
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'id', desc: false },
  ]);
  const [featuredState, setFeaturedState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(data.map((item) => [item.id, item.featured])),
  );

  // Modal state
  const [isCategoryDetailsEditOpen, setIsCategoryDetailsEditOpen] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IData | undefined>(
    undefined,
  );

  // Sheet state for displaySheet prop
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);

  // Auto-open sheet based on displaySheet prop
  useEffect(() => {
    if (displaySheet) {
      switch (displaySheet) {
        case 'categoryDetails':
          setIsCategoryDetailsEditOpen(true);
          break;
        case 'createCategory':
          setIsCreateCategoryOpen(true);
          break;
        case 'editCategory':
          setIsEditCategoryOpen(true);
          break;
      }
    }
  }, [displaySheet]);

  const ColumnInputFilter = <TData, TValue>({
    column,
  }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="w-40"
      />
    );
  };

  const handleFeaturedChange = (id: string, checked: boolean) => {
    setFeaturedState((prev) => ({ ...prev, [id]: checked }));

    // Show toaster notification with custom Alert style
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
            <AlertTitle>Category marked as featured successfully.</AlertTitle>
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
            <AlertTitle>Category removed from featured status.</AlertTitle>
          </Alert>
        ),
        {
          duration: 5000,
        },
      );
    }
  };

  const handleCategoryClick = (category: IData) => {
    setSelectedCategory(category);
    setIsCategoryDetailsEditOpen(true);
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
        size: 23,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'productInfo',
        accessorFn: (row) => row.productInfo,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Category"
            column={column}
          />
        ),
        cell: (info) => {
          const productInfo = info.row.getValue(
            'productInfo',
          ) as IData['productInfo'];
          return (
            <div className="flex items-center gap-2.5">
              <Card className="flex items-center justify-center rounded-md bg-accent/50 h-[40px] w-[50px] shadow-none shrink-0">
                <img
                  src={toAbsoluteUrl(
                    `/media/store/client/icons/light/${productInfo.image}`,
                  )}
                  className="cursor-pointer h-[30px] dark:hidden"
                  alt="image"
                />
                <img
                  src={toAbsoluteUrl(
                    `/media/store/client/icons/dark/${productInfo.image}`,
                  )}
                  className="cursor-pointer h-[30px] light:hidden"
                  alt="image"
                />
              </Card>
              <div className="flex flex-col gap-1">
                <Link
                  to="#"
                  onClick={() => handleCategoryClick(info.row.original)}
                  className="text-sm font-medium tracking-[-1%] cursor-pointer hover:text-primary"
                >
                  {productInfo.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  Category ID:{' '}
                  <span className="text-xs font-medium text-foreground">
                    {productInfo.label}
                  </span>
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 150,
      },
      {
        id: 'productsQty',
        accessorFn: (row) => row.productsQty,
        header: ({ column }) => (
          <DataGridColumnHeader title="Products QTY" column={column} />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 65,
      },
      {
        id: 'totalEarnings',
        accessorFn: (row) => row.totalEarnings,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Earnings" column={column} />
        ),
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 80,
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
        size: 80,
      },
      {
        id: 'featured',
        header: ({ column }) => (
          <DataGridColumnHeader title="Featured" column={column} />
        ),
        enableSorting: true,
        cell: (info) => {
          const id = info.row.getValue('id') as string;
          return (
            <div className="flex justify-center">
              <Checkbox
                size="sm"
                id={`featured-${id}`}
                checked={!!featuredState[id]}
                onCheckedChange={(checked: unknown) =>
                  handleFeaturedChange(id, Boolean(checked))
                }
              />
            </div>
          );
        },
        size: 45,
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => {
          const categoryId = row.getValue('id') as string;
          const categoryTitle = row.original.productInfo.title;

          const handleView = () => {
            console.log('View category:', categoryId);
          };

          const handleEdit = () => {
            setIsEditCategoryOpen(true);
            console.log('Edit category:', categoryId);
          };

          const handleDelete = () => {
            toast.error(`Deleting category: ${categoryTitle}`);
            console.log('Delete category:', categoryId);
          };

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="dim"
                mode="icon"
                size="sm"
                onClick={handleView}
                title="View category"
              >
                <Eye />
              </Button>
              <Button
                variant="dim"
                mode="icon"
                size="sm"
                onClick={handleEdit}
                title="Edit category"
              >
                <SquarePen />
              </Button>
              <Button
                variant="dim"
                mode="icon"
                size="sm"
                onClick={handleDelete}
                title="Delete category"
              >
                <Trash />
              </Button>
            </div>
          );
        },
        size: 60,
      },
    ],
    [featuredState],
  );

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        item.productInfo.title.toLowerCase().includes(query),
      );
    }
    return result;
  }, [data, searchQuery]);

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
    <>
      {/* Category List Table */}
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
          <CardToolbar className="flex items-center gap-2">
            <InputWrapper className="w-full lg:w-[200px]">
              <Search/>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="dim"
                  size="sm"
                  className="-me-3.5"
                  onClick={() => setSearchQuery('')}
                >
                  {searchQuery && <X/>}
                </Button>
              )}
            </InputWrapper>
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

      {/* Category Details Edit Sheet */}
      <CategoryDetailsEditSheet
        open={isCategoryDetailsEditOpen}
        onOpenChange={setIsCategoryDetailsEditOpen}
      />

      {/* Edit Category Sheet */}
      <CategoryFormSheet
        mode="edit"
        open={isEditCategoryOpen}
        onOpenChange={setIsEditCategoryOpen}
      />

      {/* Create Category Sheet */}
      <CategoryFormSheet
        mode="new"  
        open={isCreateCategoryOpen}
        onOpenChange={setIsCreateCategoryOpen}
      />
    </>
  );
}
