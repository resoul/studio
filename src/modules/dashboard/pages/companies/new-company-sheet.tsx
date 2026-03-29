import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/modules/dashboard/mock/categories';
import { COMPANIES, CONNECTION_STRENGTHS } from '@/modules/dashboard/mock/companies';
import { EMPLOYEE_RANGES } from '@/modules/dashboard/mock/employee-ranges';
import { ESTIMATED_ARRS } from '@/modules/dashboard/mock/estimated-arrs';
import { Company } from '@/modules/dashboard/types/company';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { format } from 'date-fns';
import { Building2, Calendar as CalendarIcon, HelpCircle } from 'lucide-react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const LAST_CONTACT_OPTIONS = [
  '23 days',
  'about 2 hours ago',
  '3 months',
  '4 days',
  '17 days',
  '12 days',
  '7 days',
  '12 hours',
  '9 hours',
  '7 months',
  'Never',
] as const;

// Form Types
export interface NewCompanyFormValues {
  name: string;
  logo?: string;
  domain?: string;
  email?: string;
  phone?: string;
  description?: string;
  category?: string;
  categoryIds?: string[];
  contactIds?: string[];
  address?: string;
  state?: string;
  city?: string;
  zip?: string;
  country?: string;
  angelList?: string;
  linkedin?: string;
  connectionStrengthId?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  telegram?: string;
  createdAt?: Date;
  updatedAt?: Date;
  foundedAt?: Date;
  estimatedArrId?: string;
  employeeRangeId?: string;
  lastInteractionAt?: Date;
  lastContacted?: string;
  teamId?: string;
}

const FormSchema = z.object({
  lastContacted: z.enum(LAST_CONTACT_OPTIONS).optional(),
  name: z.string().min(1, 'Company name is required'),
  logo: z.string().optional(),
  domain: z
    .string()
    .url('Please enter a valid domain URL')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .optional()
    .or(z.literal('')),
  category: z.string().min(1, 'Please select a category'),
  categoryIds: z.array(z.string()).optional(),
  contactIds: z.array(z.string()).optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(1, 'Please select a country'),
  angelList: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  linkedin: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  connectionStrengthId: z
    .string()
    .min(1, 'Please select a connection strength'),
  x: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  instagram: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  facebook: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  telegram: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  foundedAt: z.string().optional(),
  estimatedArrId: z.string().min(1, 'Please select an ARR range'),
  employeeRangeId: z.string().min(1, 'Please select an employee range'),
  lastInteractionAt: z.date().optional(),
  locationId: z.string().optional(),
  teamId: z.string().optional(),
});

