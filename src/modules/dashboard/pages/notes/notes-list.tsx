/* eslint-disable react-hooks/exhaustive-deps */
import { Key, useMemo, useState } from 'react';
import { mockContacts } from '@/modules/dashboard/mock/contacts'; // mockContacts fayli mavjud deb faraz qilamiz
import { Notes } from '@/modules/dashboard/types/notes';
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
  CheckCircle,
  Ellipsis,
  Filter,
  Search,
  Settings2,
  Star,
  Tag,
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

// Extended Notes interface with tags, category, priority, and isFavorite
export interface ExtendedNotes extends Omit<Notes, 'content'> {
  category: string[];
  priority: 'high' | 'medium' | 'low';
  isFavorite?: boolean;
  isClickable?: boolean;
}

// Mock note data
const mockNotes: ExtendedNotes[] = [
  {
    id: '1',
    title: 'Client Kickoff Meeting',
    createdBy: 'user1',
    dueAt: new Date(new Date().setHours(14, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T09:00:00Z'),
    updatedAt: new Date('2025-07-05T09:00:00Z'),
    assignedContactIds: ['1'],
    companyIds: ['company1'],
    category: ['client', 'kickoff'],
    priority: 'high',
    isFavorite: true,
    isClickable: false,
  },
  {
    id: '2',
    title: 'Follow-up Call with Prospect',
    createdBy: 'user2',
    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    createdAt: new Date('2025-07-04T11:00:00Z'),
    updatedAt: new Date('2025-07-05T08:30:00Z'),
    assignedContactIds: ['2', '3'],
    dealIds: ['deal1'],
    companyIds: [],
    category: ['prospect', 'sales'],
    priority: 'medium',
    isFavorite: true,
    isClickable: false,
  },
  {
    id: '3',
    title: 'Task: Update CRM Data',
    createdBy: 'user3',
    dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
    createdAt: new Date('2025-07-03T10:00:00Z'),
    updatedAt: new Date('2025-07-03T10:00:00Z'),
    assignedContactIds: ['4'],
    companyIds: [],
    category: ['maintenance', 'crm'],
    priority: 'low',
    isFavorite: true,
    isClickable: false,
  },
  {
    id: '4',
    title: 'Prepare Client Report',
    createdBy: 'user4',
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
    createdAt: new Date('2025-07-02T14:00:00Z'),
    updatedAt: new Date('2025-07-02T14:00:00Z'),
    assignedContactIds: ['5'],
    companyIds: ['company2'],
    category: ['report', 'client'],
    priority: 'medium',
    isFavorite: true,
    isClickable: true,
  },
  {
    id: '5',
    title: 'Follow-up Call with Prospect',
    createdBy: 'user2',
    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    createdAt: new Date('2025-07-04T11:00:00Z'),
    updatedAt: new Date('2025-07-05T08:30:00Z'),
    assignedContactIds: ['2', '3'],
    dealIds: ['deal1'],
    companyIds: [],
    category: ['prospect', 'sales'],
    priority: 'medium',
    isFavorite: false,
    isClickable: false,
  },
  {
    id: '6',
    title: 'Task: Update CRM Data',
    createdBy: 'user3',
    dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
    createdAt: new Date('2025-07-03T10:00:00Z'),
    updatedAt: new Date('2025-07-03T10:00:00Z'),
    assignedContactIds: ['4'],
    companyIds: [],
    category: ['maintenance', 'crm'],
    priority: 'low',
    isFavorite: false,
    isClickable: false,
  },
  {
    id: '7',
    title: 'Follow-up Call with Prospect',
    createdBy: 'user2',
    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    createdAt: new Date('2025-07-04T11:00:00Z'),
    updatedAt: new Date('2025-07-05T08:30:00Z'),
    assignedContactIds: ['2', '3'],
    dealIds: ['deal1'],
    companyIds: [],
    category: ['prospect', 'sales'],
    priority: 'medium',
    isFavorite: false,
    isClickable: true,
  },
  {
    id: '8',
    title: 'Task: Update CRM Data',
    createdBy: 'user3',
    dueAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
    createdAt: new Date('2025-07-03T10:00:00Z'),
    updatedAt: new Date('2025-07-03T10:00:00Z'),
    assignedContactIds: ['4'],
    companyIds: [],
    category: ['maintenance', 'crm'],
    priority: 'low',
    isFavorite: false,
    isClickable: true,
  },
  {
    id: '9',
    title: 'Reminder: Send Proposal',
    createdBy: 'user1',
    dueAt: new Date(new Date().setHours(16, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T07:00:00Z'),
    updatedAt: new Date('2025-07-05T07:00:00Z'),
    assignedContactIds: ['5'],
    companyIds: ['company2'],
    category: ['proposal', 'urgent'],
    priority: 'high',
    isFavorite: false,
    isClickable: false,
  },
  {
    id: '10',
    title: 'Weekly Team Sync',
    createdBy: 'user2',
    dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
    createdAt: new Date('2025-07-05T10:00:00Z'),
    updatedAt: new Date('2025-07-05T10:00:00Z'),
    assignedContactIds: ['1', '2', '3'],
    companyIds: [],
    category: ['team', 'sync'],
    priority: 'medium',
    isFavorite: false,
    isClickable: true,
  },
  {
    id: '11',
    title: 'Client Feedback Review',
    createdBy: 'user4',
    dueAt: new Date('2025-07-04T15:00:00Z'),
    completedAt: new Date('2025-07-04T14:30:00Z'),
    completedBy: 'user4',
    status: 'completed',
    createdAt: new Date('2025-07-03T09:00:00Z'),
    updatedAt: new Date('2025-07-04T14:30:00Z'),
    assignedContactIds: ['6'],
    companyIds: ['company3'],
    category: ['feedback', 'client'],
    priority: 'medium',
    isFavorite: false,
    isClickable: false,
  },
  {
    id: '12',
    title: 'Daily Team Standup',
    createdBy: 'user1',
    dueAt: new Date(new Date().setHours(9, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T08:00:00Z'),
    updatedAt: new Date('2025-07-05T08:00:00Z'),
    assignedContactIds: ['1', '2'],
    companyIds: [],
    category: ['daily', 'team'],
    priority: 'medium',
    isFavorite: true,
    isClickable: false,
  },
  {
    id: '13',
    title: 'Client Demo Prep',
    createdBy: 'user2',
    dueAt: new Date(new Date().setHours(11, 0, 0, 0)),
    status: 'in_progress',
    createdAt: new Date('2025-07-05T09:30:00Z'),
    updatedAt: new Date('2025-07-05T09:30:00Z'),
    assignedContactIds: ['4', '5'],
    companyIds: ['company1'],
    category: ['demo', 'presentation'],
    priority: 'high',
    isFavorite: false,
    isClickable: true,
  },
  {
    id: '14',
    title: 'Code Review Session',
    createdBy: 'user3',
    dueAt: new Date(new Date().setHours(13, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T10:00:00Z'),
    updatedAt: new Date('2025-07-05T10:00:00Z'),
    assignedContactIds: ['6', '7'],
    companyIds: [],
    category: ['code', 'review'],
    priority: 'medium',
    isFavorite: true,
    isClickable: false,
  },
  {
    id: '15',
    title: 'Database Backup',
    createdBy: 'user4',
    dueAt: new Date(new Date().setHours(17, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T14:00:00Z'),
    updatedAt: new Date('2025-07-05T14:00:00Z'),
    assignedContactIds: ['8', '3'],
    companyIds: [],
    category: ['maintenance', 'backup'],
    priority: 'low',
    isFavorite: false,
    isClickable: true,
  },
  {
    id: '16',
    title: 'Weekly Report',
    createdBy: 'user5',
    dueAt: new Date(new Date().setHours(18, 0, 0, 0)),
    status: 'pending',
    createdAt: new Date('2025-07-05T15:00:00Z'),
    updatedAt: new Date('2025-07-05T15:00:00Z'),
    assignedContactIds: ['9'],
    companyIds: [],
    category: ['report', 'weekly'],
    priority: 'medium',
    isFavorite: true,
    isClickable: true,
  },
];

interface NoteListProps {
  filter?: 'today' | 'week' | 'completed';
}

export function NoteList({ filter }: NoteListProps) {
  const [notes, setNotes] = useState<ExtendedNotes[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [recentlyCompleted] = useState<Set<string>>(new Set());

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'dueAt', desc: false },
  ]);

  // Dinamik kategoriyalar ro‘yxati
  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    mockNotes.forEach((note) => {
      note.category.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).map((id) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
    }));
  }, []);

  // Filter notes based on the active tab filter
  const filteredByTab = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return notes.filter((note) => {
      switch (filter) {
        case 'today':
          const noteDueDate = new Date(note.dueAt);
          const noteDate = new Date(
            noteDueDate.getFullYear(),
            noteDueDate.getMonth(),
            noteDueDate.getDate(),
          );
          return (
            noteDate.getTime() === today.getTime() &&
            (note.status !== 'completed' || recentlyCompleted.has(note.id))
          );
        case 'week':
          return (
            new Date(note.dueAt) <= weekFromNow &&
            (note.status !== 'completed' || recentlyCompleted.has(note.id))
          );
        case 'completed':
          return note.status === 'completed';
        default:
          return true;
      }
    });
  }, [notes, filter, recentlyCompleted]);

  // Apply all filters (status, priority, category, search)
  const filteredData = useMemo(() => {
    return filteredByTab.filter((note) => {
      const matchesStatus =
        !selectedStatuses.length ||
        selectedStatuses.includes(note.status || 'pending');
      const matchesPriority =
        !selectedPriorities.length ||
        selectedPriorities.includes(note.priority);
      const matchesCategory =
        !selectedCategories.length ||
        selectedCategories.some((category) => note.category.includes(category));
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        note.title.toLowerCase().includes(searchLower) ||
        note.category.some((cat) => cat.toLowerCase().includes(searchLower));

      return (
        matchesStatus && matchesPriority && matchesCategory && matchesSearch
      );
    });
  }, [
    filteredByTab,
    searchQuery,
    selectedStatuses,
    selectedPriorities,
    selectedCategories,
  ]);

  // Calculate counts for statuses, categories, and priorities
  const statusCounts = useMemo(() => {
    return filteredByTab.reduce(
      (acc, note) => {
        const status = note.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredByTab]);

  const categoryCounts = useMemo(() => {
    return filteredByTab.reduce(
      (acc, note) => {
        const category = note.category;
        category.forEach((c) => {
          acc[c] = (acc[c] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredByTab]);

  const priorityCounts = useMemo(() => {
    return filteredByTab.reduce(
      (acc, note) => {
        if (note.priority) {
          acc[note.priority] = (acc[note.priority] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [filteredByTab]);

  const handleDeleteNote = (noteId: string) => {
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="warning" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <Trash />
          </AlertIcon>
          <AlertTitle>Note deleted successfully!</AlertTitle>
        </Alert>
      ),
      { duration: 3000, position: 'top-center' },
    );

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  };

  const handleStarClick = (noteId: string) => {
    const noteToToggle = notes.find((note) => note.id === noteId);
    if (!noteToToggle) return;

    // Update both notes state and mockNotes
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note,
    );

    // Find the corresponding note in mockNotes and update it
    const mockNoteIndex = mockNotes.findIndex((note) => note.id === noteId);
    if (mockNoteIndex !== -1) {
      mockNotes[mockNoteIndex] = {
        ...mockNotes[mockNoteIndex],
        isFavorite: !mockNotes[mockNoteIndex].isFavorite,
      };
    }

    setNotes(updatedNotes);

    const updatedNote = updatedNotes.find((note) => note.id === noteId);
    if (updatedNote) {
      toast.custom(
        (t) => (
          <Alert variant="mono" icon="success" onClose={() => toast.dismiss(t)}>
            <AlertIcon>
              <CheckCircle />
            </AlertIcon>
            <AlertTitle>
              {updatedNote.isFavorite
                ? 'Added to favorites'
                : 'Removed from favorites'}
            </AlertTitle>
          </Alert>
        ),
        { duration: 5000, position: 'bottom-right' },
      );
    }
  };

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handleCategoryChange = (checked: boolean, value: string) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handlePriorityChange = (checked: boolean, value: string) => {
    setSelectedPriorities((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant="destructive" appearance="light">
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="warning" appearance="light">
            Medium
          </Badge>
        );
      case 'low':
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const columns = useMemo<ColumnDef<ExtendedNotes>[]>(
    () => [
      {
        accessorKey: 'title',
        id: 'title',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Note"
            visibility={true}
            column={column}
            className="-ms-px"
          />
        ),
        cell: ({ row }) => {
          const note = row.original;
          return (
            <div className="inline-flex items-center gap-2 ps-1.5 pe-2.5">
              <div className={cn('font-medium')}>{note.title}</div>
            </div>
          );
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
        enableResizing: true,
      },
      {
        accessorKey: 'category',
        id: 'category',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Category"
            visibility={false}
            column={column}
          />
        ),
        cell: ({ row }) => (
          <div className="flex gap-1 flex-wrap">
            {row.original.category.map((category) => (
              <Badge
                key={category}
                variant={
                  category === 'client'
                    ? 'primary'
                    : category === 'daily'
                      ? 'info'
                      : category === 'team'
                        ? 'warning'
                        : category === 'demo'
                          ? 'success'
                          : category === 'presentation'
                            ? 'destructive'
                            : category === 'code'
                              ? 'secondary'
                              : category === 'review'
                                ? 'warning'
                                : category === 'maintenance'
                                  ? 'destructive'
                                  : category === 'backup'
                                    ? 'info'
                                    : category === 'report'
                                      ? 'secondary'
                                      : category === 'weekly'
                                        ? 'success'
                                        : category === 'prospect'
                                          ? 'info'
                                          : category === 'sales'
                                            ? 'primary'
                                            : category === 'crm'
                                              ? 'warning'
                                              : category === 'proposal'
                                                ? 'destructive'
                                                : category === 'urgent'
                                                  ? 'destructive'
                                                  : 'success'
                }
                appearance="light"
              >
                {category}
              </Badge>
            ))}
          </div>
        ),
        size: 150,
        enableSorting: true,
        enableHiding: true,
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
              {contactIds
                .slice(0, 3)
                .map((contactId: Key | null | undefined) => {
                  const contact = mockContacts?.find((c) => c.id === contactId);
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
                        <AvatarFallback className="border-0 text-[11px] font-semibold bg-blue-500 text-white">
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[80px] text-xs group-hover:text-blue-600">
                        {contact.name}
                      </span>
                    </div>
                  ) : null;
                })}
              {contactIds.length > 3 && (
                <Badge variant="secondary" appearance="light">
                  +{contactIds.length - 3}
                </Badge>
              )}
            </div>
          );
        },
        size: 200,
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
        cell: ({ row }) => getPriorityBadge(row.original.priority),
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
          const note = row.original;
          const isOverdue =
            new Date(note.dueAt) < new Date() && note.status !== 'completed';
          return (
            <div className="flex items-center gap-1">
              <span className={cn(isOverdue && 'text-destructive text-xs')}>
                {formatDate(note.dueAt)}
              </span>
              {isOverdue && <AlertCircle className="size-3 text-destructive" />}
            </div>
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
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="dim"
              size="sm"
              onClick={() => handleStarClick(row.original.id)}
            >
              <Star
                className={`text-gray-200 ${row.original.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'fill-gray-200'}`}
              />
            </Button>
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
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteNote(row.original.id)}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 80,
        enableSorting: false,
        enableHiding: true,
        enableResizing: true,
      },
    ],
    [],
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    getRowId: (row: ExtendedNotes) => row.id,
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
        category: false,
      },
    },
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
          <CardHeading>
            <div className="flex items-center gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  variant="sm"
                  placeholder="Search notes or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-48 rounded-lg border-gray-300 focus:border-blue-500"
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
                      <Badge size="sm" appearance="outline">
                        {selectedStatuses.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search..." />
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
                                  handleStatusChange(
                                    checked === true,
                                    status.id,
                                  )
                                }
                                size="sm"
                              />
                              <Label
                                htmlFor={status.id}
                                className="grow flex items-center justify-between font-normal gap-1.5"
                              >
                                <Badge
                                  variant={
                                    status.id === 'completed'
                                      ? 'success'
                                      : status.id === 'in_progress'
                                        ? 'info'
                                        : 'secondary'
                                  }
                                  appearance="light"
                                  className="px-1.5 py-0.5 text-xs"
                                >
                                  {status.name}
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

              {/* Category Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="size-3.5" />
                    Category
                    {selectedCategories.length > 0 && (
                      <Badge size="sm" appearance="outline" className="ml-2">
                        {selectedCategories.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {uniqueCategories.map((category) => {
                          const count = categoryCounts[category.id] || 0;
                          return (
                            <CommandItem
                              key={category.id}
                              value={category.id}
                              className="flex items-center gap-2.5 bg-transparent!"
                            >
                              <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(
                                  category.id,
                                )}
                                onCheckedChange={(checked) =>
                                  handleCategoryChange(
                                    checked === true,
                                    category.id,
                                  )
                                }
                                size="sm"
                              />
                              <Label
                                htmlFor={category.id}
                                className="grow flex items-center justify-between font-normal gap-1.5"
                              >
                                <Badge
                                  variant={
                                    category.id === 'client'
                                      ? 'primary'
                                      : category.id === 'daily'
                                        ? 'info'
                                        : category.id === 'team'
                                          ? 'warning'
                                          : category.id === 'demo'
                                            ? 'success'
                                            : category.id === 'presentation'
                                              ? 'destructive'
                                              : category.id === 'code'
                                                ? 'secondary'
                                                : category.id === 'review'
                                                  ? 'warning'
                                                  : category.id ===
                                                      'maintenance'
                                                    ? 'destructive'
                                                    : category.id === 'backup'
                                                      ? 'info'
                                                      : category.id === 'report'
                                                        ? 'secondary'
                                                        : category.id ===
                                                            'weekly'
                                                          ? 'success'
                                                          : category.id ===
                                                              'prospect'
                                                            ? 'info'
                                                            : category.id ===
                                                                'sales'
                                                              ? 'primary'
                                                              : category.id ===
                                                                  'crm'
                                                                ? 'warning'
                                                                : category.id ===
                                                                    'proposal'
                                                                  ? 'destructive'
                                                                  : category.id ===
                                                                      'urgent'
                                                                    ? 'destructive'
                                                                    : 'success'
                                  }
                                  appearance="light"
                                  className="px-1.5 py-0.5 text-xs"
                                >
                                  {category.name}
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

              {/* Priority Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <AlertCircle className="size-3.5" />
                    Priority
                    {selectedPriorities.length > 0 && (
                      <Badge size="sm" appearance="outline" className="ml-2">
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
                                checked={selectedPriorities.includes(
                                  priority.id,
                                )}
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
                                  size="sm"
                                  variant={
                                    priority.id === 'high'
                                      ? 'destructive'
                                      : priority.id === 'medium'
                                        ? 'warning'
                                        : 'success'
                                  }
                                  appearance="light"
                                  className="px-1.5 py-0.5 text-xs"
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
          </CardHeading>
          <CardToolbar>
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-gray-300"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
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

        <CardFooter className="px-4 py-0">
          <DataGridPagination className="py-1" />
        </CardFooter>
      </Card>
    </DataGrid>
  );
}
