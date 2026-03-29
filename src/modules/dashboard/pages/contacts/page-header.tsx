import { useState } from 'react';
import {
  BarChart2,
  CalendarClock,
  Download,
  FileCheck2,
  FileText,
  History,
  Info,
  Plus,
  Share,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { ContentHeader } from '@/layout/components/content-header';
import { NewCompanySheet } from './new-contact-sheet';

export function PageHeader() {
  const [companySheetOpen, setCompanySheetOpen] = useState(false);

  const onCompanySheetOpenChange = (open: boolean) => {
    setCompanySheetOpen(open);
  };

  return (
    <ContentHeader className="space-x-2">
      <h1 className="inline-flex items-center gap-2.5 text-sm font-semibold">
        <Users className="size-4 text-primary" /> Contacts
      </h1>

      <div className="flex items-center gap-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <FileCheck2 />
              Reports
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[230px]">
            {/* Notifications Toggle */}
            <DropdownMenuItem
              className="justify-between text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <span>Enable Notifications</span>
              <Switch defaultChecked size="sm" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Add New User */}
            <DropdownMenuItem className="gap-2">
              <BarChart2 />
              <span>Generate Report</span>
            </DropdownMenuItem>

            {/* Send Invite Email */}
            <DropdownMenuItem className="gap-2">
              <CalendarClock />
              <span>Schedule Report</span>
            </DropdownMenuItem>

            {/* Set Roles */}
            <DropdownMenuItem className="gap-2">
              <History />
              <span>View Report History</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Export CSV */}
            <DropdownMenuItem className="gap-2">
              <Download />
              <span>Export view as CSV</span>
            </DropdownMenuItem>

            {/* Export Excel */}
            <DropdownMenuItem className="gap-2">
              <Share />
              <span>Export view as Excel</span>
            </DropdownMenuItem>

            {/* Import CSV */}
            <DropdownMenuItem className="gap-2">
              <FileText />
              <span>Import CSV</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Learn */}
            <DropdownMenuItem className="text-muted-foreground">
              <Info />
              <span className="text-sm">Learn more about Reports</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => setCompanySheetOpen(true)}>
          <Plus /> New Contact
        </Button>
        <NewCompanySheet
          open={companySheetOpen}
          onOpenChange={onCompanySheetOpenChange}
        />
      </div>
    </ContentHeader>
  );
}
