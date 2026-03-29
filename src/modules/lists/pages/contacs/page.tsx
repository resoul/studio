import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import {
    Contact,
    ContactList,
    ContactStatus,
    AudienceSegment,
    SegmentCondition,
} from '@/types/contacts';
import { MOCK_LISTS, MOCK_CONTACTS } from '@/modules/lists/components/contactsData';
import { MOCK_SEGMENTS } from '@/modules/lists/components/segmentsData';
import { getSegmentMatches } from '@/modules/lists/components/segmentation';
import { ListsSidebar } from '@/modules/lists/components/ListsSidebar';
import { SegmentSidebar } from '@/modules/lists/components/SegmentSidebar';
import { SegmentBuilder } from '@/modules/lists/components/SegmentBuilder';
import { CreateListModal } from '@/modules/lists/components/CreateListModal';
import { AddContactModal } from '@/modules/lists/components/AddContactModal';
import { ImportContactsModal } from '@/modules/lists/components/ImportContactsModal';
import {
    Users, Plus, RefreshCw, Search, FileUp, Trash2, Tag,
    Circle, BarChart2, ShieldCheck, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uid } from '@/utils/uid';
import { Content } from '@/layout/components/content';
import { ContentHeader } from '@/layout/components/content-header';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const LIST_STATS: Record<string, {
    sent: number; delivered: number; opened: number; openedUnique: number;
    clicked: number; clickedUnique: number; unsubscribes: number;
    complaints: number; forwards: number;
}> = {
    l1: { sent: 14200, delivered: 13980, opened: 3740, openedUnique: 3200, clicked: 620, clickedUnique: 510, unsubscribes: 42, complaints: 8, forwards: 120 },
    l2: { sent: 6200, delivered: 6110, opened: 2340, openedUnique: 2100, clicked: 410, clickedUnique: 380, unsubscribes: 18, complaints: 3, forwards: 55 },
    l3: { sent: 1100, delivered: 1095, opened: 480, openedUnique: 450, clicked: 90, clickedUnique: 80, unsubscribes: 4, complaints: 0, forwards: 12 },
    l4: { sent: 420, delivered: 418, opened: 244, openedUnique: 230, clicked: 98, clickedUnique: 90, unsubscribes: 2, complaints: 0, forwards: 8 },
    l5: { sent: 2800, delivered: 2710, opened: 560, openedUnique: 490, clicked: 70, clickedUnique: 60, unsubscribes: 95, complaints: 12, forwards: 18 },
};

const LIST_HYGIENE: Record<string, {
    listSize: number; usable: number; hardBounces: number; hygiene: number;
    complaints: number; verified: number; verifiedPct: number;
    spamtrap: number; catchall: number; disposable: number;
    unsubscribes: number; bots: number; unknown: number;
}> = {
    l1: { listSize: 14820, usable: 13100, hardBounces: 420, hygiene: 3, complaints: 8, verified: 12600, verifiedPct: 85, spamtrap: 12, catchall: 340, disposable: 60, unsubscribes: 42, bots: 8, unknown: 80 },
    l2: { listSize: 6340, usable: 5980, hardBounces: 120, hygiene: 2, complaints: 3, verified: 5800, verifiedPct: 92, spamtrap: 4, catchall: 110, disposable: 20, unsubscribes: 18, bots: 2, unknown: 30 },
    l3: { listSize: 1120, usable: 1090, hardBounces: 14, hygiene: 1, complaints: 0, verified: 1060, verifiedPct: 95, spamtrap: 0, catchall: 22, disposable: 4, unsubscribes: 4, bots: 0, unknown: 6 },
    l4: { listSize: 430, usable: 422, hardBounces: 3, hygiene: 0, complaints: 0, verified: 418, verifiedPct: 97, spamtrap: 0, catchall: 6, disposable: 1, unsubscribes: 2, bots: 0, unknown: 2 },
    l5: { listSize: 2890, usable: 2100, hardBounces: 380, hygiene: 8, complaints: 12, verified: 2000, verifiedPct: 70, spamtrap: 28, catchall: 210, disposable: 80, unsubscribes: 95, bots: 14, unknown: 120 },
};

