import { useCallback, useState, useRef, KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CustomField, FIELD_TYPE_LABELS, FIELD_ENTITY_LABELS } from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';
import {
    Lock, Pencil, Trash2, GripVertical,
    Copy, ChevronDown, ChevronUp, Check, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldRowProps {
    field: CustomField;
    onEdit:      (field: CustomField) => void;
    onDelete:    (field: CustomField) => void;
    onDuplicate: (field: CustomField) => void;
    onLabelSave: (id: string, label: string) => void;
}

export function FieldRow({ field, onEdit, onDelete, onDuplicate, onLabelSave }: FieldRowProps) {
    const [expanded,      setExpanded]      = useState(false);
    const [inlineEditing, setInlineEditing] = useState(false);
    const [draftLabel,    setDraftLabel]    = useState(field.label);
    const inputRef = useRef<HTMLInputElement>(null);

    // ── dnd-kit sortable ──────────────────────────────────────────────────
    const {
        attributes, listeners, setNodeRef,
        transform, transition, isDragging,
    } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex:  isDragging ? 50 : undefined,
    };

    // ── handlers ──────────────────────────────────────────────────────────
    const handleEdit      = useCallback(() => onEdit(field),      [onEdit, field]);
    const handleDelete    = useCallback(() => onDelete(field),    [onDelete, field]);
    const handleDuplicate = useCallback(() => onDuplicate(field), [onDuplicate, field]);

    const startInlineEdit = useCallback(() => {
        if (field.system) return;
        setDraftLabel(field.label);
        setInlineEditing(true);
        setTimeout(() => inputRef.current?.select(), 0);
    }, [field]);

    const commitInlineEdit = useCallback(() => {
        const trimmed = draftLabel.trim();
        if (trimmed && trimmed !== field.label) onLabelSave(field.id, trimmed);
        setInlineEditing(false);
    }, [draftLabel, field, onLabelSave]);

    const cancelInlineEdit = useCallback(() => {
        setDraftLabel(field.label);
        setInlineEditing(false);
    }, [field.label]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter')  commitInlineEdit();
        if (e.key === 'Escape') cancelInlineEdit();
    }, [commitInlineEdit, cancelInlineEdit]);

    const hasExtras = field.description || field.placeholder || field.defaultValue || field.options.length > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'group rounded-lg border border-border bg-card transition-shadow',
                isDragging && 'shadow-lg ring-2 ring-primary/30',
            )}
        >
            {/* ── Main row ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/20 rounded-lg">

                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0 touch-none"
                    tabIndex={-1}
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Type icon */}
                <FieldTypeIcon type={field.type} size="md" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {/* Inline label edit */}
                        {inlineEditing ? (
                            <div className="flex items-center gap-1">
                                <input
                                    ref={inputRef}
                                    value={draftLabel}
                                    onChange={(e) => setDraftLabel(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={commitInlineEdit}
                                    className="text-sm font-medium bg-background border border-primary rounded px-1.5 py-0.5 outline-none w-40"
                                />
                                <button onClick={commitInlineEdit} className="text-green-600 hover:text-green-700">
                                    <Check className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={cancelInlineEdit} className="text-muted-foreground hover:text-destructive">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <span
                                className={cn(
                                    'text-sm font-medium text-foreground',
                                    !field.system && 'cursor-text hover:text-primary transition-colors',
                                )}
                                onDoubleClick={startInlineEdit}
                                title={!field.system ? 'Double-click to rename' : undefined}
                            >
                                {field.label}
                            </span>
                        )}

                        {field.system && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-secondary text-muted-foreground">
                                <Lock className="h-2.5 w-2.5" />
                                System
                            </span>
                        )}
                        {field.required && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-destructive/10 text-destructive">
                                Required
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[11px] text-muted-foreground font-mono">{field.key}</code>
                        <span className="text-[11px] text-muted-foreground">·</span>
                        <span className="text-[11px] text-muted-foreground">{FIELD_TYPE_LABELS[field.type]}</span>
                        {field.description && (
                            <>
                                <span className="text-[11px] text-muted-foreground">·</span>
                                <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">{field.description}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Entity badge */}
                <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 shrink-0 hidden sm:inline">
                    {FIELD_ENTITY_LABELS[field.entity]}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDuplicate}
                        title="Duplicate field"
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={handleEdit}
                        title="Edit field"
                        className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {!field.system && (
                        <button
                            onClick={handleDelete}
                            title="Delete field"
                            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                    {hasExtras && (
                        <button
                            onClick={() => setExpanded(v => !v)}
                            title={expanded ? 'Collapse' : 'Expand details'}
                            className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        >
                            {expanded
                                ? <ChevronUp  className="h-3.5 w-3.5" />
                                : <ChevronDown className="h-3.5 w-3.5" />
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* ── Expanded details ─────────────────────────────────────── */}
            {expanded && hasExtras && (
                <div className="px-10 pb-3 space-y-2 border-t border-border/50 pt-2.5 text-xs text-muted-foreground">
                    {field.description && (
                        <div>
                            <span className="font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Description</span>
                            <p className="mt-0.5">{field.description}</p>
                        </div>
                    )}
                    <div className="flex gap-6">
                        {field.placeholder && (
                            <div>
                                <span className="font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Placeholder</span>
                                <p className="mt-0.5 font-mono">{field.placeholder}</p>
                            </div>
                        )}
                        {field.defaultValue && (
                            <div>
                                <span className="font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Default</span>
                                <p className="mt-0.5 font-mono">{field.defaultValue}</p>
                            </div>
                        )}
                    </div>
                    {field.options.length > 0 && (
                        <div>
                            <span className="font-semibold text-foreground/60 uppercase tracking-wider text-[10px]">Options ({field.options.length})</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {field.options.map((opt) => (
                                    <span
                                        key={opt.id}
                                        className="inline-block px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                                    >
                                        {opt.label}
                                        <span className="text-muted-foreground/50 ml-1 font-mono">={opt.value}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}