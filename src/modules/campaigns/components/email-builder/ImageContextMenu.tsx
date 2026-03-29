import React, { useState } from 'react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EmailBlock } from '@/types/email-builder';
import { Sparkles, ExternalLink, Maximize, AlignLeft, AlignCenter, AlignRight, Copy, Scissors } from 'lucide-react';
import { mockRemoveBackground } from '@/utils/aiImageMock';

interface ImageContextMenuProps {
    block: EmailBlock;
    onUpdate: (updates: Partial<EmailBlock>) => void;
    onTriggerEdit: () => void;
    children: React.ReactNode;
}

export function ImageContextMenu({ block, onUpdate, onTriggerEdit, children }: ImageContextMenuProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (block.type !== 'image') {
        return <>{children}</>;
    }

    const handleRemoveBg = async () => {
        setIsProcessing(true);
        try {
            const url = await mockRemoveBackground(block.src);
            onUpdate({ src: url });
        } catch (e) {
            console.error('Failed to remove bg', e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div className={isProcessing ? "opacity-50 pointer-events-none transition-opacity" : ""}>
                    {children}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                <ContextMenuItem onClick={onTriggerEdit} className="gap-2 focus:bg-accent/50 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>Edit & AI Magic</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleRemoveBg} disabled={isProcessing} className="gap-2 cursor-pointer">
                    <Scissors className="h-4 w-4" />
                    <span>1-Click Remove BG</span>
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem onClick={() => window.open(block.src, '_blank')} className="gap-2 cursor-pointer">
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Original</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => navigator.clipboard.writeText(block.src)} className="gap-2 cursor-pointer">
                    <Copy className="h-4 w-4" />
                    <span>Copy URL</span>
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem onClick={() => onUpdate({ width: 100 })} className="gap-2 cursor-pointer">
                    <Maximize className="h-4 w-4" />
                    <span>Make Full Width</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onUpdate({ align: 'left' })} className="gap-2 cursor-pointer">
                    <AlignLeft className="h-4 w-4" />
                    <span>Align Left</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onUpdate({ align: 'center' })} className="gap-2 cursor-pointer">
                    <AlignCenter className="h-4 w-4" />
                    <span>Align Center</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onUpdate({ align: 'right' })} className="gap-2 cursor-pointer">
                    <AlignRight className="h-4 w-4" />
                    <span>Align Right</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
