import { useCallback, ChangeEvent } from 'react';
import { ContactStatus } from '@/types/contacts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, FileUp, Download } from 'lucide-react';

const STATUS_TABS: Array<{ key: ContactStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'unsubscribed', label: 'Unsubscribed' },
    { key: 'bounced', label: 'Bounced' },
];

interface ContactsToolbarProps {
    query: string;
    statusFilter: ContactStatus | 'all';
    visibleCount: number;
    onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusFilter: (s: ContactStatus | 'all') => void;
    onAddContact: () => void;
    onImport: () => void;
    onExport: () => void;
}

export function ContactsToolbar({
                                    query,
                                    statusFilter,
                                    visibleCount,
                                    onQueryChange,
                                    onStatusFilter,
                                    onAddContact,
                                    onImport,
                                    onExport,
                                }: ContactsToolbarProps) {
    const makeStatusHandler = useCallback(
        (s: ContactStatus | 'all') => () => onStatusFilter(s),
        [onStatusFilter],
    );

    return (
        <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-2.5 flex-wrap">
            {/* Status tabs */}
            <div className="flex items-center gap-0.5">
                {STATUS_TABS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={makeStatusHandler(key)}
                        className={[
                            'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                            statusFilter === key
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                        ].join(' ')}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                <Input
                    value={query}
                    onChange={onQueryChange}
                    placeholder="Search contacts…"
                    className="pl-7 h-7 w-48 text-xs"
                />
            </div>

            <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                {visibleCount.toLocaleString()} contact{visibleCount !== 1 ? 's' : ''}
            </span>

            <div className="h-4 w-px bg-border mx-0.5" />

            {/* Actions */}
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onImport}>
                <FileUp className="h-3 w-3" />
                Import
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onExport}>
                <Download className="h-3 w-3" />
                Export
            </Button>
            <Button
                size="sm"
                className="h-7 text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onAddContact}
            >
                <Plus className="h-3 w-3" />
                Add contact
            </Button>
        </div>
    );
}