import { useCallback, useState } from 'react';
import type { MediaFile } from '@/types/storage';
import { MOCK_FILES } from '@/mocks/storage';

export function useStorageFiles() {
    const [files, setFiles] = useState<MediaFile[]>(MOCK_FILES);
    const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
    const [deletingFile, setDeletingFile] = useState<MediaFile | null>(null);

    const handleSelectFile = useCallback((id: string) => {
        setSelectedFileIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    const handleSelectAll = useCallback((filteredFiles: MediaFile[]) => {
        setSelectedFileIds(prev =>
            prev.size === filteredFiles.length
                ? new Set()
                : new Set(filteredFiles.map(f => f.id)),
        );
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedFileIds(new Set());
    }, []);

    const handleToggleStar = useCallback((id: string) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
    }, []);

    const handleDeleteFile = useCallback((file: MediaFile) => {
        setDeletingFile(file);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!deletingFile) return;
        setFiles(prev => prev.filter(f => f.id !== deletingFile.id));
        setSelectedFileIds(prev => {
            const next = new Set(prev);
            next.delete(deletingFile.id);
            return next;
        });
        setDeletingFile(null);
    }, [deletingFile]);

    const cancelDelete = useCallback(() => {
        setDeletingFile(null);
    }, []);

    const handleDeleteSelected = useCallback(() => {
        setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
        setSelectedFileIds(new Set());
    }, [selectedFileIds]);

    const handleUpload = useCallback((newFiles: MediaFile[]) => {
        setFiles(prev => [...newFiles, ...prev]);
    }, []);

    return {
        files,
        selectedFileIds,
        deletingFile,
        handleSelectFile,
        handleSelectAll,
        handleClearSelection,
        handleToggleStar,
        handleDeleteFile,
        confirmDelete,
        cancelDelete,
        handleDeleteSelected,
        handleUpload,
    };
}