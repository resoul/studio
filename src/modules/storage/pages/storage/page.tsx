import { useCallback, useState, useMemo } from 'react';
import { ChevronRight, FolderPlus, Globe, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Content } from '@/layout/components/content';
import { ContentHeader } from '@/layout/components/content-header';
import { useSecondarySidebar } from '@/hooks/useSecondarySidebar';
import { cn } from '@/lib/utils';
import { useStorageFiles } from '../../hooks/useStorageFiles';
import { useStorageFolders } from '../../hooks/useStorageFolders';
import { useStorageSources } from '../../hooks/useStorageSources';
import { useStorageFilters } from '../../hooks/useStorageFilters';
import { FolderSidebar } from '../../components/folder-sidebar/FolderSidebar';
import { KpiCard } from '../../components/kpi/KpiCard';
import { StorageBar } from '../../components/kpi/StorageBar';
import { MediaCard } from '../../components/media-grid/MediaCard';
import { MediaRow } from '../../components/media-grid/MediaRow';
import { StorageToolbar } from '../../components/toolbar/StorageToolbar';
import { UploadPanel } from '../../components/panels/UploadPanel';
import { StockSourcesPanel } from '../../components/panels/StockSourcesPanel';
import { CreateFolderModal } from '../../components/modals/CreateFolderModal';
import { PreviewModal } from '../../components/modals/PreviewModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { UsageDrilldownModal } from '../../components/modals/UsageDrilldownModal';
import { EmptyFiles, CopyToast } from '../../components/EmptyFiles';
import { GRID_COLS_MAP, STORAGE_QUOTA } from '@/mocks/storage';
import { totalStorageUsed } from '@/utils/storage';
import type { MediaFile, RightPanel, ViewMode } from '@/types/storage';
import { Folder, Image, Zap } from 'lucide-react';

