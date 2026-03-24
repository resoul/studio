import { useState, useCallback, useRef, ChangeEvent } from 'react';
import {
    Globe, Plus, Trash2, Copy, Check, ChevronDown, ChevronUp,
    Activity, Code2, Eye, EyeOff, AlertCircle, ExternalLink,
    Radio, Wifi, WifiOff, Key, Zap, Terminal, X, BookOpen,
    ChevronRight, Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
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

interface TrackedEvent {
    id: string;
    name: string;
    value: string;
    contactEmail: string;
    occurredAt: string;
    count: number;
}

type CodeLanguage = 'curl' | 'php' | 'js' | 'python';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCOUNT_ID = '613460636';
const EVENT_KEY  = 'ek_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4';

function buildTrackingScript(accountId: string): string {
    return `<script>
    (function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
    vgo('setAccount', '${accountId}');
    vgo('setTrackByDefault', true);
    vgo('process');
</script>`;
}

function buildEventCode(lang: CodeLanguage, accountId: string, key: string): string {
    const endpoint = 'https://ingest.mailflow.io/t';

    switch (lang) {
        case 'curl':
            return `curl -X POST "${endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "accountId": "${accountId}",
    "key": "${key}",
    "events": [
      {
        "type":  "event",
        "name":  "purchase",
        "email": "contact@example.com",
        "data":  { "value": "99.99", "plan": "pro" }
      }
    ]
  }'`;

        case 'php':
            return `<?php
$payload = [
    'accountId' => '${accountId}',
    'key'       => '${key}',
    'events'    => [
        [
            'type'  => 'event',
            'name'  => 'purchase',
            'email' => 'contact@example.com',
            'data'  => ['value' => '99.99', 'plan' => 'pro'],
        ],
    ],
];

$ch = curl_init('${endpoint}');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
curl_close($ch);`;

        case 'js':
            return `// Works in Node.js (v18+) and modern browsers
const response = await fetch('${endpoint}', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accountId: '${accountId}',
    key:       '${key}',
    events: [
      {
        type:  'event',
        name:  'purchase',
        email: 'contact@example.com',
        data:  { value: '99.99', plan: 'pro' },
      },
    ],
  }),
});

if (response.status === 202) {
  console.log('Event accepted');
}`;

        case 'python':
            return `import requests

payload = {
    "accountId": "${accountId}",
    "key":       "${key}",
    "events": [
        {
            "type":  "event",
            "name":  "purchase",
            "email": "contact@example.com",
            "data":  {"value": "99.99", "plan": "pro"},
        }
    ],
}

resp = requests.post(
    "${endpoint}",
    json=payload,
    timeout=5,
)
assert resp.status_code == 202, f"Unexpected status: {resp.status_code}"
print("Event accepted")`;
    }
}

const MOCK_SITES: TrackedSite[] = [
    { id: 's1', url: 'https://mycompany.com',       addedAt: '2026-03-01', pageviews: 14820, uniqueVisitors: 3240, status: 'active'   },
    { id: 's2', url: 'https://shop.mycompany.com',  addedAt: '2026-03-10', pageviews: 6410,  uniqueVisitors: 1890, status: 'active'   },
    { id: 's3', url: 'https://blog.mycompany.com',  addedAt: '2026-03-20', pageviews: 0,     uniqueVisitors: 0,    status: 'pending'  },
];

const MOCK_TRACKED_EVENTS: TrackedEvent[] = [
    { id: 'e1', name: 'purchase',       value: '99.99',     contactEmail: 'alice@example.com', occurredAt: '2026-03-24 09:14', count: 142 },
    { id: 'e2', name: 'trial_started',  value: 'pro_trial', contactEmail: 'bob@example.com',   occurredAt: '2026-03-23 17:42', count: 87  },
    { id: 'e3', name: 'video_watched',  value: 'intro',     contactEmail: 'carol@example.com', occurredAt: '2026-03-23 11:05', count: 305 },
    { id: 'e4', name: 'form_submitted', value: 'contact',   contactEmail: 'dave@example.com',  occurredAt: '2026-03-22 14:30', count: 61  },
];

const STATUS_CONFIG: Record<TrackedSite['status'], { label: string; dot: string; text: string; bg: string }> = {
    active:     { label: 'Active',     dot: 'text-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    pending:    { label: 'Pending',    dot: 'text-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-950/30'    },
    unverified: { label: 'Unverified', dot: 'text-rose-400',    text: 'text-rose-600',    bg: 'bg-rose-50 dark:bg-rose-950/30'      },
};

const CODE_LANGUAGES: { id: CodeLanguage; label: string; icon: string }[] = [
    { id: 'curl',   label: 'cURL',   icon: '⌨' },
    { id: 'php',    label: 'PHP',    icon: '🐘' },
    { id: 'js',     label: 'JS / Node', icon: '🟨' },
    { id: 'python', label: 'Python', icon: '🐍' },
];

// ── Shared copy hook ──────────────────────────────────────────────────────────

function useCopyText(text: string) {
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

// ── Sub-components ────────────────────────────────────────────────────────────

interface ScriptBlockProps {
    script: string;
    expanded: boolean;
    onToggle: () => void;
}

function ScriptBlock({ script, expanded, onToggle }: ScriptBlockProps) {
    const { copied, copy } = useCopyText(script);

    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Tracking snippet</span>
                    <span className="text-xs text-muted-foreground">— paste inside &lt;head&gt; on every page</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copy}>
                        {copied ? <><Check className="h-3.5 w-3.5 text-emerald-500" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={onToggle}>
                        {expanded ? <><ChevronUp className="h-3.5 w-3.5" />Collapse</> : <><ChevronDown className="h-3.5 w-3.5" />Expand</>}
                    </Button>
                </div>
            </div>
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
            <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{site.url}</span>
                    <a href={site.url} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                       onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Added {site.addedAt}</p>
            </div>
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
            <span className={cn('hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0', cfg.bg, cfg.text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full bg-current', cfg.dot)} />
                {cfg.label}
            </span>
            <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

interface AddSiteFormProps {
    onAdd: (url: string) => void;
}

function AddSiteForm({ onAdd }: AddSiteFormProps) {
    const [url, setUrl]     = useState('');
    const [error, setError] = useState('');

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setError('');
    }, []);

    const handleAdd = useCallback(() => {
        const trimmed = url.trim();
        if (!trimmed) { setError('Please enter a website URL.'); return; }
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
                    <Input value={url} onChange={handleChange} onKeyDown={handleKeyDown}
                           placeholder="https://mywebsite.com"
                           className={cn('pl-9', error && 'border-destructive')} />
                </div>
                <Button onClick={handleAdd} className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0" size="default">
                    <Plus className="h-4 w-4 mr-1.5" />Add site
                </Button>
            </div>
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
                </p>
            )}
        </div>
    );
}

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

// ── Event Key display ─────────────────────────────────────────────────────────

interface EventKeyDisplayProps {
    eventKey: string;
    visible: boolean;
    onToggleVisible: () => void;
}

function EventKeyDisplay({ eventKey, visible, onToggleVisible }: EventKeyDisplayProps) {
    const { copied, copy } = useCopyText(eventKey);
    const masked = eventKey.slice(0, 6) + '•'.repeat(eventKey.length - 10) + eventKey.slice(-4);

    return (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/20 px-4 py-2.5 font-mono text-sm">
            <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="flex-1 text-foreground truncate select-all">
                {visible ? eventKey : masked}
            </span>
            <button
                onClick={onToggleVisible}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title={visible ? 'Hide key' : 'Reveal key'}
            >
                {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
            <button
                onClick={copy}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy key"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        </div>
    );
}

// ── Event API Modal ───────────────────────────────────────────────────────────

interface EventApiModalProps {
    open: boolean;
    onClose: () => void;
    accountId: string;
    eventKey: string;
}

function EventApiModal({ open, onClose, accountId, eventKey }: EventApiModalProps) {
    const [activeLang, setActiveLang] = useState<CodeLanguage>('curl');
    const code = buildEventCode(activeLang, accountId, eventKey);
    const { copied, copy } = useCopyText(code);

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-primary" />
                        Event Tracking API
                    </DialogTitle>
                    <DialogDescription>
                        Send custom events from any backend or frontend using your account credentials.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-5 pr-1">

                    {/* Credentials grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Account ID (actid)</p>
                            <p className="font-mono text-sm text-foreground select-all">{accountId}</p>
                        </div>
                        <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Event Key</p>
                            <p className="font-mono text-xs text-foreground truncate select-all">{eventKey}</p>
                        </div>
                    </div>

                    {/* Parameters table */}
                    <div className="rounded-lg border border-border overflow-hidden">
                        <div className="bg-secondary/30 px-4 py-2.5 border-b border-border flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold text-foreground">Request parameters</span>
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                            <tr className="border-b border-border bg-secondary/10">
                                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Field</th>
                                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Type</th>
                                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Description</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                            {[
                                { field: 'accountId', type: 'string', desc: 'Your MailFlow account ID (actid).' },
                                { field: 'key',       type: 'string', desc: 'Your Event Key from this page.' },
                                { field: 'events[].type',  type: '"event"', desc: 'Must be the literal string "event".' },
                                { field: 'events[].name',  type: 'string', desc: 'Event name you define, e.g. "purchase".' },
                                { field: 'events[].email', type: 'string', desc: 'Contact email to attribute the event to.' },
                                { field: 'events[].data',  type: 'object', desc: 'Arbitrary key-value payload for the event.' },
                            ].map(({ field, type, desc }) => (
                                <tr key={field} className="hover:bg-secondary/10">
                                    <td className="px-4 py-2.5 font-mono text-primary">{field}</td>
                                    <td className="px-4 py-2.5 text-muted-foreground italic">{type}</td>
                                    <td className="px-4 py-2.5 text-foreground">{desc}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Code example */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">Code example</span>
                            {/* Language picker */}
                            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/20 p-1">
                                {CODE_LANGUAGES.map(({ id, label, icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveLang(id)}
                                        className={cn(
                                            'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                            activeLang === id
                                                ? 'bg-card text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground',
                                        )}
                                    >
                                        <span>{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative rounded-lg border border-border bg-secondary/10 overflow-hidden">
                            <pre className="px-4 py-4 text-xs font-mono text-foreground leading-relaxed overflow-x-auto whitespace-pre">
                                {code}
                            </pre>
                            <button
                                onClick={copy}
                                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 rounded-md bg-card border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                            >
                                {copied ? <><Check className="h-3 w-3 text-emerald-500" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3 space-y-1.5">
                        <p className="text-xs font-semibold text-foreground">Notes</p>
                        <ul className="space-y-1">
                            {[
                                'A successful request returns HTTP 202 Accepted.',
                                'If the contact email does not exist in your account the event is silently dropped.',
                                'Multiple events with identical data within a short window are deduplicated in the Activity Stream.',
                                'Event names are created automatically the first time they are received.',
                            ].map((note) => (
                                <li key={note} className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ── Tracked Events List ───────────────────────────────────────────────────────

interface TrackedEventRowProps {
    event: TrackedEvent;
}

function TrackedEventRow({ event }: TrackedEventRowProps) {
    return (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-3 transition-colors hover:bg-secondary/20">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-primary" />
            </div>

            {/* Name + email */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground font-mono">{event.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.contactEmail}</p>
            </div>

            {/* Value */}
            <div className="hidden sm:flex items-center gap-1.5">
                <Hash className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">{event.value}</span>
            </div>

            {/* Count */}
            <div className="hidden md:block text-right min-w-[60px]">
                <p className="text-sm font-semibold tabular-nums text-foreground">{event.count.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">occurrences</p>
            </div>

            {/* Time */}
            <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{event.occurredAt}</p>
            </div>

            {/* Badge */}
            <Badge variant="secondary" className="text-[10px] shrink-0">tracked</Badge>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TrackingPage() {
    const [trackingEnabled,      setTrackingEnabled]      = useState(true);
    const [eventTrackingEnabled, setEventTrackingEnabled] = useState(false);
    const [sites,                setSites]                = useState<TrackedSite[]>(MOCK_SITES);
    const [trackedEvents]                                  = useState<TrackedEvent[]>(MOCK_TRACKED_EVENTS);
    const [scriptExpanded,       setScriptExpanded]       = useState(false);
    const [keyVisible,           setKeyVisible]           = useState(false);
    const [apiModalOpen,         setApiModalOpen]         = useState(false);

    const script = buildTrackingScript(ACCOUNT_ID);

    const totalPageviews = sites.reduce((s, site) => s + site.pageviews, 0);
    const totalVisitors  = sites.reduce((s, site) => s + site.uniqueVisitors, 0);
    const activeSites    = sites.filter((s) => s.status === 'active').length;

    const handleToggleScript   = useCallback(() => setScriptExpanded((v) => !v), []);
    const handleToggleKeyVisible = useCallback(() => setKeyVisible((v) => !v), []);
    const handleOpenApiModal   = useCallback(() => setApiModalOpen(true), []);
    const handleCloseApiModal  = useCallback(() => setApiModalOpen(false), []);

    const handleAddSite = useCallback((url: string) => {
        setSites((prev) => {
            if (prev.some((s) => s.url === url)) return prev;
            const newSite: TrackedSite = {
                id: `s-${Date.now()}`, url,
                addedAt: new Date().toISOString().slice(0, 10),
                pageviews: 0, uniqueVisitors: 0, status: 'pending',
            };
            return [...prev, newSite];
        });
    }, []);

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

                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
                    {trackingEnabled ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
                    <div>
                        <p className="text-xs font-semibold text-foreground leading-tight">Site Tracking</p>
                        <p className={cn('text-[11px] font-medium', trackingEnabled ? 'text-emerald-600' : 'text-muted-foreground')}>
                            {trackingEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                    </div>
                    <Switch checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
                </div>
            </div>

            <div className="flex-1 px-6 py-6 space-y-10">

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
                    <KpiCard icon={Globe}    label="Tracked sites"    value={sites.length}                   sub={`${activeSites} active`} />
                    <KpiCard icon={Eye}      label="Page views (30d)" value={totalPageviews.toLocaleString()} />
                    <KpiCard icon={Activity} label="Unique visitors"  value={totalVisitors.toLocaleString()}  />
                    <KpiCard icon={Radio}    label="Account ID"       value={ACCOUNT_ID}                     sub="Your tracking key" />
                </div>

                {/* ── Site Tracking script ── */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">Your tracking code</h2>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Add the snippet below to the <code className="text-xs bg-secondary px-1 py-0.5 rounded font-mono">&lt;head&gt;</code> section
                        of every page you want to track.
                    </p>
                    <ScriptBlock script={script} expanded={scriptExpanded} onToggle={handleToggleScript} />
                    <div className="rounded-lg border border-border bg-card px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Installation steps</p>
                        <ol className="space-y-2">
                            {[
                                'Copy the snippet above.',
                                'Paste it inside the <head> tag on every page of your website.',
                                'Add your website URL in the "Tracked websites" section below.',
                                'Verify the snippet is working by visiting your site — the status will change to Active.',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">{i + 1}</span>
                                    <span className="text-sm text-muted-foreground">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* ── Tracked websites ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold text-foreground">Tracked websites</h2>
                        <span className="text-xs text-muted-foreground tabular-nums">{sites.length} site{sites.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="rounded-lg border border-dashed border-border bg-card/50 px-5 py-4">
                        <p className="text-sm font-medium text-foreground mb-3">Add a website</p>
                        <AddSiteForm onAdd={handleAddSite} />
                    </div>
                    {sites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                            <div className="rounded-full bg-secondary p-4 mb-3"><Globe className="h-8 w-8 text-muted-foreground" /></div>
                            <p className="text-sm font-semibold text-foreground mb-1">No websites added yet</p>
                            <p className="text-xs text-muted-foreground">Add your first website above to start tracking.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sites.map((site) => <SiteRow key={site.id} site={site} onDelete={handleDeleteSite} />)}
                        </div>
                    )}
                </div>

                {/* ════════════════════════════════════════════════════════════
                    Event Tracking section
                ════════════════════════════════════════════════════════════ */}
                <div className="space-y-5">
                    {/* Section header */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-muted-foreground" />
                                <h2 className="text-sm font-semibold text-foreground">Event Tracking</h2>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Advanced</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xl">
                                Track any contact action — purchases, video views, button clicks, in-app behavior — by posting events
                                to our API from your backend or frontend code.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shrink-0">
                            <div>
                                <p className="text-xs font-semibold text-foreground leading-tight">Event Tracking</p>
                                <p className={cn('text-[11px] font-medium', eventTrackingEnabled ? 'text-emerald-600' : 'text-muted-foreground')}>
                                    {eventTrackingEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                            <Switch checked={eventTrackingEnabled} onCheckedChange={setEventTrackingEnabled} />
                        </div>
                    </div>

                    {!eventTrackingEnabled ? (
                        /* ── Disabled state ── */
                        <div className="flex flex-col items-center justify-center py-14 text-center rounded-xl border border-dashed border-border bg-secondary/10 gap-4">
                            <div className="rounded-full bg-secondary p-4">
                                <Zap className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-1">Event Tracking is disabled</p>
                                <p className="text-xs text-muted-foreground max-w-sm">
                                    Enable it with the toggle above to generate your Event Key and start sending custom events.
                                </p>
                            </div>
                            <Button size="sm" onClick={() => setEventTrackingEnabled(true)} className="gap-1.5">
                                <Zap className="h-3.5 w-3.5" />Enable Event Tracking
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* ── Event Key card ── */}
                            <div className="rounded-lg border border-border bg-card px-5 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-semibold text-foreground">Event Key</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleOpenApiModal}>
                                        <Terminal className="h-3.5 w-3.5" />
                                        Event Tracking API
                                        <ExternalLink className="h-3 w-3 ml-0.5 opacity-50" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Pass this key with every API call so we can authenticate your requests.
                                    Keep it secret — treat it like a password.
                                </p>
                                <EventKeyDisplay
                                    eventKey={EVENT_KEY}
                                    visible={keyVisible}
                                    onToggleVisible={handleToggleKeyVisible}
                                />
                            </div>

                            {/* ── How it works ── */}
                            <div className="rounded-lg border border-border bg-card px-5 py-4 space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How it works</p>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {[
                                        { step: '1', title: 'Enable Event Tracking', body: 'Turn on the toggle above. Your Event Key is generated automatically.' },
                                        { step: '2', title: 'Capture the event', body: 'In your code, collect: who (email), what (event name), value, and when.' },
                                        { step: '3', title: 'POST to our API', body: 'Send a JSON request to our ingest endpoint with your Account ID and Event Key.' },
                                        { step: '4', title: 'Use in automations', body: 'Events appear in the contact timeline and can trigger automations or segment filters.' },
                                    ].map(({ step, title, body }) => (
                                        <div key={step} className="flex gap-3 rounded-lg bg-secondary/20 px-4 py-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                                                {step}
                                            </span>
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">{title}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleOpenApiModal}>
                                    <Terminal className="h-3.5 w-3.5" />View code examples
                                </Button>
                            </div>

                            {/* ── Events log ── */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="text-sm font-semibold text-foreground">Tracked events</h3>
                                        <span className="text-xs text-muted-foreground tabular-nums">{trackedEvents.length} event type{trackedEvents.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Events appear here as contacts trigger them. Each row shows the most recent occurrence.
                                </p>

                                {trackedEvents.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border">
                                        <div className="rounded-full bg-secondary p-4 mb-3"><Zap className="h-6 w-6 text-muted-foreground" /></div>
                                        <p className="text-sm font-semibold text-foreground mb-1">No events yet</p>
                                        <p className="text-xs text-muted-foreground">Events will appear here once contacts trigger them via the API.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {trackedEvents.map((ev) => <TrackedEventRow key={ev.id} event={ev} />)}
                                    </div>
                                )}
                            </div>
                        </>
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

            {/* ── Event API Modal ── */}
            <EventApiModal
                open={apiModalOpen}
                onClose={handleCloseApiModal}
                accountId={ACCOUNT_ID}
                eventKey={EVENT_KEY}
            />
        </div>
    );
}