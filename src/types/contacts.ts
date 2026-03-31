export interface ContactList {
    id: string;
    name: string;
    description: string;
    contactCount: number;
    createdAt: string;
    color: string;
}

export interface Contact {
    id: string;
    listId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    addedAt: string;
    tags: string[];
}

export type ContactStatus = Contact['status'];

export interface ImportResult {
    imported: number;
    skipped: number;
    duplicates: number;
    errors: string[];
}

export type SegmentField = 'status' | 'tag' | 'email' | 'firstName' | 'lastName' | 'listId';
export type SegmentOperator = 'is' | 'isNot' | 'contains' | 'notContains' | 'startsWith' | 'endsWith';
export type SegmentLogic = 'all' | 'any';

export interface SegmentCondition {
    id: string;
    field: SegmentField;
    operator: SegmentOperator;
    value: string;
}

export interface AudienceSegment {
    id: string;
    name: string;
    description: string;
    listId: string;
    logic: SegmentLogic;
    conditions: SegmentCondition[];
    estimatedContacts: number;
    updatedAt: string;
    color: string;
}

export interface SegmentFieldConfig {
    key: SegmentField;
    label: string;
    placeholder: string;
}

export interface SegmentOperatorConfig {
    key: SegmentOperator;
    label: string;
}

export type BulkAction = 'delete' | 'tag' | 'status' | 'export';

export type ContactsViewMode = 'lists' | 'segments';