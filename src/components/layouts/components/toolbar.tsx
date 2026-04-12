import { Fragment, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR_MAIN } from '@/config/config';
import { useMenu } from '@/hooks/use-menu';
import type { MenuItem } from '@/config/types';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface ToolbarHeadingProps {
  title?: string | ReactNode;
  description?: string | ReactNode;
}

function Toolbar({ children }: { children?: ReactNode }) {
  return (
    <div className="py-2.5 lg:py-0 lg:fixed top-(--header-height) start-[calc(var(--sidebar-width))] lg:in-data-[sidebar-open=false]:start-[calc(var(--sidebar-collapsed-width))] transition-all duration-300 end-0 z-10 px-5 flex flex-wrap items-center justify-between gap-2.5 min-h-(--toolbar-height) bg-background border-b border-border shrink-0">
      {children}
    </div>
  );
}

function ToolbarActions({ children }: { children?: ReactNode }) {
  return <div className="flex items-center gap-2.5">{children}</div>;
}

function ToolbarBreadcrumbs() {
  const { pathname } = useLocation();
  const { getBreadcrumb } = useMenu(pathname);
  const items: MenuItem[] = getBreadcrumb(MENU_SIDEBAR_MAIN);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="#">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              {index !== items.length - 1 && <BreadcrumbSeparator className="text-xs text-muted-foreground">/</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {!isLast ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.path || '#'}>{item.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>              
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function ToolbarHeading ({ children }: { children: ReactNode }) {
  return <div className="flex flex-col md:flex-row md:items-center flex-wrap gap-1 lg:gap-5">{children}</div>;
}

function ToolbarPageTitle ({ children }: { children?: string }) {
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR_MAIN);

  return (
    <h1 className="text-base font-medium leading-none text-foreground">
      {children ? children : item?.title || 'Untitled'}
    </h1>
  );
};

function ToolbarDescription ({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
      {children}
    </div>
  );
};

export {
  Toolbar,
  ToolbarActions,
  ToolbarBreadcrumbs,
  ToolbarHeading,
  ToolbarPageTitle,
  ToolbarDescription
};
