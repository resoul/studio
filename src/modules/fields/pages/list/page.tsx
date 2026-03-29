import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { CustomField, FieldEntity, FIELD_ENTITY_LABELS } from '@/types/fields';
import { DEFAULT_FIELDS } from '@/modules/fields/components/fieldsData';
import { FieldRow } from '@/modules/fields/components/FieldRow';
import { CreateEditFieldModal } from '@/modules/fields/components/CreateEditFieldModal';
import { DeleteFieldDialog } from '@/modules/fields/components/DeleteFieldDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search, Database, Users, Megaphone, Globe } from 'lucide-react';
import { PageHeader } from './page-header';
import { Content } from '@/layout/components/content';

const ENTITY_TABS: { entity: FieldEntity | 'all'; label: string; Icon: React.ElementType }[] = [
    { entity: 'all',      label: 'All fields', Icon: Database },
    { entity: 'contact',  label: 'Contact',    Icon: Users },
    { entity: 'campaign', label: 'Campaign',   Icon: Megaphone },
    { entity: 'global',   label: 'Global',     Icon: Globe },
];

interface ListProps {
    fields: CustomField[];
    onEdit:   (f: CustomField) => void;
    onDelete: (f: CustomField) => void;
    onMove:   (id: string, dir: 'up' | 'down') => void;
}

