import { useState, useEffect, useCallback } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    pointerWithin,
    CollisionDetection,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useEmailBuilder, createDefaultBlock } from '@/hooks/useEmailBuilder';
import { BuilderHeader } from '@/modules/campaigns/components/email-builder/BuilderHeader.tsx';
import { Canvas } from '@/modules/campaigns/components/email-builder/Canvas.tsx';
import { PropertiesPanel } from '@/modules/campaigns/components/email-builder/PropertiesPanel.tsx';
import { PreviewModal } from '@/modules/campaigns/components/email-builder/PreviewModal.tsx';
import { ExportModal } from '@/modules/campaigns/components/email-builder/ExportModal.tsx';
import { PreviewExportSheet } from '@/modules/campaigns/components/email-builder/PreviewExportSheet.tsx';
import { EmailBuilderSheet } from '@/modules/campaigns/components/email-builder/EmailBuilderSheet.tsx';
import { WelcomeScreen } from '@/modules/campaigns/components/email-builder/WelcomeScreen.tsx';
import { UploadHtmlModal } from '@/modules/campaigns/components/email-builder/UploadHtmlModal.tsx';
import { AIGenerateModal } from '@/modules/campaigns/components/email-builder/AIGenerateModal.tsx';
import { TemplatePickerModal } from '@/modules/campaigns/components/email-builder/TemplatePickerModal.tsx';
import { BlockRenderer } from '@/modules/campaigns/components/email-builder/BlockRenderer.tsx';
import { ImageEditorModal } from '@/modules/campaigns/components/email-builder/ImageEditorModal.tsx';
import { LeftSidebar } from '@/modules/campaigns/components/email-builder/index-page/LeftSidebar.tsx';
import { PaletteDragPreview } from '@/modules/campaigns/components/email-builder/index-page/PaletteDragPreview.tsx';
import { BlockType, EmailBlock, EmailTemplate } from '@/types/email-builder.ts';
import { useIsMobile } from '@/hooks/use-mobile.tsx';
import { Button } from '@/components/ui/button.tsx';
import { SlidersHorizontal } from 'lucide-react';

