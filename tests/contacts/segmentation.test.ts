import { describe, it, expect } from 'vitest';
import { getSegmentMatches } from '@/components/contacts/segmentation';
import { MOCK_CONTACTS } from '@/components/contacts/contactsData';
import { AudienceSegment } from '@/types/contacts';

describe('getSegmentMatches', () => {
    it('filters contacts by selected list when no conditions provided', () => {
        const segment: AudienceSegment = {
            id: 'segment-1',
            name: 'List only',
            description: 'No conditions',
            listId: 'l2',
            logic: 'all',
            conditions: [],
            estimatedContacts: 0,
            updatedAt: '2026-03-24',
            color: '#000000',
        };

        const result = getSegmentMatches(segment, MOCK_CONTACTS);

        expect(result.every((contact) => contact.listId === 'l2')).toBe(true);
        expect(result).toHaveLength(2);
    });

    it('applies AND logic for all conditions', () => {
        const segment: AudienceSegment = {
            id: 'segment-2',
            name: 'Active VIP',
            description: 'Only active VIP contacts',
            listId: 'l1',
            logic: 'all',
            conditions: [
                { id: 'c1', field: 'status', operator: 'is', value: 'active' },
                { id: 'c2', field: 'tag', operator: 'contains', value: 'vip' },
            ],
            estimatedContacts: 0,
            updatedAt: '2026-03-24',
            color: '#000000',
        };

        const result = getSegmentMatches(segment, MOCK_CONTACTS);

        expect(result).toHaveLength(2);
        expect(result.map((contact) => contact.id).sort()).toEqual(['c1', 'c6']);
    });

    it('applies OR logic across conditions', () => {
        const segment: AudienceSegment = {
            id: 'segment-3',
            name: 'Risk contacts',
            description: 'Unsubscribed or bounced',
            listId: 'all',
            logic: 'any',
            conditions: [
                { id: 'c1', field: 'status', operator: 'is', value: 'unsubscribed' },
                { id: 'c2', field: 'status', operator: 'is', value: 'bounced' },
            ],
            estimatedContacts: 0,
            updatedAt: '2026-03-24',
            color: '#000000',
        };

        const result = getSegmentMatches(segment, MOCK_CONTACTS);

        expect(result.map((contact) => contact.status)).toEqual(['unsubscribed', 'bounced', 'unsubscribed']);
        expect(result).toHaveLength(3);
    });

    it('matches text fields case-insensitively', () => {
        const segment: AudienceSegment = {
            id: 'segment-4',
            name: 'Domain filter',
            description: 'Example domain',
            listId: 'all',
            logic: 'all',
            conditions: [
                { id: 'c1', field: 'email', operator: 'contains', value: 'EXAMPLE.COM' },
            ],
            estimatedContacts: 0,
            updatedAt: '2026-03-24',
            color: '#000000',
        };

        const result = getSegmentMatches(segment, MOCK_CONTACTS);

        expect(result).toHaveLength(MOCK_CONTACTS.length);
    });
});
