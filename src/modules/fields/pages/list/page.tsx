import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { CustomField, FieldEntity, FIELD_ENTITY_LABELS } from '@/types/fields';
import { DEFAULT_FIELDS } from '@/mocks/fields';
import { FieldRow }              from '@/modules/fields/components/FieldRow';
import { CreateEditFieldModal }  from '@/modules/fields/components/CreateEditFieldModal';
import { DeleteFieldDialog }     from '@/modules/fields/components/DeleteFieldDialog';
import { ImportExportModal }     from '@/modules/fields/components/ImportExportModal';
import { Input }    from '@/components/ui/input';
import { Button }   from '@/components/ui/button';
import { Badge }    from '@/components/ui/badge';
import {
    Plus, Search, Database, Users, Megaphone, Globe,
    Download, Upload, ChevronDown, ChevronRight,
} from 'lucide-react';
import { PageHeader }  from './page-header';
import { Content }     from '@/layout/components/content';
import { cn }          from '@/lib/utils';

const ENTITY_TABS: { entity: FieldEntity | 'all'; label: string; Icon: React.ElementType }[] = [
    { entity: 'all',      label: 'All fields', Icon: Database },
    { entity: 'contact',  label: 'Contact',    Icon: Users },
    { entity: 'campaign', label: 'Campaign',   Icon: Megaphone },
    { entity: 'global',   label: 'Global',     Icon: Globe },
];

interface GroupedListProps {
    fields:      CustomField[];
    onEdit:      (f: CustomField) => void;
    onDelete:    (f: CustomField) => void;
    onDuplicate: (f: CustomField) => void;
    onLabelSave: (id: string, label: string) => void;
}

function GroupedList({ fields, onEdit, onDelete, onDuplicate, onLabelSave }: GroupedListProps) {
    const [collapsed, setCollapsed] = useState<Set<FieldEntity>>(new Set());

    const toggle = useCallback((entity: FieldEntity) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            next.has(entity) ? next.delete(entity) : next.add(entity);
            return next;
        });
    }, []);

    const groups: Record<FieldEntity, CustomField[]> = {
        contact:  fields.filter(f => f.entity === 'contact'),
        campaign: fields.filter(f => f.entity === 'campaign'),
        global:   fields.filter(f => f.entity === 'global'),
    };

    return (
        <>
            {(['contact', 'campaign', 'global'] as FieldEntity[]).map((entity) => {
                const group = groups[entity];
                if (group.length === 0) return null;
                const isCollapsed = collapsed.has(entity);
                return (
                    <div key={entity} className="space-y-2">
                        <button
                            onClick={() => toggle(entity)}
                            className="flex items-center gap-2 pt-2 first:pt-0 w-full text-left hover:opacity-80 transition-opacity"
                        >
                            {isCollapsed
                                ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                : <ChevronDown  className="h-3.5 w-3.5 text-muted-foreground" />
                            }
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {FIELD_ENTITY_LABELS[entity]}
                            </span>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground tabular-nums mr-2">{group.length}</span>
                        </button>
                        {!isCollapsed && (
                            <SortableContext items={group.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                {group.map((f) => (
                                    <FieldRow
                                        key={f.id}
                                        field={f}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onDuplicate={onDuplicate}
                                        onLabelSave={onLabelSave}
                                    />
                                ))}
                            </SortableContext>
                        )}
                    </div>
                );
            })}
        </>
    );
}

interface FlatListProps {
    fields:      CustomField[];
    onEdit:      (f: CustomField) => void;
    onDelete:    (f: CustomField) => void;
    onDuplicate: (f: CustomField) => void;
    onLabelSave: (id: string, label: string) => void;
}

function FlatList({ fields, onEdit, onDelete, onDuplicate, onLabelSave }: FlatListProps) {
    return (
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((f) => (
                <FieldRow
                    key={f.id}
                    field={f}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onLabelSave={onLabelSave}
                />
            ))}
        </SortableContext>
    );
}

