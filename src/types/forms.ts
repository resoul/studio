export type FormFieldType =
    | 'text'
    | 'email'
    | 'phone'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'url';

export type FormStatus = 'active' | 'draft' | 'archived';

export interface FormFieldOption {
    id: string;
    label: string;
    value: string;
}

export interface FormField {
    id: string;
    fieldKey: string;
    type: FormFieldType;
    label: string;
    placeholder: string;
    required: boolean;
    width: 'full' | 'half';
    options: FormFieldOption[];
    helpText: string;
}

export interface FormDesign {
    primaryColor: string;
    bgColor: string;
    textColor: string;
    labelColor: string;
    borderColor: string;
    borderRadius: number;
    fontFamily: string;
    buttonText: string;
    buttonBgColor: string;
    buttonTextColor: string;
    buttonBorderRadius: number;
    successMessage: string;
    showLabels: boolean;
}

export interface EmbedForm {
    id: string;
    name: string;
    description: string;
    status: FormStatus;
    fields: FormField[];
    design: FormDesign;
    listId: string | null;
    createdAt: string;
    updatedAt: string;
    submissions: number;
    views: number;
}

export interface FormTemplate {
    id: string;
    name: string;
    description: string;
    icon: string;
    tags: string[];
    avgConversion: string;
    defaultFields: Omit<FormField, 'id'>[];
}

export interface PaletteField {
    key: string;
    label: string;
    type: FormFieldType;
    placeholder: string;
    category: 'basic' | 'contact' | 'custom';
    abbr: string;
}