const Index = () => {
    const builder = useEmailBuilder();
    const {
        template,
        selectedBlockId,
        selectedRowId,
        setSelectedBlockId,
        setSelectedRowId,
        addRow,
        addBlockToRow,
        addBlockToCanvas,
        updateBlock,
        deleteBlock,
        deleteRow,
        moveRow,
        moveBlock,
        changeRowColumns,
        getSelectedBlock,
        undo,
        redo,
        canUndo,
        canRedo,
        setTemplate,
        reorderBlock,
    } = builder;

    const [showPreview, setShowPreview] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [showPreviewExportSheet, setShowPreviewExportSheet] = useState(false);
    const [showMobileProperties, setShowMobileProperties] = useState(false);
    const [includeGoogleFonts, setIncludeGoogleFonts] = useState(true);
    const [exportFileName, setExportFileName] = useState('email-template.html');
    const [showUpload, setShowUpload] = useState(false);
    const [showAIGenerate, setShowAIGenerate] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [dragOverlay, setDragOverlay] = useState<EmailBlock | null>(null);
    const [dragSource, setDragSource] = useState<'palette' | 'canvas' | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeDropId, setActiveDropId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [leftPanelTab, setLeftPanelTab] = useState<'structure' | 'content'>('structure');
    const [editingImageBlockId, setEditingImageBlockId] = useState<string | null>(null);
    const isMobile = useIsMobile();

    const isEmpty = template.rows.length === 0;
    const selectedBlock = getSelectedBlock();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo(); else undo();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setIsDragging(true);
        const data = event.active.data.current;
        if (data?.source === 'palette') {
            setDragSource('palette');
            setDragOverlay(createDefaultBlock(data.blockType as BlockType));
        } else if (data?.source === 'canvas' && data?.block) {
            setDragSource('canvas');
            setDragOverlay(data.block);
        }
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        setActiveDropId(event.over?.id ? String(event.over.id) : null);
    }, []);

    const collisionDetection = useCallback<CollisionDetection>((args) => {
        const pointerCollisions = pointerWithin(args);
        if (pointerCollisions.length > 0) {
            const isPaletteDrag = args.active.data.current?.source === 'palette';
            if (isPaletteDrag) {
                const columnCollisions = pointerCollisions.filter((c) => String(c.id).startsWith('col-'));
                if (columnCollisions.length > 0) return columnCollisions;
                if (template.rows.length === 0) {
                    return pointerCollisions.filter((c) => String(c.id) === 'canvas-drop');
                }
                return [];
            }
            return pointerCollisions;
        }
        if (args.active.data.current?.source === 'canvas') {
            return closestCenter(args);
        }
        return [];
    }, [template.rows.length]);

    const resetDragState = useCallback(() => {
        setDragOverlay(null);
        setDragSource(null);
        setIsDragging(false);
        setActiveDropId(null);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        resetDragState();
        const { active, over } = event;
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.source === 'palette') {
            const blockType = activeData.blockType as BlockType;
            if (overData?.rowId !== undefined && overData?.colIndex !== undefined) {
                addBlockToRow(overData.rowId, overData.colIndex, blockType);
            } else if (over.id === 'canvas-drop' && template.rows.length === 0) {
                addBlockToCanvas(blockType);
            }
            return;
        }

        if (activeData?.source === 'canvas') {
            const fromRowId = activeData.rowId as string;
            const fromColIndex = activeData.colIndex as number;
            const fromBlockIndex = activeData.blockIndex as number;

            if (overData?.rowId !== undefined && overData?.colIndex !== undefined) {
                const toRowId = overData.rowId as string;
                const toColIndex = overData.colIndex as number;
                const targetRow = template.rows.find((r) => r.id === toRowId);
                const toBlockIndex = targetRow?.blocks[toColIndex]?.length ?? 0;
                if (fromRowId !== toRowId || fromColIndex !== toColIndex || fromBlockIndex !== toBlockIndex) {
                    reorderBlock(fromRowId, fromColIndex, fromBlockIndex, toRowId, toColIndex, toBlockIndex);
                }
                return;
            }

            if (over.data.current?.source === 'canvas') {
                const toRowId = over.data.current.rowId as string;
                const toColIndex = over.data.current.colIndex as number;
                const toBlockIndex = over.data.current.blockIndex as number;
                if (fromRowId !== toRowId || fromColIndex !== toColIndex || fromBlockIndex !== toBlockIndex) {
                    reorderBlock(fromRowId, fromColIndex, fromBlockIndex, toRowId, toColIndex, toBlockIndex);
                }
            }
        }
    }, [addBlockToCanvas, addBlockToRow, reorderBlock, resetDragState, template.rows]);

    const handleStartScratch = useCallback(() => addRow(1), [addRow]);
    const handleImportTemplate = useCallback((nextTemplate: EmailTemplate) => setTemplate(nextTemplate), [setTemplate]);
    const handleSelectBlock = useCallback((blockId: string, rowId: string) => {
        setSelectedBlockId(blockId);
        setSelectedRowId(rowId);
    }, [setSelectedBlockId, setSelectedRowId]);
    const handleDeselectAll = useCallback(() => {
        setSelectedBlockId(null);
        setSelectedRowId(null);
    }, [setSelectedBlockId, setSelectedRowId]);
    const handleUpdateTemplate = useCallback((updates: Partial<EmailTemplate>) => {
        setTemplate((prev) => ({ ...prev, ...updates }));
    }, [setTemplate]);

    const handleDoubleClickBlock = useCallback((blockId: string) => {
        const block = template.rows.flatMap((r) => r.blocks.flatMap((col) => col)).find((b) => b.id === blockId);
        if (block && ['image', 'hero', 'product-card'].includes(block.type)) {
            setEditingImageBlockId(block.id);
        }
    }, [template.rows]);

    const openPreview = useCallback(() => setShowPreview(true), []);
    const openExport = useCallback(() => setShowExport(true), []);
    const openPreviewExportSettings = useCallback(() => setShowPreviewExportSheet(true), []);
    const openUpload = useCallback(() => setShowUpload(true), []);
    const openAIGenerate = useCallback(() => setShowAIGenerate(true), []);
    const openTemplates = useCallback(() => setShowTemplates(true), []);

    const allBlockIds = template.rows.flatMap((r) => r.blocks.flatMap((col) => col.map((b) => b.id)));

    return (
        <div className="flex h-full flex-col bg-canvas">
            <BuilderHeader
                isEmpty={isEmpty}
                onPreview={openPreviewExportSettings}
                onExport={openPreviewExportSettings}
                onStartScratch={handleStartScratch}
                onUploadHtml={openUpload}
                onGenerateAI={openAIGenerate}
                onOpenTemplates={openTemplates}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={resetDragState}
            >
                <div className="flex flex-1 overflow-hidden">
                    {isEmpty ? (
                        <WelcomeScreen
                            onStartScratch={handleStartScratch}
                            onUploadHtml={openUpload}
                            onGenerateAI={openAIGenerate}
                            onSelectTemplate={handleImportTemplate}
                        />
                    ) : (
                        <>
                            <LeftSidebar
                                leftPanelTab={leftPanelTab}
                                onLeftPanelTabChange={setLeftPanelTab}
                                onAddRow={addRow}
                                onAddBlockToCanvas={addBlockToCanvas}
                            />
                            <SortableContext items={allBlockIds} strategy={verticalListSortingStrategy}>
                                <Canvas
                                    template={template}
                                    selectedBlockId={selectedBlockId}
                                    selectedRowId={selectedRowId}
                                    viewMode={viewMode}
                                    isDragging={isDragging}
                                    activeDropId={activeDropId}
                                    onSelectBlock={handleSelectBlock}
                                    onDeselectAll={handleDeselectAll}
                                    onMoveRow={moveRow}
                                    onMoveBlock={moveBlock}
                                    onDeleteBlock={deleteBlock}
                                    onDeleteRow={deleteRow}
                                    onChangeRowColumns={changeRowColumns}
                                    onAddBlockToRow={addBlockToRow}
                                    onUpdateBlock={updateBlock}
                                    onDoubleClickBlock={handleDoubleClickBlock}
                                />
                            </SortableContext>
                            {!isMobile && (
                                <div className="w-72 shrink-0 overflow-y-auto border-l border-border bg-card">
                                    <PropertiesPanel
                                        block={selectedBlock}
                                        onUpdate={updateBlock}
                                        template={template}
                                        onUpdateTemplate={handleUpdateTemplate}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <DragOverlay>
                    {dragOverlay && (
                        dragSource === 'palette'
                            ? <PaletteDragPreview type={dragOverlay.type} />
                            : (
                                <div className="rounded-md border border-primary bg-white p-2 shadow-lg opacity-90 max-w-[300px]">
                                    <BlockRenderer block={dragOverlay} />
                                </div>
                            )
                    )}
                </DragOverlay>
            </DndContext>

            {isMobile && !isEmpty && (
                <Button
                    onClick={() => setShowMobileProperties(true)}
                    className="fixed bottom-4 right-4 z-40 shadow-lg"
                    size="sm"
                >
                    <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                    Properties
                </Button>
            )}

            <EmailBuilderSheet
                open={showMobileProperties}
                onOpenChange={setShowMobileProperties}
                side="bottom"
                className="h-[78vh] rounded-t-2xl"
                title="Properties"
                description="Edit block and template settings."
            >
                <PropertiesPanel
                    block={selectedBlock}
                    onUpdate={updateBlock}
                    template={template}
                    onUpdateTemplate={handleUpdateTemplate}
                />
            </EmailBuilderSheet>

            <PreviewExportSheet
                open={showPreviewExportSheet}
                onOpenChange={setShowPreviewExportSheet}
                includeGoogleFonts={includeGoogleFonts}
                onIncludeGoogleFontsChange={setIncludeGoogleFonts}
                exportFileName={exportFileName}
                onExportFileNameChange={setExportFileName}
                onOpenPreview={openPreview}
                onOpenExport={openExport}
            />

            <PreviewModal
                open={showPreview}
                onOpenChange={setShowPreview}
                template={template}
                includeGoogleFonts={includeGoogleFonts}
            />
            <ExportModal
                open={showExport}
                onOpenChange={setShowExport}
                template={template}
                includeGoogleFonts={includeGoogleFonts}
                fileName={exportFileName}
            />
            <UploadHtmlModal open={showUpload} onOpenChange={setShowUpload} onImport={handleImportTemplate} />
            <AIGenerateModal open={showAIGenerate} onOpenChange={setShowAIGenerate} onGenerate={handleImportTemplate} />
            <TemplatePickerModal open={showTemplates} onOpenChange={setShowTemplates} onSelectTemplate={handleImportTemplate} />

            {editingImageBlockId && (() => {
                const editingImageBlock = template.rows.flatMap((r) => r.blocks.flatMap((col) => col)).find((b) => b.id === editingImageBlockId);
                const editingImageUrl =
                    editingImageBlock?.type === 'image' ? editingImageBlock.src :
                        (editingImageBlock?.type === 'hero' || editingImageBlock?.type === 'product-card') ? editingImageBlock.imageUrl : '';
                return (
                    <ImageEditorModal
                        open={!!editingImageBlockId}
                        onOpenChange={(open) => !open && setEditingImageBlockId(null)}
                        currentSrc={editingImageUrl}
                        onSave={(newSrc) => {
                            if (editingImageBlock?.type === 'image') updateBlock(editingImageBlockId, { src: newSrc });
                            else if (editingImageBlock?.type === 'hero' || editingImageBlock?.type === 'product-card') updateBlock(editingImageBlockId, { imageUrl: newSrc });
                            setEditingImageBlockId(null);
                        }}
                    />
                );
            })()}
        </div>
    );
};

export default Index;