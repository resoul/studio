import { EMPLOYEE_RANGES } from '@/modules/dashboard/mock/employee-ranges';
import { ESTIMATED_ARRS } from '@/modules/dashboard/mock/estimated-arrs';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { format } from 'date-fns';
import { Building2, Calendar as CalendarIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import CountryCombobox from './country-combobox';

// Optionally import types if needed
// import { EstimatedArr } from '@/modules/dashboard/types/estimated-arr';
// import { EmployeeRange } from '@/modules/dashboard/types/employee-range';
// import { Company } from '@/modules/dashboard/types/company';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
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

export function NewDealSheet({
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="flex items-center gap-2.5">
            <Building2 className="text-primary size-4" />
            New Company
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Domain */}
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="info@company.com" {...field} />
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
                {/* Address, City, State, Zip */}
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip</FormLabel>
                        <FormControl>
                          <Input placeholder="Zip" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Country Combobox */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <CountryCombobox
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
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
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ARR" />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTIMATED_ARRS.map((arr) => (
                              <SelectItem
                                key={arr.id}
                                value={arr.id}
                                className="flex items-center gap-2"
                              >
                                <Badge className={cn('shrink-0', arr.color)}>
                                  {arr.name}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Employee Size</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Employee Range" />
                          </SelectTrigger>
                          <SelectContent>
                            {EMPLOYEE_RANGES.map((range) => (
                              <SelectItem key={range.id} value={range.id}>
                                <Badge className={cn('shrink-0', range.color)}>
                                  {range.name}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Socials */}
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="LinkedIn URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="angelList"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AngelList</FormLabel>
                        <FormControl>
                          <Input placeholder="AngelList URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="Facebook URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="Instagram URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telegram</FormLabel>
                        <FormControl>
                          <Input placeholder="Telegram URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <FormControl>
                          <Input placeholder="X (Twitter) URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Founded At */}
                <FormField
                  control={form.control}
                  name="foundedAt"
                  render={({ field }) => {
                    const date = field.value
                      ? new Date(field.value)
                      : undefined;
                    return (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="relative w-full">
                                <Button
                                  type="button"
                                  variant="outline"
                                  mode="input"
                                  className="w-full justify-start text-left"
                                >
                                  <CalendarIcon className="me-2 size-4" />
                                  {date ? (
                                    <span>{format(date, 'PPP')}</span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Pick a date
                                    </span>
                                  )}
                                </Button>
                                {date && (
                                  <Button
                                    type="button"
                                    variant="dim"
                                    size="sm"
                                    className="absolute top-1/2 -end-0 -translate-y-1/2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      field.onChange('');
                                    }}
                                  >
                                    <X className="size-4" />
                                  </Button>
                                )}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(selected) =>
                                  field.onChange(
                                    selected ? selected.toISOString() : '',
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
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
            <Button onClick={onSubmit}>Add company</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
