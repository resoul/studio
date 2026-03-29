import * as React from 'react';
import { ChevronRight, GalleryVerticalEnd, Plus } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function CompanyRecordsOverviewNotes() {
  const [isNotesOpen, setIsNotesOpen] = React.useState(true);

  return (
    <Collapsible
      className="space-y-2"
      open={isNotesOpen}
      onOpenChange={setIsNotesOpen}
    >
      <div className="flex items-center justify-between gap-2.5">
        <CollapsibleTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-sm text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent ps-1.5"
          >
            <GalleryVerticalEnd />
            Notes
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
            <TooltipContent side="top">Add note</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CollapsibleContent>
        <Card className="shadow-none">
          <CardContent className="space-y-3 p-3.5">
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarImage
                    src={toAbsoluteUrl('/media/avatars/300-12.png')}
                    alt="Cody Fisher"
                  />
                </Avatar>
                <Link
                  to="#"
                  className="font-medium text-foreground hover:text-primary w-[100px] shrink-0"
                >
                  Cody Fisher
                </Link>
                <Link to="#" className="font-medium hover:text-primary">
                  Untitled note
                </Link>
                <span className="text-muted-foreground">
                  This note has no content
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  13 days ago
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <Link
                  to="#"
                  className="font-medium text-foreground hover:text-primary w-[100px] shrink-0"
                >
                  John Smith
                </Link>
                <Link to="#" className="font-medium hover:text-primary">
                  Project Update
                </Link>
                <span className="text-muted-foreground">
                  Updated project timeline and milestones
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  10 days ago
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-6">
                  <AvatarImage
                    src={toAbsoluteUrl('/media/avatars/300-5.png')}
                    alt="Sarah Wilson"
                  />
                </Avatar>
                <Link
                  to="#"
                  className="font-medium text-foreground hover:text-primary w-[100px] shrink-0"
                >
                  Sarah Wilson
                </Link>
                <Link to="#" className="font-medium hover:text-primary">
                  Team Meeting
                </Link>
                <span className="text-muted-foreground">
                  Discussed team performance and goals
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  8 days ago
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
