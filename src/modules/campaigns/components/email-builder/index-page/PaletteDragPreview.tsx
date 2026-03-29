import { GripVertical } from 'lucide-react';
import { BlockType } from '@/types/email-builder';
import { BLOCK_META } from './block-meta';

interface PaletteDragPreviewProps {
    type: BlockType;
}

export function PaletteDragPreview({ type }: PaletteDragPreviewProps) {
    const meta = BLOCK_META[type];
    const Icon = meta.icon;

    return (
        <div className="w-56 rounded-lg border border-primary/40 bg-white px-3 py-2 shadow-xl">
            <div className="flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-1.5 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{meta.label}</p>
                    <p className="truncate text-xs text-muted-foreground">Drop into a column to add</p>
                </div>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
        </div>
    );
}
