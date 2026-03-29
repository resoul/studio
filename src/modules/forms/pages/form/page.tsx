import { useState, useCallback, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft, Save, Code2, Eye, Trash2, ChevronUp, ChevronDown,
    Plus, Copy, Check, X, Settings, Palette,
    AlertCircle, Type, Mail, Phone, Hash, AlignLeft, Calendar,
    Link2, CheckSquare, ChevronDown as SelectIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { EmbedForm, FormDesign, FormField, FormFieldType, PaletteField } from '@/types/forms';
import { MOCK_FORMS, DEFAULT_DESIGN, FORM_TEMPLATES, PALETTE_FIELDS } from '@/data/forms';
import { uid } from '@/utils/uid';
import {Separator} from "@/components/ui/separator.tsx";
import { useHeaderSlot } from '@/layout/components/header-slot-context';
import { Content } from '@/layout/components/content';
import { ContentHeader } from '@/layout/components/content-header';

// ── Field type icon ───────────────────────────────────────────────────────────

const TYPE_ICON: Record<FormFieldType, React.ElementType> = {
    text:     Type,
    email:    Mail,
    phone:    Phone,
    number:   Hash,
    textarea: AlignLeft,
    select:   SelectIcon,
    checkbox: CheckSquare,
    date:     Calendar,
    url:      Link2,
};

// ── Embed code generator ──────────────────────────────────────────────────────

function buildEmbedHtml(formId: string): string {
    return `<!-- MailFlow Embed Form -->
<link rel="stylesheet" href="https://forms.mailflow.io/embed/v1.css">
<div id="mf-form-${formId}"></div>
<script src="https://forms.mailflow.io/embed/v1.js" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    MailFlowForms.render('mf-form-${formId}', {
      formId: '${formId}',
      accountId: '613460636',
    });
  });
</script>`;
}

function buildEmbedReact(formId: string): string {
    return `import { MailFlowForm } from '@mailflow/react';

// npm install @mailflow/react

export default function MyPage() {
  return (
    <MailFlowForm
      formId="${formId}"
      accountId="613460636"
      onSubmit={(data) => console.log('Submitted:', data)}
      onError={(err) => console.error(err)}
    />
  );
}`;
}

// ── Copy hook ─────────────────────────────────────────────────────────────────

function useCopy(text: string) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const copy = useCallback(() => {
        navigator.clipboard.writeText(text).catch(() => undefined);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    }, [text]);
    return { copied, copy };
}

// ── Form field preview ────────────────────────────────────────────────────────

