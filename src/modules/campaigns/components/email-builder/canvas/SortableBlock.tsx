import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ChevronDown, Trash2, GripVertical } from 'lucide-react';
import { EmailBlock } from '@/types/email-builder';
import { BlockRenderer } from '../BlockRenderer';
import { ImageContextMenu } from '../ImageContextMenu';

interface SortableBlockProps {
    block: EmailBlock;
    rowId: string;
    colIndex: number;
    blockIndex: number;
    isSelected: boolean;
    onSelect: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
    onInlineUpdate: (blockId: string, updates: Partial<EmailBlock>) => void;
    onDoubleClickBlock?: (blockId: string) => void;
}

export function SortableBlock({
                                  block, rowId, colIndex, blockIndex,
                                  isSelected, onSelect, onMoveUp, onMoveDown, onDelete,
                                  canMoveUp, canMoveDown, onInlineUpdate, onDoubleClickBlock
                              }: SortableBlockProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
        data: { source: 'canvas', rowId, colIndex, blockIndex, block },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onDoubleClick={(e) => { e.stopPropagation(); onDoubleClickBlock?.(block.id); }}
            className={`group/block relative rounded-md border transition-all cursor-pointer ${
                isSelected
                    ? 'ring-2 ring-primary ring-offset-1 border-primary'
                    : 'border-transparent hover:border-border'
            }`}
        >
            <div className="flex items-start">
                <button
                    {...attributes}
                    {...listeners}
                    className="shrink-0 p-1 mt-1 cursor-grab active:cursor-grabbing text-icon opacity-0 group-hover/block:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
                <div className="flex-1 px-1 py-1">
                    <ImageContextMenu
                        block={block}
                        onUpdate={(updates) => onInlineUpdate(block.id, updates)}
                        onTriggerEdit={() => onDoubleClickBlock && onDoubleClickBlock(block.id)}
                    >
                        <BlockRenderer block={block} isSelected={isSelected} onInlineUpdate={onInlineUpdate} />
                    </ImageContextMenu>
                </div>
            </div>

            {isSelected && (
                <div className="absolute -right-1 -top-1 flex gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-sm z-10">
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        disabled={!canMoveUp}
                        className="rounded p-1 text-icon transition-colors hover:bg-secondary disabled:opacity-30"
                    >
                        <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        disabled={!canMoveDown}
                        className="rounded p-1 text-icon transition-colors hover:bg-secondary disabled:opacity-30"
                    >
                        <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="rounded p-1 text-destructive transition-colors hover:bg-destructive/10"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
}