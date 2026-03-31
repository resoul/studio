import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SecondarySidebarSlots {
    header: ReactNode;
    content: ReactNode;
    footer: ReactNode;
}

interface SecondarySidebarSlotContextValue {
    slots: SecondarySidebarSlots;
    setHeader: (node: ReactNode) => void;
    setContent: (node: ReactNode) => void;
    setFooter: (node: ReactNode) => void;
    isVisible: boolean;
}

const SecondarySidebarSlotContext = createContext<SecondarySidebarSlotContextValue | undefined>(undefined);

export function SecondarySidebarSlotProvider({ children }: { children: ReactNode }) {
    const [slots, setSlots] = useState<SecondarySidebarSlots>({
        header: null,
        content: null,
        footer: null,
    });

    const setHeader = useCallback((node: ReactNode) => {
        setSlots((prev) => (prev.header === node ? prev : { ...prev, header: node }));
    }, []);

    const setContent = useCallback((node: ReactNode) => {
        setSlots((prev) => (prev.content === node ? prev : { ...prev, content: node }));
    }, []);

    const setFooter = useCallback((node: ReactNode) => {
        setSlots((prev) => (prev.footer === node ? prev : { ...prev, footer: node }));
    }, []);

    const isVisible = slots.header !== null || slots.content !== null || slots.footer !== null;

    return (
        <SecondarySidebarSlotContext.Provider value={{ slots, setHeader, setContent, setFooter, isVisible }}>
            {children}
        </SecondarySidebarSlotContext.Provider>
    );
}

export function useSecondarySidebarSlot() {
    const context = useContext(SecondarySidebarSlotContext);
    if (!context) {
        throw new Error('useSecondarySidebarSlot must be used within a SecondarySidebarSlotProvider');
    }
    return context;
}