export default function StorageManagerPage() {
    // ── State orchestration ──────────────────────────────────────────────────
    const fileOps = useStorageFiles();
    const folderOps = useStorageFolders();
    const sourceOps = useStorageSources();
    const filters = useStorageFilters(fileOps.files, folderOps.selectedFolderId);

    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [gridCols, setGridCols] = useState<3 | 4 | 5>(4);
    const [rightPanel, setRightPanel] = useState<RightPanel>('none');
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [usageDrillFile, setUsageDrillFile] = useState<MediaFile | null>(null);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    // ── Derived ──────────────────────────────────────────────────────────────
    const totalSize = totalStorageUsed(fileOps.files);

    const currentFolderId =
        typeof folderOps.selectedFolderId === 'string' &&
        !['all', 'starred', 'recent'].includes(folderOps.selectedFolderId)
            ? folderOps.selectedFolderId
            : null;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleCopyUrl = useCallback((url: string, name: string) => {
        navigator.clipboard.writeText(url).catch(() => undefined);
        setCopiedUrl(name);
        setTimeout(() => setCopiedUrl(null), 2000);
    }, []);

    const handleUpload = useCallback((files: MediaFile[]) => {
        fileOps.handleUpload(files);
        setRightPanel('none');
    }, [fileOps]);

    const toggleRightPanel = useCallback((panel: RightPanel) => {
        setRightPanel(prev => prev === panel ? 'none' : panel);
    }, []);

    const handleSelectAll = useCallback(() => {
        fileOps.handleSelectAll(filters.filtered);
    }, [fileOps, filters.filtered]);

    const {
        folders,
        selectedFolderId,
        setSelectedFolderId,
        handleDeleteFolder,
        setFolderModalOpen
    } = folderOps;

    const sidebarHeader = useMemo(() => (
        <div className="flex items-center justify-between grow px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Library</h2>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" mode="icon" size="sm" onClick={() => setFolderModalOpen(true)}>
                        <FolderPlus />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Add a new folder</TooltipContent>
            </Tooltip>
        </div>
    ), [setFolderModalOpen])

    const sidebarContent = useMemo(() => (
        <FolderSidebar
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelect={setSelectedFolderId}
            onDeleteFolder={handleDeleteFolder}
        />
    ), [handleDeleteFolder, setSelectedFolderId, selectedFolderId, folders])

    const sidebarFooter = useMemo(() => (
        <div className="shrink-0 border-t border-border flex items-center justify-center h-(--sidebar-footer-height) px-(--sidebar-space-x)">
            <Button variant="ghost" onClick={() => setFolderModalOpen(true)} className="transition-all">
                <FolderPlus />
                <span>New folder</span>
            </Button>
        </div>
    ), [setFolderModalOpen])

    useSecondarySidebar({
        header: sidebarHeader,
        content: sidebarContent,
        footer: sidebarFooter
    });

    return (
        <>
            {/* Header */}
            <ContentHeader className="space-x-2">
                <div className="flex items-center justify-between bg-card grow">
                    <div className="flex items-center gap-2 min-w-0">
                        <h1 className="text-base font-semibold text-foreground shrink-0">Storage</h1>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{folderOps.breadcrumb}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => toggleRightPanel('sources')}
                            className={cn(
                                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border transition-colors',
                                rightPanel === 'sources'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary',
                            )}
                        >
                            <Globe className="h-3.5 w-3.5" />
                            Stock sources
                            {sourceOps.connectedSourceCount > 0 && (
                                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">
                                    {sourceOps.connectedSourceCount}
                                </span>
                            )}
                        </button>

                        <Button
                            size="sm"
                            onClick={() => toggleRightPanel('upload')}
                            className={cn(
                                'gap-1.5',
                                rightPanel === 'upload'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-accent hover:bg-accent/90 text-accent-foreground',
                            )}
                        >
                            <Upload className="h-3.5 w-3.5" />Upload
                        </Button>
                    </div>
                </div>
            </ContentHeader>

            <div className="container-fluid">
                <Content className="block py-0">
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex flex-1 flex-col overflow-hidden">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 py-4 border-b border-border shrink-0">
                                <KpiCard icon={Image} label="Total files" value={fileOps.files.length} sub={`${filters.filtered.length} visible`} />
                                <KpiCard icon={Folder} label="Folders" value={folderOps.folders.length} />
                                <KpiCard icon={Zap} label="Used in emails" value={fileOps.files.reduce((s, f) => s + f.usageCount, 0)} sub="total insertions" />
                                <StorageBar used={totalSize} total={STORAGE_QUOTA} />
                            </div>
                            <StorageToolbar
                                query={filters.query}
                                setQuery={filters.setQuery}
                                typeFilter={filters.typeFilter}
                                setTypeFilter={filters.setTypeFilter}
                                sortField={filters.sortField}
                                sortDir={filters.sortDir}
                                onSortChange={filters.handleSortChange}
                                viewMode={viewMode}
                                setViewMode={setViewMode}
                                gridCols={gridCols}
                                setGridCols={setGridCols}
                                selectedFileIds={fileOps.selectedFileIds}
                                filteredFiles={filters.filtered}
                                onSelectAll={handleSelectAll}
                                onDeleteSelected={fileOps.handleDeleteSelected}
                                onClearSelection={fileOps.handleClearSelection}
                            />
                            <div className="flex flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6">
                                    {filters.filtered.length === 0 ? (
                                        <EmptyFiles query={filters.query} onUpload={() => toggleRightPanel('upload')} />
                                    ) : viewMode === 'grid' ? (
                                        <div className={cn('grid gap-4', GRID_COLS_MAP[gridCols])}>
                                            {filters.filtered.map(file => (
                                                <MediaCard
                                                    key={file.id}
                                                    file={file}
                                                    selected={fileOps.selectedFileIds.has(file.id)}
                                                    onSelect={fileOps.handleSelectFile}
                                                    onToggleStar={fileOps.handleToggleStar}
                                                    onDelete={fileOps.handleDeleteFile}
                                                    onCopyUrl={handleCopyUrl}
                                                    onPreview={setPreviewFile}
                                                    onShowUsage={setUsageDrillFile}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-4 px-4 pb-1">
                                                <div className="w-4 shrink-0" />
                                                <div className="w-16 shrink-0" />
                                                <span className="flex-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
                                                <span className="hidden md:block text-right w-28 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dimensions</span>
                                                <span className="hidden sm:block text-right w-20 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Size</span>
                                                <span className="hidden lg:block text-right w-24 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Usage</span>
                                                <span className="hidden xl:block text-right w-24 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Added</span>
                                                <div className="w-24 shrink-0" />
                                            </div>
                                            {filters.filtered.map(file => (
                                                <MediaRow
                                                    key={file.id}
                                                    file={file}
                                                    selected={fileOps.selectedFileIds.has(file.id)}
                                                    onSelect={fileOps.handleSelectFile}
                                                    onToggleStar={fileOps.handleToggleStar}
                                                    onDelete={fileOps.handleDeleteFile}
                                                    onCopyUrl={handleCopyUrl}
                                                    onPreview={setPreviewFile}
                                                    onShowUsage={setUsageDrillFile}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {rightPanel !== 'none' && (
                                    <div className="w-80 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                                            <p className="text-sm font-semibold text-foreground">
                                                {rightPanel === 'upload' ? 'Upload files' : 'Stock sources'}
                                            </p>
                                            <button onClick={() => setRightPanel('none')} className="text-muted-foreground hover:text-foreground transition-colors">
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4">
                                            {rightPanel === 'upload' ? (
                                                <UploadPanel folderId={currentFolderId} onUpload={handleUpload} />
                                            ) : (
                                                <StockSourcesPanel
                                                    sources={sourceOps.sources}
                                                    onToggle={sourceOps.handleToggleSource}
                                                    onSaveKey={sourceOps.handleSaveApiKey}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Content>
            </div>

            <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
            <UsageDrilldownModal file={usageDrillFile} onClose={() => setUsageDrillFile(null)} />
            <CreateFolderModal
                open={folderOps.folderModalOpen}
                onOpenChange={folderOps.setFolderModalOpen}
                onSave={folderOps.handleCreateFolder}
            />
            <DeleteConfirmModal
                file={fileOps.deletingFile}
                onConfirm={fileOps.confirmDelete}
                onCancel={fileOps.cancelDelete}
            />
            <CopyToast name={copiedUrl} />
        </>
    );
}