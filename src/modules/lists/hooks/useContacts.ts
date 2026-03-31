import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import {
    Contact,
    ContactList,
    ContactStatus,
    AudienceSegment,
    SegmentCondition,
    ContactsViewMode,
} from '@/types/contacts';
import { MOCK_LISTS, MOCK_CONTACTS } from '@/mocks/contacts';
import { MOCK_SEGMENTS } from '@/mocks/segments';
import { getSegmentMatches } from '@/modules/lists/components/segmentation';
import { deduplicateContacts, exportContactsToCsv } from '@/utils/contacts';
import { uid } from '@/utils/uid';

export function useContacts() {
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

    // ── Derived ──────────────────────────────────────────────────────────────

    const selectedList = lists.find((l) => l.id === selectedListId) ?? null;
    const selectedSegment = segments.find((s) => s.id === selectedSegmentId) ?? null;

    const visibleContacts = useMemo(() => {
        return contacts.filter((c) => {
            if (c.listId !== selectedListId) return false;
            if (statusFilter !== 'all' && c.status !== statusFilter) return false;
            if (!query.trim()) return true;
            const q = query.toLowerCase();
            return (
                c.firstName.toLowerCase().includes(q) ||
                c.lastName.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q) ||
                c.phone.includes(q)
            );
        });
    }, [contacts, selectedListId, statusFilter, query]);

    const segmentContacts = useMemo(
        () => (selectedSegment ? getSegmentMatches(selectedSegment, contacts) : []),
        [selectedSegment, contacts],
    );

    const syncSegmentMeta = useCallback(
        (segment: AudienceSegment): AudienceSegment => ({
            ...segment,
            estimatedContacts: getSegmentMatches(segment, contacts).length,
            updatedAt: new Date().toISOString().slice(0, 10),
        }),
        [contacts],
    );

    // ── Navigation ────────────────────────────────────────────────────────────

    const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const handleSwitchToLists = useCallback(() => setMode('lists'), []);
    const handleSwitchToSegments = useCallback(() => setMode('segments'), []);

    const handleSelectList = useCallback((id: string) => {
        setSelectedListId(id);
        setSelected(new Set());
        setQuery('');
        setStatusFilter('all');
    }, []);

    const handleSelectSegment = useCallback((id: string) => {
        setSelectedSegmentId(id);
    }, []);

    // ── Selection ─────────────────────────────────────────────────────────────

    const toggleSelect = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        setSelected((prev) =>
            prev.size === visibleContacts.length && visibleContacts.length > 0
                ? new Set()
                : new Set(visibleContacts.map((c) => c.id)),
        );
    }, [visibleContacts]);

    const clearSelection = useCallback(() => setSelected(new Set()), []);

    // ── List CRUD ─────────────────────────────────────────────────────────────

    const handleListCreated = useCallback((list: ContactList) => {
        setLists((prev) => [...prev, list]);
        setSelectedListId(list.id);
        setMode('lists');
    }, []);

    // ── Contact CRUD ──────────────────────────────────────────────────────────

    const handleContactAdded = useCallback((contact: Contact) => {
        setContacts((prev) => [contact, ...prev]);
        setLists((prev) =>
            prev.map((l) =>
                l.id === contact.listId ? { ...l, contactCount: l.contactCount + 1 } : l,
            ),
        );
    }, []);

    const handleImported = useCallback(
        (imported: Contact[]) => {
            if (!imported.length || !selectedListId) return;
            const existingInList = contacts.filter((c) => c.listId === selectedListId);
            const { unique, duplicateCount } = deduplicateContacts(imported, existingInList);
            if (!unique.length) return { imported: 0, duplicates: duplicateCount };
            setContacts((prev) => [...unique, ...prev]);
            setLists((prev) =>
                prev.map((l) =>
                    l.id === selectedListId ? { ...l, contactCount: l.contactCount + unique.length } : l,
                ),
            );
            return { imported: unique.length, duplicates: duplicateCount };
        },
        [contacts, selectedListId],
    );

    const handleDelete = useCallback(
        (id: string) => {
            const target = contacts.find((c) => c.id === id);
            if (!target) return;
            setContacts((prev) => prev.filter((c) => c.id !== id));
            setLists((prev) =>
                prev.map((l) =>
                    l.id === target.listId ? { ...l, contactCount: Math.max(0, l.contactCount - 1) } : l,
                ),
            );
            setSelected((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        },
        [contacts],
    );

    // ── Bulk actions ──────────────────────────────────────────────────────────

    const handleBulkDelete = useCallback(() => {
        const ids = Array.from(selected);
        ids.forEach((id) => {
            const target = contacts.find((c) => c.id === id);
            if (!target) return;
            setLists((prev) =>
                prev.map((l) =>
                    l.id === target.listId ? { ...l, contactCount: Math.max(0, l.contactCount - 1) } : l,
                ),
            );
        });
        setContacts((prev) => prev.filter((c) => !selected.has(c.id)));
        setSelected(new Set());
    }, [selected, contacts]);

    const handleBulkStatusChange = useCallback(
        (status: ContactStatus) => {
            setContacts((prev) =>
                prev.map((c) => (selected.has(c.id) ? { ...c, status } : c)),
            );
            setSelected(new Set());
        },
        [selected],
    );

    const handleBulkAddTag = useCallback(
        (tag: string) => {
            const trimmed = tag.trim();
            if (!trimmed) return;
            setContacts((prev) =>
                prev.map((c) =>
                    selected.has(c.id) && !c.tags.includes(trimmed)
                        ? { ...c, tags: [...c.tags, trimmed] }
                        : c,
                ),
            );
            setSelected(new Set());
        },
        [selected],
    );

    const handleExportSelected = useCallback(() => {
        const toExport =
            selected.size > 0
                ? contacts.filter((c) => selected.has(c.id))
                : visibleContacts;
        const listName = selectedList?.name.replace(/\s+/g, '_').toLowerCase() ?? 'contacts';
        exportContactsToCsv(toExport, `${listName}.csv`);
    }, [selected, contacts, visibleContacts, selectedList]);

    // ── Segments ──────────────────────────────────────────────────────────────

    const handleCreateSegment = useCallback(() => {
        const next: AudienceSegment = syncSegmentMeta({
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
        setSegments((prev) => [next, ...prev]);
        setSelectedSegmentId(next.id);
        setMode('segments');
    }, [selectedListId, syncSegmentMeta]);

    const updateSelectedSegment = useCallback(
        (updater: (s: AudienceSegment) => AudienceSegment) => {
            if (!selectedSegmentId) return;
            setSegments((prev) =>
                prev.map((s) => (s.id === selectedSegmentId ? syncSegmentMeta(updater(s)) : s)),
            );
        },
        [selectedSegmentId, syncSegmentMeta],
    );

    const handleSegmentNameChange = useCallback(
        (v: string) => updateSelectedSegment((s) => ({ ...s, name: v })),
        [updateSelectedSegment],
    );
    const handleSegmentDescriptionChange = useCallback(
        (v: string) => updateSelectedSegment((s) => ({ ...s, description: v })),
        [updateSelectedSegment],
    );
    const handleSegmentListChange = useCallback(
        (listId: string) => updateSelectedSegment((s) => ({ ...s, listId })),
        [updateSelectedSegment],
    );
    const handleSegmentLogicChange = useCallback(
        (logic: 'all' | 'any') => updateSelectedSegment((s) => ({ ...s, logic })),
        [updateSelectedSegment],
    );
    const handleSegmentAddCondition = useCallback(() => {
        updateSelectedSegment((s) => ({
            ...s,
            conditions: [
                ...s.conditions,
                { id: uid('cond'), field: 'status' as const, operator: 'is' as const, value: '' },
            ],
        }));
    }, [updateSelectedSegment]);
    const handleSegmentRemoveCondition = useCallback(
        (condId: string) =>
            updateSelectedSegment((s) => ({
                ...s,
                conditions: s.conditions.filter((c) => c.id !== condId),
            })),
        [updateSelectedSegment],
    );
    const handleSegmentConditionChange = useCallback(
        (condId: string, patch: Partial<SegmentCondition>) =>
            updateSelectedSegment((s) => ({
                ...s,
                conditions: s.conditions.map((c) => (c.id === condId ? { ...c, ...patch } : c)),
            })),
        [updateSelectedSegment],
    );

    return {
        // State
        mode,
        lists,
        contacts,
        segments,
        selectedListId,
        selectedSegmentId,
        selectedList,
        selectedSegment,
        visibleContacts,
        segmentContacts,
        query,
        statusFilter,
        selected,

        // Modals
        showCreateList, setShowCreateList,
        showAddContact, setShowAddContact,
        showImport, setShowImport,

        // Navigation
        handleQueryChange,
        handleSwitchToLists,
        handleSwitchToSegments,
        handleSelectList,
        handleSelectSegment,
        setStatusFilter,

        // Selection
        toggleSelect,
        toggleAll,
        clearSelection,

        // CRUD
        handleListCreated,
        handleContactAdded,
        handleImported,
        handleDelete,

        // Bulk
        handleBulkDelete,
        handleBulkStatusChange,
        handleBulkAddTag,
        handleExportSelected,

        // Segments
        handleCreateSegment,
        handleSegmentNameChange,
        handleSegmentDescriptionChange,
        handleSegmentListChange,
        handleSegmentLogicChange,
        handleSegmentAddCondition,
        handleSegmentRemoveCondition,
        handleSegmentConditionChange,
    };
}