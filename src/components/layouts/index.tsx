import { Helmet } from '@packages/react-helmet-async';
import { useLocation } from 'react-router-dom';
import { MENU_SIDEBAR_MAIN } from '@/config/config';
import { useMenu } from '@/hooks/use-menu';
import { Wrapper } from './components/wrapper';
import { LayoutProvider } from './components/context';

export function Layout() {
    const { pathname } = useLocation();
    const { getCurrentItem } = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR_MAIN);

    return (
        <>
            <Helmet>
                <title>{item?.title}</title>
            </Helmet>

            <LayoutProvider
                style={{
                    '--sidebar-width': '300px',
                    '--sidebar-collapsed-width': '60px',
                    '--sidebar-header-height': '54px',
                    '--header-height': '60px',
                    '--header-height-mobile': '60px',
                } as React.CSSProperties}
            >
                <Wrapper />
            </LayoutProvider>
        </>
    );
}
