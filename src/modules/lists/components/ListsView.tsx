import { ContactList, Contact, ContactStatus } from '@/types/contacts';
import { ListStatsPanel } from './ListStatsPanel';
import { ContactsToolbar } from './ContactsToolbar';
import { BulkActionsBar } from './BulkActionsBar';
import { ContactsTable } from './ContactsTable';
import { ChangeEvent } from 'react';

interface ListsViewProps {
    selectedList: ContactList;
    visibleContacts: Contact[];
    selected: Set<string>;
    query: string;
    statusFilter: ContactStatus | 'all';
    onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusFilter: (s: ContactStatus | 'all') => void;
    onToggle: (id: string) => void;
    onToggleAll: () => void;
    onDelete: (id: string) => void;
    onBulkDelete: () => void;
    onBulkStatusChange: (status: ContactStatus) => void;
    onBulkAddTag: (tag: string) => void;
    onExportSelected: () => void;
    onClearSelection: () => void;
    onAddContact: () => void;
    onImport: () => void;
}

export function ListsView({
                              selectedList,
                              visibleContacts,
                              selected,
                              query,
                              statusFilter,
                              onQueryChange,
                              onStatusFilter,
                              onToggle,
                              onToggleAll,
                              onDelete,
                              onBulkDelete,
                              onBulkStatusChange,
                              onBulkAddTag,
                              onExportSelected,
                              onClearSelection,
                              onAddContact,
                              onImport,
                          }: ListsViewProps) {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* List header */}
            <div className="border-b border-border bg-card px-6 py-3 shrink-0">
                <div className="flex items-center gap-3">
                    <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: selectedList.color }}
                    />
                    <div>
                        <h1 className="text-sm font-semibold text-foreground">{selectedList.name}</h1>
                        {selectedList.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{selectedList.description}</p>
                        )}
                    </div>
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {selectedList.contactCount.toLocaleString()} total
                    </span>
                </div>
            </div>

            {/* Stats panels */}
            <ListStatsPanel list={selectedList} />

            {/* Bulk actions bar (visible only when something is selected) */}
            <BulkActionsBar
                selectedCount={selected.size}
                onDelete={onBulkDelete}
                onStatusChange={onBulkStatusChange}
                onAddTag={onBulkAddTag}
                onExport={onExportSelected}
                onClear={onClearSelection}
            />

            {/* Toolbar: filters + search + action buttons */}
            <ContactsToolbar
                query={query}
                statusFilter={statusFilter}
                visibleCount={visibleContacts.length}
                onQueryChange={onQueryChange}
                onStatusFilter={onStatusFilter}
                onAddContact={onAddContact}
                onImport={onImport}
                onExport={onExportSelected}
            />

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <ContactsTable
                    contacts={visibleContacts}
                    selected={selected}
                    onToggle={onToggle}
                    onToggleAll={onToggleAll}
                    onDelete={onDelete}
                    onAddContact={onAddContact}
                    onImport={onImport}
                    query={query}
                />
            </div>
        </div>
    );
}