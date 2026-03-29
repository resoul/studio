import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, FileText, Circle, Copy, Trash2, ChevronRight,
    Sparkles, BarChart2, Eye, ArrowRight, Send,
    TrendingUp, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';
import { EmbedForm, FormStatus, FormTemplate } from '@/types/forms';
import { MOCK_FORMS, FORM_TEMPLATES } from '@/data/forms';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<FormStatus, { label: string; dot: string; text: string; bg: string }> = {
    active:   { label: 'Active',   dot: 'text-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    draft:    { label: 'Draft',    dot: 'text-muted-foreground', text: 'text-muted-foreground', bg: 'bg-secondary' },
    archived: { label: 'Archived', dot: 'text-muted-foreground/50', text: 'text-muted-foreground/50', bg: 'bg-secondary/50' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function conversionRate(form: EmbedForm): string {
    if (!form.views) return '—';
    return ((form.submissions / form.views) * 100).toFixed(1) + '%';
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub }: {
    icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="text-xl font-bold tabular-nums text-foreground">{value}</p>
                {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
            </div>
        </div>
    );
}

// ── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, onUse }: { template: FormTemplate; onUse: (id: string) => void }) {
    const handleClick = useCallback(() => onUse(template.id), [onUse, template.id]);
    return (
        <div
            onClick={handleClick}
            className="group relative cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 shrink-0 text-xl">
                    {template.icon}
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">{template.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{template.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border pt-3">
                <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {template.defaultFields.length} fields
                </span>
                <span className="flex items-center gap-1 ml-auto">
                    <BarChart2 className="h-3 w-3" />{template.avgConversion} avg conversion
                </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2.5">
                {template.tags.map((tag) => (
                    <span key={tag} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Form row ──────────────────────────────────────────────────────────────────

function FormRow({ form, onEdit, onClone, onDelete }: {
    form: EmbedForm;
    onEdit: (id: string) => void;
    onClone: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const cfg = STATUS_CFG[form.status];
    const handleEdit   = useCallback(() => onEdit(form.id),   [onEdit, form.id]);
    const handleClone  = useCallback(() => onClone(form.id),  [onClone, form.id]);
    const handleDelete = useCallback(() => onDelete(form.id), [onDelete, form.id]);

    return (
        <div
            className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary/20 cursor-pointer"
            onClick={handleEdit}
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{form.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{form.description || `${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`}</p>
            </div>

            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                <Circle className={`h-1.5 w-1.5 fill-current ${cfg.dot}`} />
                {cfg.label}
            </span>

            <div className="hidden md:flex items-center gap-6 text-right">
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{form.views > 0 ? form.views.toLocaleString() : '—'}</p>
                    <p className="text-[10px] text-muted-foreground">views</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{form.submissions > 0 ? form.submissions.toLocaleString() : '—'}</p>
                    <p className="text-[10px] text-muted-foreground">submissions</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{conversionRate(form)}</p>
                    <p className="text-[10px] text-muted-foreground">conversion</p>
                </div>
            </div>

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClone} title="Duplicate" className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleDelete} title="Delete" className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FormsPage() {
    const navigate = useNavigate();
    const [forms, setForms] = useState<EmbedForm[]>(MOCK_FORMS);
    const [showTemplates, setShowTemplates] = useState(true);

    const totalSubmissions = forms.reduce((s, f) => s + f.submissions, 0);
    const totalViews       = forms.reduce((s, f) => s + f.views, 0);
    const activeForms      = forms.filter((f) => f.status === 'active').length;
    const avgConversion    = totalViews
        ? ((totalSubmissions / totalViews) * 100).toFixed(1) + '%'
        : '0%';

    const handleNew         = useCallback(() => navigate('/forms/form/new'), [navigate]);
    const handleEdit        = useCallback((id: string) => navigate(`/forms/form/${id}`), [navigate]);
    const handleUseTemplate = useCallback((templateId: string) => navigate(`/forms/form/new?template=${templateId}`), [navigate]);

    const handleClone = useCallback((id: string) => {
        const src = forms.find((f) => f.id === id);
        if (!src) return;
        setForms((prev) => [
            ...prev,
            { ...src, id: `clone-${Date.now()}`, name: `${src.name} (copy)`, status: 'draft', submissions: 0, views: 0, createdAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10) },
        ]);
    }, [forms]);

    const handleDelete = useCallback((id: string) => {
        setForms((prev) => prev.filter((f) => f.id !== id));
    }, []);

    return (
        <>
            <PageHeader />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <KpiCard icon={FileText}    label="Total forms"       value={forms.length}                    sub={`${activeForms} active`} />
                        <KpiCard icon={Eye}         label="Total views"       value={totalViews.toLocaleString()}     />
                        <KpiCard icon={Send}        label="Submissions"       value={totalSubmissions.toLocaleString()} />
                        <KpiCard icon={TrendingUp}  label="Avg. conversion"   value={avgConversion}                   sub="views → submits" />
                    </div>
                    {/* Templates */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-accent" />
                                <h2 className="text-sm font-semibold text-foreground">Quick-start templates</h2>
                                <span className="text-xs text-muted-foreground">— launch in seconds</span>
                            </div>
                            <button onClick={() => setShowTemplates((v) => !v)} className="text-xs text-primary hover:underline">
                                {showTemplates ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {showTemplates && (
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                                {FORM_TEMPLATES.map((t) => (
                                    <TemplateCard key={t.id} template={t} onUse={handleUseTemplate} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Forms list */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Your forms</h2>
                            <span className="text-xs text-muted-foreground tabular-nums">{forms.length} form{forms.length !== 1 ? 's' : ''}</span>
                        </div>

                        {forms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border">
                                <div className="rounded-full bg-secondary p-4 mb-4">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-semibold text-foreground mb-1">No forms yet</p>
                                <p className="text-xs text-muted-foreground mb-4">Start with a template or build from scratch.</p>
                                <Button size="sm" onClick={handleNew}>
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />Create form
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {forms.map((form) => (
                                    <FormRow
                                        key={form.id}
                                        form={form}
                                        onEdit={handleEdit}
                                        onClone={handleClone}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info banner */}
                    <div className="rounded-lg border border-border bg-secondary/10 px-5 py-4 flex items-start gap-3">
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Forms automatically sync new submissions to the assigned contact list. Existing contacts are updated, new ones are created.
                            All submissions respect your opt-in and GDPR settings.
                        </p>
                    </div>
                </Content>
            </div>
        </>
    );
}