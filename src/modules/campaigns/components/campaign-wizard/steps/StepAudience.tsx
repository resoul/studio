import { useCallback } from 'react';
import { CampaignFormData, ContactList, StepErrors } from '@/types/campaign';
import { Users, Check } from 'lucide-react';

const MOCK_LISTS: ContactList[] = [
    { id: 'l1', name: 'All subscribers', count: 14820 },
    { id: 'l2', name: 'Active users', count: 6340 },
    { id: 'l3', name: 'New signups (30d)', count: 1120 },
    { id: 'l4', name: 'VIP customers', count: 430 },
    { id: 'l5', name: 'Re-engagement', count: 2890 },
];

function estimatedTotal(listIds: string[]): number {
    return listIds.reduce((sum, id) => {
        const list = MOCK_LISTS.find((l) => l.id === id);
        return sum + (list?.count ?? 0);
    }, 0);
}

interface StepAudienceProps {
    data: CampaignFormData;
    errors: StepErrors;
    onChange: (patch: Partial<CampaignFormData>) => void;
}

export function StepAudience({ data, errors, onChange }: StepAudienceProps) {
    const handleToggle = useCallback(
        (id: string) => {
            const next = data.listIds.includes(id)
                ? data.listIds.filter((x) => x !== id)
                : [...data.listIds, id];
            onChange({ listIds: next });
        },
        [data.listIds, onChange],
    );

    const total = estimatedTotal(data.listIds);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-base font-semibold text-foreground">Audience</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Select one or more lists. Duplicates are removed automatically.
                </p>
            </div>

            <div className="space-y-2">
                {MOCK_LISTS.map((list) => {
                    const isSelected = data.listIds.includes(list.id);
                    return (
                        <button
                            key={list.id}
                            type="button"
                            onClick={() => handleToggle(list.id)}
                            className={[
                                'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                                isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50',
                            ].join(' ')}
                        >
                            <div
                                className={[
                                    'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                                    isSelected
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background',
                                ].join(' ')}
                            >
                                {isSelected && <Check className="h-2.5 w-2.5" />}
                            </div>
                            <span
                                className={[
                                    'flex-1 text-sm font-medium',
                                    isSelected ? 'text-primary' : 'text-foreground',
                                ].join(' ')}
                            >
                                {list.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {list.count.toLocaleString()} contacts
                            </span>
                        </button>
                    );
                })}
            </div>

            {errors.listIds && (
                <p className="text-xs text-destructive">{errors.listIds}</p>
            )}

            <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {total.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">estimated recipients</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                        {data.listIds.length} list{data.listIds.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-xs text-muted-foreground">after deduplication</p>
                </div>
            </div>
        </div>
    );
}

export { MOCK_LISTS, estimatedTotal };