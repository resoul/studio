import { Outlet } from 'react-router';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Header } from './header';
import { useLayout } from './layout-context';
import { Sidebar } from './sidebar';
import { Helmet } from '@packages/react-helmet-async';
import { SecondarySidebar } from './secondary-sidebar';
import { useSecondarySidebarSlot } from './secondary-sidebar-slot-context';
import { useTranslation } from '@/hooks/useTranslation';

export function Layout() {
    const { sidebarCollapse } = useLayout();
    const { isVisible: hasSecondarySidebar } = useSecondarySidebarSlot();
    const isMobile = useIsMobile();
    const { t } = useTranslation();

    const rootProps = {
        className: cn(
            'flex grow h-screen flex-col',
            '[--header-height:40px]',
            '[--content-header-height:54px]',
            '[--sidebar-width:250px] [--sidebar-width-collapsed:52px] [--sidebar-header-height:54px] [--sidebar-footer-height:45px] [--sidebar-footer-collapsed-height:90px]',
            '[--secondary-sidebar-width:250px]',
            hasSecondarySidebar
                ? '[--content-start:calc(var(--sidebar-width)+var(--secondary-sidebar-width))] [--content-start-collapsed:calc(var(--sidebar-width-collapsed)+var(--secondary-sidebar-width))]'
                : '[--content-start:var(--sidebar-width)] [--content-start-collapsed:var(--sidebar-width-collapsed)]',
        ),
        ...((sidebarCollapse && { 'data-sidebar-collapsed': true })),
    };

    return (
        <>
            <Helmet>
                <title>{t('layout.title')}</title>
            </Helmet>
            <div {...rootProps}>
                <Header />
                <div className="flex flex-1">
                    {!isMobile && <Sidebar />}
                    {!isMobile && <SecondarySidebar />}
                    <main
                        className={cn(
                            'flex-1 flex flex-col mt-(--header-height)',
                            'lg:mt-[calc(var(--header-height)+var(--content-header-height))]',
                            'lg:ms-(--sidebar-width) lg:in-data-[sidebar-collapsed]:ms-(--sidebar-width-collapsed)',
                            hasSecondarySidebar && 'lg:ps-(--secondary-sidebar-width)',
                            'transition-[margin,padding] duration-200 ease-in-out',
                        )}
                    >
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}
