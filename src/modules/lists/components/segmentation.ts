import { AudienceSegment, Contact, SegmentCondition } from '@/types/contacts';

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

function matchesOperator(left: string, operator: SegmentCondition['operator'], right: string): boolean {
    if (!right.trim()) return true;

    const source = normalize(left);
    const target = normalize(right);

    switch (operator) {
        case 'is':
            return source === target;
        case 'isNot':
            return source !== target;
        case 'contains':
            return source.includes(target);
        case 'notContains':
            return !source.includes(target);
        case 'startsWith':
            return source.startsWith(target);
        case 'endsWith':
            return source.endsWith(target);
        default:
            return false;
    }
}

function matchesCondition(contact: Contact, condition: SegmentCondition): boolean {
    const { field, operator, value } = condition;

    if (field === 'tag') {
        return contact.tags.some((tag) => matchesOperator(tag, operator, value));
    }

    if (field === 'listId') {
        return matchesOperator(contact.listId, operator, value);
    }

    if (field === 'status') {
        return matchesOperator(contact.status, operator, value);
    }

    if (field === 'email') {
        return matchesOperator(contact.email, operator, value);
    }

    if (field === 'firstName') {
        return matchesOperator(contact.firstName, operator, value);
    }

    return matchesOperator(contact.lastName, operator, value);
}

export function getSegmentMatches(segment: AudienceSegment, contacts: Contact[]): Contact[] {
    const baseContacts = segment.listId === 'all'
        ? contacts
        : contacts.filter((contact) => contact.listId === segment.listId);

    if (segment.conditions.length === 0) {
        return baseContacts;
    }

    return baseContacts.filter((contact) => {
        if (segment.logic === 'all') {
            return segment.conditions.every((condition) => matchesCondition(contact, condition));
        }

        return segment.conditions.some((condition) => matchesCondition(contact, condition));
    });
}
