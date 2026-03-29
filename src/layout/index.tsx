import { MAIN_NAV } from '@/config/app.config';
import { Layout } from './components/layout';
import { LayoutProvider } from './components/layout-context';
import { HeaderSlotProvider } from './components/header-slot-context';

export function DefaultLayout() {
    return (
        <HeaderSlotProvider>
            <LayoutProvider sidebarNavItems={MAIN_NAV}>
                <Layout />
            </LayoutProvider>
        </HeaderSlotProvider>
    );
}