function FieldPreview({ field, design, selected, onClick, onMoveUp, onMoveDown, onDelete, isFirst, isLast }: {
    field: FormField;
    design: FormDesign;
    selected: boolean;
    onClick: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    // const Icon = TYPE_ICON[field.type];

    const inputStyle: React.CSSProperties = {
        borderRadius: design.borderRadius,
        borderColor: selected ? design.primaryColor : design.borderColor,
        color: design.textColor,
        fontFamily: design.fontFamily,
        backgroundColor: design.bgColor,
        outline: 'none',
        border: `1px solid ${selected ? design.primaryColor : design.borderColor}`,
        padding: '8px 12px',
        fontSize: 14,
        width: '100%',
        boxSizing: 'border-box' as const,
        boxShadow: selected ? `0 0 0 2px ${design.primaryColor}33` : 'none',
    };

    const labelStyle: React.CSSProperties = {
        color: design.labelColor,
        fontFamily: design.fontFamily,
        fontSize: 13,
        fontWeight: 500,
        display: 'block',
        marginBottom: 4,
    };

    return (
        <div
            className="group relative"
            style={{ width: field.width === 'half' ? '50%' : '100%', padding: '0 4px', boxSizing: 'border-box' }}
        >
            <div
                onClick={onClick}
                className="relative cursor-pointer rounded-lg p-2 transition-colors"
                style={{
                    outline: selected ? `2px solid ${design.primaryColor}` : '2px solid transparent',
                    outlineOffset: 2,
                    backgroundColor: selected ? `${design.primaryColor}08` : 'transparent',
                }}
            >
                {/* Action buttons on hover */}
                <div className="absolute -right-1 -top-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card rounded-md border border-border shadow-sm px-1 py-0.5">
                    <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} disabled={isFirst} className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                        <ChevronUp className="h-3 w-3" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} disabled={isLast} className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    <div className="w-px h-3 bg-border mx-0.5" />
                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3 w-3" />
                    </button>
                </div>

                {design.showLabels && (
                    <label style={labelStyle}>
                        {field.label}
                        {field.required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
                    </label>
                )}

                {field.type === 'textarea' ? (
                    <textarea
                        placeholder={field.placeholder}
                        rows={3}
                        readOnly
                        style={{ ...inputStyle, resize: 'none', display: 'block' }}
                        tabIndex={-1}
                    />
                ) : field.type === 'select' ? (
                    <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} tabIndex={-1}>
                        <option value="">{field.placeholder || 'Select an option…'}</option>
                        {field.options.map((opt) => (
                            <option key={opt.id} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : field.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            readOnly
                            style={{ marginTop: 2, accentColor: design.primaryColor }}
                            tabIndex={-1}
                        />
                        <span style={{ color: design.textColor, fontFamily: design.fontFamily, fontSize: 13 }}>
                            {field.placeholder || field.label}
                        </span>
                    </label>
                ) : (
                    <input
                        type={field.type === 'phone' ? 'tel' : field.type}
                        placeholder={field.placeholder}
                        readOnly
                        style={inputStyle}
                        tabIndex={-1}
                    />
                )}

                {field.helpText && (
                    <p style={{ color: '#94A3B8', fontSize: 11, marginTop: 3, fontFamily: design.fontFamily }}>
                        {field.helpText}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Palette field pill ────────────────────────────────────────────────────────

function PaletteItem({ field, added, onAdd }: { field: PaletteField; added: boolean; onAdd: () => void }) {
    const Icon = TYPE_ICON[field.type];
    return (
        <button
            onClick={onAdd}
            disabled={added}
            className={[
                'flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors border',
                added
                    ? 'opacity-40 border-border bg-secondary/30 cursor-not-allowed'
                    : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer',
            ].join(' ')}
        >
            <div className="h-6 w-6 shrink-0 rounded bg-secondary flex items-center justify-center">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="flex-1 truncate text-xs font-medium text-foreground">{field.label}</span>
            {added ? (
                <span className="text-[10px] text-muted-foreground">Added</span>
            ) : (
                <Plus className="h-3 w-3 text-muted-foreground" />
            )}
        </button>
    );
}

// ── Color input ───────────────────────────────────────────────────────────────

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value), [onChange]);
    return (
        <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="flex items-center gap-2 h-8 rounded-md border border-input bg-background px-2">
                <input type="color" value={value} onChange={handleChange} className="h-5 w-5 cursor-pointer rounded border-none bg-transparent p-0" />
                <span className="text-xs font-mono text-foreground">{value.toUpperCase()}</span>
            </div>
        </div>
    );
}

// ── Embed modal ───────────────────────────────────────────────────────────────

function EmbedModal({ formId, onClose }: { formId: string; onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'html' | 'react'>('html');
    const code = activeTab === 'html' ? buildEmbedHtml(formId) : buildEmbedReact(formId);
    const { copied, copy } = useCopy(code);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-2xl mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Embed Code</span>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                        Copy the snippet below and paste it wherever you want the form to appear on your website.
                    </p>

                    {/* Tabs */}
                    <div className="inline-flex rounded-lg border border-border bg-secondary/20 p-0.5">
                        {(['html', 'react'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={[
                                    'rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                                    activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                                ].join(' ')}
                            >
                                {tab === 'html' ? 'HTML / JS' : 'React'}
                            </button>
                        ))}
                    </div>

                    {/* Code block */}
                    <div className="relative rounded-lg border border-border bg-secondary/10 overflow-hidden">
                        <pre className="px-4 py-4 text-xs font-mono text-foreground leading-relaxed overflow-x-auto whitespace-pre">
                            {code}
                        </pre>
                        <button
                            onClick={copy}
                            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-card border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                        >
                            {copied ? <><Check className="h-3 w-3 text-emerald-500" />Copied!</> : <><Copy className="h-3 w-3" />Copy</>}
                        </button>
                    </div>

                    {/* Notes */}
                    <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
                        <p className="text-xs text-foreground font-medium mb-1.5">Installation notes</p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            <li>• The form inherits your design settings and updates automatically when you save.</li>
                            <li>• Submissions are sent to the list assigned to this form.</li>
                            <li>• Customize appearance further via the <code className="font-mono bg-secondary px-1 rounded">design</code> option in the render call.</li>
                        </ul>
                    </div>
                </div>

                <div className="px-5 py-3 border-t border-border flex justify-end">
                    <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
}

// ── Preview modal ─────────────────────────────────────────────────────────────

function PreviewModal({ form, onClose }: { form: EmbedForm; onClose: () => void }) {
    const { design } = form;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-lg mx-4 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-secondary/50 px-4 py-2.5 flex items-center gap-3 border-b border-border">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-rose-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 h-6 rounded-md bg-background border border-border flex items-center px-3">
                        <span className="text-[11px] text-muted-foreground">yoursite.com/landing</span>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Form preview */}
                <div style={{ backgroundColor: design.bgColor }} className="p-8">
                    <div style={{ maxWidth: 440, margin: '0 auto' }}>
                        <div style={{ fontFamily: design.fontFamily }}>
                            <h3 style={{ color: design.textColor, fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
                                {form.name}
                            </h3>
                            {form.description && (
                                <p style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
                                    {form.description}
                                </p>
                            )}

                            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -4px', gap: 0 }}>
                                {form.fields.map((field) => {
                                    const inputStyle: React.CSSProperties = {
                                        borderRadius: design.borderRadius,
                                        border: `1px solid ${design.borderColor}`,
                                        color: design.textColor,
                                        fontFamily: design.fontFamily,
                                        backgroundColor: '#fff',
                                        padding: '9px 12px',
                                        fontSize: 14,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        outline: 'none',
                                        marginTop: 4,
                                    };
                                    return (
                                        <div key={field.id} style={{ width: field.width === 'half' ? '50%' : '100%', padding: '0 4px 12px' }}>
                                            {design.showLabels && (
                                                <label style={{ color: design.labelColor, fontSize: 13, fontWeight: 500, display: 'block' }}>
                                                    {field.label}
                                                    {field.required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
                                                </label>
                                            )}
                                            {field.type === 'textarea' ? (
                                                <textarea rows={3} placeholder={field.placeholder} readOnly style={{ ...inputStyle, resize: 'none', display: 'block' }} />
                                            ) : field.type === 'checkbox' ? (
                                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                                                    <input type="checkbox" readOnly style={{ marginTop: 2, accentColor: design.primaryColor }} />
                                                    <span style={{ color: design.textColor, fontSize: 13 }}>{field.placeholder || field.label}</span>
                                                </label>
                                            ) : (
                                                <input type={field.type === 'phone' ? 'tel' : field.type} placeholder={field.placeholder} readOnly style={inputStyle} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <button style={{
                                width: '100%', padding: '11px',
                                backgroundColor: design.buttonBgColor, color: design.buttonTextColor,
                                border: 'none', borderRadius: design.buttonBorderRadius,
                                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                fontFamily: design.fontFamily, marginTop: 4,
                            }}>
                                {design.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main builder ──────────────────────────────────────────────────────────────

export default function FormBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate        = useNavigate();
    const { toast }       = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showEmbed,   setShowEmbed]   = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [leftTab, setLeftTab]         = useState<'fields' | 'design'>('fields');
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // ── Form state ──
    const [form, setForm] = useState<EmbedForm>(() => {
        // Load existing form
        if (id && id !== 'new') {
            const existing = MOCK_FORMS.find((f) => f.id === id);
            if (existing) return JSON.parse(JSON.stringify(existing));
        }
        // Apply template if specified
        const templateId = searchParams.get('template');
        const template   = FORM_TEMPLATES.find((t) => t.id === templateId);
        return {
            id: `new-${Date.now()}`,
            name: template ? template.name : 'Untitled Form',
            description: template ? template.description : '',
            status: 'draft',
            fields: template
                ? template.defaultFields.map((f) => ({ ...f, id: uid('ff') }))
                : [],
            design: { ...DEFAULT_DESIGN },
            listId: null,
            createdAt: new Date().toISOString().slice(0, 10),
            updatedAt: new Date().toISOString().slice(0, 10),
            submissions: 0,
            views: 0,
        };
    });

    const selectedField = form.fields.find((f) => f.id === selectedFieldId) ?? null;
    const addedKeys = new Set(form.fields.map((f) => f.fieldKey));

    // ── Helpers ──
    const updateField = useCallback((fieldId: string, patch: Partial<FormField>) => {
        setForm((prev) => ({
            ...prev,
            fields: prev.fields.map((f) => f.id === fieldId ? { ...f, ...patch } : f),
        }));
    }, []);

    const updateDesign = useCallback((patch: Partial<FormDesign>) => {
        setForm((prev) => ({ ...prev, design: { ...prev.design, ...patch } }));
    }, []);

    const addField = useCallback((palette: PaletteField) => {
        const newField: FormField = {
            id: uid('ff'),
            fieldKey: palette.key,
            type: palette.type,
            label: palette.label,
            placeholder: palette.placeholder,
            required: palette.key === 'email',
            width: 'full',
            options: palette.key === 'plan_interest'
                ? [
                    { id: uid(), label: 'Free',    value: 'free'    },
                    { id: uid(), label: 'Growth',  value: 'growth'  },
                    { id: uid(), label: 'Pro',     value: 'pro'     },
                ]
                : [],
            helpText: '',
        };
        setForm((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
        setSelectedFieldId(newField.id);
    }, []);

    const removeField = useCallback((fieldId: string) => {
        setForm((prev) => ({ ...prev, fields: prev.fields.filter((f) => f.id !== fieldId) }));
        setSelectedFieldId((prev) => (prev === fieldId ? null : prev));
    }, []);

    const moveField = useCallback((fieldId: string, dir: 'up' | 'down') => {
        setForm((prev) => {
            const fields = [...prev.fields];
            const idx = fields.findIndex((f) => f.id === fieldId);
            if (idx < 0) return prev;
            const next = dir === 'up' ? idx - 1 : idx + 1;
            if (next < 0 || next >= fields.length) return prev;
            [fields[idx], fields[next]] = [fields[next], fields[idx]];
            return { ...prev, fields };
        });
    }, []);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 600));
        setIsSaving(false);
        toast({ description: 'Form saved successfully.' });
    }, [toast]);

    const handleBack = useCallback(() => navigate('/forms'), [navigate]);
    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, name: e.target.value }));
    }, []);

    // Click outside canvas to deselect
    const canvasRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (canvasRef.current && e.target === canvasRef.current) {
                setSelectedFieldId(null);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const { setHeaderSlot } = useHeaderSlot();

    useEffect(() => {
        setHeaderSlot(
            <>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground shrink-0" onClick={handleBack}
                    >
                        <ArrowLeft className="size-4 text-white" />
                        Forms
                    </Button>
                    <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                    <input
                        value={form.name}
                        onChange={handleNameChange}
                        className="h-7 min-w-0 max-w-48 rounded-md border-0 bg-transparent px-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Form name…"
                    />
                </div>
                <div className="flex items-center gap-2"></div>
                <div className="flex items-center gap-2">
                    <div>
                        <Button
                            onClick={() => setShowPreview(true)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                        >
                            <Eye className="size-4 text-white" />
                            Preview
                        </Button>
                    </div>
                    <div>
                        <Button
                            onClick={() => setShowEmbed(true)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-zinc-800 hover:border-zinc-800"
                        >
                            <Code2 className="size-4 text-white" />
                            Embed
                        </Button>
                    </div>
                    <Separator orientation="vertical" className="bg-zinc-600 h-4 mx-1" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white hover:from-blue-600 hover:text-white"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="size-4 text-white" />
                        {isSaving ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </>
        );

        return () => setHeaderSlot(null);
    }, [form.name, handleBack, handleNameChange, handleSave, isSaving, setHeaderSlot])

    return (
        <>
            <ContentHeader className="space-x-2">
                <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
                    <div className="flex shrink-0">
                        {(['fields', 'design'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setLeftTab(tab)}
                                className={[
                                    'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors',
                                    leftTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent',
                                ].join(' ')}
                            >
                                {tab === 'fields' ? <><Plus className="h-3 w-3" />Fields</> : <><Palette className="h-3 w-3" />Design</>}
                            </button>
                        ))}
                    </div>
                </aside>
                <aside className="w-64 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                    <div className="px-4 py-3 flex items-center gap-2 shrink-0">
                        <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground">
                            {selectedField ? 'Field Settings' : 'Form Settings'}
                        </span>
                    </div>
                </aside>
            </ContentHeader>
            <div className="container-fluid">
                <Content className="block py-0">
                    <div className="flex flex-1 overflow-hidden">

                        {/* ── Left panel ── */}
                        <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden in-data-[sidebar-collapsed]:w-[calc(16rem+36px)] transition-[width] duration-200 ease-in-out">
                            <div className="flex-1 overflow-y-auto">
                                {leftTab === 'fields' ? (
                                    <div className="p-3 space-y-4">
                                        {(['basic', 'contact', 'custom'] as const).map((category) => {
                                            const items = PALETTE_FIELDS.filter((p) => p.category === category);
                                            return (
                                                <div key={category}>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                                                        {category === 'basic' ? 'Basic' : category === 'contact' ? 'Contact' : 'Custom'}
                                                    </p>
                                                    <div className="space-y-1">
                                                        {items.map((field) => (
                                                            <PaletteItem
                                                                key={field.key}
                                                                field={field}
                                                                added={addedKeys.has(field.key)}
                                                                onAdd={() => addField(field)}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-4">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Colours</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <ColorInput label="Primary"    value={form.design.primaryColor} onChange={(v) => updateDesign({ primaryColor: v, buttonBgColor: v })} />
                                            <ColorInput label="Background" value={form.design.bgColor}      onChange={(v) => updateDesign({ bgColor: v })} />
                                            <ColorInput label="Text"       value={form.design.textColor}    onChange={(v) => updateDesign({ textColor: v })} />
                                            <ColorInput label="Border"     value={form.design.borderColor}  onChange={(v) => updateDesign({ borderColor: v })} />
                                        </div>

                                        <div className="h-px bg-border" />

                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Shape</p>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Field border radius: {form.design.borderRadius}px</Label>
                                            <input
                                                type="range" min={0} max={24} value={form.design.borderRadius}
                                                onChange={(e) => updateDesign({ borderRadius: Number(e.target.value) })}
                                                className="w-full accent-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Button border radius: {form.design.buttonBorderRadius}px</Label>
                                            <input
                                                type="range" min={0} max={24} value={form.design.buttonBorderRadius}
                                                onChange={(e) => updateDesign({ buttonBorderRadius: Number(e.target.value) })}
                                                className="w-full accent-primary"
                                            />
                                        </div>

                                        <div className="h-px bg-border" />

                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Button</p>
                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Button text</Label>
                                            <Input
                                                value={form.design.buttonText}
                                                onChange={(e) => updateDesign({ buttonText: e.target.value })}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <ColorInput label="Bg" value={form.design.buttonBgColor} onChange={(v) => updateDesign({ buttonBgColor: v })} />
                                            <ColorInput label="Text" value={form.design.buttonTextColor} onChange={(v) => updateDesign({ buttonTextColor: v })} />
                                        </div>

                                        <div className="h-px bg-border" />

                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground">Show labels</Label>
                                            <Switch
                                                checked={form.design.showLabels}
                                                onCheckedChange={(v) => updateDesign({ showLabels: v })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-muted-foreground">Success message</Label>
                                            <Input
                                                value={form.design.successMessage}
                                                onChange={(e) => updateDesign({ successMessage: e.target.value })}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* ── Canvas ── */}
                        <main
                            ref={canvasRef}
                            className="flex-1 overflow-auto flex items-start justify-center p-10"
                            style={{
                                background: '#f0f4f8',
                                backgroundImage: 'radial-gradient(circle, #c8d6e5 1.5px, transparent 1.5px)',
                                backgroundSize: '24px 24px',
                            }}
                        >
                            <div
                                className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
                                style={{ backgroundColor: form.design.bgColor, border: `1px solid ${form.design.borderColor}` }}
                            >
                                {/* Form header */}
                                <div className="px-7 pt-7 pb-1">
                                    <h3 style={{
                                        color: form.design.textColor,
                                        fontFamily: form.design.fontFamily,
                                        fontSize: 20, fontWeight: 700, marginBottom: 4,
                                    }}>
                                        {form.name}
                                    </h3>
                                    {form.description && (
                                        <p style={{ color: '#94A3B8', fontSize: 13, fontFamily: form.design.fontFamily }}>
                                            {form.description}
                                        </p>
                                    )}
                                </div>

                                {/* Fields */}
                                <div className="px-6 py-4">
                                    {form.fields.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border-2 border-dashed border-border">
                                            <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                                            <p className="text-sm font-medium text-muted-foreground">Add fields from the left panel</p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">Click any field to add it to your form</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -4px' }}>
                                            {form.fields.map((field, index) => (
                                                <FieldPreview
                                                    key={field.id}
                                                    field={field}
                                                    design={form.design}
                                                    selected={selectedFieldId === field.id}
                                                    onClick={() => setSelectedFieldId(field.id)}
                                                    onMoveUp={() => moveField(field.id, 'up')}
                                                    onMoveDown={() => moveField(field.id, 'down')}
                                                    onDelete={() => removeField(field.id)}
                                                    isFirst={index === 0}
                                                    isLast={index === form.fields.length - 1}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Submit button preview */}
                                    {form.fields.length > 0 && (
                                        <div className="mt-4 px-1">
                                            <div style={{
                                                width: '100%', padding: '10px 16px',
                                                backgroundColor: form.design.buttonBgColor,
                                                color: form.design.buttonTextColor,
                                                borderRadius: form.design.buttonBorderRadius,
                                                fontFamily: form.design.fontFamily,
                                                fontSize: 14, fontWeight: 600,
                                                textAlign: 'center',
                                                cursor: 'default',
                                            }}>
                                                {form.design.buttonText}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* ── Right panel ── */}
                        <aside className="w-64 shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedField ? (
                                    // ── Field properties ──
                                    <>
                                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30">
                                            {(() => { const Icon = TYPE_ICON[selectedField.type]; return <Icon className="h-4 w-4 text-muted-foreground shrink-0" />; })()}
                                            <span className="text-xs font-medium text-foreground truncate">{selectedField.type}</span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Label</Label>
                                            <Input
                                                value={selectedField.label}
                                                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        {selectedField.type !== 'checkbox' && (
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Placeholder</Label>
                                                <Input
                                                    value={selectedField.placeholder}
                                                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Help text</Label>
                                            <Input
                                                value={selectedField.helpText}
                                                onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
                                                placeholder="Optional hint…"
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-muted-foreground">Required</Label>
                                            <Switch
                                                checked={selectedField.required}
                                                onCheckedChange={(v) => updateField(selectedField.id, { required: v })}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Width</Label>
                                            <div className="inline-flex rounded-md border border-border bg-background p-0.5 w-full">
                                                {(['full', 'half'] as const).map((w) => (
                                                    <button
                                                        key={w}
                                                        onClick={() => updateField(selectedField.id, { width: w })}
                                                        className={[
                                                            'flex-1 rounded py-1 text-xs font-medium transition-colors',
                                                            selectedField.width === w
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'text-muted-foreground hover:text-foreground',
                                                        ].join(' ')}
                                                    >
                                                        {w === 'full' ? 'Full width' : 'Half width'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-border">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive h-8 text-xs"
                                                onClick={() => removeField(selectedField.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />Remove field
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    // ── Form settings ──
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Form name</Label>
                                            <Input
                                                value={form.name}
                                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Description</Label>
                                            <Input
                                                value={form.description}
                                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                                placeholder="Shown below the form title"
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-muted-foreground">Status</Label>
                                            <div className="inline-flex rounded-md border border-border bg-background p-0.5 w-full">
                                                {(['draft', 'active'] as const).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                                                        className={[
                                                            'flex-1 rounded py-1 text-xs font-medium transition-colors capitalize',
                                                            form.status === s
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'text-muted-foreground hover:text-foreground',
                                                        ].join(' ')}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-px bg-border" />

                                        <div className="rounded-lg border border-border bg-secondary/10 p-3 space-y-1">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Summary</p>
                                            <p className="text-xs text-foreground">{form.fields.length} field{form.fields.length !== 1 ? 's' : ''} configured</p>
                                            <p className="text-xs text-muted-foreground">
                                                {form.fields.filter((f) => f.required).length} required
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-border bg-secondary/10 p-3 space-y-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tips</p>
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
                                                Click a field in the canvas to edit its settings.
                                            </div>
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                <AlertCircle className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
                                                Use the Design tab to customise colours and typography.
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </aside>
                    </div>
                </Content>
            </div>
            {showEmbed   && <EmbedModal   formId={form.id} onClose={() => setShowEmbed(false)} />}
            {showPreview && <PreviewModal form={form}      onClose={() => setShowPreview(false)} />}
        </>
    );
}