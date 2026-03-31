import { useCallback, ChangeEvent } from 'react';
import { AudienceSegment, Contact, ContactList, SegmentCondition, SegmentField, SegmentOperator } from '@/types/contacts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SEGMENT_FIELD_CONFIG, SEGMENT_OPERATOR_CONFIG } from '@/mocks/segments';
import { Plus, Trash2, Target, Users } from 'lucide-react';

interface SegmentBuilderProps {
    segment: AudienceSegment;
    lists: ContactList[];
    matchingContacts: Contact[];
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onListChange: (listId: string) => void;
    onLogicChange: (logic: 'all' | 'any') => void;
    onAddCondition: () => void;
    onRemoveCondition: (conditionId: string) => void;
    onConditionChange: (conditionId: string, patch: Partial<SegmentCondition>) => void;
}

export function SegmentBuilder({
    segment,
    lists,
    matchingContacts,
    onNameChange,
    onDescriptionChange,
    onListChange,
    onLogicChange,
    onAddCondition,
    onRemoveCondition,
    onConditionChange,
}: SegmentBuilderProps) {
    const handleNameChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onNameChange(event.target.value),
        [onNameChange],
    );

    const handleDescriptionChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => onDescriptionChange(event.target.value),
        [onDescriptionChange],
    );

    const handleListChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => onListChange(event.target.value),
        [onListChange],
    );

    const handleLogicAll = useCallback(() => onLogicChange('all'), [onLogicChange]);
    const handleLogicAny = useCallback(() => onLogicChange('any'), [onLogicChange]);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="border-b border-border bg-card px-6 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Target className="h-3.5 w-3.5" />
                    Segment builder
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Input value={segment.name} onChange={handleNameChange} placeholder="Segment name" className="h-9" />
                    <Input value={segment.description} onChange={handleDescriptionChange} placeholder="Describe this segment" className="h-9" />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select
                        value={segment.listId}
                        onChange={handleListChange}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                    >
                        <option value="all">All lists</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>{list.name}</option>
                        ))}
                    </select>

                    <div className="inline-flex rounded-md border border-border bg-background p-0.5">
                        <button
                            onClick={handleLogicAll}
                            className={[
                                'rounded px-3 py-1 text-xs font-medium transition-colors',
                                segment.logic === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                            ].join(' ')}
                        >
                            Match all (AND)
                        </button>
                        <button
                            onClick={handleLogicAny}
                            className={[
                                'rounded px-3 py-1 text-xs font-medium transition-colors',
                                segment.logic === 'any' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                            ].join(' ')}
                        >
                            Match any (OR)
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-b border-border bg-secondary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conditions</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onAddCondition}>
                        <Plus className="h-3 w-3 mr-1" />Add condition
                    </Button>
                </div>

                <div className="mt-3 space-y-2">
                    {segment.conditions.length === 0 && (
                        <p className="rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                            No conditions. Segment includes all contacts from selected list.
                        </p>
                    )}

                    {segment.conditions.map((condition) => (
                        <ConditionRow
                            key={condition.id}
                            condition={condition}
                            lists={lists}
                            onChange={onConditionChange}
                            onRemove={onRemoveCondition}
                        />
                    ))}
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="rounded-lg border border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            Segment preview
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {matchingContacts.length.toLocaleString()} contacts
                        </span>
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                        {matchingContacts.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No contacts match current conditions.</p>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-card z-10 border-b border-border">
                                <tr>
                                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tags</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matchingContacts.slice(0, 25).map((contact) => (
                                    <tr key={contact.id} className="border-b border-border/40 last:border-0">
                                        <td className="px-4 py-2 text-xs text-foreground">{contact.email}</td>
                                        <td className="px-4 py-2 text-xs text-muted-foreground">{contact.firstName} {contact.lastName}</td>
                                        <td className="px-4 py-2 text-xs text-muted-foreground">{contact.status}</td>
                                        <td className="px-4 py-2 text-xs text-muted-foreground">{contact.tags.join(', ') || '—'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ConditionRowProps {
    condition: SegmentCondition;
    lists: ContactList[];
    onChange: (conditionId: string, patch: Partial<SegmentCondition>) => void;
    onRemove: (conditionId: string) => void;
}

function ConditionRow({ condition, lists, onChange, onRemove }: ConditionRowProps) {
    const handleFieldChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            const field = event.target.value as SegmentField;
            onChange(condition.id, { field, value: '' });
        },
        [condition.id, onChange],
    );

    const handleOperatorChange = useCallback(
        (event: ChangeEvent<HTMLSelectElement>) => {
            onChange(condition.id, { operator: event.target.value as SegmentOperator });
        },
        [condition.id, onChange],
    );

    const handleValueChange = useCallback(
        (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            onChange(condition.id, { value: event.target.value });
        },
        [condition.id, onChange],
    );

    const handleRemove = useCallback(() => onRemove(condition.id), [condition.id, onRemove]);

    const fieldMeta = SEGMENT_FIELD_CONFIG.find((field) => field.key === condition.field) ?? SEGMENT_FIELD_CONFIG[0];

    return (
        <div className="grid gap-2 rounded-md border border-border bg-card p-2 md:grid-cols-[1fr_1fr_1fr_auto]">
            <select
                value={condition.field}
                onChange={handleFieldChange}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
            >
                {SEGMENT_FIELD_CONFIG.map((field) => (
                    <option key={field.key} value={field.key}>{field.label}</option>
                ))}
            </select>

            <select
                value={condition.operator}
                onChange={handleOperatorChange}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
            >
                {SEGMENT_OPERATOR_CONFIG.map((operator) => (
                    <option key={operator.key} value={operator.key}>{operator.label}</option>
                ))}
            </select>

            {condition.field === 'status' ? (
                <select
                    value={condition.value}
                    onChange={handleValueChange}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                    <option value="">Select status</option>
                    <option value="active">active</option>
                    <option value="unsubscribed">unsubscribed</option>
                    <option value="bounced">bounced</option>
                </select>
            ) : condition.field === 'listId' ? (
                <select
                    value={condition.value}
                    onChange={handleValueChange}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                    <option value="">Select list</option>
                    {lists.map((list) => (
                        <option key={list.id} value={list.id}>{list.name}</option>
                    ))}
                </select>
            ) : (
                <Input
                    value={condition.value}
                    onChange={handleValueChange}
                    placeholder={fieldMeta.placeholder}
                    className="h-8 text-xs"
                />
            )}

            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleRemove}>
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}
