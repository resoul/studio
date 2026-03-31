'use client';

import { Link, useLocation } from 'react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const StockNavbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine the current active tab based on pathname
  const getCurrentTab = () => {
    if (pathname.includes('/all-stock')) return 'all-stock';
    if (pathname.includes('/current-stock')) return 'current-stock';
    if (pathname.includes('/inbound-stock')) return 'inbound-stock';
    if (pathname.includes('/outbound-stock')) return 'outbound-stock';

    return 'all-stock'; // default fallback
  };

  return (
    <div className="container-fluid border-b border-border mb-10">
      <Tabs value={getCurrentTab()} className="text-sm text-muted-foreground">
        <TabsList variant="line" className="border-0 gap-2.5">
          <TabsTrigger value="all-stock" asChild className="px-2.5 py-5">
            <Link to="/store-inventory/all-stock">All Stock</Link>
          </TabsTrigger>
          <TabsTrigger value="current-stock" asChild className="px-2.5 py-5">
            <Link to="/store-inventory/current-stock">Current Stock</Link>
          </TabsTrigger>
          <TabsTrigger value="inbound-stock" asChild className="px-2.5 py-5">
            <Link to="/store-inventory/inbound-stock">Inbound Stock</Link>
          </TabsTrigger>
          <TabsTrigger value="outbound-stock" asChild className="px-2.5 py-5">
            <Link to="/store-inventory/outbound-stock">Outbound Stock</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
