import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Folder, FolderOpen, Image, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FolderFilter, MediaFolder } from '@/types/storage';

interface FolderSidebarProps {
    folders: MediaFolder[];
    selectedFolderId: FolderFilter;
    onSelect: (id: FolderFilter) => void;
    onDeleteFolder: (id: string) => void;
}

export function FolderSidebar({ folders, selectedFolderId, onSelect, onDeleteFolder }: FolderSidebarProps) {
    const roots = folders.filter(f => f.parentId === null);

    const smartViews: Array<{ id: string; label: string; icon: React.ElementType }> = [
        { id: 'all', label: 'All files', icon: Image },
        { id: 'starred', label: 'Starred', icon: Star },
        { id: 'recent', label: 'Recently added', icon: Clock },
    ];

    return (
        <nav className="flex-1 overflow-y-auto py-2">
            <div className="px-2 mb-3">
                {smartViews.map(v => {
                    const Icon = v.icon;
                    const active = selectedFolderId === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => onSelect(v.id as FolderFilter)}
                            className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors text-left',
                                active
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                            )}
                        >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 truncate">{v.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="mx-3 mb-2 border-t border-border" />
            <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Folders</p>

            {roots.length === 0 && (
                <p className="px-4 py-3 text-xs text-muted-foreground">No folders yet</p>
            )}

            <div className="px-2 space-y-0.5">
                {roots.map(folder => {
                    const children = folders.filter(f => f.parentId === folder.id);
                    return (
                        <FolderItem
                            key={folder.id}
                            folder={folder}
                            children={children}
                            selectedFolderId={selectedFolderId}
                            onSelect={onSelect}
                            onDelete={onDeleteFolder}
                            active={selectedFolderId === folder.id}
                        />
                    );
                })}
            </div>
        </nav>
    );
}

interface FolderItemProps {
    folder: MediaFolder;
    children: MediaFolder[];
    selectedFolderId: FolderFilter;
    onSelect: (id: FolderFilter) => void;
    onDelete: (id: string) => void;
    active: boolean;
}

function FolderItem({ folder, children, selectedFolderId, onSelect, onDelete, active }: FolderItemProps) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = children.length > 0;

    return (
        <div>
            <div className={cn(
                'group flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors cursor-pointer',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            )}>
                {hasChildren ? (
                    <button onClick={() => setExpanded(v => !v)} className="shrink-0 p-0.5">
                        {expanded
                            ? <ChevronDown className="h-3 w-3" />
                            : <ChevronRight className="h-3 w-3" />}
                    </button>
                ) : (
                    <span className="w-4 shrink-0" />
                )}

                <button
                    onClick={() => onSelect(folder.id)}
                    className="flex flex-1 items-center gap-1.5 min-w-0 text-left"
                >
                    {active
                        ? <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                        : <Folder className="h-3.5 w-3.5 shrink-0" />}
                    <span className="truncate text-sm">{folder.name}</span>
                </button>

                <span className="text-[10px] tabular-nums opacity-60 shrink-0">{folder.itemCount}</span>

                <button
                    onClick={() => onDelete(folder.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:text-destructive shrink-0"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            </div>

            {expanded && hasChildren && (
                <div className="ml-4 mt-0.5 space-y-0.5">
                    {children.map(child => (
                        <button
                            key={child.id}
                            onClick={() => onSelect(child.id)}
                            className={cn(
                                'flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors text-left',
                                selectedFolderId === child.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                            )}
                        >
                            <Folder className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 truncate">{child.name}</span>
                            <span className="text-[10px] tabular-nums opacity-60">{child.itemCount}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}