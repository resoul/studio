import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Bold, Italic, Underline, Strikethrough,
    Link, Unlink, Type, Braces, Plus, X, ChevronDown, GitBranch, Eraser, Check,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Sparkles, Loader2
} from 'lucide-react';
import { EMAIL_FONT_CONFIG, findEmailFont } from '@/config/email-fonts';
import {
    CATEGORY_LABELS,
    CATEGORY_COLORS,
    PersonalizationVariable,
    VariableCategory,
    formatKey,
    DEFAULT_PERSONALIZATION_VARIABLES,
    CONDITIONAL_OPERATORS,
    ConditionalOperator,
} from '@/config/personalization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolbarState, ContextMenuState, TOOLBAR_COLORS } from './types';
import { clampFloatingPoint } from './positioning';
import {
    toggleBold, toggleItalic, toggleUnderline, toggleStrikethrough,
    toggleOrderedList, toggleUnorderedList,
    alignLeft, alignCenter, alignRight, alignJustify,
    clearFormatting,
    applyFontFamily, applyFontSize,
    applyLink, removeLink, applyColor,
    findSelectedAnchor,
    queryFontName, queryFontSize,
} from './formatting';

// ---------------------------------------------------------------------------
// PersonalizationDropdown
// ---------------------------------------------------------------------------

interface PersonalizationDropdownProps {
    variables: PersonalizationVariable[];
    onInsert: (variable: PersonalizationVariable) => void;
    onClose: () => void;
    x: number;
    y: number;
    onAddCustom: (name: string, label: string) => void;
}

