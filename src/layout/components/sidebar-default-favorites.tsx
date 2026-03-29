'use client';

import * as React from 'react';
import { ChevronRight, File, Plus, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLayout } from './layout-context';

interface RecentItem {
  id: number;
  name: string;
  company: string;
}

const itemStyles =
  'group flex grow items-center justify-between gap-2.5 text-sm py-0 h-8 hover:bg-accent px-2 rounded-md';

function DefaultContent({ items }: { items: RecentItem[] }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="px-(--sidebar-space-x)"
    >
      <div className={itemStyles}>
        <CollapsibleTrigger className="flex grow items-center justify-start h-8 px-0 gap-2.5 text-sm text-muted-foreground hover:text-foreground">
          <ChevronRight className="ms-0.25 size-3.5 in-data-[state=open]:rotate-90 in-data-[sidebar-collapsed]:hidden" />
          <Star className="size-4 text-muted-foreground hidden in-data-[sidebar-collapsed]:block" />
          <span className="in-data-[sidebar-collapsed]:hidden">Favorites</span>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          className="hidden group-hover:flex text-muted-foregroun size-6 hover:bg-input hover:text-foreground group-has-[data-state=open]:inlin-flex"
          size="icon"
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <CollapsibleContent className="in-data-[sidebar-collapsed]:hidden">
        {items.map((item) => (
          <div key={item.id} className={itemStyles}>
            <Button
              variant="ghost"
              className="flex grow items-center justify-start h-8 px-0 gap-2.5 text-sm"
            >
              <File className="size-4 text-muted-foreground" />
              <span>{item.name}</span>
              <span className="text-muted-foreground">{item.company}</span>
            </Button>

            <Tooltip delayDuration={800}>
              <TooltipTrigger
                className="rounded-md opacity-0 group-hover:opacity-100"
                asChild
              >
                <Button
                  variant="ghost"
                  className="size-6 hover:bg-input"
                  size="icon"
                >
                  <StarOff className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                side="right"
                sideOffset={15}
                alignOffset={-2}
              >
                Remove favorite
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function CollapsedContent({ items }: { items: RecentItem[] }) {
  return (
    <div className="px-(--sidebar-space-x)">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Star />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center" side="right" sideOffset={20}>
              Favorite
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="right"
          sideOffset={10}
          alignOffset={0}
        >
          <DropdownMenuGroup>
            <div className="group flex grow items-center justify-between h-8 px-2">
              <div className="flex grow items-center justify-start h-8 px-0 gap-2.5 text-sm text-muted-foreground">
                <span className="in-data-[sidebar-collapsed]:hidden">
                  Favorites
                </span>
              </div>
              <Button
                variant="ghost"
                className="hidden group-hover:flex text-muted-foregroun size-6"
                size="icon"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem key={item.id} className={itemStyles}>
              <Button
                variant="ghost"
                className="flex grow items-center justify-start h-8 px-0 gap-2.5 text-sm"
              >
                <File className="size-4 text-muted-foreground" />
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.company}</span>
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    className="rounded-md opacity-0 group-hover:opacity-100"
                    asChild
                  >
                    <Button
                      variant="ghost"
                      className="size-6 hover:bg-input"
                      size="icon"
                    >
                      <StarOff className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    align="start"
                    side="right"
                    sideOffset={15}
                    alignOffset={-2}
                  >
                    Remove favorite
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function SidebarDefaultFavorites() {
  const { sidebarCollapse } = useLayout();
  const items = [
    {
      id: 1,
      name: 'New task',
      company: 'Keenthemes',
    },
    {
      id: 2,
      name: 'New deal',
      company: 'Google',
    },
    {
      id: 3,
      name: 'Recent note',
      company: 'Apple',
    },
    {
      id: 4,
      name: 'Lead added',
      company: 'OpenAI',
    },
  ];

  return sidebarCollapse ? (
    <CollapsedContent items={items} />
  ) : (
    <DefaultContent items={items} />
  );
}
