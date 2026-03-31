import { cn } from '@/lib/utils';
import { fmtSize } from '@/utils/storage';

interface StorageBarProps {
    used: number;
    total: number;
}

export function StorageBar({ used, total }: StorageBarProps) {
    const pct = Math.min(100, (used / total) * 100);
    const warn = pct > 80;
    const danger = pct > 95;

    return (
        <div className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Storage used</p>
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                        {fmtSize(used)} / {fmtSize(total)}
                    </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            danger ? 'bg-destructive' : warn ? 'bg-amber-500' : 'bg-primary',
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(1)}% used</p>
            </div>
        </div>
    );
}