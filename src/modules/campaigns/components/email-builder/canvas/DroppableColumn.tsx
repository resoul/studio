import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
    rowId: string;
    colIndex: number;
    children: React.ReactNode;
    showBorder: boolean;
}

export function DroppableColumn({ rowId, colIndex, children, showBorder }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: `col-${rowId}-${colIndex}`,
        data: { rowId, colIndex },
    });

    return (
        <div
            ref={setNodeRef}
            className={`group/col min-h-[40px] rounded-md transition-all duration-200 ${
                showBorder ? 'border border-dashed border-border/50 p-1' : ''
            } ${isOver ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20 scale-[1.01]' : ''}`}
        >
            {children}
        </div>
    );
}