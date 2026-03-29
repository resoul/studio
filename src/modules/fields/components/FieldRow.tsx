import { useCallback } from 'react';
import { CustomField, FIELD_TYPE_LABELS, FIELD_ENTITY_LABELS } from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';
import { Lock, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface FieldRowProps {
    field: CustomField;
    isFirst: boolean;
    isLast: boolean;
    onEdit:   (field: CustomField) => void;
    onDelete: (field: CustomField) => void;
    onMove:   (id: string, dir: 'up' | 'down') => void;
}

export function FieldRow({ field, isFirst, isLast, onEdit, onDelete, onMove }: FieldRowProps) {
    const handleEdit   = useCallback(() => onEdit(field),   [onEdit, field]);
    const handleDelete = useCallback(() => onDelete(field), [onDelete, field]);
    const handleUp     = useCallback(() => onMove(field.id, 'up'),   [onMove, field.id]);
    const handleDown   = useCallback(() => onMove(field.id, 'down'), [onMove, field.id]);

    return (
        <div className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-secondary/20">
            {/* Type icon */}
            <FieldTypeIcon type={field.type} size="md" />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{field.label}</span>
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
                <div className="flex items-center gap-3 mt-0.5">
                    <code className="text-[11px] text-muted-foreground font-mono">{field.key}</code>
                    <span className="text-[11px] text-muted-foreground">·</span>
                    <span className="text-[11px] text-muted-foreground">{FIELD_TYPE_LABELS[field.type]}</span>
                    {field.description && (
                        <>
                            <span className="text-[11px] text-muted-foreground">·</span>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[220px]">{field.description}</span>
                        </>
                    )}
                </div>
                {/* Options preview for select/multiselect */}
                {field.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {field.options.slice(0, 5).map((opt) => (
                            <span
                                key={opt.id}
                                className="inline-block px-1.5 py-0.5 rounded-full text-[10px] bg-secondary text-muted-foreground border border-border"
                            >
                                {opt.label}
                            </span>
                        ))}
                        {field.options.length > 5 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                                +{field.options.length - 5} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Entity badge */}
            <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5 shrink-0 hidden sm:inline">
                {FIELD_ENTITY_LABELS[field.entity]}
            </span>

            {/* Actions — visible on hover */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleUp}
                    disabled={isFirst}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                >
                    <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleDown}
                    disabled={isLast}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 transition-colors"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={handleEdit}
                    className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                {!field.system && (
                    <button
                        onClick={handleDelete}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}