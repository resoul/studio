import {Users, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Content } from '@/layout/components/content';
import { ContentHeader } from '@/layout/components/content-header';
import { useSecondarySidebar } from '@/hooks/useSecondarySidebar';
import { useContacts } from '@/modules/lists/hooks/useContacts';
import { ContactsHeader } from '@/modules/lists/components/ContactsHeader';
import { ListsSidebar } from '@/modules/lists/components/ListsSidebar';
import { SegmentSidebar } from '@/modules/lists/components/SegmentSidebar';
import { ListsView } from '@/modules/lists/components/ListsView';
import { SegmentBuilder } from '@/modules/lists/components/SegmentBuilder';
import { CreateListModal } from '@/modules/lists/components/CreateListModal';
import { AddContactModal } from '@/modules/lists/components/AddContactModal';
import { ImportContactsModal } from '@/modules/lists/components/ImportContactsModal';
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function ContactsPage() {
    const c = useContacts();

    const sidebarHeader = useMemo(() => (
        <div className="inline-flex rounded-md border border-border bg-background p-0.5">
            <button
                onClick={c.handleSwitchToLists}
                className={cn(
                    'rounded px-3 py-1.5 text-xs font-semibold transition-colors',
                    c.mode === 'lists' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
            >
                Lists
            </button>
            <button
                onClick={c.handleSwitchToSegments}
                className={cn(
                    'rounded px-3 py-1.5 text-xs font-semibold transition-colors',
                    c.mode === 'segments' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
            >
                Segments
            </button>
        </div>
    ), [c.mode, c.handleSwitchToLists, c.handleSwitchToSegments]);

    const sidebarContent = useMemo(() => (
        !c.selectedList ? (<></>) : (
            c.mode === 'lists' ? (
                <ListsSidebar
                    lists={c.lists}
                    selectedId={c.selectedListId}
                    onSelect={c.handleSelectList}
                    onCreateNew={() => c.setShowCreateList(true)}
                />
            ) : (
                <SegmentSidebar
                    segments={c.segments}
                    lists={c.lists}
                    selectedId={c.selectedSegmentId}
                    onSelect={c.handleSelectSegment}
                />
            )
        )
    ), [c.mode, c.handleSwitchToLists, c.handleSwitchToSegments]);

    const sidebarFooter = useMemo(() => (
        <div className="shrink-0 border-t border-border flex items-center justify-center h-(--sidebar-footer-height) px-(--sidebar-space-x)">
            <Button
                variant="ghost"
                onClick={c.mode === 'lists' ? () => c.setShowCreateList(true) : c.handleCreateSegment}
                className="transition-all"
            >
                <Plus />
                <span>{c.mode === 'lists' ? 'New list' : 'New segment'} New folder</span>
            </Button>
        </div>
    ), [c.mode, c.setShowCreateList, c.handleCreateSegment]);

    useSecondarySidebar({ header: sidebarHeader, content: sidebarContent, footer: sidebarFooter })

    return (
        <>
            <ContentHeader>
                <ContactsHeader
                    mode={c.mode}
                    onSwitchToLists={c.handleSwitchToLists}
                    onCreateList={() => c.setShowCreateList(true)}
                    onCreateSegment={c.handleCreateSegment}
                />
            </ContentHeader>

            <div className="container-fluid">
                <Content className="block py-0">
                    <div className="flex flex-1 overflow-hidden">
                        {!c.selectedList ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                <div className="rounded-full bg-secondary p-5">
                                    <Users className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-semibold text-foreground">Select a list</p>
                                <p className="text-xs text-muted-foreground">
                                    Choose a list from the sidebar or create a new one
                                </p>
                                <Button size="sm" onClick={() => c.setShowCreateList(true)}>
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                    Create list
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-1 flex-col overflow-hidden">
                                    {c.mode === 'lists' ? (
                                        <ListsView
                                            selectedList={c.selectedList}
                                            visibleContacts={c.visibleContacts}
                                            selected={c.selected}
                                            query={c.query}
                                            statusFilter={c.statusFilter}
                                            onQueryChange={c.handleQueryChange}
                                            onStatusFilter={c.setStatusFilter}
                                            onToggle={c.toggleSelect}
                                            onToggleAll={c.toggleAll}
                                            onDelete={c.handleDelete}
                                            onBulkDelete={c.handleBulkDelete}
                                            onBulkStatusChange={c.handleBulkStatusChange}
                                            onBulkAddTag={c.handleBulkAddTag}
                                            onExportSelected={c.handleExportSelected}
                                            onClearSelection={c.clearSelection}
                                            onAddContact={() => c.setShowAddContact(true)}
                                            onImport={() => c.setShowImport(true)}
                                        />
                                    ) : (
                                        <>
                                            {!c.selectedSegment ? (
                                                <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                                                    <div className="rounded-full bg-secondary p-5">
                                                        <Target className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground">
                                                        Select a segment
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Choose a segment or create a new one
                                                    </p>
                                                    <Button size="sm" onClick={c.handleCreateSegment}>
                                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                                        Create segment
                                                    </Button>
                                                </div>
                                            ) : (
                                                <SegmentBuilder
                                                    segment={c.selectedSegment}
                                                    lists={c.lists}
                                                    matchingContacts={c.segmentContacts}
                                                    onNameChange={c.handleSegmentNameChange}
                                                    onDescriptionChange={c.handleSegmentDescriptionChange}
                                                    onListChange={c.handleSegmentListChange}
                                                    onLogicChange={c.handleSegmentLogicChange}
                                                    onAddCondition={c.handleSegmentAddCondition}
                                                    onRemoveCondition={c.handleSegmentRemoveCondition}
                                                    onConditionChange={c.handleSegmentConditionChange}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Content>
            </div>

            <CreateListModal
                open={c.showCreateList}
                onOpenChange={c.setShowCreateList}
                onCreated={c.handleListCreated}
            />
            {c.selectedListId && (
                <>
                    <AddContactModal
                        open={c.showAddContact}
                        onOpenChange={c.setShowAddContact}
                        listId={c.selectedListId}
                        onAdded={c.handleContactAdded}
                    />
                    <ImportContactsModal
                        open={c.showImport}
                        onOpenChange={c.setShowImport}
                        listId={c.selectedListId}
                        onImported={c.handleImported}
                    />
                </>
            )}
        </>
    );
}