import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mails, Plus, Play, Pause, Copy, Trash2, ChevronRight,
    Circle, Send, Users, TrendingUp,
    Rss, FlaskConical, Zap, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@/layout/components/content';
import { PageHeader } from './page-header';
import type { CampaignSummary, CampaignStatus, CampaignType } from '@/types/campaign';

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_CAMPAIGNS: CampaignSummary[] = [
    {
        id: 'c1',
        name: 'Spring Sale Announcement',
        type: 'regular',
        status: 'sent',
        subject: '🌸 Our biggest spring sale starts now',
        recipients: 12400,
        sent: 12389,
        openRate: 41.2,
        clickRate: 8.7,
        sentAt: '2026-03-28',
    },
    {
        id: 'c2',
        name: 'Subject Line Test — April Newsletter',
        type: 'ab',
        status: 'active',
        subject: 'April updates you can\'t miss / What\'s new in April',
        recipients: 8200,
        sent: 8200,
        openRate: 38.5,
        clickRate: 6.1,
        sentAt: '2026-04-01',
    },
    {
        id: 'c3',
        name: 'Welcome Series — Day 3',
        type: 'automated',
        status: 'active',
        subject: 'Here\'s what to do next',
        recipients: 3100,
        sent: 2980,
        openRate: 55.3,
        clickRate: 14.2,
        sentAt: '2026-03-15',
    },
    {
        id: 'c4',
        name: 'Blog Digest — Weekly RSS',
        type: 'rss',
        status: 'active',
        subject: 'This week on our blog',
        recipients: 5600,
        sent: 5590,
        openRate: 29.8,
        clickRate: 4.3,
        sentAt: '2026-04-01',
    },
    {
        id: 'c5',
        name: 'Re-engagement Push',
        type: 'regular',
        status: 'draft',
        subject: 'We miss you — here\'s 20% off',
        recipients: 0,
        sent: 0,
        openRate: 0,
        clickRate: 0,
        sentAt: null,
    },
    {
        id: 'c6',
        name: 'Product Launch Teaser',
        type: 'regular',
        status: 'scheduled',
        subject: 'Something big is coming…',
        recipients: 15000,
        sent: 0,
        openRate: 0,
        clickRate: 0,
        sentAt: '2026-04-10',
    },
];

