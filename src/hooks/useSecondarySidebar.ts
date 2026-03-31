import { useEffect } from 'react';
import { useSecondarySidebarSlot } from '@/layout/components/secondary-sidebar-slot-context';

interface UseSecondarySidebarOptions {
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
}

export function useSecondarySidebar({ header, content, footer }: UseSecondarySidebarOptions) {
    const { setHeader, setContent, setFooter } = useSecondarySidebarSlot();

    useEffect(() => {
        setHeader(header ?? null);
        return () => setHeader(null);
    }, [header, setHeader]);

    useEffect(() => {
        setContent(content ?? null);
        return () => setContent(null);
    }, [content, setContent]);

    useEffect(() => {
        setFooter(footer ?? null);
        return () => setFooter(null);
    }, [footer, setFooter]);
}