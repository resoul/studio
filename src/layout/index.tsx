import { MAIN_NAV } from '@/config/app.config';
import { Layout } from './components/layout';
import { LayoutProvider } from './components/layout-context';
import { HeaderSlotProvider } from './components/header-slot-context';
import { SecondarySidebarSlotProvider } from './components/secondary-sidebar-slot-context';

export function DefaultLayout() {
    return (
        <HeaderSlotProvider>
            <SecondarySidebarSlotProvider>
                <LayoutProvider sidebarNavItems={MAIN_NAV}>
                    <Layout />
                </LayoutProvider>
            </SecondarySidebarSlotProvider>
        </HeaderSlotProvider>
    );
}
