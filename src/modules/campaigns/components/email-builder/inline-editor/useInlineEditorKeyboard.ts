import { KeyboardEvent as ReactKeyboardEvent, MutableRefObject, RefObject, useCallback } from 'react';
import { tryDeleteAdjacentChip } from './chipHelpers';

interface Point {
    x: number;
    y: number;
}

interface UseInlineEditorKeyboardParams {
    editorRef: RefObject<HTMLElement | null>;
    savedRangeRef: MutableRefObject<Range | null>;
    selectedChipRef: MutableRefObject<HTMLElement | null>;
    updateToolbar: () => void;
    syncContent: () => void;
    clearSelectedChip: () => void;
    closeContextMenu: () => void;
    openPersonalizationAt: (point: Point) => void;
    closeAllFloating: () => void;
    setShowPersonalization: (value: boolean) => void;
}

export function useInlineEditorKeyboard({
    editorRef,
    savedRangeRef,
    selectedChipRef,
    updateToolbar,
    syncContent,
    clearSelectedChip,
    closeContextMenu,
    openPersonalizationAt,
    closeAllFloating,
    setShowPersonalization,
}: UseInlineEditorKeyboardParams) {
    return useCallback((e: ReactKeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            closeContextMenu();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
                const rect = sel.getRangeAt(0).getBoundingClientRect();
                openPersonalizationAt({ x: Math.max(8, rect.left), y: rect.bottom + 8 });
            } else {
                const rect = editorRef.current?.getBoundingClientRect();
                if (rect) openPersonalizationAt({ x: rect.left, y: rect.bottom + 8 });
            }
            return;
        }

        if (e.key === 'Escape') {
            closeAllFloating();
            clearSelectedChip();
            return;
        }

        if ((e.key === 'Backspace' || e.key === 'Delete') && selectedChipRef.current) {
            e.preventDefault();
            e.stopPropagation();
            const chip = selectedChipRef.current;
            const parent = chip.parentNode!;
            const index = Array.from(parent.childNodes).indexOf(chip as ChildNode);
            chip.remove();
            selectedChipRef.current = null;
            const range = document.createRange();
            range.setStart(parent, Math.min(index, parent.childNodes.length));
            range.collapse(true);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
            syncContent();
            return;
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
            if (tryDeleteAdjacentChip(e.key === 'Backspace' ? 'before' : 'after')) {
                e.preventDefault();
                e.stopPropagation();
                syncContent();
                return;
            }
        }

        if (selectedChipRef.current && !e.metaKey && !e.ctrlKey) clearSelectedChip();

        if ((e.metaKey || e.ctrlKey) && ['b', 'i', 'u'].includes(e.key)) {
            e.stopPropagation();
            setTimeout(updateToolbar, 0);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setShowPersonalization(false);
            closeContextMenu();
            clearSelectedChip();
            editorRef.current?.blur();
            return;
        }

        e.stopPropagation();
    }, [
        clearSelectedChip,
        closeAllFloating,
        closeContextMenu,
        editorRef,
        openPersonalizationAt,
        savedRangeRef,
        selectedChipRef,
        setShowPersonalization,
        syncContent,
        updateToolbar,
    ]);
}
