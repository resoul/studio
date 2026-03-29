import { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  Copy,
  DollarSign,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  Settings2,
  Target,
  Trash2,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface Deal {
  id: string;
  dealNumber: string;
  contact: {
    name: string;
    email: string;
    avatar: string;
    company: string;
  };
  dealDetails: Array<{
    name: string;
    description: string;
    value: number;
  }>;
  total: number;
  status:
    | 'prospecting'
    | 'qualification'
    | 'proposal'
    | 'negotiation'
    | 'closed_won'
    | 'closed_lost';
  paymentStatus: 'paid' | 'pending' | 'failed';
  company: string;
  dealDate: Date;
  expectedClose: Date;
  priority: 'low' | 'medium' | 'high';
}

const mockDeals: Deal[] = [
  {
    id: '1',
    dealNumber: 'DEAL-2024-001',
    contact: {
      name: 'Alex Johnson',
      email: 'alex.johnson@techcorp.com',
      avatar: '300-1.png',
      company: 'TechCorp Inc',
    },
    dealDetails: [
      {
        name: 'Software License',
        description: 'Enterprise software package',
        value: 25000,
      },
      {
        name: 'Implementation',
        description: 'Setup and training services',
        value: 15000,
      },
    ],
    total: 40000,
    status: 'closed_won',
    paymentStatus: 'paid',
    company: 'TechCorp Inc',
    dealDate: new Date('2024-01-15'),
    expectedClose: new Date('2024-01-20'),
    priority: 'high',
  },
  {
    id: '2',
    dealNumber: 'DEAL-2024-002',
    contact: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@innovate.com',
      avatar: '300-2.png',
      company: 'Innovate Solutions',
    },
    dealDetails: [
      {
        name: 'Consulting Services',
        description: 'Business process optimization',
        value: 45000,
      },
    ],
    total: 45000,
    status: 'negotiation',
    paymentStatus: 'pending',
    company: 'Innovate Solutions',
    dealDate: new Date('2024-01-16'),
    expectedClose: new Date('2024-01-25'),
    priority: 'medium',
  },
  {
    id: '3',
    dealNumber: 'DEAL-2024-003',
    contact: {
      name: 'Mike Chen',
      email: 'mike.chen@startup.io',
      avatar: '300-3.png',
      company: 'Startup.io',
    },
    dealDetails: [
      {
        name: 'Cloud Infrastructure',
        description: 'AWS migration and setup',
        value: 35000,
      },
      {
        name: 'Security Audit',
        description: 'Compliance and security review',
        value: 25000,
      },
    ],
    total: 60000,
    status: 'proposal',
    paymentStatus: 'pending',
    company: 'Startup.io',
    dealDate: new Date('2024-01-17'),
    expectedClose: new Date('2024-01-30'),
    priority: 'high',
  },
  {
    id: '4',
    dealNumber: 'DEAL-2024-004',
    contact: {
      name: 'Emma Davis',
      email: 'emma.davis@globaltech.com',
      avatar: '300-4.png',
      company: 'GlobalTech',
    },
    dealDetails: [
      {
        name: 'Data Analytics Platform',
        description: 'Custom BI solution',
        value: 75000,
      },
    ],
    total: 75000,
    status: 'closed_lost',
    paymentStatus: 'failed',
    company: 'GlobalTech',
    dealDate: new Date('2024-01-18'),
    expectedClose: new Date('2024-01-26'),
    priority: 'medium',
  },
  {
    id: '5',
    dealNumber: 'DEAL-2024-005',
    contact: {
      name: 'David Brown',
      email: 'david.brown@fintech.com',
      avatar: '300-5.png',
      company: 'FinTech Solutions',
    },
    dealDetails: [
      {
        name: 'Payment Gateway',
        description: 'Custom payment processing',
        value: 55000,
      },
      {
        name: 'API Integration',
        description: 'Third-party service integration',
        value: 25000,
      },
    ],
    total: 80000,
    status: 'qualification',
    paymentStatus: 'pending',
    company: 'FinTech Solutions',
    dealDate: new Date('2024-01-19'),
    expectedClose: new Date('2024-02-05'),
    priority: 'low',
  },
  {
    id: '6',
    dealNumber: 'DEAL-2024-006',
    contact: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@healthcare.com',
      avatar: '300-6.png',
      company: 'Healthcare Systems',
    },
    dealDetails: [
      {
        name: 'Patient Management System',
        description: 'Healthcare software platform',
        value: 120000,
      },
      {
        name: 'Training Program',
        description: 'Staff training and certification',
        value: 30000,
      },
    ],
    total: 150000,
    status: 'closed_won',
    paymentStatus: 'paid',
    company: 'Healthcare Systems',
    dealDate: new Date('2024-01-20'),
    expectedClose: new Date('2024-01-25'),
    priority: 'high',
  },
  {
    id: '7',
    dealNumber: 'DEAL-2024-007',
    contact: {
      name: 'James Wilson',
      email: 'james.wilson@retail.com',
      avatar: '300-7.png',
      company: 'Retail Innovations',
    },
    dealDetails: [
      {
        name: 'E-commerce Platform',
        description: 'Online retail solution',
        value: 85000,
      },
      {
        name: 'Mobile App',
        description: 'iOS and Android applications',
        value: 45000,
      },
    ],
    total: 130000,
    status: 'negotiation',
    paymentStatus: 'pending',
    company: 'Retail Innovations',
    dealDate: new Date('2024-01-21'),
    expectedClose: new Date('2024-02-10'),
    priority: 'high',
  },
  {
    id: '8',
    dealNumber: 'DEAL-2024-008',
    contact: {
      name: 'Maria Garcia',
      email: 'maria.garcia@education.com',
      avatar: '300-8.png',
      company: 'Education First',
    },
    dealDetails: [
      {
        name: 'Learning Management System',
        description: 'Online education platform',
        value: 65000,
      },
    ],
    total: 65000,
    status: 'proposal',
    paymentStatus: 'pending',
    company: 'Education First',
    dealDate: new Date('2024-01-22'),
    expectedClose: new Date('2024-02-15'),
    priority: 'medium',
  },
  {
    id: '9',
    dealNumber: 'DEAL-2024-009',
    contact: {
      name: 'Robert Taylor',
      email: 'robert.taylor@manufacturing.com',
      avatar: '300-9.png',
      company: 'Manufacturing Plus',
    },
    dealDetails: [
      {
        name: 'ERP System',
        description: 'Enterprise resource planning',
        value: 200000,
      },
      {
        name: 'Custom Modules',
        description: 'Industry-specific features',
        value: 50000,
      },
    ],
    total: 250000,
    status: 'closed_lost',
    paymentStatus: 'failed',
    company: 'Manufacturing Plus',
    dealDate: new Date('2024-01-23'),
    expectedClose: new Date('2024-02-20'),
    priority: 'medium',
  },
  {
    id: '10',
    dealNumber: 'DEAL-2024-010',
    contact: {
      name: 'Jennifer Lee',
      email: 'jennifer.lee@consulting.com',
      avatar: '300-10.png',
      company: 'Strategic Consulting',
    },
    dealDetails: [
      {
        name: 'Business Intelligence',
        description: 'Data analytics and reporting',
        value: 40000,
      },
      {
        name: 'Dashboard Creation',
        description: 'Custom KPI dashboards',
        value: 25000,
      },
    ],
    total: 65000,
    status: 'closed_won',
    paymentStatus: 'paid',
    company: 'Strategic Consulting',
    dealDate: new Date('2024-01-24'),
    expectedClose: new Date('2024-01-29'),
    priority: 'low',
  },
];

