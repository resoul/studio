import { ReactNode, useEffect } from 'react';
import { useSecondarySidebarSlot } from '@/layout/components/secondary-sidebar-slot-context';

interface UseSecondarySidebarOptions {
    header?: ReactNode;
    content?: ReactNode;
    footer?: ReactNode;
}

/**
 * Call this hook inside any page component to populate the secondary sidebar.
 * The sidebar disappears automatically when the component unmounts.
 *
 * @example
 * function MyPage() {
 *   useSecondarySidebar({
 *     header: <SidebarDefaultHeader />,
 *     content: <SidebarDefaultContent />,
 *     footer: <SidebarDefaultFooter />,
 *   });
 *   return <div>…</div>;
 * }
 */
export function useSecondarySidebar({ header, content, footer }: UseSecondarySidebarOptions) {
    const { setHeader, setContent, setFooter } = useSecondarySidebarSlot();

    useEffect(() => {
        setHeader(header ?? null);
        return () => setHeader(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeader]);

    useEffect(() => {
        setContent(content ?? null);
        return () => setContent(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setContent]);

    useEffect(() => {
        setFooter(footer ?? null);
        return () => setFooter(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFooter]);
}