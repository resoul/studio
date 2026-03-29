import { useState } from 'react';
import { COMPANIES } from '@/modules/dashboard/mock/companies';
import { CONNECTION_STRENGTHS } from '@/modules/dashboard/mock/connection-strengths';
import { Company } from '@/modules/dashboard/types/company';
import { ConnectionStrength } from '@/modules/dashboard/types/connection-strength';
import {
  BellPlus,
  CalendarCheck,
  CalendarSync,
  CircleX,
  Clock,
  EllipsisVertical,
  Flag,
  Handshake,
  LayoutDashboard,
  MapPin,
  MessageSquareText,
  Phone,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CompanyRecordsOverviewHighlights() {
  const [company] = useState<Company>({ ...COMPANIES[0] });
  const connectionStrength = CONNECTION_STRENGTHS.find(
    (item: ConnectionStrength) => item.id === company.connectionStrengthId,
  );

  return (
    <div className="space-y-3.5">
      <h3 className="ms-1 flex items-center gap-1.5 text-sm font-semibold">
        <LayoutDashboard className="size-3.5 opacity-60" />
        Highlights
      </h3>

      <div className="flex gap-4">
        {/* Upcoming Payment */}
        <Card className="w-72 shadow-none">
          <CardHeader className="p-2.5 py-0 min-h-10 border-0">
            <CardTitle className="text-2sm font-normal">
              Connection Strength
            </CardTitle>
            <CardToolbar>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Button variant="ghost" size="sm" mode="icon">
                    <EllipsisVertical className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom">
                  <DropdownMenuItem>
                    <MessageSquareText />
                    <span>Message</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="size-3.5" />
                    <span>Call</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CalendarCheck />
                    <span>Schedule Meeting</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardToolbar>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-1 space-y-2">
            <div className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  'rounded-full size-2 mx-0.5',
                  connectionStrength?.color,
                )}
              ></span>
              <span className={cn('font-semibold text-foreground')}>
                {connectionStrength?.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Handshake className="size-3.5 text-muted-foreground shrink-0" />
              <Link
                to="#"
                className="font-medium text-foreground hover:text-primary"
              >
                Mike Johnson
              </Link>
            </div>
          </CardContent>
        </Card>
        {/* Last Interaction */}
        <Card className="w-72 shadow-none">
          <CardHeader className="p-2.5 py-0 min-h-10 border-0">
            <CardTitle className="text-2sm font-normal">Appointments</CardTitle>
            <CardToolbar>
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Button variant="ghost" size="sm" mode="icon">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom">
                  <DropdownMenuItem>
                    <CalendarSync className="size-3.5" />
                    <span>Reschedule</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserPlus className="size-3.5" />
                    <span>Invite Participants</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BellPlus className="size-3.5" />
                    <span>Send Reminder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <CircleX className="size-3.5" />
                    <span>Cancel</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardToolbar>
          </CardHeader>
          <CardContent className="px-2.5 pb-2.5 pt-1 space-y-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flag className="size-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">On-Site Esmiation</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                <span className="font-medium">456 Square Avenue, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-muted-foreground shrink-0" />
                <Badge size="sm" variant="success" appearance="light">
                  14:30 AM - 15:30 AM
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
