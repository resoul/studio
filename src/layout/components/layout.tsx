import { Outlet } from 'react-router';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Header } from './header';
import { useLayout } from './layout-context';
import { Sidebar } from './sidebar';

export function Layout() {
  const { sidebarCollapse } = useLayout();
  const isMobile = useIsMobile();

  const rootProps = {
    className: cn(
      'flex grow h-screen flex-col',
      '[--header-height:40px]',
      '[--content-header-height:54px]',
      '[--sidebar-width:250px] [--sidebar-width-collapsed:52px] [--sidebar-header-height:54px] [--sidebar-footer-height:45px] [--sidebar-footer-collapsed-height:90px]',
    ),
    ...((sidebarCollapse && {'data-sidebar-collapsed': true})),
  };

  return (
    <div {...rootProps}>
      <Header />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />}
        <main className="flex-1 flex flex-col mt-(--header-height) lg:mt-[calc(var(--header-height)+var(--content-header-height))] lg:ms-(--sidebar-width) lg:in-data-[sidebar-collapsed]:ms-(--sidebar-width-collapsed) transition-[margin] duration-200 ease-in-out">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
