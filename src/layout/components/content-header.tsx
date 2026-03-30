import { PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLayout } from './layout-context';
import { useSecondarySidebarSlot } from './secondary-sidebar-slot-context';

export function ContentHeader({
                                  children,
                                  className,
                              }: {
    children: React.ReactNode;
    className?: string;
}) {
    const { setSidebarCollapse } = useLayout();
    const { isVisible: hasSecondarySidebar } = useSecondarySidebarSlot();

    return (
        <div className="bg-background flex items-center border-b lg:fixed top-[var(--header-height)] start-[var(--content-start)] in-data-[sidebar-collapsed]:start-[var(--content-start-collapsed)] end-0 z-[10] h-(--content-header-height) pe-[var(--removed-body-scroll-bar-size,0px)] transition-[left] duration-200 ease-in-out">
            <div className="container-fluid flex items-center">
                {!hasSecondarySidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden in-data-[sidebar-collapsed]:inline-flex -ms-2.5 me-1"
                        onClick={() => setSidebarCollapse(false)}
                    >
                        <PanelRightClose />
                    </Button>
                )}
                <div className={cn('flex items-center justify-between grow', className)}>
                    {children}
                </div>
            </div>
        </div>
    );
}