function FlatList({ fields, onEdit, onDelete, onMove }: ListProps) {
    return (
        <>
            {fields.map((f, i) => (
                <FieldRow
                    key={f.id}
                    field={f}
                    isFirst={i === 0}
                    isLast={i === fields.length - 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMove={onMove}
                />
            ))}
        </>
    );
}

function GroupedList({ fields, onEdit, onDelete, onMove }: ListProps) {
    const groups: Record<FieldEntity, CustomField[]> = {
        contact:  fields.filter((f) => f.entity === 'contact'),
        campaign: fields.filter((f) => f.entity === 'campaign'),
        global:   fields.filter((f) => f.entity === 'global'),
    };

    return (
        <>
            {(['contact', 'campaign', 'global'] as FieldEntity[]).map((entity) => {
                const group = groups[entity];
                if (group.length === 0) return null;
                return (
                    <div key={entity} className="space-y-2">
                        <div className="flex items-center gap-2 pt-2 first:pt-0">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {FIELD_ENTITY_LABELS[entity]}
                            </span>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground tabular-nums">{group.length}</span>
                        </div>
                        {group.map((f, i) => (
                            <FieldRow
                                key={f.id}
                                field={f}
                                isFirst={i === 0}
                                isLast={i === group.length - 1}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onMove={onMove}
                            />
                        ))}
                    </div>
                );
            })}
        </>
    );
}

function EmptyState({ query, onAdd }: { query: string; onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-secondary p-4 mb-4">
                <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            {query ? (
                <p className="text-sm text-muted-foreground">No fields match "<span className="font-medium text-foreground">{query}</span>".</p>
            ) : (
                <>
                    <p className="text-sm font-medium text-foreground mb-1">No fields yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Create custom fields to extend your contact and campaign data.</p>
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Create first field
                    </Button>
                </>
            )}
        </div>
    );
}

export default function ListsPage() {
    const [fields, setFields]         = useState<CustomField[]>(DEFAULT_FIELDS);
    const [activeTab, setActiveTab]   = useState<FieldEntity | 'all'>('all');
    const [query, setQuery]           = useState('');
    const [editingField, setEditingField] = useState<CustomField | null | undefined>(undefined);
    // undefined = modal closed, null = creating new, CustomField = editing
    const [deletingField, setDeletingField] = useState<CustomField | null>(null);

    const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

    const filtered = useMemo(() => {
        let list = fields;
        if (activeTab !== 'all') list = list.filter((f) => f.entity === activeTab);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (f) =>
                    f.label.toLowerCase().includes(q) ||
                    f.key.toLowerCase().includes(q) ||
                    f.description.toLowerCase().includes(q),
            );
        }
        return [...list].sort((a, b) => a.order - b.order);
    }, [fields, activeTab, query]);

    const countFor = useCallback(
        (entity: FieldEntity | 'all') =>
            entity === 'all'
                ? fields.length
                : fields.filter((f) => f.entity === entity).length,
        [fields],
    );

    const existingKeys = useMemo(() => fields.map((f) => f.key), [fields]);
    const nextOrder    = useMemo(
        () => Math.max(0, ...fields.map((f) => f.order)) + 1,
        [fields],
    );

    // ── handlers ─────────────────────────────────────────────────────────────

    const handleSave = useCallback((saved: CustomField) => {
        setFields((prev) => {
            const idx = prev.findIndex((f) => f.id === saved.id);
            return idx === -1 ? [...prev, saved] : prev.map((f) => (f.id === saved.id ? saved : f));
        });
        setEditingField(undefined);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
        setDeletingField(null);
    }, []);

    const handleMove = useCallback((id: string, dir: 'up' | 'down') => {
        setFields((prev) => {
            const entityFields = [...prev].sort((a, b) => a.order - b.order);
            const idx = entityFields.findIndex((f) => f.id === id);
            if (idx === -1) return prev;
            const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= entityFields.length) return prev;

            const updated = [...entityFields];
            const aOrder = updated[idx].order;
            const bOrder = updated[swapIdx].order;
            updated[idx]     = { ...updated[idx],     order: bOrder };
            updated[swapIdx] = { ...updated[swapIdx], order: aOrder };

            return prev.map((f) => {
                const match = updated.find((u) => u.id === f.id);
                return match ?? f;
            });
        });
    }, []);

    const openCreate = useCallback(() => setEditingField(null), []);
    const openEdit   = useCallback((f: CustomField) => setEditingField(f), []);
    const openDelete = useCallback((f: CustomField) => setDeletingField(f), []);

    return (
        <>
            <PageHeader onCreate={openCreate} />
            <div className="container-fluid">
                <Content className="block space-y-6 py-5">

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-px border-b border-border bg-border shrink-0">
                        {ENTITY_TABS.map(({ entity, label, Icon }) => (
                            <button
                                key={entity}
                                onClick={() => setActiveTab(entity)}
                                className={[
                                    'flex items-center gap-3 px-5 py-3.5 bg-card text-left transition-colors hover:bg-secondary/40',
                                    activeTab === entity ? 'border-b-2 border-primary' : '',
                                ].join(' ')}
                            >
                                <div className={[
                                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                                    activeTab === entity ? 'bg-primary/10' : 'bg-secondary',
                                ].join(' ')}>
                                    <Icon className={[
                                        'h-4 w-4',
                                        activeTab === entity ? 'text-primary' : 'text-muted-foreground',
                                    ].join(' ')} />
                                </div>
                                <div>
                                    <p className={[
                                        'text-xl font-semibold tabular-nums leading-tight',
                                        activeTab === entity ? 'text-primary' : 'text-foreground',
                                    ].join(' ')}>
                                        {countFor(entity)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-secondary/10 shrink-0">
                        <div className="relative max-w-xs flex-1">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={query}
                                onChange={handleQueryChange}
                                placeholder="Search fields…"
                                className="pl-8 h-8 text-sm"
                            />
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {filtered.length} field{filtered.length !== 1 ? 's' : ''}
                </span>
                    </div>

                    {/* Field list */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {filtered.length === 0 ? (
                            <EmptyState query={query} onAdd={openCreate} />
                        ) : (
                            <div className="space-y-2">
                                {/* Group by entity within "all" tab */}
                                {activeTab === 'all'
                                    ? <GroupedList fields={filtered} onEdit={openEdit} onDelete={openDelete} onMove={handleMove} />
                                    : <FlatList    fields={filtered} onEdit={openEdit} onDelete={openDelete} onMove={handleMove} />
                                }
                            </div>
                        )}
                    </div>

                    {/* Modals */}
                    <CreateEditFieldModal
                        open={editingField !== undefined}
                        onOpenChange={(v) => !v && setEditingField(undefined)}
                        field={editingField ?? null}
                        existingKeys={existingKeys}
                        nextOrder={nextOrder}
                        onSave={handleSave}
                    />

                    <DeleteFieldDialog
                        field={deletingField}
                        onClose={() => setDeletingField(null)}
                        onConfirm={handleDelete}
                    />
                </Content>
            </div>
        </>
    );
}
