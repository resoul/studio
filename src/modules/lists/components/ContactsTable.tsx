import { useCallback } from 'react';
import { Contact, ContactStatus } from '@/types/contacts';
import { Button } from '@/components/ui/button';
import { Users, Plus, FileUp, Circle, Trash2 } from 'lucide-react';

export const STATUS_CONFIG: Record<ContactStatus, { label: string; dot: string; text: string }> = {
    active:       { label: 'Active',       dot: 'text-emerald-500', text: 'text-emerald-600' },
    unsubscribed: { label: 'Unsubscribed', dot: 'text-amber-400',   text: 'text-amber-600'   },
    bounced:      { label: 'Bounced',      dot: 'text-rose-500',    text: 'text-rose-600'    },
};

interface ContactsTableProps {
    contacts: Contact[];
    selected: Set<string>;
    onToggle: (id: string) => void;
    onToggleAll: () => void;
    onDelete: (id: string) => void;
    onAddContact: () => void;
    onImport: () => void;
    query: string;
}

export function ContactsTable({
                                  contacts,
                                  selected,
                                  onToggle,
                                  onToggleAll,
                                  onDelete,
                                  onAddContact,
                                  onImport,
                                  query,
                              }: ContactsTableProps) {
    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-secondary p-4 mb-3">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                {query ? (
                    <p className="text-sm text-muted-foreground">No contacts match your search.</p>
                ) : (
                    <>
                        <p className="text-sm font-medium text-foreground mb-1">No contacts yet</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            Add one manually or import from a CSV.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={onImport}>
                                <FileUp className="h-3.5 w-3.5 mr-1.5" />
                                Import CSV
                            </Button>
                            <Button size="sm" onClick={onAddContact}>
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                Add contact
                            </Button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const allSelected = selected.size === contacts.length && contacts.length > 0;
    const someSelected = selected.size > 0 && !allSelected;

    return (
        <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b border-border z-10">
            <tr>
                <th className="px-4 py-2.5 w-8">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected; }}
                        onChange={onToggleAll}
                        className="rounded border-border accent-primary cursor-pointer"
                    />
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-10">
                    #
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    First name
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Last name
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Added
                </th>
                <th className="px-4 py-2.5 w-10" />
            </tr>
            </thead>
            <tbody>
            {contacts.map((contact, index) => (
                <ContactRow
                    key={contact.id}
                    contact={contact}
                    index={index}
                    isSelected={selected.has(contact.id)}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
            </tbody>
        </table>
    );
}

interface ContactRowProps {
    contact: Contact;
    index: number;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

function ContactRow({ contact, index, isSelected, onToggle, onDelete }: ContactRowProps) {
    const cfg = STATUS_CONFIG[contact.status];
    const initials = `${contact.firstName[0] ?? ''}${contact.lastName[0] ?? ''}`.toUpperCase() || '?';

    const handleToggle = useCallback(() => onToggle(contact.id), [onToggle, contact.id]);
    const handleDelete = useCallback(() => onDelete(contact.id), [onDelete, contact.id]);

    return (
        <tr
            className={[
                'border-b border-border/40 last:border-0 transition-colors group',
                isSelected ? 'bg-primary/5' : 'hover:bg-secondary/30',
            ].join(' ')}
        >
            <td className="px-4 py-2.5">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleToggle}
                    className="rounded border-border accent-primary cursor-pointer"
                />
            </td>
            <td className="px-3 py-2.5 text-xs text-muted-foreground tabular-nums">{index + 1}</td>
            <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
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
                <div className="flex flex-wrap gap-1">
                    {contact.tags.length > 0 ? (
                        contact.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                </div>
            </td>
            <td className="px-3 py-2.5">
                <span className={['inline-flex items-center gap-1 text-xs font-medium', cfg.text].join(' ')}>
                    <Circle className={['h-1.5 w-1.5 fill-current', cfg.dot].join(' ')} />
                    {cfg.label}
                </span>
            </td>
            <td className="px-3 py-2.5 text-xs text-muted-foreground">{contact.addedAt}</td>
            <td className="px-4 py-2.5">
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Delete contact"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </td>
        </tr>
    );
}