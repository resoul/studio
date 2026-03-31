import { useCallback } from 'react';
import { ContactList, AudienceSegment } from '@/types/contacts';
import { Target, Users } from 'lucide-react';

interface SegmentSidebarProps {
    segments: AudienceSegment[];
    lists: ContactList[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

function getListLabel(lists: ContactList[], listId: string): string {
    if (listId === 'all') {
        return 'All lists';
    }

    return lists.find((list) => list.id === listId)?.name ?? 'Unknown list';
}

export function SegmentSidebar({ segments, lists, selectedId, onSelect }: SegmentSidebarProps) {
    return (
        <>
            <nav className="flex-1 overflow-y-auto py-1.5 px-1.5 space-y-0.5">
                {segments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                        <Target className="h-7 w-7 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground">No segments yet</p>
                    </div>
                )}

                {segments.map((segment) => (
                    <SegmentListItem
                        key={segment.id}
                        segment={segment}
                        listLabel={getListLabel(lists, segment.listId)}
                        isSelected={segment.id === selectedId}
                        onSelect={onSelect}
                    />
                ))}
            </nav>
        </>
    );
}

interface SegmentListItemProps {
    segment: AudienceSegment;
    listLabel: string;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

function SegmentListItem({ segment, listLabel, isSelected, onSelect }: SegmentListItemProps) {
    const handleSelect = useCallback(() => onSelect(segment.id), [onSelect, segment.id]);

    return (
        <button
            onClick={handleSelect}
            className={[
                'w-full rounded-md px-2.5 py-2 text-left transition-colors',
                isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
            ].join(' ')}
        >
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="truncate text-sm font-medium">{segment.name}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="truncate opacity-80">{listLabel}</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                    <Users className="h-3 w-3" />
                    {segment.estimatedContacts.toLocaleString()}
                </span>
            </div>
        </button>
    );
}
