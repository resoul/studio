import { useMemo, useState } from 'react';
import { mockContacts } from '@/modules/dashboard/mock/contacts';
import { Contact } from '@/modules/dashboard/types/contact';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Briefcase, Building, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ContactListProps {
  filter?: 'all' | 'today' | 'week' | 'completed';
}

const ContactList = ({ filter = 'all' }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const columns: ColumnDef<Contact>[] = [
    {
      id: 'select',
      size: 50,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          size="sm"
          className="ms-1.5 align-middle"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          size="sm"
          className="ms-1.5 align-middle"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            {row.original.avatar ? (
              <AvatarImage
                src={toAbsoluteUrl(row.original.avatar)}
                alt={row.original.name}
              />
            ) : (
              <AvatarFallback>
                {row.original.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <Link
            to={`#`}
            className="font-medium text-foreground hover:text-primary"
          >
            {row.original.name}
          </Link>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
      cell: ({ row }) => (
        <Link
          to={`/dashboard/contacts/${row.original.id}`}
          className="hover:text-primary"
        >
          {row.original.email || '-'}
        </Link>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      size: 200,
      cell: ({ row }) => <div>{row.original.address || '-'}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'socialLinks',
      header: 'Social Links',
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {row.original.socialLinks?.linkedin && (
            <Link to="#" className="text-primary hover:underline">
              LinkedIn
            </Link>
          )}
          {row.original.socialLinks?.twitter && (
            <Link to="#" className="text-primary hover:underline">
              Twitter
            </Link>
          )}
          {row.original.socialLinks?.github && (
            <Link to="#" className="text-primary hover:underline">
              GitHub
            </Link>
          )}
          {row.original.socialLinks?.instagram && (
            <Link to="#" className="text-primary hover:underline">
              Instagram
            </Link>
          )}
          {row.original.socialLinks?.facebook && (
            <Link to="#" className="text-primary hover:underline">
              Facebook
            </Link>
          )}
          {row.original.socialLinks?.youtube && (
            <Link to="#" className="text-primary hover:underline">
              YouTube
            </Link>
          )}
          {row.original.socialLinks?.medium && (
            <Link to="#" className="text-primary hover:underline">
              Medium
            </Link>
          )}
          {row.original.socialLinks?.stackoverflow && (
            <Link to="#" className="text-primary hover:underline">
              StackOverflow
            </Link>
          )}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 150,
      cell: ({ row }) => <div>{row.original.phone || '-'}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'position',
      header: 'Position',
      size: 150,
      cell: ({ row }) => <div>{row.original.position || '-'}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'company',
      header: 'Company',
      size: 150,
      cell: ({ row }) => {
        const company = row.original.company || '';
        return (
          <Link
            to={`#`}
            className="group flex items-center gap-1.5 cursor-pointer"
          >
            <Avatar className="flex items-center justify-center size-5">
              <AvatarImage
                className="size-4 rounded-none"
                src={toAbsoluteUrl(row.original.logo || '')}
                alt={company || 'Company'}
              />
            </Avatar>
            <div className="group-hover:text-primary">{company || '-'}</div>
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span>{formatDate(date)}</span>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      size: 150,
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);

        return <span>{formatDate(date)}</span>;
      },
      enableSorting: true,
    },
  ];

  const filteredContacts = useMemo(() => {
    let contacts = mockContacts;
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7,
    );

    // Apply time-based filter
    if (filter !== 'all') {
      contacts = contacts.filter((contact) => {
        const contactDate = new Date(contact.updatedAt);

        switch (filter) {
          case 'today':
            // For today filter, check if date is exactly today
            return contactDate >= todayStart;
          case 'week':
            // For week filter, show contacts from the last 7 days
            return contactDate >= weekStart;
          case 'completed':
            // For completed, show contacts older than 7 days
            return contactDate < weekStart;
          default:
            return true;
        }
      });
    }

    // Apply position filter
    if (selectedPositions.length > 0) {
      contacts = contacts.filter((contact) =>
        selectedPositions.includes(contact.position || ''),
      );
    }

    // Apply company filter
    if (selectedCompanies.length > 0) {
      contacts = contacts.filter((contact) =>
        selectedCompanies.includes(contact.company || ''),
      );
    }

    // Apply search filter
    return contacts.filter(
      (contact: Contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery) ||
        contact.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, filter, selectedPositions, selectedCompanies]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredContacts.length}
      tableLayout={{
        dense: true,
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
    >
      <Card className="border-none shadow-none">
        <CardHeader className="px-4 py-3 -mt-4">
          <div className="flex items-center flex-wrap gap-2 justify-between w-full">
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  variant="sm"
                  placeholder="Search contacts..."
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

              {/* Position Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="size-4" />
                    Position
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search positions..." />
                    <CommandList>
                      <CommandEmpty>No positions found.</CommandEmpty>
                      <CommandGroup>
                        {Array.from(
                          new Set(mockContacts.map((c) => c.position)),
                        ).map((position) => (
                          <CommandItem
                            key={position}
                            value={position || ''}
                            className="flex items-center gap-2.5 bg-transparent!"
                          >
                            <Checkbox
                              id={position || ''}
                              checked={selectedPositions.includes(
                                position || '',
                              )}
                              onCheckedChange={(checked) => {
                                setSelectedPositions((prev) =>
                                  checked
                                    ? [...prev, position || '']
                                    : prev.filter(
                                        (p) => p !== (position || ''),
                                      ),
                                );
                              }}
                              size="sm"
                            />
                            {position || 'No position'}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Company Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Building className="size-4" />
                    Company
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search companies..." />
                    <CommandList>
                      <CommandEmpty>No companies found.</CommandEmpty>
                      <CommandGroup>
                        {Array.from(
                          new Set(mockContacts.map((c) => c.company)),
                        ).map((company) => (
                          <CommandItem
                            key={company}
                            value={company || ''}
                            className="flex items-center gap-2.5 bg-transparent!"
                          >
                            <Checkbox
                              id={company || ''}
                              checked={selectedCompanies.includes(
                                company || '',
                              )}
                              onCheckedChange={(checked) => {
                                setSelectedCompanies((prev) =>
                                  checked
                                    ? [...prev, company || '']
                                    : prev.filter((p) => p !== (company || '')),
                                );
                              }}
                              size="sm"
                            />
                            <div className="flex items-center gap-2">
                              <Avatar className="flex items-center justify-center size-5 border border-border rounded-full">
                                <AvatarImage
                                  className="size-4"
                                  src={
                                    mockContacts.find(
                                      (c) => c.company === company,
                                    )?.logo
                                  }
                                  alt={company || 'Company'}
                                />
                              </Avatar>
                              {company || 'No company'}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <DataGridColumnVisibility
                table={table}
                trigger={
                  <Button variant="outline" size="sm">
                    Columns
                  </Button>
                }
              />
            </div>
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
};

export default ContactList;