export function PersonalizationDropdown({
                                            variables, onInsert, onClose, x, y, onAddCustom,
                                        }: PersonalizationDropdownProps) {
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newLabel, setNewLabel] = useState('');

    const filtered = variables.filter(v =>
        search === '' ||
        v.label.toLowerCase().includes(search.toLowerCase()) ||
        v.name.toLowerCase().includes(search.toLowerCase())
    );

    const grouped = (Object.keys(CATEGORY_LABELS) as VariableCategory[]).reduce(
        (acc, cat) => { acc[cat] = filtered.filter(v => v.category === cat); return acc; },
        {} as Record<VariableCategory, PersonalizationVariable[]>
    );

    const handleAdd = () => {
        if (!newName.trim() || !newLabel.trim()) return;
        onAddCustom(newName.replace(/[[\]{}%]/g, '').trim(), newLabel.trim());
        setShowAdd(false);
        setNewName('');
        setNewLabel('');
    };

    const position = clampFloatingPoint({ x, y }, { width: 260, height: 340 });

    return (
        <div
            data-editor-dropdown="true"
            className="fixed z-[60] rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95"
            style={{ left: position.x, top: position.y, width: 260 }}
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div className="p-2 border-b border-border">
                <input
                    autoFocus
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onMouseDown={e => e.stopPropagation()}
                    placeholder="Search variables…"
                    className="w-full rounded-md bg-secondary px-2.5 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                />
            </div>

            <div className="max-h-52 overflow-y-auto p-1">
                {filtered.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">No variables found</p>
                )}
                {(Object.keys(CATEGORY_LABELS) as VariableCategory[]).map(cat => {
                    const items = grouped[cat];
                    if (!items?.length) return null;
                    const { bg, text, border } = CATEGORY_COLORS[cat];
                    return (
                        <div key={cat}>
                            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {CATEGORY_LABELS[cat]}
                            </p>
                            {items.map(variable => (
                                <button
                                    key={variable.name}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        onInsert(variable);
                                        onClose();
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary"
                                >
                                    <span
                                        className="shrink-0 rounded px-1.5 py-0.5 font-mono font-semibold text-[10px]"
                                        style={{ background: bg, color: text, border: `1px solid ${border}` }}
                                    >
                                        {formatKey(variable.name)}
                                    </span>
                                    <span className="text-foreground">{variable.label}</span>
                                    {variable.fallback && (
                                        <span className="ml-auto text-[10px] text-muted-foreground">↩ {variable.fallback}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-border p-2">
                {!showAdd ? (
                    <button
                        onMouseDown={e => { e.preventDefault(); setShowAdd(true); }}
                        className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                        <Plus className="h-3 w-3" />
                        Add custom variable
                    </button>
                ) : (
                    <div className="space-y-1.5">
                        <input
                            autoFocus value={newLabel} onChange={e => setNewLabel(e.target.value)}
                            onMouseDown={e => e.stopPropagation()} placeholder="Label (e.g. Account ID)"
                            className="w-full rounded-md bg-secondary px-2.5 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                        />
                        <input
                            value={newName} onChange={e => setNewName(e.target.value)}
                            onMouseDown={e => e.stopPropagation()} placeholder="variable_name"
                            className="w-full rounded-md bg-secondary px-2.5 py-1.5 font-mono text-xs outline-none placeholder:text-muted-foreground"
                        />
                        {newName && (
                            <p className="text-[10px] text-muted-foreground px-1">
                                Preview: <span className="font-mono font-semibold text-foreground">
                                    {formatKey(newName.replace(/[[\]{}%]/g, '').trim() || 'name')}
                                </span>
                            </p>
                        )}
                        <div className="flex gap-1">
                            <button
                                onMouseDown={e => { e.preventDefault(); handleAdd(); }}
                                disabled={!newName.trim() || !newLabel.trim()}
                                className="flex-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
                            >Add</button>
                            <button
                                onMouseDown={e => { e.preventDefault(); setShowAdd(false); }}
                                className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
                            ><X className="h-3 w-3" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ConditionalDropdown
// ---------------------------------------------------------------------------

interface ConditionalDropdownProps {
    onInsert: (variable: PersonalizationVariable, operator: ConditionalOperator, value: string) => void;
    onClose: () => void;
    x: number;
    y: number;
}

export function ConditionalDropdown({ onInsert, onClose, x, y }: ConditionalDropdownProps) {
    const [variable, setVariable] = useState('');
    const [operator, setOperator] = useState<ConditionalOperator>('is_set');
    const [value, setValue] = useState('');

    const needsValue = !['is_set', 'is_not_set'].includes(operator);
    const selectedVar = DEFAULT_PERSONALIZATION_VARIABLES.find(v => v.name === variable);
    const canInsert = !!selectedVar;

    const position = clampFloatingPoint({ x, y }, { width: 260, height: 320 });

    return (
        <div
            data-editor-dropdown="true"
            className="fixed z-[60] rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95"
            style={{ left: position.x, top: position.y, width: 260 }}
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div className="p-2 border-b border-border">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1.5">Insert Conditional</p>
            </div>

            <div className="p-2 space-y-2">
                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Variable</label>
                    <Select value={variable} onValueChange={setVariable}>
                        <SelectTrigger className="h-7 w-full text-xs bg-secondary border-border" onMouseDown={e => e.stopPropagation()}>
                            <SelectValue placeholder="Select variable…" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            {DEFAULT_PERSONALIZATION_VARIABLES.map(v => (
                                <SelectItem key={v.name} value={v.name} className="text-xs">
                                    {v.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Condition</label>
                    <Select value={operator} onValueChange={v => setOperator(v as ConditionalOperator)}>
                        <SelectTrigger className="h-7 w-full text-xs bg-secondary border-border" onMouseDown={e => e.stopPropagation()}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            {CONDITIONAL_OPERATORS.map(op => (
                                <SelectItem key={op.value} value={op.value} className="text-xs">
                                    {op.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {needsValue && (
                    <div>
                        <label className="text-[10px] font-medium text-muted-foreground">Value</label>
                        <input
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onMouseDown={e => e.stopPropagation()}
                            placeholder="Enter value…"
                            className="mt-0.5 w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                )}
            </div>

            <div className="border-t border-border p-2 flex gap-1.5">
                <button
                    disabled={!canInsert}
                    onMouseDown={e => {
                        e.preventDefault();
                        if (selectedVar) {
                            onInsert(selectedVar, operator, value);
                            onClose();
                        }
                    }}
                    className="flex-1 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                >Insert</button>
                <button
                    onMouseDown={e => { e.preventDefault(); onClose(); }}
                    className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                ><X className="h-3 w-3" /></button>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// AIRewriteDropdown
// ---------------------------------------------------------------------------

interface AIRewriteDropdownProps {
    onInsert: (prompt: string) => void;
    onClose: () => void;
    x: number;
    y: number;
}

export function AIRewriteDropdown({ onInsert, onClose, x, y }: AIRewriteDropdownProps) {
    const [prompt, setPrompt] = useState('');
    const position = clampFloatingPoint({ x, y }, { width: 260, height: 200 });

    const presets = [
        { label: 'Fix spelling & grammar', prompt: 'Fix spelling and grammar' },
        { label: 'Make professional', prompt: 'Make it professional' },
        { label: 'Make shorter', prompt: 'Make it shorter' },
    ];

    return (
        <div
            data-editor-dropdown="true"
            className="fixed z-[60] rounded-lg border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95"
            style={{ left: position.x, top: position.y, width: 260 }}
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
        >
            <div className="p-2 border-b border-border flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">AI Rewrite</p>
            </div>

            <div className="p-2 space-y-1">
                {presets.map(p => (
                    <button
                        key={p.label}
                        onMouseDown={e => {
                            e.preventDefault();
                            onInsert(p.prompt);
                            onClose();
                        }}
                        className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-secondary text-foreground"
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="border-t border-border p-2 space-y-2">
                <input
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onMouseDown={e => e.stopPropagation()}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && prompt.trim()) {
                            e.preventDefault();
                            onInsert(prompt);
                            onClose();
                        }
                    }}
                    placeholder="Custom prompt..."
                    className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                />
                <div className="flex gap-1.5">
                    <button
                        disabled={!prompt.trim()}
                        onMouseDown={e => {
                            e.preventDefault();
                            onInsert(prompt);
                            onClose();
                        }}
                        className="flex-1 rounded-md bg-accent px-2 py-1.5 text-xs font-medium text-accent-foreground disabled:opacity-50"
                    >Rewrite</button>
                    <button
                        onMouseDown={e => { e.preventDefault(); onClose(); }}
                        className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                    ><X className="h-3 w-3" /></button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// ContextMenu
// ---------------------------------------------------------------------------

interface ContextMenuProps {
    state: ContextMenuState;
    onClose: () => void;
    onOpenPersonalization: () => void;
    onOpenConditional: () => void;
    contextType?: 'default' | 'link' | 'chip';
    onUnlink?: () => void;
    onRemoveChip?: () => void;
    onConvertChipToText?: () => void;
}

export function ContextMenu({
                                state,
                                onClose,
                                onOpenPersonalization,
                                onOpenConditional,
                                contextType = 'default',
                                onUnlink,
                                onRemoveChip,
                                onConvertChipToText,
                            }: ContextMenuProps) {
    if (!state.show) return null;
    const position = clampFloatingPoint({ x: state.x, y: state.y }, { width: 200, height: 120 });

    return (
        <div
            data-editor-dropdown="true"
            className="fixed z-[70] min-w-[180px] rounded-lg border border-border bg-popover py-1 shadow-xl animate-in fade-in-0 zoom-in-95"
            style={{ left: position.x, top: position.y }}
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); }}
        >
            <button
                onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenPersonalization();
                    onClose();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
                <Braces className="h-4 w-4 text-primary" />
                <span>Insert variable…</span>
                <span className="ml-auto text-[10px] text-muted-foreground">⌃Space</span>
            </button>
            <button
                onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenConditional();
                    onClose();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
                <GitBranch className="h-4 w-4 text-violet-500" />
                <span>Insert conditional…</span>
            </button>

            {contextType === 'link' && onUnlink && (
                <>
                    <div className="mx-2 my-1 h-px bg-border" />
                    <button
                        onMouseDown={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onUnlink();
                            onClose();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                        <Unlink className="h-4 w-4 text-destructive" />
                        <span>Remove link</span>
                    </button>
                </>
            )}

            {contextType === 'chip' && (
                <>
                    <div className="mx-2 my-1 h-px bg-border" />
                    {onConvertChipToText && (
                        <button
                            onMouseDown={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                onConvertChipToText();
                                onClose();
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                        >
                            <Type className="h-4 w-4 text-primary" />
                            <span>Convert to plain text</span>
                        </button>
                    )}
                    {onRemoveChip && (
                        <button
                            onMouseDown={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                onRemoveChip();
                                onClose();
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-secondary"
                        >
                            <X className="h-4 w-4 text-destructive" />
                            <span>Remove chip</span>
                        </button>
                    )}
                </>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// FloatingToolbar
// ---------------------------------------------------------------------------

interface FloatingToolbarProps {
    state: ToolbarState;
    containerRef: React.RefObject<HTMLElement | null>;
    showPersonalization: boolean;
    onTogglePersonalization: () => void;
    onClosePersonalization: () => void;
    variables: PersonalizationVariable[];
    onInsertVariable: (variable: PersonalizationVariable) => void;
    onAddCustomVariable: (name: string, label: string) => void;
    showConditional: boolean;
    onToggleConditional: () => void;
    onCloseConditional: () => void;
    onInsertConditional: (variable: PersonalizationVariable, operator: ConditionalOperator, value: string) => void;
    showAIRewrite: boolean;
    onToggleAIRewrite: () => void;
    onCloseAIRewrite: () => void;
    onInsertRewrite: (prompt: string) => void;
    isRewriting: boolean;
}

export function FloatingToolbar({
                                    state, containerRef,
                                    showPersonalization, onTogglePersonalization, onClosePersonalization,
                                    variables, onInsertVariable, onAddCustomVariable,
                                    showConditional, onToggleConditional, onCloseConditional,
                                    onInsertConditional,
                                    showAIRewrite, onToggleAIRewrite, onCloseAIRewrite,
                                    onInsertRewrite, isRewriting,
                                }: FloatingToolbarProps) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);
    const [showSizePicker, setShowSizePicker] = useState(false);
    const [showLinkEditor, setShowLinkEditor] = useState(false);
    const [linkDraft, setLinkDraft] = useState('');
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [toolbarSize, setToolbarSize] = useState({ width: 280, height: 42 });

    const container = containerRef.current;

    useEffect(() => {
        if (!state.show || !rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        setToolbarSize({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
    }, [state.show, showColorPicker, showFontPicker, showSizePicker]);

    useEffect(() => {
        if (!state.show) return;
        const onResize = () => {
            if (!rootRef.current) return;
            const rect = rootRef.current.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            setToolbarSize({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [state.show]);

    const currentFontRaw = queryFontName();
    const currentFontEntry = currentFontRaw ? findEmailFont(currentFontRaw) : undefined;
    const currentFontLabel = currentFontEntry?.label || 'Font';
    const currentSize = queryFontSize(container ?? null);

    const FONT_SIZES = [10, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64];

    const closeAllPickers = useCallback(() => {
        setShowColorPicker(false);
        setShowFontPicker(false);
        setShowSizePicker(false);
        setShowLinkEditor(false);
    }, []);

    const handleToggleLinkEditor = useCallback(() => {
        const anchor = findSelectedAnchor(container ?? null);
        setLinkDraft(anchor?.getAttribute('href') || '');
        setShowLinkEditor(v => !v);
        setShowColorPicker(false);
        setShowFontPicker(false);
        setShowSizePicker(false);
        onClosePersonalization();
        onCloseConditional();
    }, [container, onCloseConditional, onClosePersonalization]);

    const normalizeUrl = useCallback((url: string) => {
        const trimmed = url.trim();
        if (!trimmed) return '';
        if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    }, []);

    const handleApplyLink = useCallback(() => {
        const normalized = normalizeUrl(linkDraft);
        if (!normalized) return;
        applyLink(normalized, container ?? null);
        setShowLinkEditor(false);
    }, [container, linkDraft, normalizeUrl]);

    const handleUnlink = useCallback(() => {
        removeLink(container ?? null);
        setShowLinkEditor(false);
    }, [container]);

    if (!state.show) return null;

    const toolbarPosition = clampFloatingPoint(
        { x: state.x, y: state.y },
        toolbarSize,
    );
    const anchoredDropdown = clampFloatingPoint(
        { x: toolbarPosition.x - 10, y: toolbarPosition.y + toolbarSize.height + 8 },
        { width: 260, height: 340 },
    );

    return (
        <>
            <div
                ref={rootRef}
                data-editor-dropdown="true"
                className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1 py-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                style={{ left: toolbarPosition.x, top: toolbarPosition.y }}
                onMouseDown={e => e.preventDefault()}
            >
                {/* Font family picker */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowFontPicker(v => !v);
                            setShowColorPicker(false);
                            setShowSizePicker(false);
                            setShowLinkEditor(false);
                            onClosePersonalization();
                        }}
                        title="Font family"
                        className={`flex items-center gap-0.5 rounded px-1.5 py-1 text-[11px] transition-colors max-w-[90px] ${
                            showFontPicker ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-secondary'
                        }`}
                        onMouseDown={e => e.preventDefault()}
                    >
                        <span className="truncate">{currentFontLabel}</span>
                        <ChevronDown className="h-3 w-3 shrink-0" />
                    </button>
                    {showFontPicker && (
                        <div
                            data-editor-dropdown="true"
                            className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-popover shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
                            onMouseDown={e => e.preventDefault()}
                        >
                            <div className="max-h-48 overflow-y-auto py-1">
                                {EMAIL_FONT_CONFIG.map(font => (
                                    <button
                                        key={font.key}
                                        className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-secondary ${
                                            currentFontEntry?.key === font.key ? 'bg-secondary font-semibold' : ''
                                        }`}
                                        style={{ fontFamily: font.cssStack }}
                                        onMouseDown={e => {
                                            e.preventDefault();
                                            applyFontFamily(font.cssStack, container ?? null);
                                            setShowFontPicker(false);
                                        }}
                                    >
                                        {font.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Font size picker */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowSizePicker(v => !v);
                            setShowFontPicker(false);
                            setShowColorPicker(false);
                            setShowLinkEditor(false);
                            onClosePersonalization();
                        }}
                        title="Font size"
                        className={`flex items-center gap-0.5 rounded px-1.5 py-1 text-[11px] transition-colors min-w-[36px] justify-center ${
                            showSizePicker ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-secondary'
                        }`}
                        onMouseDown={e => e.preventDefault()}
                    >
                        <span>{currentSize || '—'}</span>
                        <ChevronDown className="h-3 w-3 shrink-0" />
                    </button>
                    {showSizePicker && (
                        <div
                            data-editor-dropdown="true"
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-20 rounded-lg border border-border bg-popover shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
                            onMouseDown={e => e.preventDefault()}
                        >
                            <div className="max-h-48 overflow-y-auto py-1">
                                {FONT_SIZES.map(size => (
                                    <button
                                        key={size}
                                        className={`w-full px-3 py-1.5 text-center text-xs transition-colors hover:bg-secondary ${
                                            currentSize === size.toString() ? 'bg-secondary font-semibold' : ''
                                        }`}
                                        onMouseDown={e => {
                                            e.preventDefault();
                                            applyFontSize(size, container ?? null);
                                            setShowSizePicker(false);
                                        }}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarButton active={state.bold} onClick={() => toggleBold(container ?? null)} title="Bold">
                    <Bold className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.italic} onClick={() => toggleItalic(container ?? null)} title="Italic">
                    <Italic className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.underline} onClick={() => toggleUnderline(container ?? null)} title="Underline">
                    <Underline className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.strikethrough} onClick={() => toggleStrikethrough(container ?? null)} title="Strikethrough">
                    <Strikethrough className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={false} onClick={() => clearFormatting(container ?? null)} title="Clear formatting">
                    <Eraser className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarButton active={state.unorderedList} onClick={() => toggleUnorderedList(container ?? null)} title="Bullet List">
                    <List className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.orderedList} onClick={() => toggleOrderedList(container ?? null)} title="Numbered List">
                    <ListOrdered className="h-3.5 w-3.5" />
                </ToolbarButton>

                <ToolbarButton active={state.alignLeft} onClick={() => alignLeft(container ?? null)} title="Align Left">
                    <AlignLeft className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.alignCenter} onClick={() => alignCenter(container ?? null)} title="Align Center">
                    <AlignCenter className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.alignRight} onClick={() => alignRight(container ?? null)} title="Align Right">
                    <AlignRight className="h-3.5 w-3.5" />
                </ToolbarButton>
                <ToolbarButton active={state.alignJustify} onClick={() => alignJustify(container ?? null)} title="Justify">
                    <AlignJustify className="h-3.5 w-3.5" />
                </ToolbarButton>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarButton
                    active={showLinkEditor || state.link}
                    onClick={handleToggleLinkEditor}
                    title={state.link ? 'Edit or remove link' : 'Add link'}
                >
                    {state.link ? <Unlink className="h-3.5 w-3.5" /> : <Link className="h-3.5 w-3.5" />}
                </ToolbarButton>

                {showLinkEditor && (
                    <div
                        data-editor-dropdown="true"
                        className="absolute top-full left-1/2 z-[70] mt-1 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-2 shadow-lg"
                        onMouseDown={e => e.preventDefault()}
                    >
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Link</p>
                        <input
                            value={linkDraft}
                            onChange={e => setLinkDraft(e.target.value)}
                            onMouseDown={e => e.stopPropagation()}
                            placeholder="https://example.com"
                            className="w-full rounded-md border border-border bg-secondary px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
                        />
                        <div className="mt-2 flex gap-1.5">
                            <button
                                onMouseDown={e => { e.preventDefault(); handleApplyLink(); }}
                                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground"
                            >
                                <Check className="h-3 w-3" />
                                Apply
                            </button>
                            {state.link && (
                                <button
                                    onMouseDown={e => { e.preventDefault(); handleUnlink(); }}
                                    className="rounded-md px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                                >
                                    Unlink
                                </button>
                            )}
                            <button
                                onMouseDown={e => { e.preventDefault(); setShowLinkEditor(false); }}
                                className="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative">
                    <ToolbarButton
                        active={showColorPicker}
                        onClick={() => {
                            setShowColorPicker(v => !v);
                            setShowFontPicker(false);
                            setShowSizePicker(false);
                            setShowLinkEditor(false);
                            onClosePersonalization();
                        }}
                        title="Text color"
                    >
                        <Type className="h-3.5 w-3.5" />
                    </ToolbarButton>
                    {showColorPicker && (
                        <div
                            data-editor-dropdown="true"
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 rounded-lg border border-border bg-popover shadow-lg grid grid-cols-3 gap-1.5"
                            onMouseDown={e => e.preventDefault()}
                        >
                            {TOOLBAR_COLORS.map(color => (
                                <button
                                    key={color}
                                    className="h-6 w-6 rounded-full border border-border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        applyColor(color, container ?? null);
                                        setShowColorPicker(false);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarButton
                    active={showPersonalization}
                    onClick={() => {
                        closeAllPickers();
                        onCloseConditional();
                        onTogglePersonalization();
                    }}
                    title="Insert variable (Ctrl+Space)"
                >
                    <Braces className="h-3.5 w-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    active={showConditional}
                    onClick={() => {
                        closeAllPickers();
                        onClosePersonalization();
                        onCloseAIRewrite();
                        onToggleConditional();
                    }}
                    title="Insert conditional (IF/ELSE)"
                >
                    <GitBranch className="h-3.5 w-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    active={showAIRewrite || isRewriting}
                    onClick={() => {
                        closeAllPickers();
                        onCloseConditional();
                        onClosePersonalization();
                        onToggleAIRewrite();
                    }}
                    title="AI Rewrite"
                >
                    {isRewriting
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                        : <Sparkles className="h-3.5 w-3.5 text-accent" />
                    }
                </ToolbarButton>
            </div>

            {showPersonalization && (
                <PersonalizationDropdown
                    variables={variables}
                    onInsert={onInsertVariable}
                    onClose={onClosePersonalization}
                    x={anchoredDropdown.x}
                    y={anchoredDropdown.y}
                    onAddCustom={onAddCustomVariable}
                />
            )}

            {showConditional && (
                <ConditionalDropdown
                    onInsert={onInsertConditional}
                    onClose={onCloseConditional}
                    x={anchoredDropdown.x}
                    y={anchoredDropdown.y}
                />
            )}

            {showAIRewrite && (
                <AIRewriteDropdown
                    onInsert={onInsertRewrite}
                    onClose={onCloseAIRewrite}
                    x={anchoredDropdown.x}
                    y={anchoredDropdown.y}
                />
            )}
        </>
    );
}

// ---------------------------------------------------------------------------
// ToolbarButton (internal)
// ---------------------------------------------------------------------------

function ToolbarButton({ active, onClick, title, children }: {
    active: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`rounded p-1.5 transition-colors ${
                active ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-secondary'
            }`}
        >
            {children}
        </button>
    );
}