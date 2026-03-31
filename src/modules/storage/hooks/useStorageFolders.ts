import { useCallback, useState } from 'react';
import type { FolderFilter, MediaFolder } from '@/types/storage';
import { MOCK_FOLDERS } from '@/mocks/storage';
import { uid } from '@/utils/storage';

export function useStorageFolders() {
    const [folders, setFolders] = useState<MediaFolder[]>(MOCK_FOLDERS);
    const [selectedFolderId, setSelectedFolderId] = useState<FolderFilter>('all');
    const [folderModalOpen, setFolderModalOpen] = useState(false);

    const handleCreateFolder = useCallback((name: string) => {
        const folder: MediaFolder = {
            id: uid(),
            name,
            parentId: null,
            itemCount: 0,
            createdAt: new Date().toISOString().slice(0, 10),
        };
        setFolders(prev => [...prev, folder]);
    }, []);

    const handleDeleteFolder = useCallback((id: string) => {
        setFolders(prev => prev.filter(f => f.id !== id));
        setSelectedFolderId(prev => prev === id ? 'all' : prev);
    }, []);

    const currentFolder =
        typeof selectedFolderId === 'string' &&
        !['all', 'starred', 'recent'].includes(selectedFolderId)
            ? folders.find(f => f.id === selectedFolderId)
            : null;

    const breadcrumb = currentFolder
        ? currentFolder.name
        : ({ all: 'All files', starred: 'Starred', recent: 'Recently added' } as Record<string, string>)[selectedFolderId as string] ?? 'All files';

    return {
        folders,
        selectedFolderId,
        setSelectedFolderId,
        folderModalOpen,
        setFolderModalOpen,
        currentFolder,
        breadcrumb,
        handleCreateFolder,
        handleDeleteFolder,
    };
}