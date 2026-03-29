import { useCallback } from 'react';
import { ColumnLayout, BlockType } from '@/types/email-builder';
import { RowControls } from '@/modules/campaigns/components/email-builder/RowControls';
import { BlockPalette } from '@/modules/campaigns/components/email-builder/BlockPalette';

interface LeftSidebarProps {
    leftPanelTab: 'structure' | 'content';
    onLeftPanelTabChange: (tab: 'structure' | 'content') => void;
    onAddRow: (columns?: ColumnLayout) => void;
    onAddBlockToCanvas: (type: BlockType) => void;
}

export function LeftSidebar({
    leftPanelTab,
    onLeftPanelTabChange,
    onAddRow,
    onAddBlockToCanvas,
}: LeftSidebarProps) {
    const handleStructureClick = useCallback(() => onLeftPanelTabChange('structure'), [onLeftPanelTabChange]);
    const handleContentClick = useCallback(() => onLeftPanelTabChange('content'), [onLeftPanelTabChange]);

    return (
        <div className="w-56 shrink-0 overflow-y-auto border-r border-border bg-card p-4">
            <div className="mb-4 grid grid-cols-2 rounded-md border border-border p-1">
                <button
                    onClick={handleStructureClick}
                    className={`rounded px-2 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                        leftPanelTab === 'structure'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-secondary'
                    }`}
                >
                    Structure
                </button>
                <button
                    onClick={handleContentClick}
                    className={`rounded px-2 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                        leftPanelTab === 'content'
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-secondary'
                    }`}
                >
                    Content
                </button>
            </div>

            {leftPanelTab === 'structure' && <RowControls onAddRow={onAddRow} />}
            {leftPanelTab === 'content' && <BlockPalette onAddBlock={onAddBlockToCanvas} />}
        </div>
    );
}
