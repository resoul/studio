import { ArrowUpDown, Check, CheckSquare, LayoutGrid, List, Search, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { MediaFile, MediaType, SortDir, SortField, ViewMode } from '@/types/storage';

interface StorageToolbarProps {
    query: string;
    setQuery: (v: string) => void;
    typeFilter: MediaType | 'all';
    setTypeFilter: (v: MediaType | 'all') => void;
    sortField: SortField;
    sortDir: SortDir;
    onSortChange: (field: SortField) => void;
    viewMode: ViewMode;
    setViewMode: (v: ViewMode) => void;
    gridCols: 3 | 4 | 5;
    setGridCols: (v: 3 | 4 | 5) => void;
    selectedFileIds: Set<string>;
    filteredFiles: MediaFile[];
    onSelectAll: () => void;
    onDeleteSelected: () => void;
    onClearSelection: () => void;
}

export function StorageToolbar({
                                   query, setQuery,
                                   typeFilter, setTypeFilter,
                                   sortField, sortDir, onSortChange,
                                   viewMode, setViewMode,
                                   gridCols, setGridCols,
                                   selectedFileIds, filteredFiles,
                                   onSelectAll, onDeleteSelected, onClearSelection,
                               }: StorageToolbarProps) {
    const SORT_OPTIONS: Array<{ field: SortField; label: string }> = [
        { field: 'name', label: 'Name' },
        { field: 'size', label: 'File size' },
        { field: 'createdAt', label: 'Date added' },
        { field: 'usageCount', label: 'Usage count' },
    ];

    return (
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border shrink-0 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 max-w-xs min-w-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search files, tags…"
                    className="pl-8 h-8 text-sm"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                {(['all', 'image', 'gif', 'svg'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={cn(
                            'rounded px-2.5 py-1 text-xs font-medium transition-colors capitalize',
                            typeFilter === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Sort */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                        <ArrowUpDown className="h-3 w-3" />Sort
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    {SORT_OPTIONS.map(({ field, label }) => (
                        <DropdownMenuItem key={field} onClick={() => onSortChange(field)}>
                            {sortField === field && <Check className="h-3.5 w-3.5 mr-2 text-primary" />}
                            <span className={sortField !== field ? 'ml-5' : ''}>{label}</span>
                            {sortField === field && (
                                <span className="ml-auto text-[10px] text-muted-foreground">
                                    {sortDir === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk actions */}
            {selectedFileIds.size > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5">
                    <span className="text-xs font-semibold text-primary">{selectedFileIds.size} selected</span>
                    <button
                        onClick={onDeleteSelected}
                        className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        Delete
                    </button>
                    <button onClick={onClearSelection} className="rounded p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="ml-auto flex items-center gap-2">
                {/* Select all */}
                <button
                    onClick={onSelectAll}
                    className="hidden sm:flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    {selectedFileIds.size === filteredFiles.length && filteredFiles.length > 0
                        ? <CheckSquare className="h-3.5 w-3.5 text-primary" />
                        : <Square className="h-3.5 w-3.5" />}
                    All
                </button>

                <span className="text-xs text-muted-foreground tabular-nums">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
                </span>

                {/* View mode */}
                <div className="flex items-center rounded-md border border-border bg-background p-0.5">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Grid density */}
                {viewMode === 'grid' && (
                    <div className="flex items-center rounded-md border border-border bg-background p-0.5">
                        {([3, 4, 5] as const).map(cols => (
                            <button
                                key={cols}
                                onClick={() => setGridCols(cols)}
                                className={cn(
                                    'rounded px-2 py-1 text-[10px] font-semibold transition-colors',
                                    gridCols === cols ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {cols}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}