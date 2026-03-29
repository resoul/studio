/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react';
import { mockContacts } from '@/modules/dashboard/mock/contacts';
import { Task } from '@/modules/dashboard/types/task';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  AlertCircle,
  CircleCheck,
  Ellipsis,
  Filter,
  Search,
  Trash,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
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
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Mock task data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with potential client',
    content: 'Schedule a meeting to discuss project requirements and budget.',
    createdBy: 'user2',
    priority: 'medium',
    dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'pending',
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-10T09:00:00Z'),
    assignedContactIds: ['1', '4'],
    companyIds: ['company1'],
  },
  {
    id: '2',
    title: 'Prepare project proposal',
    content:
      'Create detailed proposal including timeline, deliverables, and pricing.',
    createdBy: 'user2',
    priority: 'high',
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    status: 'in_progress',
    createdAt: new Date('2024-01-12T11:00:00Z'),
    updatedAt: new Date('2024-01-13T15:30:00Z'),
    assignedContactIds: ['2', '3'],
    dealIds: ['deal1'],
  },
  {
    id: '3',
    title: 'Client onboarding meeting',
    content: 'Conduct initial onboarding session with new client.',
    createdBy: 'user2',
    priority: 'medium',
    dueAt: new Date('2024-01-12T16:00:00Z'), // Past date
    completedAt: new Date('2024-01-12T16:30:00Z'),
    completedBy: 'user2',
    status: 'completed',
    createdAt: new Date('2024-01-08T10:00:00Z'),
    updatedAt: new Date('2024-01-12T16:30:00Z'),
    assignedContactIds: ['1', '3'],
    companyIds: ['company2'],
  },
  {
    id: '4',
    title: 'Review quarterly reports',
    content:
      'Analyze Q4 performance metrics and prepare summary for stakeholders.',
    createdBy: 'user1',
    priority: 'low',
    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'pending',
    createdAt: new Date('2024-01-14T08:00:00Z'),
    updatedAt: new Date('2024-01-14T08:00:00Z'),
    assignedContactIds: ['4'],
  },
  {
    id: '5',
    title: 'Team sync meeting',
    content: 'Weekly team synchronization and project status updates.',
    createdBy: 'user2',
    priority: 'medium',
    dueAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now (tomorrow)
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedContactIds: ['2', '3'],
  },
  {
    id: '6',
    title: 'Update website content',
    content:
      'Refresh homepage content and update product descriptions based on latest features.',
    createdBy: 'user4',
    priority: 'low',
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    status: 'in_progress',
    createdAt: new Date('2024-01-11T14:00:00Z'),
    updatedAt: new Date('2024-01-14T10:15:00Z'),
    assignedContactIds: ['5', '6'],
    companyIds: ['company3'],
  },
  {
    id: '7',
    title: 'Database optimization',
    content:
      'Optimize database queries and improve performance for user dashboard.',
    createdBy: 'user5',
    priority: 'high',
    dueAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    status: 'pending',
    createdAt: new Date('2024-01-05T16:00:00Z'),
    updatedAt: new Date('2024-01-05T16:00:00Z'),
    assignedContactIds: ['7'],
  },
  {
    id: '8',
    title: 'Marketing campaign launch',
    content: 'Launch Q1 marketing campaign across social media platforms.',
    createdBy: 'user6',
    priority: 'medium',
    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'pending',
    createdAt: new Date('2024-01-13T12:00:00Z'),
    updatedAt: new Date('2024-01-13T12:00:00Z'),
    assignedContactIds: ['8', '9'],
    dealIds: ['deal2'],
  },
  {
    id: '9',
    title: 'Security audit',
    content:
      'Conduct comprehensive security audit of all systems and applications.',
    createdBy: 'user7',
    priority: 'high',
    dueAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'in_progress',
    createdAt: new Date('2024-01-09T08:30:00Z'),
    updatedAt: new Date('2024-01-15T11:20:00Z'),
    assignedContactIds: ['11', '12'],
  },
  {
    id: '10',
    title: 'Customer feedback analysis',
    content:
      'Analyze customer feedback from last quarter and identify improvement areas.',
    createdBy: 'user8',
    priority: 'medium',
    dueAt: new Date('2024-01-10T15:00:00Z'), // Past date
    completedAt: new Date('2024-01-10T14:45:00Z'),
    completedBy: 'user8',
    status: 'completed',
    createdAt: new Date('2024-01-07T09:00:00Z'),
    updatedAt: new Date('2024-01-10T14:45:00Z'),
    assignedContactIds: ['3', '2'],
    companyIds: ['company4'],
  },
  {
    id: '11',
    title: 'Mobile app testing',
    content:
      'Complete testing of new mobile app features before production release.',
    createdBy: 'user9',
    priority: 'high',
    dueAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'pending',
    createdAt: new Date('2024-01-12T10:00:00Z'),
    updatedAt: new Date('2024-01-12T10:00:00Z'),
    assignedContactIds: ['14', '15'],
  },
  {
    id: '12',
    title: 'Invoice processing',
    content:
      'Process pending invoices and send payment reminders to overdue accounts.',
    createdBy: 'user10',
    priority: 'high',
    dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
    status: 'in_progress',
    createdAt: new Date('2024-01-14T13:00:00Z'),
    updatedAt: new Date('2024-01-15T09:30:00Z'),
    assignedContactIds: ['1', '4'],
    dealIds: ['deal3', 'deal4'],
  },
  {
    id: '13',
    title: 'Product demo preparation',
    content:
      'Prepare comprehensive product demo for potential enterprise clients.',
    createdBy: 'user11',
    priority: 'medium',
    dueAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    status: 'pending',
    createdAt: new Date('2024-01-13T15:00:00Z'),
    updatedAt: new Date('2024-01-13T15:00:00Z'),
    assignedContactIds: ['17', '18'],
    companyIds: ['company5'],
  },
  {
    id: '14',
    title: 'Code review session',
    content: 'Review code changes from development team and provide feedback.',
    createdBy: 'user12',
    priority: 'medium',
    dueAt: new Date('2024-01-08T16:00:00Z'), // Past date
    completedAt: new Date('2024-01-08T15:30:00Z'),
    completedBy: 'user12',
    status: 'completed',
    createdAt: new Date('2024-01-06T11:00:00Z'),
    updatedAt: new Date('2024-01-08T15:30:00Z'),
    assignedContactIds: ['20'],
  },
  {
    id: '15',
    title: 'Server maintenance',
    content: 'Perform scheduled server maintenance and apply security updates.',
    createdBy: 'user13',
    priority: 'low',
    dueAt: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
    status: 'pending',
    createdAt: new Date('2024-01-14T16:00:00Z'),
    updatedAt: new Date('2024-01-14T16:00:00Z'),
    assignedContactIds: ['1', '2'],
  },
  {
    id: '16',
    title: 'Morning standup meeting',
    content: 'Daily team standup to discuss progress and blockers.',
    createdBy: 'user1',
    priority: 'medium',
    dueAt: new Date(new Date().setHours(9, 0, 0, 0)), // Today at 9 AM
    status: 'pending',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T08:00:00Z'),
    assignedContactIds: ['1', '3'],
  },
  {
    id: '17',
    title: 'Client presentation',
    content: 'Present Q1 roadmap and deliverables to key stakeholders.',
    createdBy: 'user2',
    priority: 'high',
    dueAt: new Date(new Date().setHours(14, 30, 0, 0)), // Today at 2:30 PM
    status: 'in_progress',
    createdAt: new Date('2024-01-14T10:00:00Z'),
    updatedAt: new Date('2024-01-15T09:15:00Z'),
    assignedContactIds: ['1', '4'],
    companyIds: ['company1'],
  },
  {
    id: '18',
    title: 'Bug fix deployment',
    content: 'Deploy critical bug fixes to production environment.',
    createdBy: 'user3',
    priority: 'high',
    dueAt: new Date(new Date().setHours(16, 0, 0, 0)), // Today at 4 PM
    status: 'pending',
    createdAt: new Date('2024-01-15T07:30:00Z'),
    updatedAt: new Date('2024-01-15T07:30:00Z'),
    assignedContactIds: ['7', '6'],
    dealIds: ['deal1'],
  },
  {
    id: '19',
    title: 'Send weekly report',
    content: 'Compile and send weekly progress report to management.',
    createdBy: 'user4',
    priority: 'medium',
    dueAt: new Date(new Date().setHours(17, 0, 0, 0)), // Today at 5 PM
    status: 'pending',
    createdAt: new Date('2024-01-15T06:00:00Z'),
    updatedAt: new Date('2024-01-15T06:00:00Z'),
    assignedContactIds: ['8'],
  },
  {
    id: '20',
    title: 'Database backup',
    content: 'Perform daily database backup and verify integrity.',
    createdBy: 'user5',
    priority: 'low',
    dueAt: new Date(new Date().setHours(18, 30, 0, 0)), // Today at 6:30 PM
    status: 'pending',
    createdAt: new Date('2024-01-15T05:00:00Z'),
    updatedAt: new Date('2024-01-15T05:00:00Z'),
    assignedContactIds: ['3', '9'],
  },
  {
    id: '21',
    title: 'Customer support review',
    content:
      'Review pending customer support tickets and prioritize responses.',
    createdBy: 'user6',
    priority: 'high',
    dueAt: new Date(new Date().setHours(11, 30, 0, 0)), // Today at 11:30 AM
    status: 'in_progress',
    createdAt: new Date('2024-01-15T08:30:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
    assignedContactIds: ['12', '19'],
  },
  {
    id: '22',
    title: 'Social media content',
    content: 'Create and schedule social media posts for the week.',
    createdBy: 'user7',
    priority: 'low',
    dueAt: new Date(new Date().setHours(12, 0, 0, 0)), // Today at 12 PM
    status: 'pending',
    createdAt: new Date('2024-01-14T16:00:00Z'),
    updatedAt: new Date('2024-01-14T16:00:00Z'),
    assignedContactIds: ['6', '1'],
    companyIds: ['company2'],
  },
  {
    id: '23',
    title: 'Code review for PR #145',
    content: 'Review and approve pull request for new authentication feature.',
    createdBy: 'user8',
    priority: 'medium',
    dueAt: new Date(new Date().setHours(15, 15, 0, 0)), // Today at 3:15 PM
    status: 'pending',
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-01-15T09:00:00Z'),
    assignedContactIds: ['2', '17'],
  },
];

