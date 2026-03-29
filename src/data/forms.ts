import { EmbedForm, FormDesign, FormTemplate, PaletteField } from '@/types/forms';

export const DEFAULT_DESIGN: FormDesign = {
    primaryColor: '#4F46E5',
    bgColor: '#FFFFFF',
    textColor: '#1E293B',
    labelColor: '#374151',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    fontFamily: 'Arial, Helvetica, sans-serif',
    buttonText: 'Submit',
    buttonBgColor: '#4F46E5',
    buttonTextColor: '#FFFFFF',
    buttonBorderRadius: 8,
    successMessage: 'Thank you! Your submission has been received.',
    showLabels: true,
};

export const FORM_TEMPLATES: FormTemplate[] = [
    {
        id: 'newsletter',
        name: 'Newsletter Signup',
        description: 'Simple two-field opt-in to grow your subscriber list fast',
        icon: '📧',
        tags: ['Popular', 'Simple'],
        avgConversion: '12%',
        defaultFields: [
            { fieldKey: 'first_name', type: 'text',  label: 'First Name',    placeholder: 'Alice',             required: false, width: 'half', options: [], helpText: '' },
            { fieldKey: 'email',      type: 'email', label: 'Email Address', placeholder: 'alice@example.com', required: true,  width: 'half', options: [], helpText: '' },
        ],
    },
    {
        id: 'contact',
        name: 'Contact Us',
        description: 'General contact form for questions, support and inquiries',
        icon: '💬',
        tags: ['Popular'],
        avgConversion: '8%',
        defaultFields: [
            { fieldKey: 'first_name', type: 'text',     label: 'First Name',    placeholder: 'Alice',                    required: true,  width: 'half', options: [], helpText: '' },
            { fieldKey: 'last_name',  type: 'text',     label: 'Last Name',     placeholder: 'Johnson',                  required: false, width: 'half', options: [], helpText: '' },
            { fieldKey: 'email',      type: 'email',    label: 'Email Address', placeholder: 'alice@example.com',        required: true,  width: 'full', options: [], helpText: '' },
            { fieldKey: 'message',    type: 'textarea', label: 'Message',       placeholder: 'How can we help you?',     required: true,  width: 'full', options: [], helpText: '' },
        ],
    },
    {
        id: 'lead-gen',
        name: 'Lead Generation',
        description: 'Capture qualified leads with company and role information',
        icon: '🎯',
        tags: ['B2B', 'Sales'],
        avgConversion: '6%',
        defaultFields: [
            { fieldKey: 'first_name', type: 'text',  label: 'First Name',  placeholder: 'Alice',           required: true,  width: 'half', options: [], helpText: '' },
            { fieldKey: 'last_name',  type: 'text',  label: 'Last Name',   placeholder: 'Johnson',         required: false, width: 'half', options: [], helpText: '' },
            { fieldKey: 'email',      type: 'email', label: 'Work Email',  placeholder: 'alice@acme.com',  required: true,  width: 'full', options: [], helpText: '' },
            { fieldKey: 'company',    type: 'text',  label: 'Company',     placeholder: 'Acme Inc.',       required: true,  width: 'half', options: [], helpText: '' },
            { fieldKey: 'phone',      type: 'phone', label: 'Phone',       placeholder: '+1 555-0100',     required: false, width: 'half', options: [], helpText: '' },
        ],
    },
    {
        id: 'event',
        name: 'Event Registration',
        description: 'Collect attendee details for webinars and live events',
        icon: '🎟️',
        tags: ['Events'],
        avgConversion: '22%',
        defaultFields: [
            { fieldKey: 'first_name', type: 'text',  label: 'First Name',    placeholder: 'Alice',           required: true,  width: 'half', options: [], helpText: '' },
            { fieldKey: 'last_name',  type: 'text',  label: 'Last Name',     placeholder: 'Johnson',         required: true,  width: 'half', options: [], helpText: '' },
            { fieldKey: 'email',      type: 'email', label: 'Email Address', placeholder: 'alice@acme.com',  required: true,  width: 'full', options: [], helpText: '' },
            { fieldKey: 'company',    type: 'text',  label: 'Company',       placeholder: 'Acme Inc.',       required: false, width: 'full', options: [], helpText: '' },
        ],
    },
    {
        id: 'feedback',
        name: 'Customer Feedback',
        description: 'Gather product satisfaction and improvement suggestions',
        icon: '⭐',
        tags: ['Feedback', 'CX'],
        avgConversion: '18%',
        defaultFields: [
            { fieldKey: 'first_name', type: 'text',     label: 'Your Name',    placeholder: 'Alice',         required: false, width: 'full', options: [], helpText: '' },
            { fieldKey: 'email',      type: 'email',    label: 'Email',        placeholder: 'alice@example.com', required: false, width: 'full', options: [], helpText: '' },
            { fieldKey: 'message',    type: 'textarea', label: 'Your Feedback', placeholder: 'Tell us what you think...', required: true, width: 'full', options: [], helpText: '' },
        ],
    },
    {
        id: 'survey',
        name: 'Quick Survey',
        description: 'Short research survey with open-ended questions',
        icon: '📊',
        tags: ['Research', 'Data'],
        avgConversion: '14%',
        defaultFields: [
            { fieldKey: 'email',   type: 'email',    label: 'Email',    placeholder: 'alice@example.com',      required: true,  width: 'full', options: [], helpText: '' },
            { fieldKey: 'message', type: 'textarea', label: 'Question', placeholder: 'Your answer here...',    required: false, width: 'full', options: [], helpText: '' },
        ],
    },
];

