import { useDroppable } from '@dnd-kit/core';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';
import { EmailTemplate, EmailRow, BlockType, ColumnLayout, EmailBlock } from '@/types/email-builder';
import { ColumnLayoutSelector } from './canvas/ColumnLayoutSelector';
import { DroppableColumn } from './canvas/DroppableColumn';
import { SortableBlock } from './canvas/SortableBlock';

interface CanvasProps {
    template: EmailTemplate;
    selectedBlockId: string | null;
    selectedRowId: string | null;
    viewMode: 'desktop' | 'mobile';
    isDragging: boolean;
    activeDropId: string | null;
    onSelectBlock: (blockId: string, rowId: string) => void;
    onDeselectAll: () => void;
    onMoveRow: (rowId: string, direction: 'up' | 'down') => void;
    onMoveBlock: (rowId: string, colIndex: number, blockId: string, direction: 'up' | 'down') => void;
    onDeleteBlock: (blockId: string) => void;
    onDeleteRow: (rowId: string) => void;
    onChangeRowColumns: (rowId: string, columns: ColumnLayout) => void;
    onAddBlockToRow: (rowId: string, colIndex: number, type: BlockType) => void;
    onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
    onDoubleClickBlock?: (blockId: string) => void;
}

export function Canvas({
                           template, selectedBlockId, selectedRowId, viewMode,
                           isDragging, activeDropId,
                           onSelectBlock, onDeselectAll, onMoveRow, onMoveBlock,
                           onDeleteBlock, onDeleteRow, onChangeRowColumns, onUpdateBlock, onDoubleClickBlock
                       }: CanvasProps) {
    const { setNodeRef: setCanvasRef } = useDroppable({
        id: 'canvas-drop',
        data: { target: 'canvas' },
    });

    const canvasWidth =
        viewMode === 'mobile' ? Math.min(375, template.contentWidth) : template.contentWidth;

    return (
        <div className="flex-1 overflow-auto bg-canvas" onClick={onDeselectAll}>
            <div className="px-8 pb-8 pt-6">
                <div
                    ref={setCanvasRef}
                    className={`mx-auto rounded-lg shadow-md border-2 transition-all duration-300 ${
                        isDragging && activeDropId === 'canvas-drop'
                            ? 'border-primary/60 ring-2 ring-primary/20'
                            : isDragging
                                ? 'border-dashed border-primary/30'
                                : 'border-transparent'
                    } bg-white text-[#0F172A]`}
                    style={{ maxWidth: canvasWidth, fontFamily: template.fontFamily }}
                >
                    <div className="p-6">
                        {template.rows.length === 0 ? (
                            <EmptyCanvas />
                        ) : (
                            <div className="space-y-2">
                                {template.rows.map((row, rowIndex) => (
                                    <CanvasRow
                                        key={row.id}
                                        row={row}
                                        rowIndex={rowIndex}
                                        totalRows={template.rows.length}
                                        selectedBlockId={selectedBlockId}
                                        selectedRowId={selectedRowId}
                                        viewMode={viewMode}
                                        onSelectBlock={onSelectBlock}
                                        onMoveRow={onMoveRow}
                                        onMoveBlock={onMoveBlock}
                                        onDeleteBlock={onDeleteBlock}
                                        onDeleteRow={onDeleteRow}
                                        onChangeRowColumns={onChangeRowColumns}
                                        onUpdateBlock={onUpdateBlock}
                                        onDoubleClickBlock={onDoubleClickBlock}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyCanvas() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="rounded-full bg-secondary p-4 mb-4">
                <Plus className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">Start building your email</p>
            <p className="text-xs mt-1">Drag blocks from the left panel or click to add</p>
        </div>
    );
}

interface CanvasRowProps {
    row: EmailRow;
    rowIndex: number;
    totalRows: number;
    selectedBlockId: string | null;
    selectedRowId: string | null;
    viewMode: 'desktop' | 'mobile';
    onSelectBlock: (blockId: string, rowId: string) => void;
    onMoveRow: (rowId: string, direction: 'up' | 'down') => void;
    onMoveBlock: (rowId: string, colIndex: number, blockId: string, direction: 'up' | 'down') => void;
    onDeleteBlock: (blockId: string) => void;
    onDeleteRow: (rowId: string) => void;
    onChangeRowColumns: (rowId: string, columns: ColumnLayout) => void;
    onUpdateBlock: (blockId: string, updates: Partial<EmailBlock>) => void;
    onDoubleClickBlock?: (blockId: string) => void;
}

function CanvasRow({
                       row, rowIndex, totalRows, selectedBlockId, selectedRowId, viewMode,
                       onSelectBlock, onMoveRow, onMoveBlock, onDeleteBlock, onDeleteRow,
                       onChangeRowColumns, onUpdateBlock, onDoubleClickBlock
                   }: CanvasRowProps) {
    const colClass = viewMode === 'mobile' ? 'grid-cols-1'
        : row.columns === 1 ? 'grid-cols-1'
            : row.columns === 2 ? 'grid-cols-2'
                : 'grid-cols-3';

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`group relative rounded-md border transition-all ${
                selectedRowId === row.id && !selectedBlockId
                    ? 'border-primary/50 bg-primary/[0.02]'
                    : 'border-transparent hover:border-slate-200'
            }`}
        >
            {/* Row toolbar */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ColumnLayoutSelector
                    row={row}
                    onChange={(c) => onChangeRowColumns(row.id, c)}
                />
                <div className="w-px h-4 bg-border mx-1" />
                <button
                    onClick={() => onMoveRow(row.id, 'up')}
                    disabled={rowIndex === 0}
                    className="rounded p-1 text-icon hover:bg-secondary disabled:opacity-30 transition-colors"
                >
                    <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onMoveRow(row.id, 'down')}
                    disabled={rowIndex === totalRows - 1}
                    className="rounded p-1 text-icon hover:bg-secondary disabled:opacity-30 transition-colors"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDeleteRow(row.id)}
                    className="rounded p-1 text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Columns */}
            <div className={`grid gap-2 p-2 pt-4 ${colClass}`}>
                {row.blocks.map((col, colIndex) => (
                    <DroppableColumn
                        key={colIndex}
                        rowId={row.id}
                        colIndex={colIndex}
                        showBorder={row.columns > 1}
                    >
                        {col.map((block, blockIndex) => (
                            <SortableBlock
                                key={block.id}
                                block={block}
                                rowId={row.id}
                                colIndex={colIndex}
                                blockIndex={blockIndex}
                                isSelected={selectedBlockId === block.id}
                                onSelect={() => onSelectBlock(block.id, row.id)}
                                onMoveUp={() => onMoveBlock(row.id, colIndex, block.id, 'up')}
                                onMoveDown={() => onMoveBlock(row.id, colIndex, block.id, 'down')}
                                onDelete={() => onDeleteBlock(block.id)}
                                canMoveUp={blockIndex > 0}
                                canMoveDown={blockIndex < col.length - 1}
                                onInlineUpdate={onUpdateBlock}
                                onDoubleClickBlock={onDoubleClickBlock}
                            />
                        ))}
                    </DroppableColumn>
                ))}
            </div>
        </div>
    );
}