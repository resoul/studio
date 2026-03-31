'use client';

import { useRef, useState } from 'react';
import { addDays, format } from 'date-fns';
import { ChevronDown, PlusIcon, Upload } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { OrderListTable } from '../../tables/order-list';
import { OrderDetailsSheet } from '../../components/order-details-sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CategoryFormSheet } from '../../components/category-form-sheet';

export function OrderListProducts() {
  // Date range picker state
  const today = new Date();
  const defaultDateRange: DateRange = {
    from: addDays(today, -30), // Show last 30 days by default
    to: today,
  };
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    defaultDateRange,
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const isApplyingRef = useRef(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Date range picker handlers
  const handleDateRangeApply = () => {
    isApplyingRef.current = true;
    if (tempDateRange) {
      setDateRange(tempDateRange);
    }
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeReset = () => {
    isApplyingRef.current = true;
    setTempDateRange(defaultDateRange);
    setDateRange(defaultDateRange);
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeCancel = () => {
    isApplyingRef.current = true;
    // Reset temp state to actual state when canceling
    setTempDateRange(dateRange);
    setIsDatePickerOpen(false);
    setTimeout(() => {
      isApplyingRef.current = false;
    }, 100);
  };

  const handleDateRangeSelect = (selected: DateRange | undefined) => {
    setTempDateRange({
      from: selected?.from || undefined,
      to: selected?.to || undefined,
    });
  };
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  
  return (
    <div className="container-fluid space-y-5 lg:space-y-9">
      <div className="flex items-center flex-wrap gap-2 justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-foreground">Order List</h1>
          <span className="text-sm text-muted-foreground">
            435 orders found. 62 orders needs your attention.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <Popover
            open={isDatePickerOpen}
            onOpenChange={(open) => {
              if (open) {
                // Sync temp state with actual state when opening
                setTempDateRange(dateRange);
                setIsDatePickerOpen(open);
              } else if (!isApplyingRef.current) {
                // Only handle cancel if we're not in the middle of applying/resetting
                setTempDateRange(dateRange);
                setIsDatePickerOpen(open);
              }
            }}
          >
            <PopoverTrigger asChild>
              <Button type="button" variant="outline">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'MMM dd')} -{' '}
                      {format(dateRange.to, 'MMM dd, yyyy')}
                    </>
                  ) : (
                    format(dateRange.from, 'MMM dd, yyyy')
                  )
                ) : (
                  <span>2 June - 9 June</span>
                )}
                <ChevronDown className="size-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={tempDateRange?.from || dateRange?.from}
                showOutsideDays={false}
                selected={tempDateRange} // <-- Only temp
                onSelect={handleDateRangeSelect} // <-- Updates temp only
                numberOfMonths={2}
              />
              <div className="flex items-center justify-between border-t border-border p-3">
                <Button variant="outline" onClick={handleDateRangeReset}>
                  Reset
                </Button>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" onClick={handleDateRangeCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleDateRangeApply}>Apply</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover> 
          
          <Button variant="outline" className="gap-2 shrink-0">
            <Upload className="h-4 w-4" />
            Import
          </Button>

          {/* Select */}
          <Select defaultValue="more-actions" indicatorPosition="right">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="More Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="more-actions">More Actions</SelectItem>
              <SelectItem value="order-tracking">Order Tracking</SelectItem>
              <SelectItem value="view-shipping-label">View Shipping Label</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="mono" onClick={() => setIsCreateCategoryOpen(true)}>
            <PlusIcon />
            New Order
          </Button>
        </div>
      </div>
      
      <OrderListTable displayProducts={true} />

      <OrderDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
      <CategoryFormSheet
        mode="new"  
        open={isCreateCategoryOpen}
        onOpenChange={setIsCreateCategoryOpen}
      />
    </div>
  );
}
