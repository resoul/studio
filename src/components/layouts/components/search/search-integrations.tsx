import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
} from '@/components/ui/accordion-menu';
import { Button } from '@/components/ui/button';
import { AvatarGroup } from '@/components/layouts/components/avatar-group';
import { type SearchIntegrationsItem } from './types';

export function SearchIntegrations({
  items,
  more,
}: {
  items: SearchIntegrationsItem[];
  more?: boolean;
}) {
  return (
    <AccordionMenu
      type="single"
      collapsible
      classNames={{
        separator: '-mx-2 mb-2.5',
      }}
    >
      <AccordionMenuGroup>
        <div className="grid gap-2 px-2">
          {items.map((item, index) => (
            <AccordionMenuItem key={index} value={item.name} asChild>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center grow gap-2">
                  {/* Logo */}
                  <div className="flex items-center justify-center size-10 shrink-0 rounded-full border border-border bg-accent/60">
                    <img
                      src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
                      className="size-6 shrink-0"
                      alt={item.name}
                    />
                  </div>

                  {/* Name and description */}
                  <div className="flex flex-col gap-0.5">
                    <Link
                      to="#"
                      className="text-sm font-semibold text-mono hover:text-primary-active"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs font-medium text-secondary-foreground">
                      {item.description}
                    </span>
                  </div>
                </div>

                {/* Team avatars */}
                <div className="flex justify-end shrink-0">
                  <AvatarGroup group={item.team} />
                </div>
              </div>
            </AccordionMenuItem>
          ))}
        </div>
        {!more || (
          <AccordionMenuItem className="px-4 pt-2" value={''}>
            <Button variant="outline" className="mx-auto w-full max-w-full">
              Go to Users
            </Button>
          </AccordionMenuItem>
        )}
      </AccordionMenuGroup>
    </AccordionMenu>
  );
}
