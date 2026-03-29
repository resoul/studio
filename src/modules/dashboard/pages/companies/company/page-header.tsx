import * as React from 'react';
import { COMPANIES } from '@/modules/dashboard/mock/companies';
import {
  BarChart2,
  CalendarClock,
  CheckCircle,
  Download,
  FileCheck2,
  FilePlus,
  FileText,
  History,
  Info,
  ListPlus,
  Share,
  SquareCheckBig,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ContentHeader } from '@/layout/components/content-header';

export function PageHeader() {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [company] = React.useState({ ...COMPANIES[0] });

  const handleStarClick = () => {
    setIsFavorite(!isFavorite);
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          onClose={() => toast.dismiss(t)}
          className="mt-4.5"
        >
          <AlertIcon>
            <CheckCircle />
          </AlertIcon>
          <AlertTitle>Company marked as favorite</AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
        position: 'top-center',
      },
    );
  };

  return (
    <ContentHeader>
      <h1 className="inline-flex items-center gap-1.5 text-md font-semibold">
        <Avatar className="size-8">
          <AvatarImage src={toAbsoluteUrl(company.logo || '')} alt="company" />
          <AvatarFallback>{company.name[0]}</AvatarFallback>
        </Avatar>
        <span>{company.name}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="dim" size="sm" onClick={handleStarClick}>
                <Star
                  className={
                    isFavorite ? 'text-yellow-500 fill-yellow-500' : ''
                  }
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Mark as favorite company
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h1>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" mode="icon" size="sm">
                <ListPlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add company to a list</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" mode="icon" size="sm">
                <FilePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New note</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" mode="icon" size="sm">
                <SquareCheckBig />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New task</TooltipContent>
          </Tooltip>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
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
      </div>
    </ContentHeader>
  );
}
