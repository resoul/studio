import * as React from 'react';
import {
  Calendar,
  ChevronRight,
  ListTodo,
  Plus,
  User,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function CompanyRecordsOverviewTasks() {
  const [isTasksOpen, setIsTasksOpen] = React.useState(true);

  return (
    <Collapsible
      className="space-y-2 mb-5"
      open={isTasksOpen}
      onOpenChange={setIsTasksOpen}
    >
      <div className="flex items-center justify-between gap-2.5">
        <CollapsibleTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-sm text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent ps-1.5"
          >
            <ListTodo />
            Tasks
            <ChevronRight className="[[data-state=open]_&]:rotate-90" />
          </Button>
        </CollapsibleTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" size="sm" mode="icon">
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Add task</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CollapsibleContent>
        <Card className="shadow-none">
          <CardContent className="space-y-4 p-3.5">
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-1 text-sm">
                <Checkbox size="sm" className="mt-[1px] me-1" />
                <Link to="#" className="font-medium hover:text-primary">
                  @Keenthemes
                </Link>
                <span className="text-muted-foreground">completed a task</span>
                <div className="ms-auto flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          size="sm"
                          className="cursor-pointer"
                        >
                          <Users className="size-3.5" /> 2 People
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="p-2 flex gap-3.5">
                        <div className="flex items-center gap-1">
                          <Avatar className="size-4">
                            <AvatarImage
                              src={toAbsoluteUrl('/media/avatars/300-1.png')}
                              alt="John Doe"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">Ana Smith</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Avatar className="size-4">
                            <AvatarImage
                              src={toAbsoluteUrl('/media/avatars/300-5.png')}
                              alt="John Doe"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">John Doe</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Badge appearance="light" size="sm" variant="destructive">
                    <Calendar className="size-3.5" /> May 14, 2025
                  </Badge>
                </div>
              </li>
              <li className="flex items-center gap-1 text-sm">
                <Checkbox size="sm" className="mt-[1px] me-1" defaultChecked />
                <Link to="#" className="font-medium hover:text-primary">
                  @Tbg
                </Link>
                <span className="text-muted-foreground">added new task</span>
                <div className="ms-auto flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    <User className="size-3.5" /> Alex Thompson
                  </Badge>
                  <Badge variant="secondary" size="sm">
                    <Calendar className="size-3.5 opacity-60" /> July 27, 2025
                  </Badge>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