const dealStatuses = [
  {
    id: 'prospecting',
    name: 'Prospecting',
    variant: 'secondary',
    icon: Target,
  },
  { id: 'qualification', name: 'Qualification', variant: 'info', icon: User },
  { id: 'proposal', name: 'Proposal', variant: 'warning', icon: Package },
  { id: 'negotiation', name: 'Negotiation', variant: 'warning', icon: Clock },
  {
    id: 'closed_won',
    name: 'Closed Won',
    variant: 'success',
    icon: CheckCircle,
  },
  {
    id: 'closed_lost',
    name: 'Closed Lost',
    variant: 'destructive',
    icon: XCircle,
  },
];

const paymentStatuses = [
  { id: 'paid', name: 'Paid', variant: 'success' },
  { id: 'pending', name: 'Pending', variant: 'warning' },
  { id: 'failed', name: 'Failed', variant: 'destructive' },
];

const priorities = [
  { id: 'low', name: 'Low', variant: 'secondary' },
  { id: 'medium', name: 'Medium', variant: 'info' },
  { id: 'high', name: 'High', variant: 'destructive' },
];

export function RecentDeals() {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<
    string[]
  >([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dealDate', desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusIcon = (status: string) => {
    const statusData = dealStatuses.find((s) => s.id === status);
    return statusData ? statusData.icon : Target;
  };

  const getStatusVariant = (status: string): BadgeProps['variant'] => {
    const statusData = dealStatuses.find((s) => s.id === status);
    return (statusData?.variant as BadgeProps['variant']) || 'secondary';
  };

  const getPaymentStatusVariant = (status: string): BadgeProps['variant'] => {
    const statusData = paymentStatuses.find((s) => s.id === status);
    return (statusData?.variant as BadgeProps['variant']) || 'secondary';
  };

  const getPriorityVariant = (priority: string): BadgeProps['variant'] => {
    const priorityData = priorities.find((p) => p.id === priority);
    return (priorityData?.variant as BadgeProps['variant']) || 'secondary';
  };

  const columns = useMemo<ColumnDef<Deal>[]>(
    () => [
      {
        accessorKey: 'id',
        id: 'id',
        header: () => <DataGridTableRowSelectAll size="sm" />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} size="sm" />,
        enableSorting: false,
        size: 30,
        meta: {
          headerClassName: '',
          cellClassName: '',
        },
        enableHiding: false,
        enableResizing: false,
      },
      {
        accessorKey: 'dealNumber',
        id: 'dealNumber',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Deal #"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="font-mono font-medium text-foreground">
              {row.original.dealNumber}
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: 'contact',
        id: 'contact',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Contact"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const contact = row.original.contact;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarImage
                  src={toAbsoluteUrl(`/media/avatars/${contact.avatar}`)}
                  alt={contact.name}
                />
                <AvatarFallback className="text-xs">
                  {contact.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{contact.name}</span>
                <span className="text-xs text-muted-foreground">
                  {contact.email}
                </span>
              </div>
            </div>
          );
        },
        size: 200,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'company',
        id: 'company',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Company"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1 text-sm">
              <Building2 className="size-3 text-muted-foreground" />
              <span className="truncate max-w-[120px]">
                {row.original.company}
              </span>
            </div>
          );
        },
        size: 140,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'dealDetails',
        id: 'dealDetails',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Deal Details"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const dealDetails = row.original.dealDetails;
          return (
            <div className="flex flex-col gap-1">
              {dealDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate max-w-[120px]">{detail.name}</span>
                  <span className="text-muted-foreground">
                    ${detail.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          );
        },
        size: 180,
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
        hidden: true,
      },
      {
        accessorKey: 'total',
        id: 'total',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Total Value"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1 font-medium">
              <DollarSign className="size-3" />
              {row.original.total.toLocaleString()}
            </div>
          );
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Status"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          const StatusIcon = getStatusIcon(status);
          return (
            <Badge variant={getStatusVariant(status)} appearance="light">
              <StatusIcon className="size-3" />
              {dealStatuses.find((s) => s.id === status)?.name}
            </Badge>
          );
        },
        size: 140,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'paymentStatus',
        id: 'paymentStatus',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Payment"
            visibility={false}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const paymentStatus = row.original.paymentStatus;
          return (
            <Badge
              variant={getPaymentStatusVariant(paymentStatus)}
              appearance="light"
            >
              {paymentStatuses.find((s) => s.id === paymentStatus)?.name}
            </Badge>
          );
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: {
          headerTitle: 'Payment Status',
        },
      },
      {
        accessorKey: 'dealDate',
        id: 'dealDate',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Deal Date"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return row.original.dealDate.toLocaleDateString();
        },
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: {
          headerTitle: 'Deal Date',
        },
      },
      {
        accessorKey: 'expectedClose',
        id: 'expectedClose',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Expected Close"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          return row.original.expectedClose.toLocaleDateString();
        },
        size: 130,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
        meta: {
          headerTitle: 'Expected Close Date',
        },
      },
      {
        accessorKey: 'priority',
        id: 'priority',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Priority"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const priority = row.original.priority;
          return (
            <Badge variant={getPriorityVariant(priority)} appearance="light">
              {priorities.find((p) => p.id === priority)?.name}
            </Badge>
          );
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const deal = row.original;

          const handleViewDeal = () => {
            console.log('View deal:', deal.dealNumber);
          };

          const handleEditDeal = () => {
            console.log('Edit deal:', deal.dealNumber);
          };

          const handleCopyDealNumber = () => {
            navigator.clipboard.writeText(deal.dealNumber);
            toast.custom(
              (t) => (
                <Alert
                  variant="mono"
                  icon="success"
                  onClose={() => toast.dismiss(t)}
                >
                  <AlertIcon>
                    <Copy />
                  </AlertIcon>
                  <AlertTitle>Deal number copied to clipboard!</AlertTitle>
                </Alert>
              ),
              { duration: 3000, position: 'top-center' },
            );
          };

          const handleRemoveDeal = () => {
            console.log('Remove deal:', deal.dealNumber);
            // Add confirmation dialog here if needed
          };

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleViewDeal}>
                  <Eye />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEditDeal}>
                  <Edit />
                  Edit Deal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyDealNumber}>
                  <Copy />
                  Copy Deal #
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRemoveDeal}
                  variant="destructive"
                >
                  <Trash2 />
                  Remove Deal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 50,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const filteredData = useMemo(() => {
    return mockDeals.filter((item) => {
      // Filter by status
      const matchesStatus =
        !selectedStatuses?.length || selectedStatuses.includes(item.status);

      // Filter by payment status
      const matchesPaymentStatus =
        !selectedPaymentStatuses?.length ||
        selectedPaymentStatuses.includes(item.paymentStatus);

      // Filter by priority
      const matchesPriority =
        !selectedPriorities?.length ||
        selectedPriorities.includes(item.priority);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.dealNumber.toLowerCase().includes(searchLower) ||
        item.contact.name.toLowerCase().includes(searchLower) ||
        item.contact.email.toLowerCase().includes(searchLower) ||
        item.company.toLowerCase().includes(searchLower);

      return (
        matchesStatus &&
        matchesPaymentStatus &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [
    searchQuery,
    selectedStatuses,
    selectedPaymentStatuses,
    selectedPriorities,
  ]);

  const handleStatusChange = (checked: boolean, status: string) => {
    if (checked) {
      setSelectedStatuses((prev) => [...prev, status]);
    } else {
      setSelectedStatuses((prev) => prev.filter((s) => s !== status));
    }
  };

  const handlePaymentStatusChange = (checked: boolean, status: string) => {
    if (checked) {
      setSelectedPaymentStatuses((prev) => [...prev, status]);
    } else {
      setSelectedPaymentStatuses((prev) => prev.filter((s) => s !== status));
    }
  };

  const handlePriorityChange = (checked: boolean, priority: string) => {
    if (checked) {
      setSelectedPriorities((prev) => [...prev, priority]);
    } else {
      setSelectedPriorities((prev) => prev.filter((p) => p !== priority));
    }
  };

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: Deal) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnVisibility: {
        dealDetails: false,
        paymentStatus: false,
      },
    },
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card>
        <CardHeader className="px-3 py-3">
          <CardHeading>
            <div className="flex items-center gap-2.5">
              {/* Search */}
              <InputWrapper>
                <Search className="text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="dim"
                    size="sm"
                    className="-me-2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </InputWrapper>

              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="size-3.5" />
                    Status
                    {selectedStatuses.length > 0 && (
                      <Badge size="sm" variant="outline">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {dealStatuses.map((status) => (
                          <CommandItem
                            key={status.id}
                            value={status.id}
                            className="flex items-center gap-2.5 bg-transparent!"
                          >
                            <Checkbox
                              id={status.id}
                              checked={selectedStatuses.includes(status.id)}
                              onCheckedChange={(checked) =>
                                handleStatusChange(checked === true, status.id)
                              }
                            />
                            <Label
                              htmlFor={status.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <Badge
                                variant={
                                  status.variant as BadgeProps['variant']
                                }
                                appearance="light"
                              >
                                {status.name}
                              </Badge>
                              <span className="text-muted-foreground font-semibold me-2.5">
                                {
                                  filteredData.filter(
                                    (item) => item.status === status.id,
                                  ).length
                                }
                              </span>
                            </Label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Payment Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <DollarSign className="size-3.5" />
                    Payment
                    {selectedPaymentStatuses.length > 0 && (
                      <Badge size="sm" variant="outline">
                        {selectedPaymentStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search payment status..." />
                    <CommandList>
                      <CommandEmpty>No payment status found.</CommandEmpty>
                      <CommandGroup>
                        {paymentStatuses.map((status) => (
                          <CommandItem
                            key={status.id}
                            value={status.id}
                            className="flex items-center gap-2.5 bg-transparent!"
                          >
                            <Checkbox
                              id={status.id}
                              checked={selectedPaymentStatuses.includes(
                                status.id,
                              )}
                              onCheckedChange={(checked) =>
                                handlePaymentStatusChange(
                                  checked === true,
                                  status.id,
                                )
                              }
                            />
                            <Label
                              htmlFor={status.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <Badge
                                variant={
                                  status.variant as BadgeProps['variant']
                                }
                                appearance="light"
                              >
                                {status.name}
                              </Badge>
                              <span className="text-muted-foreground font-semibold me-2.5">
                                {
                                  filteredData.filter(
                                    (item) => item.paymentStatus === status.id,
                                  ).length
                                }
                              </span>
                            </Label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Priority Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <AlertCircle className="size-3.5" />
                    Priority
                    {selectedPriorities.length > 0 && (
                      <Badge size="sm" variant="outline">
                        {selectedPriorities.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search priority..." />
                    <CommandList>
                      <CommandEmpty>No priority found.</CommandEmpty>
                      <CommandGroup>
                        {priorities.map((priority) => (
                          <CommandItem
                            key={priority.id}
                            value={priority.id}
                            className="flex items-center gap-2.5 bg-transparent!"
                          >
                            <Checkbox
                              id={priority.id}
                              checked={selectedPriorities.includes(priority.id)}
                              onCheckedChange={(checked) =>
                                handlePriorityChange(
                                  checked === true,
                                  priority.id,
                                )
                              }
                            />
                            <Label
                              htmlFor={priority.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <Badge
                                variant={
                                  priority.variant as BadgeProps['variant']
                                }
                                appearance="light"
                              >
                                {priority.name}
                              </Badge>
                              <span className="text-muted-foreground font-semibold me-2.5">
                                {
                                  filteredData.filter(
                                    (item) => item.priority === priority.id,
                                  ).length
                                }
                              </span>
                            </Label>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeading>
          <CardToolbar>
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant="outline">
                  <Settings2 />
                  View Settings
                </Button>
              }
            />
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter className="px-3 py-0">
          <DataGridPagination className="py-1" />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
