import { useState, useCallback, ChangeEvent } from 'react';
import { Contact, ContactList, ContactStatus } from '@/types/contacts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, FileUp, Trash2, Circle } from 'lucide-react';

const STATUS_CONFIG: Record<ContactStatus, { label: string; dotClass: string; textClass: string }> = {
    active:       { label: 'Active',       dotClass: 'text-accent',       textClass: 'text-accent' },
    unsubscribed: { label: 'Unsubscribed', dotClass: 'text-amber-500',    textClass: 'text-amber-600' },
    bounced:      { label: 'Bounced',      dotClass: 'text-destructive',  textClass: 'text-destructive' },
};

interface ContactsTableProps {
    list: ContactList;
    contacts: Contact[];
    onAddContact: () => void;
    onImport: () => void;
    onDelete: (contactId: string) => void;
}

export function ContactsTable({ list, contacts, onAddContact, onImport, onDelete }: ContactsTableProps) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');

    const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), []);

    const filtered = contacts.filter((c) => {
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

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: list.color }}
                        />
                        <h1 className="text-base font-semibold text-foreground">{list.name}</h1>
                    </div>
                    {list.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 ml-5">{list.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={onImport}>
                        <FileUp className="h-3.5 w-3.5 mr-1.5" />
                        Import CSV
                    </Button>
                    <Button
                        size="sm"
                        onClick={onAddContact}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                        Add contact
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 px-6 py-3 border-b border-border bg-secondary/20">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                        value={query}
                        onChange={handleQueryChange}
                        placeholder="Search contacts…"
                        className="pl-8 h-8 text-sm"
                    />
                </div>

                <div className="flex items-center gap-1">
                    {(['all', 'active', 'unsubscribed', 'bounced'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={[
                                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                                statusFilter === s
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                            ].join(' ')}
                        >
                            {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
                        </button>
                    ))}
                </div>

                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {filtered.length.toLocaleString()} contact{filtered.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                {filtered.length === 0 ? (
                    <EmptyState query={query} onAddContact={onAddContact} onImport={onImport} />
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-card border-b border-border z-10">
                        <tr>
                            <th className="px-6 py-2.5 text-left text-xs font-medium text-muted-foreground">Name</th>
                            <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Email</th>
                            <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Phone</th>
                            <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                            <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Added</th>
                            <th className="px-4 py-2.5" />
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((contact) => (
                            <ContactRow
                                key={contact.id}
                                contact={contact}
                                onDelete={onDelete}
                            />
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

interface ContactRowProps {
    contact: Contact;
    onDelete: (id: string) => void;
}

function ContactRow({ contact, onDelete }: ContactRowProps) {
    const cfg = STATUS_CONFIG[contact.status];
    const initials = `${contact.firstName[0] ?? ''}${contact.lastName[0] ?? ''}`.toUpperCase() || '?';
    const handleDelete = useCallback(() => onDelete(contact.id), [onDelete, contact.id]);

    return (
        <tr className="border-b border-border/50 last:border-0 hover:bg-secondary/30 group transition-colors">
            <td className="px-6 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials}
                    </div>
                    <span className="font-medium text-foreground">
                        {contact.firstName} {contact.lastName}
                    </span>
                </div>
            </td>
            <td className="px-3 py-3 text-muted-foreground">{contact.email}</td>
            <td className="px-3 py-3 text-muted-foreground">{contact.phone || '—'}</td>
            <td className="px-3 py-3">
                <span className={['inline-flex items-center gap-1.5 text-xs font-medium', cfg.textClass].join(' ')}>
                    <Circle className={['h-1.5 w-1.5 fill-current', cfg.dotClass].join(' ')} />
                    {cfg.label}
                </span>
            </td>
            <td className="px-3 py-3 text-xs text-muted-foreground">{contact.addedAt}</td>
            <td className="px-4 py-3">
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </td>
        </tr>
    );
}

interface EmptyStateProps {
    query: string;
    onAddContact: () => void;
    onImport: () => void;
}

function EmptyState({ query, onAddContact, onImport }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="rounded-full bg-secondary p-4 mb-4">
                <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            {query ? (
                <p className="text-sm text-muted-foreground">No contacts match your search.</p>
            ) : (
                <>
                    <p className="text-sm font-medium text-foreground mb-1">No contacts yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Add one manually or import from a CSV file.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onImport}>
                            <FileUp className="h-3.5 w-3.5 mr-1.5" />
                            Import CSV
                        </Button>
                        <Button size="sm" onClick={onAddContact}>
                            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                            Add contact
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}