const STATUS_CONFIG: Record<ContactStatus, { label: string; dot: string; text: string }> = {
    active: { label: 'Active', dot: 'text-emerald-500', text: 'text-emerald-600' },
    unsubscribed: { label: 'Unsubscribed', dot: 'text-amber-400', text: 'text-amber-600' },
    bounced: { label: 'Bounced', dot: 'text-rose-500', text: 'text-rose-600' },
};

type ContactsViewMode = 'lists' | 'segments';

function pct(a: number, b: number) {
    if (!b) return '0.00%';
    return ((a / b) * 100).toFixed(2) + '%';
}

function fmt(n: number) {
    return n.toLocaleString();
}

function StatPill({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="flex flex-col gap-0.5 min-w-[90px]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="text-sm font-bold text-foreground tabular-nums">{value}</span>
            {sub && <span className="text-[10px] text-muted-foreground tabular-nums">{sub}</span>}
        </div>
    );
}

function HygieneTile({ label, value, warning = false }: { label: string; value: string | number; warning?: boolean }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className={['text-xl font-bold tabular-nums', warning && Number(value) > 0 ? 'text-rose-500' : 'text-foreground'].join(' ')}>
                {value}
            </span>
        </div>
    );
}

export default function ContactsPage() {
    const [mode, setMode] = useState<ContactsViewMode>('lists');

    const [lists, setLists] = useState<ContactList[]>(MOCK_LISTS);
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [segments, setSegments] = useState<AudienceSegment[]>(MOCK_SEGMENTS);

    const [selectedListId, setSelectedListId] = useState<string | null>(MOCK_LISTS[0]?.id ?? null);
    const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(MOCK_SEGMENTS[0]?.id ?? null);

    const [showCreateList, setShowCreateList] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [showImport, setShowImport] = useState(false);

    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [, setRefreshKey] = useState(0);

    const selectedList = lists.find((list) => list.id === selectedListId) ?? null;
    const selectedSegment = segments.find((segment) => segment.id === selectedSegmentId) ?? null;

    const visibleContacts = contacts.filter((contact) => {
        if (contact.listId !== selectedListId) return false;
        if (statusFilter !== 'all' && contact.status !== statusFilter) return false;
        if (!query.trim()) return true;

        const normalizedQuery = query.toLowerCase();
        return (
            contact.firstName.toLowerCase().includes(normalizedQuery)
            || contact.lastName.toLowerCase().includes(normalizedQuery)
            || contact.email.toLowerCase().includes(normalizedQuery)
        );
    });

    const segmentContacts = useMemo(
        () => (selectedSegment ? getSegmentMatches(selectedSegment, contacts) : []),
        [selectedSegment, contacts],
    );

    const stats = selectedListId ? LIST_STATS[selectedListId] : null;
    const hygiene = selectedListId ? LIST_HYGIENE[selectedListId] : null;

    const syncSegmentMeta = useCallback((segment: AudienceSegment): AudienceSegment => ({
        ...segment,
        estimatedContacts: getSegmentMatches(segment, contacts).length,
        updatedAt: new Date().toISOString().slice(0, 10),
    }), [contacts]);

    const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    const handleSwitchToLists = useCallback(() => setMode('lists'), []);
    const handleSwitchToSegments = useCallback(() => setMode('segments'), []);

    const handleSelectList = useCallback((id: string) => {
        setSelectedListId(id);
        setSelected(new Set());
        setQuery('');
    }, []);

    const handleSelectSegment = useCallback((id: string) => {
        setSelectedSegmentId(id);
    }, []);

    const toggleSelect = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        setSelected((prev) => (
            prev.size === visibleContacts.length
                ? new Set()
                : new Set(visibleContacts.map((contact) => contact.id))
        ));
    }, [visibleContacts]);

    const handleListCreated = useCallback((list: ContactList) => {
        setLists((prev) => [...prev, list]);
        setSelectedListId(list.id);
        setMode('lists');
    }, []);

    const handleContactAdded = useCallback((contact: Contact) => {
        setContacts((prev) => [contact, ...prev]);
        setLists((prev) => prev.map((list) => (
            list.id === contact.listId
                ? { ...list, contactCount: list.contactCount + 1 }
                : list
        )));
    }, []);

    const handleImported = useCallback((imported: Contact[]) => {
        if (!imported.length) return;

        setContacts((prev) => [...imported, ...prev]);
        setLists((prev) => prev.map((list) => (
            list.id === selectedListId
                ? { ...list, contactCount: list.contactCount + imported.length }
                : list
        )));
    }, [selectedListId]);

    const handleDelete = useCallback((id: string) => {
        const target = contacts.find((contact) => contact.id === id);
        if (!target) return;

        setContacts((prev) => prev.filter((contact) => contact.id !== id));
        setLists((prev) => prev.map((list) => (
            list.id === target.listId
                ? { ...list, contactCount: Math.max(0, list.contactCount - 1) }
                : list
        )));
        setSelected((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, [contacts]);

    const handleRemoveSelected = useCallback(() => {
        selected.forEach((id) => handleDelete(id));
        setSelected(new Set());
    }, [selected, handleDelete]);

    const handleCreateSegment = useCallback(() => {
        const nextSegment: AudienceSegment = syncSegmentMeta({
            id: uid('segment'),
            name: 'Untitled segment',
            description: 'New custom segment',
            listId: selectedListId ?? 'all',
            logic: 'all',
            conditions: [],
            estimatedContacts: 0,
            updatedAt: new Date().toISOString().slice(0, 10),
            color: '#0EA5E9',
        });

        setSegments((prev) => [nextSegment, ...prev]);
        setSelectedSegmentId(nextSegment.id);
        setMode('segments');
    }, [selectedListId, syncSegmentMeta]);

    const updateSelectedSegment = useCallback((updater: (segment: AudienceSegment) => AudienceSegment) => {
        if (!selectedSegmentId) return;

        setSegments((prev) => prev.map((segment) => (
            segment.id === selectedSegmentId
                ? syncSegmentMeta(updater(segment))
                : segment
        )));
    }, [selectedSegmentId, syncSegmentMeta]);

    const handleSegmentNameChange = useCallback((value: string) => {
        updateSelectedSegment((segment) => ({ ...segment, name: value }));
    }, [updateSelectedSegment]);

    const handleSegmentDescriptionChange = useCallback((value: string) => {
        updateSelectedSegment((segment) => ({ ...segment, description: value }));
    }, [updateSelectedSegment]);

    const handleSegmentListChange = useCallback((listId: string) => {
        updateSelectedSegment((segment) => ({ ...segment, listId }));
    }, [updateSelectedSegment]);

    const handleSegmentLogicChange = useCallback((logic: 'all' | 'any') => {
        updateSelectedSegment((segment) => ({ ...segment, logic }));
    }, [updateSelectedSegment]);

    const handleSegmentAddCondition = useCallback(() => {
        updateSelectedSegment((segment) => ({
            ...segment,
            conditions: [
                ...segment.conditions,
                { id: uid('condition'), field: 'status', operator: 'is', value: '' },
            ],
        }));
    }, [updateSelectedSegment]);

    const handleSegmentRemoveCondition = useCallback((conditionId: string) => {
        updateSelectedSegment((segment) => ({
            ...segment,
            conditions: segment.conditions.filter((condition) => condition.id !== conditionId),
        }));
    }, [updateSelectedSegment]);

    const handleSegmentConditionChange = useCallback((conditionId: string, patch: Partial<SegmentCondition>) => {
        updateSelectedSegment((segment) => ({
            ...segment,
            conditions: segment.conditions.map((condition) => (
                condition.id === conditionId
                    ? { ...condition, ...patch }
                    : condition
            )),
        }));
    }, [updateSelectedSegment]);

    return (
        <>
            <ContentHeader className="space-x-2">
                <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h2 className="text-sm font-semibold text-foreground">
                            {mode === 'lists' ? ('Lists') : ('Segments')}
                        </h2>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" mode="icon" size="sm" onClick={mode === 'lists' ? () => setShowCreateList(true) : handleCreateSegment}>
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                {mode === 'lists' ? 'Add a new list' : 'Add a new segment'}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </aside>
                <div className="flex items-center justify-between bg-card grow">
                    <div className="inline-flex rounded-md border border-border bg-background p-0.5">
                        <button
                            onClick={handleSwitchToLists}
                            className={[
                                'rounded px-3 py-1.5 text-xs font-semibold transition-colors',
                                mode === 'lists' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                            ].join(' ')}
                        >
                            Lists
                        </button>
                        <button
                            onClick={handleSwitchToSegments}
                            className={[
                                'rounded px-3 py-1.5 text-xs font-semibold transition-colors',
                                mode === 'segments' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                            ].join(' ')}
                        >
                            Segments
                        </button>
                    </div>
                    {mode === 'lists' ? (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                Refresh
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
                                <FileUp className="h-3.5 w-3.5 mr-1.5" />
                                Import CSV
                            </Button>
                            <Button size="sm" onClick={() => setShowAddContact(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add contact
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleCreateSegment}>
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                New segment
                            </Button>
                            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSwitchToLists}>
                                <Target className="h-3.5 w-3.5 mr-1.5" />
                                Save view
                            </Button>
                        </div>
                    )}
                </div>
            </ContentHeader>
            <div className="container-fluid">
                <Content className="block py-0">
                    <div className="flex flex-1 overflow-hidden">
                        {!selectedList ? (
                            <>
                                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                    <div className="rounded-full bg-secondary p-5">
                                        <Users className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm font-semibold text-foreground">Select a list</p>
                                    <p className="text-xs text-muted-foreground">Choose a list from the sidebar or create a new one</p>
                                    <Button size="sm" onClick={() => setShowCreateList(true)}>
                                        <Plus className="h-3.5 w-3.5 mr-1.5" />Create list
                                    </Button>
                                </div>
                                <CreateListModal open={showCreateList} onOpenChange={setShowCreateList} onCreated={handleListCreated} />
                            </>
                        ) : (
                            <>
                                <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden in-data-[sidebar-collapsed]:w-[calc(16rem+36px)] transition-[width] duration-200 ease-in-out">
                                    {mode === 'lists' ? (
                                        <ListsSidebar
                                            lists={lists}
                                            selectedId={selectedListId}
                                            onSelect={handleSelectList}
                                            onCreateNew={() => setShowCreateList(true)}
                                        />
                                    ) : (
                                        <SegmentSidebar
                                            segments={segments}
                                            lists={lists}
                                            selectedId={selectedSegmentId}
                                            onSelect={handleSelectSegment}
                                            onCreateNew={handleCreateSegment}
                                        />
                                    )}
                                </aside>
                                <div className="flex items-center justify-between bg-card grow">
                                    <div className="flex flex-1 flex-col overflow-hidden">
                                        {mode === 'lists' ? (
                                            <div className="flex-1 overflow-y-auto">
                                                {selectedList && (
                                                    <div className="border-b border-border bg-card px-6 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: selectedList.color }} />
                                                            <div>
                                                                <h1 className="text-sm font-semibold text-foreground">{selectedList.name}</h1>
                                                                {selectedList.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5">{selectedList.description}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {stats && (
                                                    <div className="border-b border-border bg-card px-6 py-4">
                                                        <div className="flex items-center gap-1.5 mb-3">
                                                            <BarChart2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engagement</span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-5 lg:grid-cols-9">
                                                            <StatPill label="Sent" value={fmt(stats.sent)} />
                                                            <StatPill label="Delivered" value={fmt(stats.delivered)} sub={pct(stats.delivered, stats.sent)} />
                                                            <StatPill label="Opened" value={fmt(stats.opened)} sub={pct(stats.opened, stats.delivered)} />
                                                            <StatPill label="Open Unique" value={fmt(stats.openedUnique)} sub={pct(stats.openedUnique, stats.delivered)} />
                                                            <StatPill label="Clicked" value={fmt(stats.clicked)} sub={pct(stats.clicked, stats.delivered)} />
                                                            <StatPill label="Click Unique" value={fmt(stats.clickedUnique)} sub={pct(stats.clickedUnique, stats.delivered)} />
                                                            <StatPill label="Unsubs" value={fmt(stats.unsubscribes)} sub={pct(stats.unsubscribes, stats.sent)} />
                                                            <StatPill label="Complaints" value={fmt(stats.complaints)} sub={pct(stats.complaints, stats.sent)} />
                                                            <StatPill label="Forwards" value={fmt(stats.forwards)} />
                                                        </div>
                                                    </div>
                                                )}

                                                {hygiene && (
                                                    <div className="border-b border-border bg-secondary/20 px-6 py-4">
                                                        <div className="flex items-center gap-1.5 mb-3">
                                                            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">List settings & hygiene</span>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-x-8 gap-y-3 sm:grid-cols-6 lg:grid-cols-12">
                                                            <HygieneTile label="List size" value={fmt(hygiene.listSize)} />
                                                            <HygieneTile label="Usable" value={fmt(hygiene.usable)} />
                                                            <HygieneTile label="Hard bounces" value={fmt(hygiene.hardBounces)} warning />
                                                            <HygieneTile label="Hygiene %" value={hygiene.hygiene + '%'} warning={hygiene.hygiene > 2} />
                                                            <HygieneTile label="Complaints" value={fmt(hygiene.complaints)} warning />
                                                            <HygieneTile label="Verified" value={fmt(hygiene.verified)} />
                                                            <HygieneTile label="Verified %" value={hygiene.verifiedPct + '%'} />
                                                            <HygieneTile label="Spamtrap" value={fmt(hygiene.spamtrap)} warning />
                                                            <HygieneTile label="Catchall" value={fmt(hygiene.catchall)} />
                                                            <HygieneTile label="Disposable" value={fmt(hygiene.disposable)} warning />
                                                            <HygieneTile label="Unsubs" value={fmt(hygiene.unsubscribes)} />
                                                            <HygieneTile label="Unknown" value={fmt(hygiene.unknown)} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 border-b border-border bg-card px-6 py-2.5 flex-wrap">
                                                    <Button variant="outline" size="sm" onClick={() => setShowAddContact(true)} className="h-7 text-xs gap-1">
                                                        <Plus className="h-3 w-3" />Add
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={selected.size === 0}
                                                        onClick={handleRemoveSelected}
                                                        className="h-7 text-xs gap-1 text-destructive hover:text-destructive border-border"
                                                    >
                                                        <Trash2 className="h-3 w-3" />Remove{selected.size > 0 ? ` (${selected.size})` : ''}
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                                        <Tag className="h-3 w-3" />Tags
                                                    </Button>

                                                    <div className="h-4 w-px bg-border mx-1" />

                                                    <div className="flex items-center gap-0.5">
                                                        {(['all', 'active', 'unsubscribed', 'bounced'] as const).map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => setStatusFilter(status)}
                                                                className={[
                                                                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                                                                    statusFilter === status
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                                                                ].join(' ')}
                                                            >
                                                                {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="flex-1" />

                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                                                        <Input value={query} onChange={handleQueryChange} placeholder="Search contacts…" className="pl-7 h-7 w-48 text-xs" />
                                                    </div>

                                                    <span className="text-xs text-muted-foreground tabular-nums">
                                {visibleContacts.length.toLocaleString()} contact{visibleContacts.length !== 1 ? 's' : ''}
                            </span>
                                                </div>

                                                <div className="overflow-auto">
                                                    {visibleContacts.length === 0 ? (
                                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                                            <div className="rounded-full bg-secondary p-4 mb-3">
                                                                <Users className="h-8 w-8 text-muted-foreground" />
                                                            </div>
                                                            {query ? (
                                                                <p className="text-sm text-muted-foreground">No contacts match your search.</p>
                                                            ) : (
                                                                <>
                                                                    <p className="text-sm font-medium text-foreground mb-1">No contacts yet</p>
                                                                    <p className="text-xs text-muted-foreground mb-4">Add one manually or import from a CSV.</p>
                                                                    <div className="flex gap-2">
                                                                        <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
                                                                            <FileUp className="h-3.5 w-3.5 mr-1.5" />Import CSV
                                                                        </Button>
                                                                        <Button size="sm" onClick={() => setShowAddContact(true)}>
                                                                            <Plus className="h-3.5 w-3.5 mr-1.5" />Add contact
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <table className="w-full text-sm">
                                                            <thead className="sticky top-0 bg-card border-b border-border z-10">
                                                            <tr>
                                                                <th className="px-4 py-2.5 w-8">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selected.size === visibleContacts.length && visibleContacts.length > 0}
                                                                        onChange={toggleAll}
                                                                        className="rounded border-border accent-primary cursor-pointer"
                                                                    />
                                                                </th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-12">ID</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">First name</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Last name</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Phone</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                                                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Added</th>
                                                                <th className="px-4 py-2.5 w-10" />
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {visibleContacts.map((contact, index) => {
                                                                const statusConfig = STATUS_CONFIG[contact.status];
                                                                const initials = `${contact.firstName[0] ?? ''}${contact.lastName[0] ?? ''}`.toUpperCase() || '?';
                                                                const isSelected = selected.has(contact.id);

                                                                return (
                                                                    <tr
                                                                        key={contact.id}
                                                                        className={[
                                                                            'border-b border-border/40 last:border-0 transition-colors group',
                                                                            isSelected ? 'bg-primary/5' : 'hover:bg-secondary/30',
                                                                        ].join(' ')}
                                                                    >
                                                                        <td className="px-4 py-2.5">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={isSelected}
                                                                                onChange={() => toggleSelect(contact.id)}
                                                                                className="rounded border-border accent-primary cursor-pointer"
                                                                            />
                                                                        </td>
                                                                        <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">{index + 1}</td>
                                                                        <td className="px-3 py-2.5">
                                                                            <div className="flex items-center gap-2.5">
                                                                                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                                                                                    {initials}
                                                                                </div>
                                                                                <span className="text-xs text-foreground">{contact.email}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-3 py-2.5 text-xs text-foreground">{contact.firstName}</td>
                                                                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{contact.lastName || '—'}</td>
                                                                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{contact.phone || '—'}</td>
                                                                        <td className="px-3 py-2.5">
                                                    <span className={['inline-flex items-center gap-1 text-xs font-medium', statusConfig.text].join(' ')}>
                                                        <Circle className={['h-1.5 w-1.5 fill-current', statusConfig.dot].join(' ')} />
                                                        {statusConfig.label}
                                                    </span>
                                                                        </td>
                                                                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{contact.addedAt}</td>
                                                                        <td className="px-4 py-2.5">
                                                                            <button
                                                                                onClick={() => handleDelete(contact.id)}
                                                                                className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                            >
                                                                                <Trash2 className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {!selectedSegment ? (
                                                    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                                        <div className="rounded-full bg-secondary p-5">
                                                            <Target className="h-10 w-10 text-muted-foreground" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-foreground">Select a segment</p>
                                                        <p className="text-xs text-muted-foreground">Choose a segment or create a new audience segment.</p>
                                                        <Button size="sm" onClick={handleCreateSegment}>
                                                            <Plus className="h-3.5 w-3.5 mr-1.5" />Create segment
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <SegmentBuilder
                                                        segment={selectedSegment}
                                                        lists={lists}
                                                        matchingContacts={segmentContacts}
                                                        onNameChange={handleSegmentNameChange}
                                                        onDescriptionChange={handleSegmentDescriptionChange}
                                                        onListChange={handleSegmentListChange}
                                                        onLogicChange={handleSegmentLogicChange}
                                                        onAddCondition={handleSegmentAddCondition}
                                                        onRemoveCondition={handleSegmentRemoveCondition}
                                                        onConditionChange={handleSegmentConditionChange}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Content>
            </div>
            <CreateListModal open={showCreateList} onOpenChange={setShowCreateList} onCreated={handleListCreated} />
            {selectedListId && (
                <>
                    <AddContactModal open={showAddContact} onOpenChange={setShowAddContact} listId={selectedListId} onAdded={handleContactAdded} />
                    <ImportContactsModal open={showImport} onOpenChange={setShowImport} listId={selectedListId} onImported={handleImported} />
                </>
            )}
        </>
    );
}
