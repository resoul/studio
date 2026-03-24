import { AudienceSegment, SegmentFieldConfig, SegmentOperatorConfig } from '@/types/contacts';

export const SEGMENT_FIELD_CONFIG: SegmentFieldConfig[] = [
    { key: 'status', label: 'Contact status', placeholder: 'active' },
    { key: 'tag', label: 'Tag', placeholder: 'vip' },
    { key: 'email', label: 'Email', placeholder: 'example@company.com' },
    { key: 'firstName', label: 'First name', placeholder: 'Alice' },
    { key: 'lastName', label: 'Last name', placeholder: 'Johnson' },
    { key: 'listId', label: 'List', placeholder: 'All subscribers' },
];

export const SEGMENT_OPERATOR_CONFIG: SegmentOperatorConfig[] = [
    { key: 'is', label: 'is' },
    { key: 'isNot', label: 'is not' },
    { key: 'contains', label: 'contains' },
    { key: 'notContains', label: 'does not contain' },
    { key: 'startsWith', label: 'starts with' },
    { key: 'endsWith', label: 'ends with' },
];

export const MOCK_SEGMENTS: AudienceSegment[] = [
    {
        id: 's1',
        name: 'Warm engaged',
        description: 'Active contacts with engagement tags',
        listId: 'l1',
        logic: 'all',
        conditions: [
            { id: 'sc1', field: 'status', operator: 'is', value: 'active' },
            { id: 'sc2', field: 'tag', operator: 'contains', value: 'vip' },
        ],
        estimatedContacts: 920,
        updatedAt: '2026-03-24',
        color: '#10B981',
    },
    {
        id: 's2',
        name: 'At-risk deliverability',
        description: 'Subscribers that need hygiene review',
        listId: 'all',
        logic: 'any',
        conditions: [
            { id: 'sc3', field: 'status', operator: 'is', value: 'bounced' },
            { id: 'sc4', field: 'status', operator: 'is', value: 'unsubscribed' },
        ],
        estimatedContacts: 540,
        updatedAt: '2026-03-22',
        color: '#F97316',
    },
    {
        id: 's3',
        name: 'New list joiners',
        description: 'Newly tagged subscribers',
        listId: 'l3',
        logic: 'all',
        conditions: [
            { id: 'sc5', field: 'tag', operator: 'contains', value: 'new' },
        ],
        estimatedContacts: 310,
        updatedAt: '2026-03-20',
        color: '#6366F1',
    },
];
