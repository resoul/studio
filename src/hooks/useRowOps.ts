import { useCallback } from 'react';
import { ColumnLayout, EmailBlock, EmailRow, EmailTemplate } from '@/types/email-builder';
import { uid } from '@/utils/uid';

type SetTemplate = (updater: (prev: EmailTemplate) => EmailTemplate) => void;

export function useRowOps(
    setTemplate: SetTemplate,
    selectedRowId: string | null,
    setSelectedRowId: (id: string | null) => void,
    setSelectedBlockId: (id: string | null) => void,
) {
    const addRow = useCallback(
        (columns: ColumnLayout = 1) => {
            const row: EmailRow = {
                id: uid('row'),
                columns,
                blocks: Array.from({ length: columns }, (): EmailBlock[] => []),
            };
            setTemplate(prev => ({ ...prev, rows: [...prev.rows, row] }));
        },
        [setTemplate],
    );

    const deleteRow = useCallback(
        (rowId: string) => {
            setTemplate(prev => ({ ...prev, rows: prev.rows.filter(r => r.id !== rowId) }));
            if (selectedRowId === rowId) {
                setSelectedBlockId(null);
                setSelectedRowId(null);
            }
        },
        [selectedRowId, setSelectedBlockId, setSelectedRowId, setTemplate],
    );

    const moveRow = useCallback(
        (rowId: string, direction: 'up' | 'down') => {
            setTemplate(prev => {
                const idx = prev.rows.findIndex(r => r.id === rowId);
                if (idx === -1) return prev;
                const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (newIdx < 0 || newIdx >= prev.rows.length) return prev;
                const newRows = [...prev.rows];
                [newRows[idx], newRows[newIdx]] = [newRows[newIdx], newRows[idx]];
                return { ...prev, rows: newRows };
            });
        },
        [setTemplate],
    );

    const changeRowColumns = useCallback(
        (rowId: string, columns: ColumnLayout) => {
            setTemplate(prev => ({
                ...prev,
                rows: prev.rows.map(row => {
                    if (row.id !== rowId) return row;
                    const newBlocks: EmailBlock[][] = Array.from(
                        { length: columns },
                        (_, i) => row.blocks[i] ?? [],
                    );
                    return { ...row, columns, blocks: newBlocks };
                }),
            }));
        },
        [setTemplate],
    );

    const getSelectedRow = useCallback(
        (template: EmailTemplate): EmailRow | null => {
            if (!selectedRowId) return null;
            return template.rows.find(r => r.id === selectedRowId) ?? null;
        },
        [selectedRowId],
    );

    return { addRow, deleteRow, moveRow, changeRowColumns, getSelectedRow };
}