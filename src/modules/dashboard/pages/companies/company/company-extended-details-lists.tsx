import { useState } from 'react';
import { ChevronRight, ListPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function CompanyExtendedDetailsLists() {
  const [isListsOpen, setIsListsOpen] = useState(true);

  return (
    <div>
      <Collapsible
        className="space-y-2 relative"
        open={isListsOpen}
        onOpenChange={setIsListsOpen}
      >
        <div className="flex items-center justify-between gap-2.5">
          <CollapsibleTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="text-sm text-semibold [&:not(:hover)[data-state=open]]:bg-transparent hover:bg-accent ps-1.5 -ms-1.5"
            >
              <ChevronRight className="[[data-state=open]_&]:rotate-90" />
              Lists
            </Button>
          </CollapsibleTrigger>

          <div className="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost">
                  <ListPlus />
                  Add to list
                </Button>
              </TooltipTrigger>
              <TooltipContent align="center" side="left">
                Add to list
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <CollapsibleContent>
          <div className="text-muted-foreground">
            This record has not been added to any lists
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
