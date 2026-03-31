import { ContactList } from '@/types/contacts';
import { LIST_STATS, LIST_HYGIENE } from '@/mocks/contacts';
import { fmt, pct } from '@/utils/contacts';
import { BarChart2, ShieldCheck } from 'lucide-react';

interface StatPillProps {
    label: string;
    value: string | number;
    sub?: string;
}

function StatPill({ label, value, sub }: StatPillProps) {
    return (
        <div className="flex flex-col gap-0.5 min-w-[80px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            <span className="text-sm font-bold text-foreground tabular-nums">{value}</span>
            {sub && (
                <span className="text-[10px] text-muted-foreground tabular-nums">{sub}</span>
            )}
        </div>
    );
}

interface HygieneTileProps {
    label: string;
    value: string | number;
    warning?: boolean;
}

function HygieneTile({ label, value, warning = false }: HygieneTileProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
            <span
                className={[
                    'text-xl font-bold tabular-nums',
                    warning && Number(value) > 0 ? 'text-rose-500' : 'text-foreground',
                ].join(' ')}
            >
                {value}
            </span>
        </div>
    );
}

interface ListStatsPanelProps {
    list: ContactList;
}

export function ListStatsPanel({ list }: ListStatsPanelProps) {
    const stats = LIST_STATS[list.id];
    const hygiene = LIST_HYGIENE[list.id];

    if (!stats && !hygiene) return null;

    return (
        <>
            {stats && (
                <div className="border-b border-border bg-card px-6 py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                        <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Engagement
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-5 lg:grid-cols-9">
                        <StatPill label="Sent"        value={fmt(stats.sent)} />
                        <StatPill label="Delivered"   value={fmt(stats.delivered)}   sub={pct(stats.delivered,   stats.sent)} />
                        <StatPill label="Opened"      value={fmt(stats.opened)}      sub={pct(stats.opened,      stats.delivered)} />
                        <StatPill label="Open Uniq"   value={fmt(stats.openedUnique)} sub={pct(stats.openedUnique, stats.delivered)} />
                        <StatPill label="Clicked"     value={fmt(stats.clicked)}     sub={pct(stats.clicked,     stats.delivered)} />
                        <StatPill label="Click Uniq"  value={fmt(stats.clickedUnique)} sub={pct(stats.clickedUnique, stats.delivered)} />
                        <StatPill label="Unsubs"      value={fmt(stats.unsubscribes)} sub={pct(stats.unsubscribes, stats.sent)} />
                        <StatPill label="Complaints"  value={fmt(stats.complaints)}  sub={pct(stats.complaints,  stats.sent)} />
                        <StatPill label="Forwards"    value={fmt(stats.forwards)} />
                    </div>
                </div>
            )}

            {hygiene && (
                <div className="border-b border-border bg-secondary/20 px-6 py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            List hygiene
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-x-8 gap-y-3 sm:grid-cols-6 lg:grid-cols-12">
                        <HygieneTile label="List size"    value={fmt(hygiene.listSize)} />
                        <HygieneTile label="Usable"       value={fmt(hygiene.usable)} />
                        <HygieneTile label="Hard bounces" value={fmt(hygiene.hardBounces)} warning />
                        <HygieneTile label="Hygiene %"    value={hygiene.hygiene + '%'} warning={hygiene.hygiene > 2} />
                        <HygieneTile label="Complaints"   value={fmt(hygiene.complaints)} warning />
                        <HygieneTile label="Verified"     value={fmt(hygiene.verified)} />
                        <HygieneTile label="Verified %"   value={hygiene.verifiedPct + '%'} />
                        <HygieneTile label="Spamtrap"     value={fmt(hygiene.spamtrap)} warning />
                        <HygieneTile label="Catchall"     value={fmt(hygiene.catchall)} />
                        <HygieneTile label="Disposable"   value={fmt(hygiene.disposable)} warning />
                        <HygieneTile label="Unsubs"       value={fmt(hygiene.unsubscribes)} />
                        <HygieneTile label="Unknown"      value={fmt(hygiene.unknown)} />
                    </div>
                </div>
            )}
        </>
    );
}