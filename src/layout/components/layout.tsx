import { Outlet } from 'react-router';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Helmet } from 'react-helmet-async';

export function Layout() {
    return (
        <>
            <Helmet>
                <title>title</title>
            </Helmet>
            <div className={cn('flex h-screen w-screen flex-col', useIsMobile() && 'overflow-hidden')}>
                <Header />
                <div className='flex-1 flex overflow-hidden'>
                    <Sidebar />
                </div>
                <Outlet />
            </div>
        </>
    )
}