export const MOCK_FORMS: EmbedForm[] = [
    {
        id: 'f1',
        name: 'Newsletter Signup',
        description: 'Main website newsletter form',
        status: 'active',
        listId: 'l1',
        fields: [
            { id: 'ff1', fieldKey: 'first_name', type: 'text',  label: 'First Name',    placeholder: 'Alice',             required: false, width: 'half', options: [], helpText: '' },
            { id: 'ff2', fieldKey: 'email',      type: 'email', label: 'Email Address', placeholder: 'alice@example.com', required: true,  width: 'half', options: [], helpText: '' },
        ],
        design: { ...DEFAULT_DESIGN },
        createdAt: '2026-03-01',
        updatedAt: '2026-03-20',
        submissions: 842,
        views: 4120,
    },
    {
        id: 'f2',
        name: 'Contact Us',
        description: 'Support page contact form',
        status: 'active',
        listId: 'l2',
        fields: [
            { id: 'ff3', fieldKey: 'first_name', type: 'text',     label: 'First Name',    placeholder: 'Alice',               required: true,  width: 'half', options: [], helpText: '' },
            { id: 'ff4', fieldKey: 'last_name',  type: 'text',     label: 'Last Name',     placeholder: 'Johnson',             required: false, width: 'half', options: [], helpText: '' },
            { id: 'ff5', fieldKey: 'email',      type: 'email',    label: 'Email Address', placeholder: 'alice@example.com',   required: true,  width: 'full', options: [], helpText: '' },
            { id: 'ff6', fieldKey: 'message',    type: 'textarea', label: 'Message',       placeholder: 'How can we help...?', required: true,  width: 'full', options: [], helpText: '' },
        ],
        design: { ...DEFAULT_DESIGN, primaryColor: '#10B981', buttonBgColor: '#10B981' },
        createdAt: '2026-02-15',
        updatedAt: '2026-03-18',
        submissions: 234,
        views: 1890,
    },
    {
        id: 'f3',
        name: 'Lead Gen Form',
        description: 'Pricing page lead capture',
        status: 'draft',
        listId: 'l4',
        fields: [
            { id: 'ff7', fieldKey: 'first_name', type: 'text',  label: 'First Name',  placeholder: 'Alice',          required: true,  width: 'half', options: [], helpText: '' },
            { id: 'ff8', fieldKey: 'email',      type: 'email', label: 'Work Email',  placeholder: 'alice@acme.com', required: true,  width: 'half', options: [], helpText: '' },
            { id: 'ff9', fieldKey: 'company',    type: 'text',  label: 'Company',     placeholder: 'Acme Inc.',      required: false, width: 'full', options: [], helpText: '' },
        ],
        design: { ...DEFAULT_DESIGN, primaryColor: '#8B5CF6', buttonBgColor: '#8B5CF6', borderRadius: 4, buttonBorderRadius: 4 },
        createdAt: '2026-03-10',
        updatedAt: '2026-03-10',
        submissions: 0,
        views: 0,
    },
];

export const PALETTE_FIELDS: PaletteField[] = [
    // Basic
    { key: 'message',       label: 'Message',       type: 'textarea', placeholder: 'Your message...',    category: 'basic',   abbr: '¶'  },
    { key: 'subject',       label: 'Subject',       type: 'text',     placeholder: 'Subject',            category: 'basic',   abbr: 'T'  },
    { key: 'website',       label: 'Website URL',   type: 'url',      placeholder: 'https://',           category: 'basic',   abbr: '🔗' },
    { key: 'date_field',    label: 'Date',          type: 'date',     placeholder: '',                   category: 'basic',   abbr: '📅' },
    { key: 'number_field',  label: 'Number',        type: 'number',   placeholder: '0',                  category: 'basic',   abbr: '#'  },
    // Contact
    { key: 'first_name',    label: 'First Name',    type: 'text',     placeholder: 'Alice',              category: 'contact', abbr: 'A'  },
    { key: 'last_name',     label: 'Last Name',     type: 'text',     placeholder: 'Johnson',            category: 'contact', abbr: 'A'  },
    { key: 'email',         label: 'Email Address', type: 'email',    placeholder: 'alice@example.com',  category: 'contact', abbr: '@'  },
    { key: 'phone',         label: 'Phone Number',  type: 'phone',    placeholder: '+1 555-0100',        category: 'contact', abbr: '☎' },
    { key: 'company',       label: 'Company',       type: 'text',     placeholder: 'Acme Inc.',          category: 'contact', abbr: '🏢' },
    // Custom
    { key: 'gdpr_consent',  label: 'GDPR Consent',  type: 'checkbox', placeholder: 'I agree to receive communications', category: 'custom', abbr: '☑' },
    { key: 'plan_interest', label: 'Plan Interest', type: 'select',   placeholder: '',                   category: 'custom',  abbr: '▾' },
];