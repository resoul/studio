import { useCallback } from 'react';
import { Plus, Users } from 'lucide-react';
import { ContactList } from '@/types/contacts';

interface ListsSidebarProps {
    lists: ContactList[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onCreateNew: () => void;
}

export function ListsSidebar({ lists, selectedId, onSelect, onCreateNew }: ListsSidebarProps) {
    return (
        <>
            <nav className="flex-1 overflow-y-auto py-2 px-2">
                {lists.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <Users className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No lists yet</p>
                        <button
                            onClick={onCreateNew}
                            className="text-xs text-primary underline-offset-2 hover:underline mt-1"
                        >
                            Create one
                        </button>
                    </div>
                )}

                {lists.map((list) => (
                    <ListItem
                        key={list.id}
                        list={list}
                        isSelected={list.id === selectedId}
                        onSelect={onSelect}
                    />
                ))}
            </nav>
            <div className="border-t border-border px-3 py-3">
                <button
                    onClick={onCreateNew}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Plus className="h-3.5 w-3.5" />
                    New list
                </button>
            </div>
        </>
    );
}

interface ListItemProps {
    list: ContactList;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

function ListItem({ list, isSelected, onSelect }: ListItemProps) {
    const handleClick = useCallback(() => onSelect(list.id), [onSelect, list.id]);

    return (
        <button
            onClick={handleClick}
            className={[
                'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors',
                isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            ].join(' ')}
        >
            <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: list.color }}
            />
            <span className="flex-1 truncate text-sm font-medium">{list.name}</span>
            <span
                className={[
                    'text-xs tabular-nums shrink-0',
                    isSelected ? 'text-primary/70' : 'text-muted-foreground/60',
                ].join(' ')}
            >
                {list.contactCount.toLocaleString()}
            </span>
        </button>
    );
}