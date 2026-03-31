import { Contact } from '@/types/contacts';

/**
 * Exports an array of contacts to a CSV file download.
 */
export function exportContactsToCsv(contacts: Contact[], filename = 'contacts.csv'): void {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Tags', 'Added At'];
    const rows = contacts.map((c) => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        c.phone,
        c.status,
        c.tags.join('; '),
        c.addedAt,
    ]);

    const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Deduplicates incoming contacts against existing ones by email (case-insensitive).
 * Returns { unique: Contact[], duplicateCount: number }.
 */
export function deduplicateContacts(
    incoming: Contact[],
    existing: Contact[],
): { unique: Contact[]; duplicateCount: number } {
    const existingEmails = new Set(existing.map((c) => c.email.toLowerCase()));
    const seen = new Set<string>();
    const unique: Contact[] = [];

    for (const contact of incoming) {
        const key = contact.email.toLowerCase();
        if (existingEmails.has(key) || seen.has(key)) {
            continue;
        }
        seen.add(key);
        unique.push(contact);
    }

    return { unique, duplicateCount: incoming.length - unique.length };
}

/**
 * Formats large numbers with locale separators.
 */
export function fmt(n: number): string {
    return n.toLocaleString();
}

/**
 * Formats a percentage with two decimal places.
 */
export function pct(a: number, b: number): string {
    if (!b) return '0.00%';
    return ((a / b) * 100).toFixed(2) + '%';
}