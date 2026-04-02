import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Plus, Play, Pause, Copy, Trash2, ArrowRight,
    Circle, Users, Send, TrendingUp, BarChart2,
    ChevronRight, Sparkles, ShoppingCart, Gift, RefreshCw,
    Package, Leaf, ToggleLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutomationSummary, AutomationStatus, RecipeTemplate } from '@/types/automation';
import { RECIPES } from '@/mocks/automation';
import { WORKFLOW_GRAPH_PRESETS } from '@/data/workflow-graphs';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_AUTOMATIONS: AutomationSummary[] = WORKFLOW_GRAPH_PRESETS.map((preset) => ({
    id: preset.id,
    name: preset.name,
    status: preset.status,
    trigger: preset.trigger,
    enrolled: preset.enrolled,
    completed: preset.completed,
    emailsSent: preset.emailsSent,
    openRate: preset.openRate,
    createdAt: '2026-03-23',
}));

const RECIPE_ICONS: Record<string, React.ElementType> = {
    welcome: Users,
    'abandoned-cart': ShoppingCart,
    birthday: Gift,
    winback: RefreshCw,
    'post-purchase': Package,
    'lead-nurture': Leaf,
    're-engagement': RefreshCw,
    'lead-nurture-match': Leaf,
    'vip-routing': Sparkles,
    'webinar-reminder': Send,
    'post-purchase-followup': Package,
    'multi-trigger-escalation': Zap,
};

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AutomationStatus, {
    label: string; dot: string; text: string; bg: string;
}> = {
    active: { label: 'Active', dot: 'text-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    paused: { label: 'Paused', dot: 'text-amber-400', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    draft: { label: 'Draft', dot: 'text-muted-foreground', text: 'text-muted-foreground', bg: 'bg-secondary' },
    archived: { label: 'Archived', dot: 'text-muted-foreground/50', text: 'text-muted-foreground/50', bg: 'bg-secondary/50' },
};

// ── KPI strip ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, accent }: {
    icon: React.ElementType; label: string; value: string | number; sub?: string; accent?: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent ?? 'bg-primary/10'}`}>
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

// ── Recipe card ───────────────────────────────────────────────────────────────

function RecipeCard({ recipe, onUse }: { recipe: RecipeTemplate; onUse: (id: string) => void }) {
    const Icon = RECIPE_ICONS[recipe.id] ?? Zap;
    return (
        <div
            onClick={() => onUse(recipe.id)}
            className="group relative cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </div>

            <p className="text-sm font-semibold text-foreground mb-1">{recipe.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{recipe.description}</p>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border pt-3">
                <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />{recipe.trigger}
                </span>
                <span className="flex items-center gap-1 ml-auto">
                    <BarChart2 className="h-3 w-3" />{recipe.avgOpenRate} open rate
                </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2.5">
                {recipe.tags.map(tag => (
                    <span key={tag} className="inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Automation row ────────────────────────────────────────────────────────────

function AutomationRow({ item, onEdit, onToggle, onClone, onDelete }: {
    item: AutomationSummary;
    onEdit: (id: string) => void;
    onToggle: (id: string) => void;
    onClone: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const cfg = STATUS_CONFIG[item.status];
    const completionRate = item.enrolled > 0 ? ((item.completed / item.enrolled) * 100).toFixed(0) + '%' : '—';

    return (
        <div
            className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary/20 cursor-pointer"
            onClick={() => onEdit(item.id)}
        >
            {/* Status indicator */}
            <div className="flex flex-col items-center gap-1 shrink-0">
                <Circle className={`h-2 w-2 fill-current ${cfg.dot}`} />
            </div>

            {/* Name + trigger */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5" />
                    {item.trigger}
                </p>
            </div>

            {/* Status badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
            </span>

            {/* Metrics */}
            <div className="hidden md:flex items-center gap-6 text-right">
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{item.enrolled.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">enrolled</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{completionRate}</p>
                    <p className="text-[10px] text-muted-foreground">completed</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{item.emailsSent.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">emails sent</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {item.openRate > 0 ? item.openRate + '%' : '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">open rate</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => onToggle(item.id)}
                    title={item.status === 'active' ? 'Pause' : 'Activate'}
                    className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    {item.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => onClone(item.id)} title="Clone" className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => onDelete(item.id)} title="Delete" className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AutomationsPage() {
    const navigate = useNavigate();
    const [automations, setAutomations] = useState<AutomationSummary[]>(MOCK_AUTOMATIONS);
    const [showRecipes, setShowRecipes] = useState(true);

    const totalEnrolled  = automations.reduce((s, a) => s + a.enrolled, 0);
    const totalSent      = automations.reduce((s, a) => s + a.emailsSent, 0);
    const activeCount    = automations.filter(a => a.status === 'active').length;
    const avgOpen        = automations.filter(a => a.openRate > 0);
    const avgOpenRate    = avgOpen.length
        ? (avgOpen.reduce((s, a) => s + a.openRate, 0) / avgOpen.length).toFixed(1)
        : '—';

    const handleEdit  = useCallback((id: string) => navigate(`/automations/automations/${id}`), [navigate]);
    const handleNew   = useCallback(() => navigate('/automations/automations/new'), [navigate]);
    const handleUseRecipe = useCallback((recipeId: string) => navigate(`/automations/automations/new?recipe=${recipeId}`), [navigate]);

    const handleToggle = useCallback((id: string) => {
        setAutomations(prev => prev.map(a => a.id === id
            ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
            : a
        ));
    }, []);

    const handleClone = useCallback((id: string) => {
        const source = automations.find(a => a.id === id);
        if (!source) return;
        setAutomations(prev => [
            ...prev,
            { ...source, id: `clone-${Date.now()}`, name: `${source.name} (copy)`, status: 'draft', enrolled: 0, completed: 0, emailsSent: 0, openRate: 0 },
        ]);
    }, [automations]);

    const handleDelete = useCallback((id: string) => {
        setAutomations(prev => prev.filter(a => a.id !== id));
    }, []);

    return (
        <>
            <PageHeader onCreate={handleNew} />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">
                    {/* ── KPI strip ── */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <KpiCard icon={ToggleLeft}  label="Active graphs" value={activeCount} sub={`of ${automations.length} total`} />
                        <KpiCard icon={Users}   label="Contacts enrolled" value={totalEnrolled.toLocaleString()} />
                        <KpiCard icon={Send}    label="Emails sent (all-time)" value={totalSent.toLocaleString()} />
                        <KpiCard icon={TrendingUp} label="Avg. open rate" value={avgOpenRate + '%'} sub="across active flows" />
                    </div>

                    {/* ── Recipes ── */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">Quick-start templates</h2>
                                <span className="text-xs text-muted-foreground">— start from a ready graph</span>
                            </div>
                            <button
                                onClick={() => setShowRecipes(v => !v)}
                                className="text-xs text-primary hover:underline"
                            >
                                {showRecipes ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {showRecipes && (
                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                                {RECIPES.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} onUse={handleUseRecipe} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Workflow list ── */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Your workflow graphs</h2>
                            <span className="text-xs text-muted-foreground tabular-nums">{automations.length} flow{automations.length !== 1 ? 's' : ''}</span>
                        </div>

                        {automations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border">
                                <div className="rounded-full bg-secondary p-4 mb-4">
                                    <Zap className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-semibold text-foreground mb-1">No workflow graphs yet</p>
                                <p className="text-xs text-muted-foreground mb-4">Start with a template or create from scratch.</p>
                                <Button size="sm" onClick={handleNew}>
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                    Create graph
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {automations.map(item => (
                                    <AutomationRow
                                        key={item.id}
                                        item={item}
                                        onEdit={handleEdit}
                                        onToggle={handleToggle}
                                        onClone={handleClone}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Content>
            </div>
        </>
    );
}
