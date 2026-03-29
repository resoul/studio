/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { format } from 'date-fns';
import { CalendarIcon, CheckSquare, X } from 'lucide-react';
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
import { Badge, BadgeButton } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  estimatedArrId: z.string().optional(),
  employeeRangeId: z.string().optional(),
  assign: z.array(z.string()).optional(),
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
      estimatedArrId: '',
      employeeRangeId: '',
      assign: [],
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

  const users = [
    {
      id: 'alice-johnson',
      name: 'Alice Johnson',
      email: 'alice.johnson@gmail.com',
      avatar: '/media/avatars/300-1.png',
      status: 'online',
    },
    {
      id: 'bob-smith',
      name: 'Bob Smith',
      email: 'bob.smith@yahoo.com',
      avatar: '/media/avatars/300-2.png',
      status: 'offline',
    },
    {
      id: 'carol-davis',
      name: 'Carol Davis',
      email: 'carol.davis@hotmail.com',
      avatar: '/media/avatars/300-3.png',
      status: 'away',
    },
    {
      id: 'david-wilson',
      name: 'David Wilson',
      email: 'david.wilson@outlook.com',
      avatar: '/media/avatars/300-4.png',
      status: 'online',
    },
    {
      id: 'eve-martinez',
      name: 'Eve Martinez',
      email: 'eve.martinez@gmail.com',
      avatar: '/media/avatars/300-5.png',
      status: 'busy',
    },
    {
      id: 'frank-garcia',
      name: 'Frank Garcia',
      email: 'frank.garcia@icloud.com',
      avatar: '/media/avatars/300-6.png',
      status: 'online',
    },
    {
      id: 'grace-lee',
      name: 'Grace Lee',
      email: 'grace.lee@protonmail.com',
      avatar: '/media/avatars/300-7.png',
      status: 'busy',
    },
    {
      id: 'henry-walker',
      name: 'Henry Walker',
      email: 'henry.walker@gmail.com',
      avatar: '/media/avatars/300-8.png',
      status: 'online',
    },
  ];

  const [date] = useState<Date | undefined>(new Date(1984, 0, 20));

  // Docs: https://v1.reui.io/docs/date-picker#date--time
  const today = new Date();
  const [availabilityDate, setAvailabilityDate] = useState<Date | undefined>(
    today,
  );
  const [availabilityTime, setAvailabilityTime] = useState<string | undefined>(
    '10:00',
  );
  const availabilityTimeSlots = [
    { time: '09:00', available: false },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true },
    { time: '18:30', available: true },
    { time: '19:00', available: true },
    { time: '19:30', available: true },
    { time: '20:00', available: true },
    { time: '20:30', available: true },
    { time: '21:00', available: true },
    { time: '21:30', available: true },
    { time: '22:00', available: true },
    { time: '22:30', available: true },
    { time: '23:00', available: true },
    { time: '23:30', available: true },
    { time: '24:00', available: true },
  ];

  const [taskOpen, setTaskOpen] = React.useState(false);
  const taskOptions = [
    {
      value: 'high',
      label: 'High',
      state: 'bg-red-500',
    },
    {
      value: 'medium',
      label: 'Medium',
      state: 'bg-yellow-500',
    },
    {
      value: 'low',
      label: 'Low',
      state: 'bg-green-500',
    },
  ];

  const [statusOpen, setStatusOpen] = React.useState(false);
  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending',
      state: 'bg-yellow-500',
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      state: 'bg-blue-500',
    },
    {
      value: 'completed',
      label: 'Completed',
      state: 'bg-green-500',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="flex items-center gap-2.5">
            <CheckSquare className="text-primary size-4" />
            New Task
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="p-0">
          <ScrollArea className="h-[calc(100dvh-11.75rem)] ps-3 pe-2 me-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 px-2"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Task</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder="Enter task details..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assign */}
                <FormField
                  control={form.control}
                  name="assign"
                  render={({ field }) => {
                    const [open, setOpen] = useState(false);
                    const [selectedValues, setSelectedValues] = useState<
                      string[]
                    >(Array.isArray(field.value) ? field.value : []);

                    const toggleSelection = (value: string) => {
                      const newValues = selectedValues.includes(value)
                        ? selectedValues.filter((v) => v !== value)
                        : [...selectedValues, value];
                      setSelectedValues(newValues);
                      field.onChange(newValues);
                    };

                    const removeSelection = (value: string) => {
                      const newValues = selectedValues.filter(
                        (v) => v !== value,
                      );
                      setSelectedValues(newValues);
                      field.onChange(newValues);
                    };

                    return (
                      <FormItem>
                        <FormLabel>Assign</FormLabel>
                        <FormControl>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                mode="input"
                                aria-expanded={!!open}
                                autoHeight={true}
                                placeholder={!field.value}
                                className="w-full"
                              >
                                {selectedValues.length === 0 && (
                                  <span className="text-muted-foreground">
                                    Select user...
                                  </span>
                                )}
                                <div className="flex gap-1 pe-2.5">
                                  {selectedValues.length > 0 ? (
                                    selectedValues.map((val) => {
                                      const user = users.find(
                                        (u) => u.id === val,
                                      );
                                      return user ? (
                                        <Badge
                                          key={val}
                                          variant="outline"
                                          className="gap-1.5 pe-1"
                                        >
                                          <Avatar className="size-3.5">
                                            <AvatarImage
                                              src={user.avatar}
                                              alt={user.name}
                                            />
                                            <AvatarFallback className="text-xs">
                                              {user.name[0]}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="font-medium">
                                            {user.name}
                                          </span>
                                          <BadgeButton
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeSelection(val);
                                            }}
                                          >
                                            <X />
                                          </BadgeButton>
                                        </Badge>
                                      ) : null;
                                    })
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-[350px] p-0"
                            >
                              <Command>
                                <CommandInput placeholder="Search user..." />
                                <CommandList>
                                  <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                    <CommandEmpty>No users found.</CommandEmpty>
                                    <CommandGroup>
                                      {users.map((user) => (
                                        <CommandItem
                                          key={user.id}
                                          value={user.name}
                                          onSelect={() =>
                                            toggleSelection(user.id)
                                          }
                                        >
                                          <div className="flex items-center gap-2">
                                            <Avatar className="size-7">
                                              <AvatarImage
                                                src={user.avatar}
                                                alt={user.name}
                                              />
                                              <AvatarFallback>
                                                {user.name[0]}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <Link
                                                to={`#`}
                                                className="hover:text-primary"
                                              >
                                                {user.name}
                                              </Link>
                                              <span className="text-muted-foreground text-xs">
                                                {user.email}
                                              </span>
                                            </div>
                                          </div>
                                          {selectedValues.includes(user.id) && (
                                            <CommandCheck />
                                          )}
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
                    );
                  }}
                />

                {/* Task ComboBox */}
                <FormField
                  control={form.control}
                  name="estimatedArrId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Popover open={taskOpen} onOpenChange={setTaskOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              mode="input"
                              placeholder={!field.value}
                              aria-expanded={taskOpen}
                              className="w-full"
                            >
                              {field.value ? (
                                <span className="flex items-center gap-2.5">
                                  <span
                                    className={cn(
                                      'ms-0.5 size-1.5 rounded-full',
                                      taskOptions.find(
                                        (p) => p.value === field.value,
                                      )?.state,
                                    )}
                                  ></span>
                                  <span className="truncate">
                                    {
                                      taskOptions.find(
                                        (p) => p.value === field.value,
                                      )?.label
                                    }
                                  </span>
                                </span>
                              ) : (
                                <span>Select task...</span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-0"
                            side="bottom"
                            align="start"
                            sideOffset={0}
                            alignOffset={0}
                            avoidCollisions={true}
                            collisionPadding={8}
                          >
                            <Command>
                              <CommandList>
                                <CommandEmpty>
                                  No priorities found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {taskOptions.map((task) => (
                                    <CommandItem
                                      key={task.value}
                                      value={task.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setTaskOpen(false);
                                      }}
                                    >
                                      <span className="flex items-center gap-2.5">
                                        <span
                                          className={cn(
                                            'ms-0.5 size-1.5 rounded-full',
                                            task.state,
                                          )}
                                        ></span>
                                        <span className="truncate">
                                          {task.label}
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

                {/* Status ComboBox */}
                <FormField
                  control={form.control}
                  name="employeeRangeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              mode="input"
                              placeholder={!field.value}
                              aria-expanded={statusOpen}
                              className="w-full"
                            >
                              {field.value ? (
                                <span className="flex items-center gap-2.5">
                                  <span
                                    className={cn(
                                      'ms-0.5 size-1.5 rounded-full',
                                      statusOptions.find(
                                        (r) => r.value === field.value,
                                      )?.state,
                                    )}
                                  ></span>
                                  <span className="truncate">
                                    {
                                      statusOptions.find(
                                        (r) => r.value === field.value,
                                      )?.label
                                    }
                                  </span>
                                </span>
                              ) : (
                                <span>Select status...</span>
                              )}
                              <ButtonArrow />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[200px] p-0"
                            side="bottom"
                            align="start"
                            sideOffset={0}
                            alignOffset={0}
                            avoidCollisions={true}
                            collisionPadding={8}
                          >
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {statusOptions.map((range) => (
                                    <CommandItem
                                      key={range.value}
                                      value={range.value}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setStatusOpen(false);
                                      }}
                                    >
                                      <span className="flex items-center gap-2.5">
                                        <span
                                          className={cn(
                                            'ms-0.5 size-1.5 rounded-full',
                                            range.state,
                                          )}
                                        ></span>
                                        <span className="truncate">
                                          {range.label}
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
            <Button onClick={onSubmit}>Save Task</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
