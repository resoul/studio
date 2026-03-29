import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { ContextMenuState } from './types';
import { useMirroredBoolean } from './useMirroredBoolean';

interface AnchorPoint {
    x: number;
    y: number;
}

interface UseInlineEditorDropdownsParams {
    editorRef: RefObject<HTMLElement | null>;
}

export function useInlineEditorDropdowns({ editorRef }: UseInlineEditorDropdownsParams) {
    const {
        state: showPersonalization,
        stateRef: showPersonalizationRef,
        setState: setShowPersonalization,
    } = useMirroredBoolean(false);
    const {
        state: showConditional,
        stateRef: showConditionalRef,
        setState: setShowConditional,
    } = useMirroredBoolean(false);
    const {
        state: showAIRewrite,
        stateRef: showAIRewriteRef,
        setState: setShowAIRewrite,
    } = useMirroredBoolean(false);

    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ show: false, x: 0, y: 0 });
    const contextMenuRef = useRef(false);
    const [persAnchor, setPersAnchor] = useState<AnchorPoint | null>(null);
    const [condAnchor, setCondAnchor] = useState<AnchorPoint | null>(null);

    const openContextMenu = useCallback((x: number, y: number) => {
        contextMenuRef.current = true;
        setContextMenu({ show: true, x, y });
    }, []);

    const closeContextMenu = useCallback(() => {
        contextMenuRef.current = false;
        setContextMenu({ show: false, x: 0, y: 0 });
    }, []);

    const closeAllFloating = useCallback(() => {
        setShowPersonalization(false);
        setShowConditional(false);
        setShowAIRewrite(false);
        setPersAnchor(null);
        setCondAnchor(null);
        closeContextMenu();
    }, [closeContextMenu, setShowConditional, setShowPersonalization, setShowAIRewrite]);

    const openPersonalizationAt = useCallback((point: AnchorPoint) => {
        setPersAnchor(point);
        setShowPersonalization(true);
    }, [setShowPersonalization]);

    const openConditionalAt = useCallback((point: AnchorPoint) => {
        setCondAnchor(point);
        setShowConditional(true);
    }, [setShowConditional]);

    const openPersonalizationFromContextMenu = useCallback(() => {
        setPersAnchor({ x: contextMenu.x, y: contextMenu.y + 8 });
        setShowPersonalization(true);
    }, [contextMenu.x, contextMenu.y, setShowPersonalization]);

    const openConditionalFromContextMenu = useCallback(() => {
        setCondAnchor({ x: contextMenu.x, y: contextMenu.y + 8 });
        setShowConditional(true);
    }, [contextMenu.x, contextMenu.y, setShowConditional]);

    const toggleToolbarPersonalization = useCallback(() => {
        setPersAnchor(null);
        setCondAnchor(null);
        setShowConditional(false);
        setShowAIRewrite(false);
        setShowPersonalization((prev) => !prev);
    }, [setShowConditional, setShowPersonalization, setShowAIRewrite]);

    const toggleToolbarConditional = useCallback(() => {
        setCondAnchor(null);
        setPersAnchor(null);
        setShowPersonalization(false);
        setShowAIRewrite(false);
        setShowConditional((prev) => !prev);
    }, [setShowConditional, setShowPersonalization, setShowAIRewrite]);

    const toggleToolbarAIRewrite = useCallback(() => {
        setCondAnchor(null);
        setPersAnchor(null);
        setShowPersonalization(false);
        setShowConditional(false);
        setShowAIRewrite((prev) => !prev);
    }, [setShowConditional, setShowPersonalization, setShowAIRewrite]);

    const closeToolbarPersonalization = useCallback(() => {
        setShowPersonalization(false);
        setPersAnchor(null);
    }, [setShowPersonalization]);

    const closeToolbarConditional = useCallback(() => {
        setShowConditional(false);
        setCondAnchor(null);
    }, [setShowConditional]);

    const closeToolbarAIRewrite = useCallback(() => {
        setShowAIRewrite(false);
    }, [setShowAIRewrite]);

    useEffect(() => {
        if (!contextMenu.show && !showPersonalization && !showConditional && !showAIRewrite) return;

        const handleOutsideMouseDown = (e: MouseEvent) => {
            const target = e.target as Element;
            if (target.closest?.('[data-editor-dropdown]')) return;
            closeContextMenu();
            if (!editorRef.current?.contains(target)) {
                setShowPersonalization(false);
                setShowConditional(false);
                setShowAIRewrite(false);
                setPersAnchor(null);
                setCondAnchor(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideMouseDown);
        return () => document.removeEventListener('mousedown', handleOutsideMouseDown);
    }, [
        contextMenu.show,
        showPersonalization,
        showConditional,
        showAIRewrite,
        closeContextMenu,
        editorRef,
        setShowPersonalization,
        setShowConditional,
        setShowAIRewrite,
    ]);

    return {
        contextMenu,
        contextMenuRef,
        openContextMenu,
        closeContextMenu,
        showPersonalization,
        showPersonalizationRef,
        setShowPersonalization,
        showConditional,
        showConditionalRef,
        setShowConditional,
        showAIRewrite,
        showAIRewriteRef,
        setShowAIRewrite,
        persAnchor,
        setPersAnchor,
        condAnchor,
        setCondAnchor,
        closeAllFloating,
        openPersonalizationAt,
        openConditionalAt,
        openPersonalizationFromContextMenu,
        openConditionalFromContextMenu,
        toggleToolbarPersonalization,
        toggleToolbarConditional,
        toggleToolbarAIRewrite,
        closeToolbarPersonalization,
        closeToolbarConditional,
        closeToolbarAIRewrite,
    };
}