function EmptyState({ query, onAdd }: { query: string; onAdd: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-secondary p-4 mb-4">
                <Database className="h-8 w-8 text-muted-foreground" />
            </div>
            {query ? (
                <p className="text-sm text-muted-foreground">
                    No fields match "<span className="font-medium text-foreground">{query}</span>".
                </p>
            ) : (
                <>
                    <p className="text-sm font-medium text-foreground mb-1">No fields yet</p>
                    <p className="text-xs text-muted-foreground mb-4">
                        Create custom fields to extend your contact and campaign data.
                    </p>
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
    const [fields,       setFields]       = useState<CustomField[]>(DEFAULT_FIELDS);
    const [activeTab,    setActiveTab]    = useState<FieldEntity | 'all'>('all');
    const [query,        setQuery]        = useState('');
    const [activeTag,    setActiveTag]    = useState<string | null>(null);
    const [editingField, setEditingField] = useState<CustomField | null | undefined>(undefined);
    const [deletingField,setDeletingField]= useState<CustomField | null>(null);
    const [importExport, setImportExport] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const allTags = useMemo(() => {
        const set = new Set<string>();
        fields.forEach(f => f.tags?.forEach(t => set.add(t)));
        return [...set].sort();
    }, [fields]);

    const filtered = useMemo(() => {
        let list = fields;
        if (activeTab !== 'all') list = list.filter(f => f.entity === activeTab);
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(f =>
                f.label.toLowerCase().includes(q) ||
                f.key.toLowerCase().includes(q)   ||
                f.description.toLowerCase().includes(q),
            );
        }
        if (activeTag) {
            list = list.filter(f => f.tags?.includes(activeTag));
        }
        return [...list].sort((a, b) => a.order - b.order);
    }, [fields, activeTab, query, activeTag]);

    const countFor = useCallback(
        (entity: FieldEntity | 'all') =>
            entity === 'all'
                ? fields.length
                : fields.filter(f => f.entity === entity).length,
        [fields],
    );

    const totalUsage = useMemo(
        () => fields.reduce((s, f) => s + (f.usageCount ?? 0), 0),
        [fields],
    );

    const existingKeys = useMemo(() => fields.map(f => f.key), [fields]);
    const nextOrder    = useMemo(
        () => Math.max(0, ...fields.map(f => f.order)) + 1,
        [fields],
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setFields(prev => {
            const sorted = [...prev].sort((a, b) => a.order - b.order);
            const oldIdx = sorted.findIndex(f => f.id === active.id);
            const newIdx = sorted.findIndex(f => f.id === over.id);
            if (oldIdx === -1 || newIdx === -1) return prev;
            const reordered = arrayMove(sorted, oldIdx, newIdx);
            return reordered.map((f, i) => ({ ...f, order: i }));
        });
    }, []);

    const handleSave = useCallback((saved: CustomField) => {
        setFields(prev => {
            const idx = prev.findIndex(f => f.id === saved.id);
            return idx === -1 ? [...prev, saved] : prev.map(f => f.id === saved.id ? saved : f);
        });
        setEditingField(undefined);
    }, []);

    const handleDelete = useCallback((id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
        setDeletingField(null);
    }, []);

    const handleDuplicate = useCallback((source: CustomField) => {
        const now = new Date().toISOString().split('T')[0];
        const newField: CustomField = {
            ...source,
            id:        `cf-dup-${Date.now()}`,
            key:       `${source.key}_copy`,
            label:     `${source.label} (copy)`,
            system:    false,
            order:     nextOrder,
            createdAt: now,
        };
        setFields(prev => [...prev, newField]);
    }, [nextOrder]);

    const handleLabelSave = useCallback((id: string, label: string) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, label } : f));
    }, []);

    const handleImport = useCallback((imported: CustomField[]) => {
        setFields(prev => [...prev, ...imported]);
    }, []);

    const openCreate = useCallback(() => setEditingField(null),   []);
    const openEdit   = useCallback((f: CustomField) => setEditingField(f),   []);
    const openDelete = useCallback((f: CustomField) => setDeletingField(f),  []);

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
                                className={cn(
                                    'flex items-center gap-3 px-5 py-3.5 bg-card text-left transition-colors hover:bg-secondary/40',
                                    activeTab === entity && 'border-b-2 border-primary',
                                )}
                            >
                                <div className={cn(
                                    'h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                                    activeTab === entity ? 'bg-primary/10' : 'bg-secondary',
                                )}>
                                    <Icon className={cn(
                                        'h-4 w-4',
                                        activeTab === entity ? 'text-primary' : 'text-muted-foreground',
                                    )} />
                                </div>
                                <div>
                                    <p className={cn(
                                        'text-xl font-semibold tabular-nums leading-tight',
                                        activeTab === entity ? 'text-primary' : 'text-foreground',
                                    )}>
                                        {countFor(entity)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{label}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Usage stat bar */}
                    {totalUsage > 0 && (
                        <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                            <Database className="h-4 w-4 text-blue-500 shrink-0" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Your fields are used across <strong>{totalUsage.toLocaleString()}</strong> records total.
                            </p>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border bg-secondary/10 shrink-0">
                        <div className="relative max-w-xs flex-1 min-w-[160px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={query}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                placeholder="Search fields…"
                                className="pl-8 h-8 text-sm"
                            />
                        </div>

                        {/* Tag filter chips */}
                        {allTags.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {allTags.map(tag => (
                                    <Badge
                                        key={tag}
                                        variant={activeTag === tag ? 'primary' : 'secondary'}
                                        className="cursor-pointer text-xs"
                                        onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-muted-foreground tabular-nums">
                                {filtered.length} field{filtered.length !== 1 ? 's' : ''}
                            </span>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setImportExport(true)}
                            >
                                <Download className="h-3.5 w-3.5" />
                                <Upload  className="h-3.5 w-3.5 -ml-1" />
                                Import / Export
                            </Button>
                        </div>
                    </div>

                    {/* Field list with DnD */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {filtered.length === 0 ? (
                            <EmptyState query={query} onAdd={openCreate} />
                        ) : (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                modifiers={[restrictToVerticalAxis]}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="space-y-2">
                                    {activeTab === 'all' ? (
                                        <GroupedList
                                            fields={filtered}
                                            onEdit={openEdit}
                                            onDelete={openDelete}
                                            onDuplicate={handleDuplicate}
                                            onLabelSave={handleLabelSave}
                                        />
                                    ) : (
                                        <FlatList
                                            fields={filtered}
                                            onEdit={openEdit}
                                            onDelete={openDelete}
                                            onDuplicate={handleDuplicate}
                                            onLabelSave={handleLabelSave}
                                        />
                                    )}
                                </div>
                            </DndContext>
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

                    <ImportExportModal
                        open={importExport}
                        onOpenChange={setImportExport}
                        fields={fields}
                        existingKeys={existingKeys}
                        nextOrder={nextOrder}
                        onImport={handleImport}
                    />
                </Content>
            </div>
        </>
    );
}