interface TaskListProps {
  filter?: 'today' | 'week' | 'completed';
}

export function TaskList({ filter }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(
    new Set(),
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dueAt', desc: false },
  ]);

  // Filter tasks based on the active tab filter
  const filteredByTab = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      switch (filter) {
        case 'today':
          const taskDueDate = new Date(task.dueAt);
          const taskDate = new Date(
            taskDueDate.getFullYear(),
            taskDueDate.getMonth(),
            taskDueDate.getDate(),
          );
          return (
            taskDate.getTime() === today.getTime() &&
            (task.status !== 'completed' || recentlyCompleted.has(task.id))
          );
        case 'week':
          return (
            new Date(task.dueAt) <= weekFromNow &&
            (task.status !== 'completed' || recentlyCompleted.has(task.id))
          );
        case 'completed':
          return task.status === 'completed';
        default:
          return true;
      }
    });
  }, [tasks, filter, recentlyCompleted]);

  const priorityCounts = useMemo(() => {
    return filteredByTab.reduce(
      (acc, task) => {
        if (task.priority) {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredByTab]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    return filteredByTab.filter((task) => {
      // Filter by status
      const matchesStatus =
        !selectedStatuses?.length ||
        selectedStatuses.includes(task.status || 'pending');

      // Filter by priority
      const matchesPriority =
        !selectedPriorities?.length ||
        selectedPriorities.includes(task.priority || '');

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchLower) ||
        task.content.toLowerCase().includes(searchLower);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [filteredByTab, searchQuery, selectedStatuses, selectedPriorities]);

  const statusCounts = useMemo(() => {
    return filteredByTab.reduce(
      (acc, task) => {
        const status = task.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredByTab]);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handlePriorityChange = (checked: boolean, value: string) => {
    setSelectedPriorities((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handleTaskComplete = (taskId: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: checked ? 'completed' : 'pending',
              completedAt: checked ? new Date() : undefined,
              completedBy: checked ? 'current_user' : undefined,
              updatedAt: new Date(),
            }
          : task,
      ),
    );

    if (checked) {
      const completedTask = tasks.find((task) => task.id === taskId);
      if (completedTask) {
        // Add to recently completed to keep it visible temporarily
        setRecentlyCompleted((prev) => new Set(prev).add(taskId));

        toast.custom(
          (t) => (
            <Alert
              variant="mono"
              icon="success"
              onClose={() => toast.dismiss(t)}
            >
              <AlertIcon>
                <CircleCheck />
              </AlertIcon>
              <AlertTitle>Task completed successfully!</AlertTitle>
            </Alert>
          ),
          {
            duration: 5000,
          },
        );

        // Hide the completed task after 2 seconds to let user see the checked state
        setTimeout(() => {
          setRecentlyCompleted((prev) => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId),
          );
        }, 2000);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success" appearance="light">
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="info" appearance="light">
            In Progress
          </Badge>
        );
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: 'status',
        id: 'status-toggle',
        header: '',
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex items-center justify-center ps-2.5">
              <Checkbox
                size="sm"
                id={task.id}
                checked={task.status === 'completed'}
                onCheckedChange={(checked) =>
                  handleTaskComplete(task.id, checked === true)
                }
              />
            </div>
          );
        },
        enableSorting: false,
        size: 30,
        enableHiding: false,
        enableResizing: false,
      },
      {
        accessorKey: 'title',
        id: 'title',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Task"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="inline-flex items-center gap-2 pe-2.5">
              <div
                className={cn(
                  'font-medium',
                  task.status === 'completed' && 'line-through',
                )}
              >
                {task.title}
              </div>
              <div className="hidden text-muted-foreground line-clamp-2">
                {task.content}
              </div>
            </div>
          );
        },
        size: 225,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: 'assignedContacts',
        id: 'team',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Assigned"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const contactIds = row.original.assignedContactIds || [];
          return (
            <div className="flex truncate overflow-hidden gap-1.5">
              {contactIds.map((contactId) => {
                const contact = mockContacts.find((c) => c.id === contactId);
                return contact ? (
                  <div
                    key={contactId}
                    className="group cursor-pointer flex items-center gap-1 px-1 border border-border rounded-full bg-accent/50"
                  >
                    <Avatar className="size-4 my-1">
                      <AvatarImage
                        src={toAbsoluteUrl(contact.avatar || '')}
                        alt={contact.name}
                      />
                      <AvatarFallback className="border-0 text-[11px] font-semibold bg-green-500 text-white">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="border-r border-border h-full"></div>

                    <span className="truncate max-w-[100px] text-xs group-hover:text-primary">
                      {contact.name}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
          );
        },
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
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
          const task = row.original;
          return task ? (
            task.priority ? (
              <Badge
                variant={
                  task.priority === 'high'
                    ? 'destructive'
                    : task.priority === 'medium'
                      ? 'warning'
                      : 'success'
                }
                appearance="light"
                className="px-1.5 py-0.5 text-xs"
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            ) : (
              <span className="text-muted-foreground">None</span>
            )
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
        size: 100,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'dueAt',
        id: 'dueAt',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Due Date"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => {
          const task = row.original;
          const isOverdue =
            new Date(task.dueAt) < new Date() && task.status !== 'completed';

          return (
            <span className={cn(isOverdue && 'text-destructive')}>
              {formatDate(task.dueAt)}
            </span>
          );
        },
        size: 150,
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
        cell: ({ row }) => getStatusBadge(row.original.status || 'pending'),
        size: 120,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'createdAt',
        id: 'created',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Added"
            visibility={true}
            column={column}
          />
        ),
        cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => <></>,
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="dim"
                mode="icon"
                size="sm"
                className="pointer-events-none opacity-0 transition-opacity duration-300 group-hover/row:pointer-events-auto group-hover/row:opacity-100 data-[state=open]:pointer-events-auto data-[state=open]:opacity-100"
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem variant="destructive">
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 60,
        enableSorting: true,
        enableHiding: true,
        enableResizing: true,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableClassNames={{
        bodyRow: 'group/row',
      }}
      tableLayout={{
        dense: true,
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card className="border-none shadow-none">
        <CardHeader className="px-4 py-3 -mt-2.5">
          <div className="flex gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                variant="sm"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 w-48"
              />
              {searchQuery.length > 0 && (
                <Button
                  mode="icon"
                  variant="ghost"
                  className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery('')}
                >
                  <X />
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
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
                      {[
                        { id: 'pending', name: 'Pending' },
                        { id: 'in_progress', name: 'In Progress' },
                        { id: 'completed', name: 'Completed' },
                      ].map((status) => {
                        const count = statusCounts[status.id] || 0;
                        return (
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
                              {getStatusBadge(status.id)}
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

            {/* Priority Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <AlertCircle className="size-3.5" />
                  Priority
                  {selectedPriorities.length > 0 && (
                    <Badge variant="outline" className="ml-2">
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
                      {[
                        { id: 'high', name: 'High' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'low', name: 'Low' },
                      ].map((priority) => {
                        const count = priorityCounts[priority.id] || 0;
                        return (
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
                              size="sm"
                            />
                            <Label
                              htmlFor={priority.id}
                              className="grow flex items-center justify-between font-normal gap-1.5"
                            >
                              <Badge
                                variant={
                                  priority.id === 'high'
                                    ? 'destructive'
                                    : priority.id === 'medium'
                                      ? 'warning'
                                      : 'success'
                                }
                                appearance="light"
                              >
                                {priority.name}
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
          </div>
        </CardHeader>

        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>

        <CardFooter className="px-4 py-0">
          <DataGridPagination className="py-1" />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
