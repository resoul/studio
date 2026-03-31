import { useCallback, useState, ChangeEvent } from 'react';
import { ContactStatus } from '@/types/contacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2, Tag, ChevronDown, Download, UserCheck } from 'lucide-react';

interface BulkActionsBarProps {
    selectedCount: number;
    onDelete: () => void;
    onStatusChange: (status: ContactStatus) => void;
    onAddTag: (tag: string) => void;
    onExport: () => void;
    onClear: () => void;
}

export function BulkActionsBar({
                                   selectedCount,
                                   onDelete,
                                   onStatusChange,
                                   onAddTag,
                                   onExport,
                                   onClear,
                               }: BulkActionsBarProps) {
    const [tagInput, setTagInput] = useState('');
    const [tagOpen, setTagOpen] = useState(false);

    const handleTagInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    }, []);

    const handleTagSubmit = useCallback(() => {
        if (!tagInput.trim()) return;
        onAddTag(tagInput.trim());
        setTagInput('');
        setTagOpen(false);
    }, [tagInput, onAddTag]);

    const handleTagKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') handleTagSubmit();
        },
        [handleTagSubmit],
    );

    const handleStatusActive = useCallback(() => onStatusChange('active'), [onStatusChange]);
    const handleStatusUnsub = useCallback(() => onStatusChange('unsubscribed'), [onStatusChange]);
    const handleStatusBounced = useCallback(() => onStatusChange('bounced'), [onStatusChange]);

    if (selectedCount === 0) return null;

    return (
        <div className="flex items-center gap-2 px-6 py-2 bg-primary/5 border-b border-primary/20 animate-in slide-in-from-top-1 duration-150">
            <span className="text-xs font-semibold text-primary tabular-nums">
                {selectedCount} selected
            </span>

            <div className="h-4 w-px bg-border mx-1" />

            {/* Status change */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <UserCheck className="h-3 w-3" />
                        Set status
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Change status to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleStatusActive}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStatusUnsub}>Unsubscribed</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleStatusBounced}>Bounced</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Add tag */}
            <DropdownMenu open={tagOpen} onOpenChange={setTagOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Tag className="h-3 w-3" />
                        Add tag
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="p-2 w-52">
                    <p className="text-xs text-muted-foreground mb-1.5 px-1">Tag name</p>
                    <div className="flex gap-1.5">
                        <Input
                            value={tagInput}
                            onChange={handleTagInputChange}
                            onKeyDown={handleTagKeyDown}
                            placeholder="e.g. vip"
                            className="h-7 text-xs flex-1"
                            autoFocus
                        />
                        <Button size="sm" className="h-7 text-xs px-2" onClick={handleTagSubmit}>
                            Add
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onExport}>
                <Download className="h-3 w-3" />
                Export
            </Button>

            {/* Delete */}
            <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 text-destructive hover:text-destructive border-border"
                onClick={onDelete}
            >
                <Trash2 className="h-3 w-3" />
                Delete
            </Button>

            <button
                onClick={onClear}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
                Clear
            </button>
        </div>
    );
}