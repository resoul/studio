import { useCallback, useMemo, useState } from 'react';
import type { FolderFilter, MediaFile, MediaType, SortDir, SortField } from '@/types/storage';

export function useStorageFilters(files: MediaFile[], selectedFolderId: FolderFilter) {
    const [query, setQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<MediaType | 'all'>('all');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const handleSortChange = useCallback((field: SortField) => {
        setSortField(prev => {
            if (prev === field) {
                setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                return field;
            }
            setSortDir('asc');
            return field;
        });
    }, []);

    const filtered = useMemo(() => {
        let list = files;

        if (selectedFolderId === 'starred') {
            list = list.filter(f => f.starred);
        } else if (selectedFolderId === 'recent') {
            list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);
        } else if (selectedFolderId !== 'all' && selectedFolderId !== null) {
            list = list.filter(f => f.folderId === selectedFolderId);
        }

        if (typeFilter !== 'all') list = list.filter(f => f.type === typeFilter);

        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(f =>
                f.name.toLowerCase().includes(q) ||
                f.alt.toLowerCase().includes(q) ||
                f.tags.some(t => t.includes(q)),
            );
        }

        return [...list].sort((a, b) => {
            let cmp = 0;
            if (sortField === 'name') cmp = a.name.localeCompare(b.name);
            else if (sortField === 'size') cmp = a.size - b.size;
            else if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
            else if (sortField === 'usageCount') cmp = a.usageCount - b.usageCount;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [files, selectedFolderId, typeFilter, query, sortField, sortDir]);

    return {
        query, setQuery,
        typeFilter, setTypeFilter,
        sortField, sortDir,
        handleSortChange,
        filtered,
    };
}