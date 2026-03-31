import { useCallback, useState } from 'react';
import type { StockSource, StockSourceKey } from '@/types/storage';
import { STOCK_SOURCES } from '@/mocks/storage';

export function useStorageSources() {
    const [sources, setSources] = useState<StockSource[]>(STOCK_SOURCES);

    const handleToggleSource = useCallback((key: StockSourceKey) => {
        setSources(prev => prev.map(s => s.key === key ? { ...s, connected: !s.connected } : s));
    }, []);

    const handleSaveApiKey = useCallback((key: StockSourceKey, apiKey: string) => {
        setSources(prev => prev.map(s => s.key === key ? { ...s, apiKey } : s));
    }, []);

    const connectedSourceCount = sources.filter(s => s.connected).length;

    return { sources, connectedSourceCount, handleToggleSource, handleSaveApiKey };
}