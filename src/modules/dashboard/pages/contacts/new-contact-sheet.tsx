import { useState } from 'react';
import { mockContacts } from '@/modules/dashboard/mock/contacts';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import { Button, ButtonArrow } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

// Optionally import types if needed
// import { EstimatedArr } from '@/modules/dashboard/types/estimated-arr';
// import { EmployeeRange } from '@/modules/dashboard/types/employee-range';
// import { Company } from '@/modules/dashboard/types/company';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  position: z.string().optional(),
  socialLinks: z.string().optional(),
  logo: z.string().optional(),
  domain: z.string().optional(),
  email: z.string().email('Please enter a valid email').optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  contactIds: z.array(z.string()).optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  angelList: z.string().optional(),
  linkedin: z.string().optional(),
  connectionStrengthId: z.string().optional(),
  x: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  telegram: z.string().optional(),
  foundedAt: z.string().optional(),
  estimatedArrId: z.string().optional(),
  employeeRangeId: z.string().optional(),
  teamId: z.string().optional(),
});

export function NewCompanySheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      position: '',
      logo: '',
      domain: '',
      email: '',
      phone: '',
      description: '',
      categoryIds: [],
      contactIds: [],
      address: '',
      state: '',
      city: '',
      zip: '',
      country: '',
      angelList: '',
      linkedin: '',
      connectionStrengthId: '',
      x: '',
      instagram: '',
      facebook: '',
      telegram: '',
      foundedAt: '',
      estimatedArrId: '',
      employeeRangeId: '',
      teamId: '',
    },
  });

  const onSubmit = () => {
    toast.custom((t) => (
      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Your form has been successfully submitted</AlertTitle>
      </Alert>
    ));
  };

  const handleReset = () => {
    form.reset();
  };

  const companies = mockContacts.map((contact) => ({
    value: contact.id,
    label: contact.company,
    logo: contact.logo as string,
  }));

  const users = [
    {
      name: 'Alice Johnson',
      avatar: '/media/avatars/300-1.png', // Female
      status: 'online',
    },
    {
      name: 'Bob Smith',
      avatar: '/media/avatars/300-2.png', // Male
      status: 'offline',
    },
    {
      name: 'Carol Davis',
      avatar: '/media/avatars/300-3.png', // Female
      status: 'away',
    },
    {
      name: 'David Wilson',
      avatar: '/media/avatars/300-4.png', // Male
      status: 'online',
    },
    {
      name: 'Eve Martinez',
      email: 'eve.martinez@gmail.com',
      avatar: '/media/avatars/300-5.png', // Female
      status: 'busy',
    },
    {
      name: 'Frank Garcia',
      avatar: '/media/avatars/300-6.png', // Male
      status: 'online',
    },
    {
      name: 'Grace Lee',
      email: 'grace.lee@protonmail.com',
      avatar: '/media/avatars/300-7.png', // Female
      status: 'busy',
    },
    {
      name: 'Henry Walker',
      avatar: '/media/avatars/300-8.png', // Male
      status: 'online',
    },
  ];

  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [comboBoxValue, setComboBoxValue] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const selectedUser = users.find((user) => user.name === comboBoxValue);

  const handleComboBoxSelect = (value: string) => {
    setComboBoxValue(value);
    form.setValue('name', value);
    setComboBoxOpen(false);
  };

  const [date] = useState<Date | undefined>(new Date());

  // Docs: https://v1.reui.io/docs/date-picker#date--time
  const today = new Date();
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(
    today,
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const timeSlots = [
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '12:00', available: true },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: true },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="flex items-center gap-2.5">
            <Users className="text-primary size-4" />
            New Contact
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="px-5 py-0">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] pe-3 -me-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={() => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Popover
                          open={comboBoxOpen}
                          onOpenChange={setComboBoxOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-60',
                                !selectedUser && 'text-muted-foreground',
                              )}
                              aria-expanded={comboBoxOpen}
                            >
                              {selectedUser ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="size-4">
                                    <AvatarImage
                                      src={selectedUser.avatar}
                                      alt={selectedUser.name}
                                    />
                                    <AvatarFallback>
                                      {selectedUser.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="truncate">
                                    {selectedUser.name}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select a user
                                </span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[300px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search user..." />
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandEmpty>No users found.</CommandEmpty>
                                  <CommandGroup>
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user.name}
                                        value={user.name}
                                        onSelect={(currentValue) =>
                                          handleComboBoxSelect(currentValue)
                                        }
                                      >
                                        <span className="flex items-center gap-2">
                                          <Avatar className="size-4">
                                            <AvatarImage
                                              src={user.avatar}
                                              alt={user.name}
                                            />
                                            <AvatarFallback>
                                              {user.name[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="font-medium">
                                            {user.name}
                                          </span>
                                        </span>
                                        <CommandCheck
                                          className={cn(
                                            comboBoxValue === user.name
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company ComboBox */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                <div className="flex items-center gap-2">
                                  <Avatar className="flex items-center justify-center size-5 border border-border rounded-full">
                                    <AvatarImage
                                      className="size-4"
                                      src={
                                        companies.find(
                                          (c) => c.value === field.value,
                                        )?.logo
                                      }
                                      alt={
                                        companies.find(
                                          (c) => c.value === field.value,
                                        )?.label
                                      }
                                    />
                                  </Avatar>
                                  <span className="text-sm">
                                    {
                                      companies.find(
                                        (c) => c.value === field.value,
                                      )?.label
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select a company
                                </span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[300px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search company..." />
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandEmpty>
                                    No companies found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {companies.map((company) => (
                                      <CommandItem
                                        key={company.value}
                                        value={company.value}
                                        onSelect={() =>
                                          field.onChange(company.value)
                                        }
                                      >
                                        <div className="flex items-center gap-2">
                                          <Avatar className="flex items-center justify-center size-5 border border-border rounded-full">
                                            <AvatarImage
                                              className="size-4"
                                              src={company.logo}
                                              alt={company.label}
                                            />
                                          </Avatar>
                                          <span className="text-sm">
                                            {company.label}
                                          </span>
                                        </div>
                                        <CommandCheck
                                          className={cn(
                                            field.value === company.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Position ComboBox */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                <span className="capitalize">
                                  {field.value}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select position
                                </span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[300px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search position..." />
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandEmpty>
                                    No positions found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {[
                                      'CEO',
                                      'CTO',
                                      'COO',
                                      'CFO',
                                      'CMO',
                                      'VP of Engineering',
                                      'VP of Sales',
                                      'VP of Marketing',
                                      'Director',
                                      'Manager',
                                      'Senior Manager',
                                      'Team Lead',
                                      'Developer',
                                      'Designer',
                                      'Analyst',
                                      'Consultant',
                                      'Specialist',
                                    ].map((position) => (
                                      <CommandItem
                                        key={position}
                                        value={position}
                                        onSelect={() =>
                                          field.onChange(position)
                                        }
                                      >
                                        <span className="capitalize">
                                          {position}
                                        </span>
                                        <CommandCheck
                                          className={cn(
                                            field.value === position
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Social Links ComboBox */}
                <FormField
                  control={form.control}
                  name="socialLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Links</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                <span className="capitalize">
                                  {field.value}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select social media
                                </span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[300px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search social media..." />
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandEmpty>
                                    No social media found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {[
                                      'linkedin',
                                      'twitter',
                                      'github',
                                      'instagram',
                                      'facebook',
                                      'youtube',
                                      'medium',
                                      'stackoverflow',
                                    ].map((platform) => (
                                      <CommandItem
                                        key={platform}
                                        value={platform}
                                        onSelect={() =>
                                          field.onChange(platform)
                                        }
                                      >
                                        <span className="capitalize">
                                          {platform}
                                        </span>
                                        <CommandCheck
                                          className={cn(
                                            field.value === platform
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email ComboBox */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Popover open={emailOpen} onOpenChange={setEmailOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={emailOpen}
                              className={cn(
                                'justify-between',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                <div className="flex items-center gap-1.5 truncate">
                                  {field.value}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select Email
                                </span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[280px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search Email..." />
                              <CommandEmpty>No Email found.</CommandEmpty>
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandGroup>
                                    {mockContacts
                                      .filter((contact) => contact.email)
                                      .map((contact) => (
                                        <CommandItem
                                          key={contact.email}
                                          value={contact.email}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setEmailOpen(false);
                                          }}
                                        >
                                          <Link
                                            to={`/dashboard/companies/${contact.id}`}
                                          >
                                            {contact.email}
                                          </Link>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Address ComboBox*/}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Popover
                          open={addressOpen}
                          onOpenChange={setAddressOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:opacity-60',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                <div className="flex items-center gap-1.5 truncate">
                                  {field.value}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Select Address
                                </span>
                              )}
                              <ChevronDown className="h-4 w-4 opacity-60 -me-0.5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[280px] p-0"
                          >
                            <Command>
                              <CommandInput placeholder="Search Address..." />
                              <CommandEmpty>No Address found.</CommandEmpty>
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                  <CommandGroup>
                                    {mockContacts
                                      .filter((contact) => contact.address)
                                      .map((contact) => (
                                        <CommandItem
                                          key={contact.address}
                                          value={contact.address}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setAddressOpen(false);
                                          }}
                                        >
                                          {contact.address}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </ScrollArea>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <div className="flex flex-col gap-2.5">
                  <Label className="flex w-full items-center gap-1 max-w-56">
                    Due Date
                  </Label>
                  {/*
                    Docs: https://v1.reui.io/docs/date-picker#date--time
                  */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="grow relative">
                        <Button
                          type="button"
                          variant="outline"
                          mode="input"
                          placeholder={!date}
                          className="w-full"
                        >
                          <CalendarIcon />
                          {date ? (
                            format(date, 'PPP') +
                            (selectedTime ? ` - ${selectedTime}` : '')
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex max-sm:flex-col">
                        <Calendar
                          mode="single"
                          selected={availabilityDate}
                          onSelect={(newDate) => {
                            if (newDate) {
                              setAvailabilityDate(newDate);
                              setSelectedTime(undefined);
                            }
                          }}
                          className="p-2 sm:pe-5"
                          disabled={[{ before: today }]}
                        />
                        <div className="relative w-full max-sm:h-48 sm:w-40">
                          <div className="absolute inset-0 py-4 max-sm:border-t">
                            <ScrollArea className="h-full sm:border-s">
                              <div className="space-y-3">
                                <div className="flex h-5 shrink-0 items-center px-5">
                                  <p className="text-sm font-medium">
                                    {date
                                      ? format(date, 'EEEE, d')
                                      : 'Pick a date'}
                                    <span className="text-muted-foreground">
                                      {selectedTime ? ` - ${selectedTime}` : ''}
                                    </span>
                                  </p>
                                </div>
                                <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                                  {timeSlots.map(({ time, available }) => (
                                    <Button
                                      key={time}
                                      variant={
                                        selectedTime === time
                                          ? 'primary'
                                          : 'outline'
                                      }
                                      size="sm"
                                      className="w-full"
                                      onClick={() => setSelectedTime(time)}
                                      disabled={!available}
                                    >
                                      {time}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="flex items-center not-only-of-type:justify-between border-t py-3.5 px-5 border-border">
          <div className="flex items-center space-x-2">
            <Switch id="create-more" size="sm" />
            <Label
              htmlFor="create-more"
              className="text-xs text-secondary-foreground"
            >
              Create more
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Save Contact</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
