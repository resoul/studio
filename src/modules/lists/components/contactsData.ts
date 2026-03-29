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