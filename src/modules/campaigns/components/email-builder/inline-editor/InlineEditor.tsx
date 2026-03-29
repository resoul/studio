import { useRef, useCallback, useEffect, useState } from 'react';
import {
    DEFAULT_PERSONALIZATION_VARIABLES,
    PersonalizationVariable,
    VariableCategory,
    buildVariableHtml,
    buildConditionalHtml,
    ConditionalOperator,
} from '@/config/personalization';
import { ToolbarState, InlineEditorProps } from './types';
import { isVarChip, selectChip, deselectChip, clearAllSelectedChips } from './chipHelpers';
import { FloatingToolbar, PersonalizationDropdown, ConditionalDropdown, ContextMenu, AIRewriteDropdown } from './Toolbar';
import { useFloatingToolbarState } from './useFloatingToolbarState';
import { useInlineEditorDropdowns } from './useInlineEditorDropdowns';
import { useInlineEditorKeyboard } from './useInlineEditorKeyboard';
import { insertHtmlAtCaret } from './formatting';
import { mockAiRewrite } from '@/utils/aiRewriteMock';

export function InlineEditor({
                                 value, onChange, style, className, tag: Tag = 'div', extraVariables = [],
                             }: InlineEditorProps) {
    const ref = useRef<HTMLElement>(null);
    const lastValue = useRef(value);
    const savedRangeRef = useRef<Range | null>(null);
    const selectedChipRef = useRef<HTMLElement | null>(null);
    const contextLinkRef = useRef<HTMLAnchorElement | null>(null);
    const contextChipRef = useRef<HTMLElement | null>(null);
    const isFocused = useRef(false);
    const [contextType, setContextType] = useState<'default' | 'link' | 'chip'>('default');

    const {
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
        persAnchor,
        setPersAnchor,
        condAnchor,
        setCondAnchor,
        showAIRewrite,
        showAIRewriteRef,
        setShowAIRewrite,
        closeAllFloating,
        openPersonalizationAt,
        openPersonalizationFromContextMenu,
        openConditionalFromContextMenu,
        toggleToolbarPersonalization,
        toggleToolbarConditional,
        toggleToolbarAIRewrite,
        closeToolbarPersonalization,
        closeToolbarConditional,
        closeToolbarAIRewrite,
    } = useInlineEditorDropdowns({ editorRef: ref });

    // ── Variables ─────────────────────────────────────────────────────────────
    const [customVariables, setCustomVariables] = useState<PersonalizationVariable[]>([]);
    const allVariables = [
        ...DEFAULT_PERSONALIZATION_VARIABLES,
        ...extraVariables,
        ...customVariables,
    ].filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i);

    const { toolbar, setToolbar, updateToolbar } = useFloatingToolbarState({
        editorRef: ref,
        savedRangeRef,
        showPersonalizationRef,
        showConditionalRef,
    });

    // ── Mount: set initial HTML once ──────────────────────────────────────────
    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = value;
            lastValue.current = value;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Sync external value — only when NOT focused ───────────────────────────
    useEffect(() => {
        if (isFocused.current || !ref.current || value === lastValue.current) return;
        ref.current.innerHTML = value;
        lastValue.current = value;
    }, [value]);

    // ── Sync DOM → parent ─────────────────────────────────────────────────────
    const syncContent = useCallback(() => {
        if (!ref.current) return;
        const html = ref.current.innerHTML;
        if (html !== lastValue.current) {
            lastValue.current = html;
            onChange(html);
        }
    }, [onChange]);

    // ── Chip helpers ──────────────────────────────────────────────────────────
    const clearSelectedChip = useCallback(() => {
        if (selectedChipRef.current) {
            deselectChip(selectedChipRef.current);
            selectedChipRef.current = null;
        }
    }, []);

    // ── Focus / Blur ──────────────────────────────────────────────────────────
    const handleFocus = useCallback(() => { isFocused.current = true; }, []);

    const handleBlur = useCallback(() => {
        setTimeout(() => {
            if (!ref.current) return;
            if (showPersonalizationRef.current || contextMenuRef.current || showConditionalRef.current) return;
            if (ref.current.contains(document.activeElement)) return;
            isFocused.current = false;
            clearSelectedChip();
            setToolbar(prev => ({ ...prev, show: false }));
            syncContent();
        }, 150);
    }, [syncContent, clearSelectedChip]);

    // ── Click ─────────────────────────────────────────────────────────────────
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        closeContextMenu();
        const target = e.target as HTMLElement;
        if (isVarChip(target)) {
            clearAllSelectedChips(ref.current);
            selectChip(target);
            selectedChipRef.current = target;
            const range = document.createRange();
            range.setStartAfter(target);
            range.collapse(true);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
        } else {
            clearSelectedChip();
        }
    }, [clearSelectedChip, closeContextMenu]);

    // ── Right-click ───────────────────────────────────────────────────────────
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();

        const link = target.closest('a') as HTMLAnchorElement | null;
        const chip = target.hasAttribute('data-var')
            ? target
            : target.closest('[data-var]') as HTMLElement | null;
        contextLinkRef.current = link;
        contextChipRef.current = chip;
        if (link) setContextType('link');
        else if (chip) setContextType('chip');
        else setContextType('default');

        closeAllFloating();
        openContextMenu(e.clientX, e.clientY);
    }, [openContextMenu, closeAllFloating]);

    const handleKeyDown = useInlineEditorKeyboard({
        editorRef: ref,
        savedRangeRef,
        selectedChipRef,
        updateToolbar,
        syncContent,
        clearSelectedChip,
        closeContextMenu,
        openPersonalizationAt,
        closeAllFloating,
        setShowPersonalization,
    });

    // ── Restore saved range to DOM selection ──────────────────────────────────
    const restoreSavedRange = useCallback(() => {
        if (!savedRangeRef.current) return;
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(savedRangeRef.current);
    }, []);

    // ── Insert variable ───────────────────────────────────────────────────────
    const insertVariable = useCallback((variable: PersonalizationVariable) => {
        clearSelectedChip();
        setPersAnchor(null);
        ref.current?.focus();
        restoreSavedRange();
        insertHtmlAtCaret(buildVariableHtml(variable), ref.current ?? null);
        syncContent();
        setToolbar(prev => ({ ...prev, show: false }));
    }, [syncContent, clearSelectedChip, restoreSavedRange]);

    const addCustomVariable = useCallback((name: string, label: string) => {
        setCustomVariables(prev => [...prev, { name, label, category: 'contact' as VariableCategory }]);
    }, []);

    // ── Insert conditional ────────────────────────────────────────────────────
    const insertConditional = useCallback((variable: PersonalizationVariable, operator: ConditionalOperator, value: string) => {
        clearSelectedChip();
        setPersAnchor(null);
        setCondAnchor(null);
        ref.current?.focus();
        restoreSavedRange();
        insertHtmlAtCaret(buildConditionalHtml(variable, operator, value), ref.current ?? null);
        syncContent();
        setToolbar(prev => ({ ...prev, show: false }));
    }, [syncContent, clearSelectedChip, restoreSavedRange]);

    // ── AI Rewrite ────────────────────────────────────────────────────────────
    const [isRewriting, setIsRewriting] = useState(false);

    const handleRewrite = useCallback(async (prompt: string) => {
        if (!savedRangeRef.current || !ref.current) return;

        const selectionRange = savedRangeRef.current.cloneRange();
        const selectedText = selectionRange.toString();

        if (!selectedText.trim()) {
            setToolbar(prev => ({ ...prev, show: false }));
            return;
        }

        setIsRewriting(true);
        try {
            const rewritten = await mockAiRewrite(selectedText, prompt);

            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(selectionRange);

            insertHtmlAtCaret(rewritten, ref.current);
            syncContent();
        } catch (error) {
            console.error('AI Rewrite failed:', error);
        } finally {
            setIsRewriting(false);
            setToolbar(prev => ({ ...prev, show: false }));
        }
    }, [syncContent, setToolbar]);

    const handlePersonalizationDropdownClose = useCallback(() => {
        setShowPersonalization(false);
        setPersAnchor(null);
    }, [setShowPersonalization, setPersAnchor]);

    const handleConditionalDropdownClose = useCallback(() => {
        setShowConditional(false);
        setCondAnchor(null);
    }, [setShowConditional, setCondAnchor]);

    const handleEditorMouseUp = useCallback(() => {
        setTimeout(updateToolbar, 10);
    }, [updateToolbar]);

    const handleContextUnlink = useCallback(() => {
        const link = contextLinkRef.current;
        if (!link) return;
        const selection = window.getSelection();
        if (!selection) return;
        const range = document.createRange();
        range.selectNodeContents(link);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('unlink');
        syncContent();
        contextLinkRef.current = null;
    }, [syncContent]);

    const handleContextRemoveChip = useCallback(() => {
        const chip = contextChipRef.current;
        if (!chip) return;
        chip.remove();
        contextChipRef.current = null;
        selectedChipRef.current = null;
        syncContent();
    }, [syncContent]);

    const handleContextConvertChipToText = useCallback(() => {
        const chip = contextChipRef.current;
        if (!chip) return;
        const token = chip.getAttribute('data-var') || chip.textContent || '';
        chip.replaceWith(document.createTextNode(token));
        contextChipRef.current = null;
        selectedChipRef.current = null;
        syncContent();
    }, [syncContent]);

    const handleEditorRef = useCallback((node: HTMLElement | null) => {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }, []);

    // ── Global listeners ──────────────────────────────────────────────────────
    useEffect(() => {
        const handler = () => {
            if (showPersonalizationRef.current || showConditionalRef.current) return;
            updateToolbar();
        };
        document.addEventListener('selectionchange', handler);
        return () => document.removeEventListener('selectionchange', handler);
    }, [updateToolbar]);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <>
            <FloatingToolbar
                state={toolbar}
                containerRef={ref}
                showPersonalization={showPersonalization && !persAnchor}
                onTogglePersonalization={toggleToolbarPersonalization}
                onClosePersonalization={closeToolbarPersonalization}
                variables={allVariables}
                onInsertVariable={insertVariable}
                onAddCustomVariable={addCustomVariable}
                showConditional={showConditional && !condAnchor}
                onToggleConditional={toggleToolbarConditional}
                onCloseConditional={closeToolbarConditional}
                onInsertConditional={insertConditional}
                showAIRewrite={showAIRewrite}
                onToggleAIRewrite={toggleToolbarAIRewrite}
                onCloseAIRewrite={closeToolbarAIRewrite}
                onInsertRewrite={handleRewrite}
                isRewriting={isRewriting}
            />

            {showPersonalization && persAnchor && (
                <PersonalizationDropdown
                    variables={allVariables}
                    onInsert={insertVariable}
                    onClose={handlePersonalizationDropdownClose}
                    x={persAnchor.x}
                    y={persAnchor.y}
                    onAddCustom={addCustomVariable}
                />
            )}

            <ContextMenu
                state={contextMenu}
                onClose={closeContextMenu}
                onOpenPersonalization={openPersonalizationFromContextMenu}
                onOpenConditional={openConditionalFromContextMenu}
                contextType={contextType}
                onUnlink={handleContextUnlink}
                onRemoveChip={handleContextRemoveChip}
                onConvertChipToText={handleContextConvertChipToText}
            />

            {showConditional && condAnchor && (
                <ConditionalDropdown
                    onInsert={insertConditional}
                    onClose={handleConditionalDropdownClose}
                    x={condAnchor.x}
                    y={condAnchor.y}
                />
            )}

            {/* DOM managed via ref — no dangerouslySetInnerHTML to preserve caret */}
            <Tag
                ref={handleEditorRef}
                contentEditable
                suppressContentEditableWarning
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onInput={syncContent}
                onMouseUp={handleEditorMouseUp}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
                style={{ ...style, outline: 'none', cursor: 'text', minWidth: '1em' }}
                className={className}
            />
        </>
    );
}