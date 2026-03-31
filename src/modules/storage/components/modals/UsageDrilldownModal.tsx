import { Calendar, CheckCircle, Clock, ExternalLink, Mail, TrendingUp, X, Zap } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { EmailUsageItem, MediaFile } from '@/types/storage';

interface UsageDrilldownModalProps {
    file: MediaFile | null;
    onClose: () => void;
}

const STATUS_CONFIG: Record<EmailUsageItem['status'], { label: string; color: string; icon: React.ElementType }> = {
    sent:      { label: 'Sent',      color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', icon: CheckCircle },
    scheduled: { label: 'Scheduled', color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', icon: Clock },
    draft:     { label: 'Draft',     color: 'bg-secondary text-muted-foreground border-border', icon: Mail },
};

function UsageRow({ item }: { item: EmailUsageItem }) {
    const cfg = STATUS_CONFIG[item.status];
    const Icon = cfg.icon;

    return (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:bg-secondary/20 transition-colors group">
            {/* Status icon */}
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', cfg.color)}>
                <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">{item.campaignName}</p>
                    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold', cfg.color)}>
                        {cfg.label}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.subject}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {item.sentAt && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {item.status === 'scheduled' ? `Scheduled ${item.sentAt}` : item.sentAt}
                        </span>
                    )}
                    {item.openRate !== undefined && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            {item.openRate}% open rate
                        </span>
                    )}
                </div>
            </div>

            {/* Open link */}
            <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="shrink-0 rounded p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-foreground transition-all"
                title="Open campaign"
            >
                <ExternalLink className="h-3.5 w-3.5" />
            </a>
        </div>
    );
}

export function UsageDrilldownModal({ file, onClose }: UsageDrilldownModalProps) {
    if (!file) return null;

    const items = file.usageItems ?? [];
    const sentItems = items.filter(i => i.status === 'sent');
    const avgOpenRate = sentItems.length > 0
        ? sentItems.reduce((s, i) => s + (i.openRate ?? 0), 0) / sentItems.length
        : null;

    return (
        <Dialog open={!!file} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-lg w-full p-0 overflow-hidden gap-0">
                {/* Header */}
                <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
                    {/* Thumb */}
                    <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                        <img src={file.thumbUrl} alt={file.alt} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Used in <span className="font-semibold text-primary">{file.usageCount}</span> campaign{file.usageCount !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="shrink-0 rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Stats row */}
                {(sentItems.length > 0 || avgOpenRate !== null) && (
                    <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                        <div className="px-4 py-3 text-center">
                            <p className="text-lg font-bold tabular-nums text-foreground">{items.length}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Total campaigns</p>
                        </div>
                        <div className="px-4 py-3 text-center">
                            <p className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{sentItems.length}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Sent</p>
                        </div>
                        <div className="px-4 py-3 text-center">
                            {avgOpenRate !== null ? (
                                <>
                                    <p className="text-lg font-bold tabular-nums text-foreground">{avgOpenRate.toFixed(1)}%</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Avg open rate</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-lg font-bold tabular-nums text-muted-foreground">—</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">Avg open rate</p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Campaign list */}
                <div className="overflow-y-auto max-h-[380px] p-4 space-y-2">
                    {items.length > 0 ? (
                        items.map(item => <UsageRow key={item.id} item={item} />)
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                                <Zap className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-foreground">No usage details available</p>
                            <p className="text-xs text-muted-foreground">Campaign data hasn't been loaded yet.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border bg-secondary/20">
                    <p className="text-[10px] text-muted-foreground text-center">
                        Deleting this image will break all campaigns listed above
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}