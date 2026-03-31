export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'email'
    | 'phone'
    | 'url'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'multiselect'
    | 'color'
    | 'rating'
    | 'file'
    | 'json'
    | 'relation'
    | 'formula';

export type FieldEntity = 'contact' | 'campaign' | 'global';

export interface FieldOption {
    id: string;
    label: string;
    value: string;
}

export interface FieldValidation {
    /** Regex pattern string for text/email/phone/url */
    pattern?: string;
    patternMessage?: string;
    /** Min / max for number fields */
    min?: number;
    max?: number;
    /** Allowed email domains, e.g. ['gmail.com'] */
    allowedDomains?: string[];
    /** Min / max dates (ISO string) */
    minDate?: string;
    maxDate?: string;
    /** Rating max stars */
    maxRating?: number;
    /** Formula expression (for formula type) */
    formulaExpression?: string;
    /** Related entity for relation type */
    relatedEntity?: FieldEntity;
}

export interface CustomField {
    id: string;
    /** Slugified machine key — used in API / CSV headers */
    key: string;
    label: string;
    type: FieldType;
    entity: FieldEntity;
    required: boolean;
    /** System fields are locked — cannot be deleted or have key/type changed */
    system: boolean;
    description: string;
    placeholder: string;
    defaultValue: string;
    /** Only for select / multiselect */
    options: FieldOption[];
    order: number;
    createdAt: string;
    /** Validation rules (optional) */
    validation?: FieldValidation;
    /** Usage count — how many contacts/campaigns use this field (mock) */
    usageCount?: number;
    /** Tags for grouping */
    tags?: string[];
}

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
    text:        'Short text',
    textarea:    'Long text',
    number:      'Number',
    email:       'Email',
    phone:       'Phone',
    url:         'URL',
    date:        'Date',
    datetime:    'Date & Time',
    boolean:     'Yes / No',
    select:      'Dropdown',
    multiselect: 'Multi-select',
    color:       'Color',
    rating:      'Rating',
    file:        'File upload',
    json:        'JSON',
    relation:    'Relation',
    formula:     'Formula',
};

export const FIELD_ENTITY_LABELS: Record<FieldEntity, string> = {
    contact:  'Contact',
    campaign: 'Campaign',
    global:   'Global',
};

export const FIELD_TYPE_GROUPS: { label: string; types: FieldType[] }[] = [
    {
        label: 'Text',
        types: ['text', 'textarea', 'email', 'phone', 'url'],
    },
    {
        label: 'Numbers & Choices',
        types: ['number', 'boolean', 'select', 'multiselect', 'rating'],
    },
    {
        label: 'Date & Time',
        types: ['date', 'datetime'],
    },
    {
        label: 'Advanced',
        types: ['color', 'file', 'json', 'relation', 'formula'],
    },
];