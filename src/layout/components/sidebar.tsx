'use client';

import { cn } from '@/lib/utils';
import { SidebarContent } from './sidebar-content';

export function Sidebar() {
  return (
    <aside
      className={cn(
        'flex flex-col fixed z-[10] start-0 top-[var(--header-height)] bottom-0 w-(--sidebar-width) in-data-[sidebar-collapsed]:w-(--sidebar-width-collapsed) bg-background border-e border-border',
        '[--sidebar-space-x:calc(var(--spacing)*2.5)]',
        'transition-[width] duration-200 ease-in-out',
      )}
    >
      <SidebarContent />
    </aside>
  );
}
