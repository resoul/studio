import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface HeaderSlotContextValue {
    headerSlot: ReactNode;
    setHeaderSlot: (node: ReactNode) => void;
}

const HeaderSlotContext = createContext<HeaderSlotContextValue>({
    headerSlot: null,
    setHeaderSlot: () => {},
});

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
    const [headerSlot, setHeaderSlotState] = useState<ReactNode>(null);

    const setHeaderSlot = useCallback((node: ReactNode) => {
        setHeaderSlotState(node);
    }, []);

    return (
        <HeaderSlotContext.Provider value={{ headerSlot, setHeaderSlot }}>
            {children}
        </HeaderSlotContext.Provider>
    );
}

export function useHeaderSlot() {
    return useContext(HeaderSlotContext);
}