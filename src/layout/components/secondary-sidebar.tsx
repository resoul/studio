import { PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLayout } from './layout-context';
import { useSecondarySidebarSlot } from './secondary-sidebar-slot-context';

export function SecondarySidebar() {
    const { slots, isVisible } = useSecondarySidebarSlot();
    const { setSidebarCollapse } = useLayout();

    if (!isVisible) return null;

    return (
        <aside
            className={cn(
                'flex flex-col fixed z-[10] start-[var(--sidebar-width)] in-data-[sidebar-collapsed]:start-(--sidebar-width-collapsed) top-[var(--header-height)] bottom-0',
                'w-(--secondary-sidebar-width) bg-background border-e border-border',
                'transition-[left] duration-200 ease-in-out',
            )}
        >
            <div className="group flex justify-between items-center gap-2.5 border-b border-border h-11 lg:h-(--sidebar-header-height) shrink-0 px-2.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden in-data-[sidebar-collapsed]:inline-flex top-[calc((var(--content-header-height)-2rem)/2)] start-2 z-10"
                    onClick={() => setSidebarCollapse(false)}
                >
                    <PanelRightClose />
                </Button>

                {slots.header}
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                {slots.content}
            </div>
            {slots.footer}
        </aside>
    );
}