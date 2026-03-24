import { useState, useCallback, useRef, ChangeEvent } from 'react';
import {
    Globe, Plus, Trash2, Copy, Check, ChevronDown, ChevronUp,
    Activity, Code2, Eye, EyeOff, AlertCircle, ExternalLink,
    Radio, Wifi, WifiOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrackedSite {
    id: string;
    url: string;
    addedAt: string;
    pageviews: number;
    uniqueVisitors: number;
    status: 'active' | 'pending' | 'unverified';
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCOUNT_ID = '613460636';

function buildTrackingScript(accountId: string): string {
    return `<script>
    (function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
    vgo('setAccount', '${accountId}');
    vgo('setTrackByDefault', true);
    vgo('process');
</script>`;
}

const MOCK_SITES: TrackedSite[] = [
    {
        id: 's1',
        url: 'https://mycompany.com',
        addedAt: '2026-03-01',
        pageviews: 14820,
        uniqueVisitors: 3240,
        status: 'active',
    },
    {
        id: 's2',
        url: 'https://shop.mycompany.com',
        addedAt: '2026-03-10',
        pageviews: 6410,
        uniqueVisitors: 1890,
        status: 'active',
    },
    {
        id: 's3',
        url: 'https://blog.mycompany.com',
        addedAt: '2026-03-20',
        pageviews: 0,
        uniqueVisitors: 0,
        status: 'pending',
    },
];

const STATUS_CONFIG: Record<TrackedSite['status'], {
    label: string;
    dot: string;
    text: string;
    bg: string;
}> = {
    active:     { label: 'Active',      dot: 'text-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    pending:    { label: 'Pending',     dot: 'text-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/30'    },
    unverified: { label: 'Unverified',  dot: 'text-rose-400',    text: 'text-rose-600',    bg: 'bg-rose-50 dark:bg-rose-950/30'      },
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface ScriptBlockProps {
    script: string;
    expanded: boolean;
    onToggle: () => void;
}

function ScriptBlock({ script, expanded, onToggle }: ScriptBlockProps) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(script).catch(() => undefined);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }, [script]);

    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Tracking snippet</span>
                    <span className="text-xs text-muted-foreground">— paste inside &lt;head&gt; on every page</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1.5 text-xs"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <><Check className="h-3.5 w-3.5 text-emerald-500" />Copied!</>
                        ) : (
                            <><Copy className="h-3.5 w-3.5" />Copy</>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 text-xs"
                        onClick={onToggle}
                    >
                        {expanded ? (
                            <><ChevronUp className="h-3.5 w-3.5" />Collapse</>
                        ) : (
                            <><ChevronDown className="h-3.5 w-3.5" />Expand</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Code */}
            {expanded && (
                <pre className="px-4 py-4 text-xs font-mono text-foreground leading-relaxed overflow-x-auto bg-secondary/10 whitespace-pre-wrap break-all">
                    {script}
                </pre>
            )}
        </div>
    );
}

interface SiteRowProps {
    site: TrackedSite;
    onDelete: (id: string) => void;
}

function SiteRow({ site, onDelete }: SiteRowProps) {
    const cfg = STATUS_CONFIG[site.status];

    const handleDelete = useCallback(() => onDelete(site.id), [onDelete, site.id]);

    return (
        <div className="group flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-3.5 transition-colors hover:bg-secondary/20">
            {/* Icon */}
            <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* URL */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{site.url}</span>
                    <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Added {site.addedAt}</p>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-8 text-right">
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {site.pageviews > 0 ? site.pageviews.toLocaleString() : '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">page views</p>
                </div>
                <div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                        {site.uniqueVisitors > 0 ? site.uniqueVisitors.toLocaleString() : '—'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">unique visitors</p>
                </div>
            </div>

            {/* Status badge */}
            <span className={cn(
                'hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0',
                cfg.bg, cfg.text,
            )}>
                <span className={cn('h-1.5 w-1.5 rounded-full bg-current', cfg.dot)} />
                {cfg.label}
            </span>

            {/* Delete */}
            <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

interface AddSiteFormProps {
    onAdd: (url: string) => void;
}

function AddSiteForm({ onAdd }: AddSiteFormProps) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setError('');
    }, []);

    const handleAdd = useCallback(() => {
        const trimmed = url.trim();
        if (!trimmed) {
            setError('Please enter a website URL.');
            return;
        }
        // Basic URL validation
        try {
            const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
            onAdd(parsed.origin);
            setUrl('');
        } catch {
            setError('Please enter a valid URL (e.g. https://mysite.com).');
        }
    }, [url, onAdd]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleAdd();
    }, [handleAdd]);

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={url}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="https://mywebsite.com"
                        className={cn('pl-9', error && 'border-destructive')}
                    />
                </div>
                <Button
                    onClick={handleAdd}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
                    size="default"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add site
                </Button>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
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

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TrackingPage() {
    const [trackingEnabled, setTrackingEnabled] = useState(true);
    const [sites, setSites] = useState<TrackedSite[]>(MOCK_SITES);
    const [scriptExpanded, setScriptExpanded] = useState(false);

    const script = buildTrackingScript(ACCOUNT_ID);

    const totalPageviews = sites.reduce((s, site) => s + site.pageviews, 0);
    const totalVisitors = sites.reduce((s, site) => s + site.uniqueVisitors, 0);
    const activeSites = sites.filter((s) => s.status === 'active').length;

    const handleToggleScript = useCallback(() => setScriptExpanded((v) => !v), []);

    const handleAddSite = useCallback((url: string) => {
        const already = sites.find((s) => s.url === url);
        if (already) return;
        const newSite: TrackedSite = {
            id: `s-${Date.now()}`,
            url,
            addedAt: new Date().toISOString().slice(0, 10),
            pageviews: 0,
            uniqueVisitors: 0,
            status: 'pending',
        };
        setSites((prev) => [...prev, newSite]);
    }, [sites]);

    const handleDeleteSite = useCallback((id: string) => {
        setSites((prev) => prev.filter((s) => s.id !== id));
    }, []);

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* ── Page header ── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
                <div>
                    <h1 className="text-lg font-semibold text-foreground">Site & Event Tracking</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Record contact behavior on your web assets and third-party tools.
                    </p>
                </div>

                {/* Global enable/disable */}
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
                    {trackingEnabled ? (
                        <Wifi className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <WifiOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">
                            Site Tracking
                        </p>
                        <p className={cn('text-[11px] font-medium', trackingEnabled ? 'text-emerald-600' : 'text-muted-foreground')}>
                            {trackingEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                    </div>
                    <Switch
                        checked={trackingEnabled}
                        onCheckedChange={setTrackingEnabled}
                    />
                </div>
            </div>

            <div className="flex-1 px-6 py-6 space-y-8">

                {/* ── Disabled banner ── */}
                {!trackingEnabled && (
                    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Site Tracking is currently disabled. Enable it above to start recording contact behavior.
                        </p>
                    </div>
                )}

                {/* ── KPI strip ── */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KpiCard icon={Globe}    label="Tracked sites"    value={sites.length} sub={`${activeSites} active`} />
                    <KpiCard icon={Eye}      label="Page views (30d)" value={totalPageviews.toLocaleString()} />
                    <KpiCard icon={Activity} label="Unique visitors"  value={totalVisitors.toLocaleString()} />
                    <KpiCard icon={Radio}    label="Account ID"       value={ACCOUNT_ID} sub="Your tracking key" />
                </div>

                {/* ── Tracking script ── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">Your tracking code</h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Add the snippet below to the <code className="text-xs bg-secondary px-1 py-0.5 rounded font-mono">&lt;head&gt;</code> section
                        of every page you want to track. It automatically identifies contacts by email when they fill in a form.
                    </p>

                    <ScriptBlock
                        script={script}
                        expanded={scriptExpanded}
                        onToggle={handleToggleScript}
                    />

                    {/* Installation steps */}
                    <div className="rounded-lg border border-border bg-card px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Installation steps
                        </p>
                        <ol className="space-y-2">
                            {[
                                'Copy the snippet above.',
                                'Paste it inside the <head> tag on every page of your website.',
                                'Add your website URL in the "Tracked websites" section below.',
                                'Verify the snippet is working by visiting your site — the status will change to Active.',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* ── Tracked websites ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-semibold text-foreground">Tracked websites</h2>
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {sites.length} site{sites.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Add form */}
                    <div className="rounded-lg border border-dashed border-border bg-card/50 px-5 py-4">
                        <p className="text-sm font-medium text-foreground mb-3">Add a website</p>
                        <AddSiteForm onAdd={handleAddSite} />
                    </div>

                    {/* List */}
                    {sites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                            <div className="rounded-full bg-secondary p-4 mb-3">
                                <Globe className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-semibold text-foreground mb-1">No websites added yet</p>
                            <p className="text-xs text-muted-foreground">Add your first website above to start tracking.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sites.map((site) => (
                                <SiteRow
                                    key={site.id}
                                    site={site}
                                    onDelete={handleDeleteSite}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Privacy note ── */}
                <div className="rounded-lg border border-border bg-secondary/10 px-5 py-4 flex items-start gap-3">
                    <EyeOff className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Site Tracking only records page visits by known contacts (those with a matching email address in your account).
                        Anonymous visitors are not tracked. Make sure your privacy policy reflects the use of tracking technology on your sites.
                    </p>
                </div>

            </div>
        </div>
    );
}