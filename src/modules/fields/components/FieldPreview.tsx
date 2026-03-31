import { CustomField } from '@/types/fields';
import { Star } from 'lucide-react';

interface FieldPreviewProps {
    field: CustomField;
}

export function FieldPreview({ field }: FieldPreviewProps) {
    const maxRating = field.validation?.maxRating ?? 5;

    return (
        <div className="rounded-lg border border-border bg-secondary/20 p-5">
            <div className="space-y-1.5 max-w-sm">
                {/* Label */}
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                    {field.label || <span className="text-muted-foreground italic">Label</span>}
                    {field.required && <span className="text-destructive text-xs">*</span>}
                </label>

                {/* Description */}
                {field.description && (
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                )}

                {/* Input */}
                <PreviewInput field={field} maxRating={maxRating} />

                {/* Validation hints */}
                {field.validation?.pattern && (
                    <p className="text-[10px] text-muted-foreground font-mono">
                        Pattern: {field.validation.pattern}
                    </p>
                )}
                {field.validation?.min !== undefined && (
                    <p className="text-[10px] text-muted-foreground">
                        Min: {field.validation.min}
                        {field.validation.max !== undefined && ` · Max: ${field.validation.max}`}
                    </p>
                )}
                {field.validation?.allowedDomains?.length && (
                    <p className="text-[10px] text-muted-foreground">
                        Allowed domains: {field.validation.allowedDomains.join(', ')}
                    </p>
                )}
            </div>
        </div>
    );
}

function PreviewInput({ field, maxRating }: { field: CustomField; maxRating: number }) {
    const base = 'w-full rounded-md border border-input bg-background text-sm px-3 py-2 text-muted-foreground pointer-events-none select-none';

    switch (field.type) {
        case 'text':
        case 'email':
        case 'phone':
        case 'url':
        case 'number':
            return (
                <div className={base}>
                    {field.placeholder || <span className="opacity-50">{field.type} input</span>}
                </div>
            );

        case 'textarea':
            return (
                <div className={`${base} min-h-[72px]`}>
                    {field.placeholder || <span className="opacity-50">Long text…</span>}
                </div>
            );

        case 'date':
        case 'datetime':
            return (
                <div className={`${base} flex items-center justify-between`}>
                    <span className="opacity-50">{field.type === 'date' ? 'dd/mm/yyyy' : 'dd/mm/yyyy hh:mm'}</span>
                    <span className="text-muted-foreground/50">📅</span>
                </div>
            );

        case 'boolean':
            return (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-6 rounded-full bg-muted border border-input flex items-center px-0.5">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/40" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {field.defaultValue === 'true' ? 'Yes' : 'No'}
                    </span>
                </div>
            );

        case 'select':
            return (
                <div className={`${base} flex items-center justify-between`}>
                    <span className="opacity-50">
                        {field.options[0]?.label ?? 'Select an option…'}
                    </span>
                    <span className="text-muted-foreground/50">▾</span>
                </div>
            );

        case 'multiselect':
            return (
                <div className={`${base} flex flex-wrap gap-1 min-h-[38px]`}>
                    {field.options.slice(0, 2).map(opt => (
                        <span key={opt.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            {opt.label}
                        </span>
                    ))}
                    {field.options.length === 0 && (
                        <span className="opacity-50 text-sm">Select options…</span>
                    )}
                </div>
            );

        case 'color':
            return (
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-md border border-input bg-blue-500" />
                    <div className={`${base} w-28`}>#3B82F6</div>
                </div>
            );

        case 'rating':
            return (
                <div className="flex items-center gap-1">
                    {Array.from({ length: maxRating }, (_, i) => (
                        <Star
                            key={i}
                            className={`h-6 w-6 ${i < 3 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                        />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">3 / {maxRating}</span>
                </div>
            );

        case 'file':
            return (
                <div className="flex items-center justify-center rounded-md border border-dashed border-input bg-background py-4 text-sm text-muted-foreground">
                    📎 Click to upload or drag & drop
                </div>
            );

        case 'json':
            return (
                <div className={`${base} font-mono text-xs min-h-[72px] whitespace-pre`}>
                    {'{\n  "key": "value"\n}'}
                </div>
            );

        case 'relation':
            return (
                <div className={`${base} flex items-center justify-between`}>
                    <span className="opacity-50">Search {field.validation?.relatedEntity ?? 'contact'}…</span>
                    <span className="text-muted-foreground/50">🔗</span>
                </div>
            );

        case 'formula':
            return (
                <div className={`${base} font-mono text-xs bg-muted/30`}>
                    {field.validation?.formulaExpression ?? '= formula'}
                </div>
            );

        default:
            return (
                <div className={base}>
                    <span className="opacity-50">input</span>
                </div>
            );
    }
}