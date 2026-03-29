import * as React from 'react';
import { Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CompanyRecordsOverviewActivity() {
  const [isActivityOpen, setIsActivityOpen] = React.useState(true);

  return (
    <Collapsible
      className="space-y-2 relative"
      open={isActivityOpen}
      onOpenChange={setIsActivityOpen}
    >
      <div className="flex items-center justify-between gap-2.5">
        <CollapsibleTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-sm text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent ps-1.5"
          >
            <Activity />
            Activity
            <ChevronRight className="[[data-state=open]_&]:rotate-90" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <Tabs
          defaultValue="today"
          className="text-sm text-muted-foreground end-0 top-0 absolute z-1"
        >
          <TabsList
            variant="button"
            size="xs"
            className="[&_button]:text-muted-foreground"
          >
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="shadow-none">
          <CardContent className="space-y-3 p-3.5">
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarImage
                    src={toAbsoluteUrl('/media/avatars/300-1.png')}
                    alt="John Doe"
                  />
                </Avatar>
                <div className="flex items-center gap-1">
                  <Link to="#" className="font-medium hover:text-primary">
                    John Doe
                  </Link>
                  <span className="text-muted-foreground">changed</span>
                  <Link
                    to="#"
                    className="text-mono font-medium hover:text-primary"
                  >
                    Project Status
                  </Link>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  5 days ago
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarFallback>AF</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <Link
                    to="#"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Ana Fisher
                  </Link>
                  <span className="text-muted-foreground">added</span>
                  <Link
                    to="#"
                    className="text-mono font-medium hover:text-primary"
                  >
                    Meeting Notes
                  </Link>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  3 days ago
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarImage
                    src={toAbsoluteUrl('/media/avatars/300-3.png')}
                    alt="Mike Johnson"
                  />
                </Avatar>

                <div className="flex items-center gap-1">
                  <Link
                    to="#"
                    className="font-medium text-foreground hover:text-primary"
                  >
                    Mike Johnson
                  </Link>
                  <span className="text-muted-foreground">added</span>
                  <Link
                    to="#"
                    className="text-mono font-medium hover:text-primary"
                  >
                    Task Update
                  </Link>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  1 day ago
                </span>
              </li>
            </ul>
            <div className="flex justify-start">
              <Button mode="link" underline="solid" asChild>
                <Link to="#">View all</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