// ── Type config ───────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<CampaignType, { label: string; Icon: React.ElementType; color: string }> = {
    regular: { label: 'Regular',   Icon: Mail,         color: 'text-blue-500' },
    ab:      { label: 'A/B Test',  Icon: FlaskConical, color: 'text-violet-500' },
    automated: { label: 'Automated', Icon: Zap,        color: 'text-amber-500' },
    rss:     { label: 'RSS',       Icon: Rss,          color: 'text-orange-500' },
};

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CampaignStatus, { label: string; dot: string; text: string; bg: string }> = {
    draft:     { label: 'Draft',     dot: 'text-muted-foreground',   text: 'text-muted-foreground',   bg: 'bg-secondary' },
    scheduled: { label: 'Scheduled', dot: 'text-blue-400',           text: 'text-blue-600',           bg: 'bg-blue-50 dark:bg-blue-950/30' },
    active:    { label: 'Active',    dot: 'text-emerald-500',        text: 'text-emerald-600',        bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    sent:      { label: 'Sent',      dot: 'text-slate-400',          text: 'text-slate-600',          bg: 'bg-slate-100 dark:bg-slate-800/40' },
    paused:    { label: 'Paused',    dot: 'text-amber-400',          text: 'text-amber-600',          bg: 'bg-amber-50 dark:bg-amber-950/30' },
    archived:  { label: 'Archived',  dot: 'text-muted-foreground/50', text: 'text-muted-foreground/50', bg: 'bg-secondary/50' },
};

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

// ── Campaign row ──────────────────────────────────────────────────────────────

function CampaignRow({ item, onEdit, onToggle, onClone, onDelete }: {
    item: CampaignSummary;
    onEdit:   (id: string) => void;
    onToggle: (id: string) => void;
    onClone:  (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const status = STATUS_CONFIG[item.status];
    const type   = TYPE_CONFIG[item.type];
    const TypeIcon = type.Icon;

    return (
        <div
            className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-secondary/20 cursor-pointer"
            onClick={() => onEdit(item.id)}
        >
            {/* Status dot */}
            <Circle className={`h-2 w-2 shrink-0 fill-current ${status.dot}`} />

            {/* Name + subject */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.subject}</p>
            </div>

            {/* Type badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium ${type.color}`}>
                <TypeIcon className="h-3.5 w-3.5" />
                {type.label}
            </span>

            {/* Status badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                {status.label}
            </span>

            {/* Metrics */}
            <div className="hidden md:flex items-center gap-6 text-right">
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">{item.recipients.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">recipients</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {item.openRate > 0 ? item.openRate + '%' : '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">open rate</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {item.clickRate > 0 ? item.clickRate + '%' : '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">click rate</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {item.sentAt ?? '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        {item.status === 'scheduled' ? 'scheduled' : 'sent'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div
                className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
            >
                {(item.status === 'active' || item.status === 'paused') && (
                    <button
                        onClick={() => onToggle(item.id)}
                        title={item.status === 'active' ? 'Pause' : 'Resume'}
                        className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                        {item.status === 'active'
                            ? <Pause className="h-3.5 w-3.5" />
                            : <Play  className="h-3.5 w-3.5" />}
                    </button>
                )}
                <button
                    onClick={() => onClone(item.id)}
                    title="Duplicate"
                    className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    title="Delete"
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CampaignsPage() {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<CampaignSummary[]>(MOCK_CAMPAIGNS);

    const totalSent      = campaigns.reduce((s, c) => s + c.sent, 0);
    const totalRecipients = campaigns.reduce((s, c) => s + c.recipients, 0);
    const activeCount    = campaigns.filter(c => c.status === 'active').length;
    const sentList       = campaigns.filter(c => c.openRate > 0);
    const avgOpen        = sentList.length
        ? (sentList.reduce((s, c) => s + c.openRate, 0) / sentList.length).toFixed(1)
        : '—';

    const handleEdit = useCallback((id: string) => {
        navigate(`/campaigns/${id}/edit`);
    }, [navigate]);

    const handleCreate = useCallback((type?: CampaignType) => {
        const query = type ? `?type=${type}` : '';
        navigate(`/campaigns/create${query}`);
    }, [navigate]);

    const handleToggle = useCallback((id: string) => {
        setCampaigns(prev => prev.map(c =>
            c.id === id
                ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
                : c
        ));
    }, []);

    const handleClone = useCallback((id: string) => {
        const source = campaigns.find(c => c.id === id);
        if (!source) return;
        setCampaigns(prev => [
            ...prev,
            {
                ...source,
                id: `clone-${Date.now()}`,
                name: `${source.name} (copy)`,
                status: 'draft',
                sent: 0,
                recipients: 0,
                openRate: 0,
                clickRate: 0,
                sentAt: null,
            },
        ]);
    }, [campaigns]);

    const handleDelete = useCallback((id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    }, []);

    return (
        <>
            <PageHeader onCreate={handleCreate} />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">

                    {/* KPI strip */}
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <KpiCard icon={Mails}           label="Active campaigns"    value={activeCount}                       sub={`of ${campaigns.length} total`} />
                        <KpiCard icon={Users}           label="Total recipients"    value={totalRecipients.toLocaleString()} />
                        <KpiCard icon={Send}            label="Emails sent"         value={totalSent.toLocaleString()} />
                        <KpiCard icon={TrendingUp}      label="Avg. open rate"      value={avgOpen === '—' ? '—' : avgOpen + '%'} sub="across sent campaigns" />
                    </div>

                    {/* Type quick-create strip */}
                    <div className="flex flex-wrap gap-3">
                        {(Object.entries(TYPE_CONFIG) as [CampaignType, typeof TYPE_CONFIG[CampaignType]][]).map(([key, cfg]) => {
                            const Icon = cfg.Icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleCreate(key)}
                                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-secondary/40 transition-colors"
                                >
                                    <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                                    New {cfg.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* List */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Your campaigns</h2>
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {campaigns.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border">
                                <div className="rounded-full bg-secondary p-4 mb-4">
                                    <Mails className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-semibold text-foreground mb-1">No campaigns yet</p>
                                <p className="text-xs text-muted-foreground mb-4">Create your first campaign to get started.</p>
                                <Button size="sm" onClick={() => handleCreate()}>
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                    Create campaign
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {campaigns.map(item => (
                                    <CampaignRow
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