export function NewCompanySheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [connectionOpen, setConnectionOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const connectionStrengthOptions = CONNECTION_STRENGTHS.map((strength) => ({
    value: strength.id,
    label: strength.name,
    color: strength.color,
  }));

  useEffect(() => {
    // Using real mock data from companies.ts
    setCompanies(COMPANIES);
  }, []);

  const [date, setDate] = useState<Date | undefined>();
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>();
  const [availabilityTime, setAvailabilityTime] = useState<
    string | undefined
  >();
  const [availabilityTimeSlots, setAvailabilityTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const today = new Date();

  // Initialize time slots
  useEffect(() => {
    const timeSlots = [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: true },
    ];
    setAvailabilityTimeSlots(timeSlots);
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      logo: '',
      domain: '',
      email: '',
      phone: '',
      description: '',
      category: '',
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
    mode: 'onSubmit',
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log('Form data:', data);
    console.log('Form is valid:', form.formState.isValid);
    console.log('Form errors:', form.formState.errors);
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>Your form has been successfully submitted</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  const onError = (errors: FieldErrors<z.infer<typeof FormSchema>>) => {
    console.log('Form validation errors:', errors);
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="destructive"
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>
            Please fix the validation errors before submitting
          </AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  const handleReset = () => {
    form.reset();
  };

  // State for ARR ComboBox
  const [arrOpen, setArrOpen] = useState(false);
  // State for Employee Size ComboBox
  const [employeeOpen, setEmployeeOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="flex items-center gap-2.5">
            <Building2 className="text-primary size-4" />
            New Company
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="p-0">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] ps-3 pe-2 me-1">
            <TooltipProvider>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, onError)}
                  className="space-y-6 px-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Company Name</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Provide a legal name for the company</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Description</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enter a brief description of the company
                                (minimum 10 characters)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Connection Strength ComboBox */}
                  <FormField
                    control={form.control}
                    name="connectionStrengthId"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Connection Strength</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Select the strength of your connection with this
                                company
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Popover
                            open={connectionOpen}
                            onOpenChange={setConnectionOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                mode="input"
                                placeholder={!field.value}
                                aria-expanded={connectionOpen}
                                className="w-full"
                              >
                                {field.value ? (
                                  <div className="inline-flex items-center gap-1.5">
                                    <span
                                      className={cn(
                                        'rounded-full size-2',
                                        connectionStrengthOptions.find(
                                          (c) => c.value === field.value,
                                        )?.color,
                                      )}
                                    ></span>
                                    <span
                                      className={cn(
                                        'text-medium text-foreground',
                                      )}
                                    >
                                      {
                                        connectionStrengthOptions.find(
                                          (c) => c.value === field.value,
                                        )?.label
                                      }
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select connection...
                                  </span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[200px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder={
                                    field.value
                                      ? undefined
                                      : 'Select connection strength...'
                                  }
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No connection strength found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {connectionStrengthOptions.map(
                                      (strength) => (
                                        <CommandItem
                                          key={strength.value}
                                          value={strength.value}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setConnectionOpen(false);
                                          }}
                                        >
                                          <div className="inline-flex items-center gap-1.5">
                                            <span
                                              className={cn(
                                                'rounded-full size-2',
                                                strength.color,
                                              )}
                                            ></span>
                                            <span
                                              className={cn(
                                                'text-medium text-foreground',
                                              )}
                                            >
                                              {strength.label}
                                            </span>
                                          </div>
                                          {field.value === strength.value && (
                                            <CommandCheck />
                                          )}
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location ComboBox */}
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Popover
                            open={locationOpen}
                            onOpenChange={setLocationOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                mode="input"
                                aria-expanded={locationOpen}
                                className="w-full"
                              >
                                {field.value ? (
                                  <div className="inline-flex items-center gap-1.5">
                                    <span>
                                      {
                                        companies.find(
                                          (c) => c.id === field.value,
                                        )?.country
                                      }
                                      ,
                                    </span>
                                    <span>
                                      {
                                        companies.find(
                                          (c) => c.id === field.value,
                                        )?.city
                                      }
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select location...
                                  </span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[200px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search location..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No location found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {companies.map((company) => (
                                      <CommandItem
                                        key={company.id}
                                        value={company.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);
                                          setLocationOpen(false);
                                        }}
                                      >
                                        <div className="inline-flex items-center gap-1.5">
                                          <span>{company.country},</span>
                                          <span>{company.city}</span>
                                        </div>
                                        {field.value === company.id && (
                                          <CommandCheck />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category ComboBox */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Category</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Select the primary business category for this
                                company
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Popover
                            open={categoryOpen}
                            onOpenChange={setCategoryOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                mode="input"
                                placeholder={!field.value}
                                aria-expanded={categoryOpen}
                                className="w-full"
                              >
                                {field.value ? (
                                  <span className="inline-flex items-center gap-2.5">
                                    <span
                                      className={cn(
                                        'size-2 rounded-full',
                                        CATEGORIES.find(
                                          (c) =>
                                            c.id ===
                                            companies.find(
                                              (c) => c.id === field.value,
                                            )?.categoryIds?.[0],
                                        )?.bullet,
                                      )}
                                    ></span>
                                    <span className="truncate">
                                      {
                                        CATEGORIES.find(
                                          (c) =>
                                            c.id ===
                                            companies.find(
                                              (c) => c.id === field.value,
                                            )?.categoryIds?.[0],
                                        )?.name
                                      }
                                    </span>
                                  </span>
                                ) : (
                                  <span>Select category...</span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[200px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search category..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {CATEGORIES.map((category) => (
                                      <CommandItem
                                        key={category.id}
                                        value={category.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);
                                          setCategoryOpen(false);
                                        }}
                                      >
                                        <div className="inline-flex items-center gap-1.5">
                                          <span
                                            className={cn(
                                              'rounded-full size-2',
                                              category.bullet,
                                            )}
                                          ></span>
                                          <span
                                            className={cn(
                                              'text-medium text-foreground',
                                            )}
                                          >
                                            {category.name}
                                          </span>
                                        </div>
                                        {field.value === category.id && (
                                          <CommandCheck />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ARR ComboBox */}
                  <FormField
                    control={form.control}
                    name="estimatedArrId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Recurring Revenue (ARR)</FormLabel>
                        <FormControl>
                          <Popover open={arrOpen} onOpenChange={setArrOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={arrOpen}
                                className="w-full justify-between"
                              >
                                {field.value ? (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span
                                      className={cn(
                                        'rounded-full size-2',
                                        ESTIMATED_ARRS.find(
                                          (a) => a.id === field.value,
                                        )?.color.replace('50', '500'),
                                      )}
                                    ></span>
                                    <span
                                      className={cn(
                                        'text-medium text-foreground',
                                      )}
                                    >
                                      {
                                        ESTIMATED_ARRS.find(
                                          (a) => a.id === field.value,
                                        )?.name
                                      }
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select ARR
                                  </span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-[200px] p-0"
                            >
                              <Command>
                                <CommandInput placeholder="Search ARR..." />
                                <CommandEmpty>No ARR found.</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {ESTIMATED_ARRS.map((arr) => (
                                      <CommandItem
                                        key={arr.id}
                                        value={arr.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);
                                          setArrOpen(false);
                                        }}
                                      >
                                        <span className="inline-flex items-center gap-1.5">
                                          <span
                                            className={cn(
                                              'rounded-full size-2',
                                              arr.color.replace('50', '500'),
                                            )}
                                          ></span>
                                          <span
                                            className={cn(
                                              'text-medium text-foreground',
                                            )}
                                          >
                                            {arr.name}
                                          </span>
                                        </span>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Employee Size ComboBox */}
                  <FormField
                    control={form.control}
                    name="employeeRangeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee Range</FormLabel>
                        <FormControl>
                          <Popover
                            open={employeeOpen}
                            onOpenChange={setEmployeeOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={employeeOpen}
                                className="w-full justify-between"
                              >
                                {field.value ? (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span
                                      className={cn(
                                        'rounded-full size-2',
                                        EMPLOYEE_RANGES.find(
                                          (r) => r.id === field.value,
                                        )?.color.replace('50', '500'),
                                      )}
                                    ></span>
                                    <span
                                      className={cn(
                                        'text-medium text-foreground',
                                      )}
                                    >
                                      {
                                        EMPLOYEE_RANGES.find(
                                          (r) => r.id === field.value,
                                        )?.name
                                      }
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select Employee Range
                                  </span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-[200px] p-0"
                            >
                              <Command>
                                <CommandInput placeholder="Search Employee Range..." />
                                <CommandEmpty>
                                  No Employee Range found.
                                </CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {EMPLOYEE_RANGES.map((range) => (
                                      <CommandItem
                                        key={range.id}
                                        value={range.id}
                                        onSelect={(currentValue) => {
                                          field.onChange(currentValue);
                                          setEmployeeOpen(false);
                                        }}
                                      >
                                        <span className="inline-flex items-center gap-1.5">
                                          <span
                                            className={cn(
                                              'rounded-full size-2',
                                              range.color.includes('stone')
                                                ? 'bg-stone-500'
                                                : range.color.includes('red')
                                                  ? 'bg-red-500'
                                                  : range.color.includes(
                                                        'orange',
                                                      )
                                                    ? 'bg-orange-500'
                                                    : range.color.includes(
                                                          'yellow',
                                                        )
                                                      ? 'bg-yellow-500'
                                                      : range.color.includes(
                                                            'lime',
                                                          )
                                                        ? 'bg-lime-500'
                                                        : range.color.includes(
                                                              'green',
                                                            )
                                                          ? 'bg-green-500'
                                                          : range.color.includes(
                                                                'sky',
                                                              )
                                                            ? 'bg-sky-500'
                                                            : range.color.includes(
                                                                  'blue',
                                                                )
                                                              ? 'bg-blue-500'
                                                              : 'bg-gray-500',
                                            )}
                                          ></span>
                                          <span
                                            className={cn(
                                              'text-medium text-foreground',
                                            )}
                                          >
                                            {range.name}
                                          </span>
                                        </span>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
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
                        <div className="flex items-center gap-2">
                          <FormLabel>Email</FormLabel>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter the primary contact email address</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Domain ComboBox */}
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="Domain" {...field} />
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
                              (availabilityTime ? ` - ${availabilityTime}` : '')
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
                                setDate(newDate);
                                setAvailabilityTime(undefined);
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
                                    </p>
                                  </div>
                                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                                    {availabilityTimeSlots.map(
                                      ({ time: timeSlot, available }) => (
                                        <Button
                                          key={timeSlot}
                                          variant={
                                            availabilityTime === timeSlot
                                              ? 'primary'
                                              : 'outline'
                                          }
                                          size="sm"
                                          className="w-full"
                                          onClick={() =>
                                            setAvailabilityTime(timeSlot)
                                          }
                                          disabled={!available}
                                        >
                                          {timeSlot}
                                        </Button>
                                      ),
                                    )}
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
            </TooltipProvider>
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
            <Button onClick={form.handleSubmit(onSubmit, onError)}>
              Save Company
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
