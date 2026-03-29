import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarDefaultFavorites } from './sidebar-default-favorites';
import { SidebarDefaultNav } from './sidebar-default-nav';

export function SidebarDefaultContent() {
  return (
    <div className="grow">
      <ScrollArea className="h-[calc(100vh-(var(--header-height))-(var(--content-header-height))-(var(--sidebar-footer-height)))] in-data-[sidebar-collapsed]:h-[calc(100vh-(var(--header-height))-(var(--content-header-height))-(var(--sidebar-footer-collapsed-height)))]">
        <div className="py-3.5 space-y-3.5">
          <SidebarDefaultNav />
          <SidebarDefaultFavorites />
        </div>
      </ScrollArea>
    </div>
  );
}
