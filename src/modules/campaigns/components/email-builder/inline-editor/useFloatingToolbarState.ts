import { MutableRefObject, RefObject, useCallback, useState } from 'react';
import { ToolbarState } from './types';
import { clampFloatingPoint } from './positioning';
import {
    queryBold, queryItalic, queryUnderline, queryStrikethrough,
    queryOrderedList, queryUnorderedList,
    queryAlignLeft, queryAlignCenter, queryAlignRight, queryAlignJustify,
    queryLink,
} from './formatting';

interface UseFloatingToolbarStateParams {
    editorRef: RefObject<HTMLElement | null>;
    savedRangeRef: MutableRefObject<Range | null>;
    showPersonalizationRef: MutableRefObject<boolean>;
    showConditionalRef: MutableRefObject<boolean>;
}

export function useFloatingToolbarState({
                                            editorRef,
                                            savedRangeRef,
                                            showPersonalizationRef,
                                            showConditionalRef,
                                        }: UseFloatingToolbarStateParams) {
    const [toolbar, setToolbar] = useState<ToolbarState>({
        show: false,
        x: 0,
        y: 0,
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        link: false,
        orderedList: false,
        unorderedList: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
        alignJustify: false,
    });

    const updateToolbar = useCallback(() => {
        if (showPersonalizationRef.current || showConditionalRef.current) return;

        const selection = window.getSelection();
        if (
            !selection ||
            selection.isCollapsed ||
            !editorRef.current?.contains(selection.anchorNode)
        ) {
            setToolbar(prev => ({ ...prev, show: false }));
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect.width && !rect.height) return;

        savedRangeRef.current = range.cloneRange();

        const clamped = clampFloatingPoint(
            { x: rect.left + rect.width / 2 - 140, y: rect.top - 48 },
            { width: 280, height: 42 },
        );

        setToolbar({
            show: true,
            x: clamped.x,
            y: clamped.y,
            bold: queryBold(),
            italic: queryItalic(),
            underline: queryUnderline(),
            strikethrough: queryStrikethrough(),
            orderedList: queryOrderedList(),
            unorderedList: queryUnorderedList(),
            alignLeft: queryAlignLeft(),
            alignCenter: queryAlignCenter(),
            alignRight: queryAlignRight(),
            alignJustify: queryAlignJustify(),
            link: queryLink(editorRef.current),
        });
    }, [editorRef, savedRangeRef, showConditionalRef, showPersonalizationRef]);

    return {
        toolbar,
        setToolbar,
        updateToolbar,
    };
}