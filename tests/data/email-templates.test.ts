import { describe, expect, it } from 'vitest';
import { getStarterTemplateById, getStarterTemplates } from '../../src/data/email-templates';

describe('email starter templates', () => {
    it('returns 5 starter templates for english locale', () => {
        const templates = getStarterTemplates('en');

        expect(templates).toHaveLength(5);
        expect(templates.map((template) => template.id)).toEqual([
            'welcome',
            'newsletter',
            'promotion',
            'product-launch',
            'event-invite',
        ]);
    });

    it('returns localized template labels', () => {
        const enTemplates = getStarterTemplates('en');
        const ruTemplates = getStarterTemplates('ru');

        expect(enTemplates[0].name).toBe('Welcome Email');
        expect(ruTemplates[0].name).toBe('Приветственное письмо');
    });

    it('returns template by id for current locale', () => {
        const template = getStarterTemplateById('en', 'product-launch');

        expect(template).not.toBeNull();
        expect(template?.id).toBe('product-launch');
        expect(template?.name).toBe('Product Launch');
    });

    it('returns null when template id does not exist', () => {
        expect(getStarterTemplateById('en', 'missing-template')).toBeNull();
    });
});
