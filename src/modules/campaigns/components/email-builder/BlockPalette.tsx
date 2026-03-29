import { useCallback, useEffect, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
    Heading, Type, ImageIcon, MousePointerClick, Minus, ArrowUpDown,
    Code, Share2, GitBranch, RectangleHorizontal, Package, TicketPercent, Star,
    Timer, Video,
} from 'lucide-react';
import { BlockType } from '@/types/email-builder';

interface BlockPaletteProps {
    onAddBlock: (type: BlockType) => void;
}

const blocks: { type: BlockType; icon: React.ElementType; label: string }[] = [
    { type: 'heading',      icon: Heading,            label: 'Heading'      },
    { type: 'text',         icon: Type,               label: 'Text'         },
    { type: 'image',        icon: ImageIcon,          label: 'Image'        },
    { type: 'button',       icon: MousePointerClick,  label: 'Button'       },
    { type: 'hero',         icon: RectangleHorizontal,label: 'Hero'         },
    { type: 'product-card', icon: Package,            label: 'Product Card' },
    { type: 'coupon',       icon: TicketPercent,      label: 'Coupon'       },
    { type: 'survey',       icon: Star,               label: 'Survey'       },
    { type: 'divider',      icon: Minus,              label: 'Divider'      },
    { type: 'spacer',       icon: ArrowUpDown,        label: 'Spacer'       },
    { type: 'html',         icon: Code,               label: '</> HTML'     },
    { type: 'social',       icon: Share2,             label: 'Social'       },
    { type: 'conditional',  icon: GitBranch,          label: 'IF / ELSE'    },
    { type: 'timer',        icon: Timer,              label: 'Timer'  },
    { type: 'video',        icon: Video,              label: 'Video'  },
];

function DraggablePaletteItem({
                                  type,
                                  icon: Icon,
                                  label,
                                  onAddBlock,
                              }: {
    type: BlockType;
    icon: React.ElementType;
    label: string;
    onAddBlock: (type: BlockType) => void;
}) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { source: 'palette', blockType: type },
    });

    const wasDragging = useRef(false);

    useEffect(() => {
        if (isDragging) wasDragging.current = true;
    }, [isDragging]);

    const handleClick = useCallback(() => {
        if (wasDragging.current) {
            wasDragging.current = false;
            return;
        }
        onAddBlock(type);
    }, [onAddBlock, type]);

    return (
        <button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={handleClick}
            className={`flex flex-col items-center gap-1.5 rounded-md border border-border bg-card p-3 text-icon transition-colors hover:border-primary hover:text-primary cursor-grab active:cursor-grabbing ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

export function BlockPalette({ onAddBlock }: BlockPaletteProps) {
    return (
        <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-3">
                Content
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {blocks.map((b) => (
                    <DraggablePaletteItem key={b.type} {...b} onAddBlock={onAddBlock} />
                ))}
            </div>
        </div>
    );
}
