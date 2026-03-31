import { Contact, ContactList } from '@/types/contacts';

export const MOCK_LISTS: ContactList[] = [
    {
        id: 'l1',
        name: 'All subscribers',
        description: 'Everyone who signed up',
        contactCount: 14820,
        createdAt: '2025-01-10',
        color: '#4F46E5',
    },
    {
        id: 'l2',
        name: 'Active users',
        description: 'Opened email in last 90 days',
        contactCount: 6340,
        createdAt: '2025-01-15',
        color: '#10B981',
    },
    {
        id: 'l3',
        name: 'New signups (30d)',
        description: 'Joined in the last 30 days',
        contactCount: 1120,
        createdAt: '2025-02-01',
        color: '#F59E0B',
    },
    {
        id: 'l4',
        name: 'VIP customers',
        description: 'High-value repeat buyers',
        contactCount: 430,
        createdAt: '2025-01-20',
        color: '#EF4444',
    },
    {
        id: 'l5',
        name: 'Re-engagement',
        description: 'Inactive for 90+ days',
        contactCount: 2890,
        createdAt: '2025-02-10',
        color: '#8B5CF6',
    },
];

export const MOCK_CONTACTS: Contact[] = [
    { id: 'c1',  listId: 'l1', firstName: 'Alice',   lastName: 'Johnson',   email: 'alice@example.com',    phone: '+1 555-0101', status: 'active',       addedAt: '2025-03-01', tags: ['vip'] },
    { id: 'c2',  listId: 'l1', firstName: 'Bob',     lastName: 'Smith',     email: 'bob@example.com',      phone: '+1 555-0102', status: 'active',       addedAt: '2025-03-02', tags: [] },
    { id: 'c3',  listId: 'l1', firstName: 'Carol',   lastName: 'Williams',  email: 'carol@example.com',    phone: '+1 555-0103', status: 'unsubscribed', addedAt: '2025-02-20', tags: [] },
    { id: 'c4',  listId: 'l1', firstName: 'David',   lastName: 'Brown',     email: 'david@example.com',    phone: '+1 555-0104', status: 'active',       addedAt: '2025-03-05', tags: ['new'] },
    { id: 'c5',  listId: 'l1', firstName: 'Eva',     lastName: 'Davis',     email: 'eva@example.com',      phone: '+1 555-0105', status: 'bounced',      addedAt: '2025-01-15', tags: [] },
    { id: 'c6',  listId: 'l1', firstName: 'Frank',   lastName: 'Miller',    email: 'frank@example.com',    phone: '+1 555-0106', status: 'active',       addedAt: '2025-03-10', tags: ['vip', 'new'] },
    { id: 'c7',  listId: 'l1', firstName: 'Grace',   lastName: 'Wilson',    email: 'grace@example.com',    phone: '+1 555-0107', status: 'active',       addedAt: '2025-02-28', tags: [] },
    { id: 'c8',  listId: 'l1', firstName: 'Henry',   lastName: 'Moore',     email: 'henry@example.com',    phone: '+1 555-0108', status: 'active',       addedAt: '2025-03-12', tags: ['new'] },
    { id: 'c9',  listId: 'l2', firstName: 'Iris',    lastName: 'Taylor',    email: 'iris@example.com',     phone: '+1 555-0109', status: 'active',       addedAt: '2025-03-08', tags: [] },
    { id: 'c10', listId: 'l2', firstName: 'Jack',    lastName: 'Anderson',  email: 'jack@example.com',     phone: '+1 555-0110', status: 'active',       addedAt: '2025-03-09', tags: ['vip'] },
    { id: 'c11', listId: 'l3', firstName: 'Kate',    lastName: 'Thomas',    email: 'kate@example.com',     phone: '+1 555-0111', status: 'active',       addedAt: '2025-03-15', tags: ['new'] },
    { id: 'c12', listId: 'l4', firstName: 'Leo',     lastName: 'Jackson',   email: 'leo@example.com',      phone: '+1 555-0112', status: 'active',       addedAt: '2025-02-14', tags: ['vip'] },
    { id: 'c13', listId: 'l5', firstName: 'Maya',    lastName: 'White',     email: 'maya@example.com',     phone: '+1 555-0113', status: 'unsubscribed', addedAt: '2024-11-01', tags: [] },
];

export const LIST_STATS: Record<string, {
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

export const LIST_HYGIENE: Record<string, {
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