import { useState, useCallback, useEffect, ChangeEvent } from 'react';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    CustomField, FieldType, FieldEntity,
    FIELD_TYPE_LABELS, FIELD_ENTITY_LABELS, FieldOption,
} from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';
import { Plus, X, GripVertical, Lock } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

function uid(): string {
    return `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const ALL_TYPES: FieldType[] = [
    'text', 'textarea', 'number', 'email',
    'phone', 'url', 'date', 'datetime',
    'boolean', 'select', 'multiselect',
];

const ALL_ENTITIES: FieldEntity[] = ['contact', 'campaign', 'global'];

// ── sub-components ────────────────────────────────────────────────────────────

interface TypeGridProps {
    value: FieldType;
    onChange: (t: FieldType) => void;
    locked?: boolean;
}

function TypeGrid({ value, onChange, locked }: TypeGridProps) {
    return (
        <div className="grid grid-cols-3 gap-1.5">
            {ALL_TYPES.map((t) => (
                <button
                    key={t}
                    type="button"
                    disabled={locked}
                    onClick={() => onChange(t)}
                    className={[
                        'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors',
                        value === t
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/50 hover:text-foreground',
                        locked ? 'opacity-50 cursor-not-allowed' : '',
                    ].join(' ')}
                >
                    <FieldTypeIcon type={t} size="sm" />
                    <span className="truncate">{FIELD_TYPE_LABELS[t]}</span>
                </button>
            ))}
        </div>
    );
}

interface OptionsEditorProps {
    options: FieldOption[];
    onChange: (opts: FieldOption[]) => void;
}

function OptionsEditor({ options, onChange }: OptionsEditorProps) {
    const handleAdd = useCallback(() => {
        onChange([...options, { id: uid(), label: '', value: '' }]);
    }, [options, onChange]);

    const handleLabelChange = useCallback((id: string, label: string) => {
        onChange(options.map((o) =>
            o.id === id ? { ...o, label, value: o.value || slugify(label) } : o,
        ));
    }, [options, onChange]);

    const handleValueChange = useCallback((id: string, value: string) => {
        onChange(options.map((o) => o.id === id ? { ...o, value } : o));
    }, [options, onChange]);

    const handleRemove = useCallback((id: string) => {
        onChange(options.filter((o) => o.id !== id));
    }, [options, onChange]);

    return (
        <div className="space-y-1.5">
            {options.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 text-center border border-dashed border-border rounded-md">
                    No options yet — add one below
                </p>
            )}
            {options.map((opt, i) => (
                <div key={opt.id} className="flex items-center gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                    <Input
                        value={opt.label}
                        onChange={(e) => handleLabelChange(opt.id, e.target.value)}
                        placeholder={`Option ${i + 1} label`}
                        className="h-7 text-xs flex-1"
                    />
                    <Input
                        value={opt.value}
                        onChange={(e) => handleValueChange(opt.id, e.target.value)}
                        placeholder="value"
                        className="h-7 text-xs w-28 font-mono"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemove(opt.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
            >
                <Plus className="h-3 w-3" />
                Add option
            </button>
        </div>
    );
}

// ── main modal ────────────────────────────────────────────────────────────────

interface CreateEditFieldModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    field?: CustomField | null;
    existingKeys: string[];
    nextOrder: number;
    onSave: (field: CustomField) => void;
}

interface FormState {
    label: string;
    key: string;
    type: FieldType;
    entity: FieldEntity;
    required: boolean;
    description: string;
    placeholder: string;
    defaultValue: string;
    options: FieldOption[];
}

interface FormErrors {
    label?: string;
    key?: string;
    options?: string;
}

const EMPTY: FormState = {
    label: '', key: '', type: 'text', entity: 'contact',
    required: false, description: '', placeholder: '',
    defaultValue: '', options: [],
};

export function CreateEditFieldModal({
                                         open, onOpenChange, field, existingKeys, nextOrder, onSave,
                                     }: CreateEditFieldModalProps) {
    const isEdit   = !!field;
    const isSystem = field?.system ?? false;

    const [form, setForm]   = useState<FormState>(EMPTY);
    const [keyEdited, setKeyEdited] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    // Sync when field changes
    useEffect(() => {
        if (open) {
            if (field) {
                setForm({
                    label:        field.label,
                    key:          field.key,
                    type:         field.type,
                    entity:       field.entity,
                    required:     field.required,
                    description:  field.description,
                    placeholder:  field.placeholder,
                    defaultValue: field.defaultValue,
                    options:      field.options,
                });
            } else {
                setForm(EMPTY);
            }
            setKeyEdited(false);
            setErrors({});
        }
    }, [open, field]);

    const setField = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
        setForm((prev) => ({ ...prev, [k]: v }));
        setErrors((prev) => ({ ...prev, [k]: undefined }));
    }, []);

    const handleLabelChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const label = e.target.value;
        setForm((prev) => ({
            ...prev,
            label,
            key: keyEdited || isSystem ? prev.key : slugify(label),
        }));
        setErrors((prev) => ({ ...prev, label: undefined, key: undefined }));
    }, [keyEdited, isSystem]);

    const handleKeyChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setKeyEdited(true);
        const key = slugify(e.target.value);
        setField('key', key);
    }, [setField]);

    const validate = useCallback((): boolean => {
        const next: FormErrors = {};
        if (!form.label.trim())  next.label = 'Label is required.';
        if (!form.key.trim())    next.key   = 'Key is required.';
        else {
            const takenKeys = existingKeys.filter((k) => !isEdit || k !== field?.key);
            if (takenKeys.includes(form.key)) next.key = `Key "${form.key}" is already in use.`;
        }
        if ((form.type === 'select' || form.type === 'multiselect') && form.options.length === 0) {
            next.options = 'Add at least one option.';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [form, existingKeys, isEdit, field]);

    const handleSave = useCallback(() => {
        if (!validate()) return;

        const saved: CustomField = {
            id:           field?.id ?? `cf-${Date.now()}`,
            key:          form.key,
            label:        form.label.trim(),
            type:         form.type,
            entity:       form.entity,
            required:     form.required,
            system:       isSystem,
            description:  form.description.trim(),
            placeholder:  form.placeholder.trim(),
            defaultValue: form.defaultValue.trim(),
            options:      form.options,
            order:        field?.order ?? nextOrder,
            createdAt:    field?.createdAt ?? new Date().toISOString().split('T')[0],
        };
        onSave(saved);
        onOpenChange(false);
    }, [validate, form, field, isSystem, nextOrder, onSave, onOpenChange]);

    const needsOptions = form.type === 'select' || form.type === 'multiselect';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        {isSystem && <Lock className="h-4 w-4 text-muted-foreground" />}
                        {isEdit ? 'Edit field' : 'New field'}
                    </DialogTitle>
                    <DialogDescription>
                        {isSystem
                            ? 'System fields — label, description and placeholder can be changed.'
                            : 'Define a custom field that will be available on the selected entity.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 pr-1 mt-2">
                    <div className="space-y-5">

                        {/* Field type */}
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                Field type
                            </Label>
                            <TypeGrid
                                value={form.type}
                                onChange={(t) => setField('type', t)}
                                locked={isSystem}
                            />
                            {isSystem && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Lock className="h-3 w-3" /> Type is locked for system fields.
                                </p>
                            )}
                        </div>

                        {/* Label + Key */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="f-label">
                                    Label <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="f-label"
                                    value={form.label}
                                    onChange={handleLabelChange}
                                    placeholder="e.g. Company name"
                                    className={errors.label ? 'border-destructive' : ''}
                                />
                                {errors.label && <p className="text-xs text-destructive">{errors.label}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="f-key">
                                    Key <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="f-key"
                                    value={form.key}
                                    onChange={handleKeyChange}
                                    placeholder="company_name"
                                    disabled={isSystem}
                                    className={[
                                        'font-mono text-xs',
                                        errors.key ? 'border-destructive' : '',
                                        isSystem ? 'opacity-60' : '',
                                    ].join(' ')}
                                />
                                {errors.key
                                    ? <p className="text-xs text-destructive">{errors.key}</p>
                                    : <p className="text-[10px] text-muted-foreground">Used in API, CSV export and merge tags.</p>
                                }
                            </div>
                        </div>

                        {/* Entity + Required */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label>Applies to</Label>
                                <Select
                                    value={form.entity}
                                    onValueChange={(v) => setField('entity', v as FieldEntity)}
                                    disabled={isSystem}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_ENTITIES.map((e) => (
                                            <SelectItem key={e} value={e}>
                                                {FIELD_ENTITY_LABELS[e]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Required</Label>
                                <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 h-10">
                                    <span className="text-sm text-muted-foreground">
                                        {form.required ? 'This field is required' : 'Optional field'}
                                    </span>
                                    <Switch
                                        checked={form.required}
                                        onCheckedChange={(v) => setField('required', v)}
                                        disabled={isSystem && field?.required}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="f-desc">
                                Description <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Textarea
                                id="f-desc"
                                value={form.description}
                                onChange={(e) => setField('description', e.target.value)}
                                placeholder="Helpful hint shown below the field…"
                                className="resize-none"
                                rows={2}
                            />
                        </div>

                        {/* Placeholder + Default */}
                        {form.type !== 'boolean' && form.type !== 'select' && form.type !== 'multiselect' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="f-placeholder">Placeholder</Label>
                                    <Input
                                        id="f-placeholder"
                                        value={form.placeholder}
                                        onChange={(e) => setField('placeholder', e.target.value)}
                                        placeholder="Shown inside empty input…"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="f-default">Default value</Label>
                                    <Input
                                        id="f-default"
                                        value={form.defaultValue}
                                        onChange={(e) => setField('defaultValue', e.target.value)}
                                        placeholder="Pre-filled value…"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Boolean default */}
                        {form.type === 'boolean' && (
                            <div className="space-y-1.5">
                                <Label>Default value</Label>
                                <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 h-10">
                                    <span className="text-sm text-muted-foreground">
                                        Default: {form.defaultValue === 'true' ? 'Yes (true)' : 'No (false)'}
                                    </span>
                                    <Switch
                                        checked={form.defaultValue === 'true'}
                                        onCheckedChange={(v) => setField('defaultValue', v ? 'true' : 'false')}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options for select / multiselect */}
                        {needsOptions && (
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    Options
                                </Label>
                                {errors.options && (
                                    <p className="text-xs text-destructive">{errors.options}</p>
                                )}
                                <OptionsEditor
                                    options={form.options}
                                    onChange={(opts) => setField('options', opts)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4 shrink-0">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave}>
                        {isEdit ? 'Save changes' : 'Create field'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}