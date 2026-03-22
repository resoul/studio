import { describe, it, expect } from 'vitest';
import { parseHtmlToTemplate } from '@/utils/parseHtml';
import { HeadingBlock, ImageBlock, ButtonBlock, DividerBlock, TextBlock } from '@/types/email-builder';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function wrap(body: string, bgColor = ''): string {
    return `<!DOCTYPE html><html><body${bgColor ? ` style="background-color:${bgColor};"` : ''}>${body}</body></html>`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('parseHtmlToTemplate', () => {
    describe('background colour', () => {
        it('extracts bgColor from body style', () => {
            const template = parseHtmlToTemplate(wrap('<p>hi</p>', '#123456'));
            expect(template.bgColor).toBe('#123456');
        });

        it('falls back to #F8FAFC when no bg is set', () => {
            const template = parseHtmlToTemplate(wrap('<p>hi</p>'));
            expect(template.bgColor).toBe('#F8FAFC');
        });
    });

    describe('content width', () => {
        it('picks up width attribute from a table', () => {
            const html = wrap('<table width="600"><tr><td><p>text</p></td></tr></table>');
            const template = parseHtmlToTemplate(html);
            expect(template.contentWidth).toBe(600);
        });

        it('defaults to 600 when no width hint found', () => {
            const html = wrap('<p>text</p>');
            expect(parseHtmlToTemplate(html).contentWidth).toBe(600);
        });
    });

    describe('headings', () => {
        it('extracts h1 block', () => {
            const html = wrap('<h1 style="color:#111111;text-align:center;">Hello</h1>');
            const { rows } = parseHtmlToTemplate(html);
            expect(rows).toHaveLength(1);
            const block = rows[0].blocks[0][0] as HeadingBlock;
            expect(block.type).toBe('heading');
            expect(block.level).toBe('h1');
            expect(block.color).toBe('#111111');
            expect(block.align).toBe('center');
            expect(block.content).toContain('Hello');
        });

        it('maps h4+ to h3', () => {
            const html = wrap('<h4>Sub</h4>');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as HeadingBlock;
            expect(block.level).toBe('h3');
        });
    });

    describe('images', () => {
        it('extracts img block with src and alt', () => {
            const html = wrap('<img src="https://example.com/img.png" alt="Test image" />');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as ImageBlock;
            expect(block.type).toBe('image');
            expect(block.src).toBe('https://example.com/img.png');
            expect(block.alt).toBe('Test image');
        });

        it('picks up href when image is wrapped in anchor', () => {
            const html = wrap('<a href="https://example.com"><img src="img.jpg" alt="" /></a>');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as ImageBlock;
            expect(block.href).toBe('https://example.com');
        });

        it('reads percentage width from style', () => {
            const html = wrap('<img src="x.jpg" style="width:50%;" />');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as ImageBlock;
            expect(block.width).toBe(50);
        });
    });

    describe('buttons', () => {
        it('extracts anchor with background as button', () => {
            const html = wrap(
                '<a href="https://cta.com" style="background-color:#4f46e5;color:#ffffff;border-radius:6px;">Click Me</a>'
            );
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as ButtonBlock;
            expect(block.type).toBe('button');
            expect(block.url).toBe('https://cta.com');
            expect(block.bgColor).toBe('#4f46e5');
            expect(block.textColor).toBe('#ffffff');
            expect(block.borderRadius).toBe(6);
        });

        it('does not treat plain anchor (no background) as button', () => {
            const html = wrap('<a href="https://example.com">plain link</a>');
            const { rows } = parseHtmlToTemplate(html);
            const types = rows.flatMap(r => r.blocks.flatMap(col => col.map(b => b.type)));
            expect(types).not.toContain('button');
        });
    });

    describe('dividers', () => {
        it('extracts hr as divider', () => {
            const html = wrap('<hr style="border-top:2px dashed #E2E8F0;" />');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0];
            expect(block.type).toBe('divider');
        });
    });

    describe('text', () => {
        it('extracts paragraph as text block', () => {
            const html = wrap('<p style="color:#334155;font-size:16px;text-align:left;">Body text</p>');
            const block = parseHtmlToTemplate(html).rows[0].blocks[0][0] as TextBlock;
            expect(block.type).toBe('text');
            expect(block.color).toBe('#334155');
            expect(block.fontSize).toBe(16);
            expect(block.align).toBe('left');
        });
    });

    describe('multi-column layout', () => {
        it('detects 2-column table layout', () => {
            const html = wrap(`
                <table>
                    <tr>
                        <td><h3>Column A</h3></td>
                        <td><h3>Column B</h3></td>
                    </tr>
                </table>
            `);
            const { rows } = parseHtmlToTemplate(html);
            const multiRow = rows.find(r => r.columns === 2);
            expect(multiRow).toBeDefined();
            expect(multiRow?.blocks[0].length).toBeGreaterThan(0);
            expect(multiRow?.blocks[1].length).toBeGreaterThan(0);
        });

        it('detects 3-column table layout', () => {
            const html = wrap(`
                <table>
                    <tr>
                        <td><p>A</p></td>
                        <td><p>B</p></td>
                        <td><p>C</p></td>
                    </tr>
                </table>
            `);
            const { rows } = parseHtmlToTemplate(html);
            const multiRow = rows.find(r => r.columns === 3);
            expect(multiRow).toBeDefined();
        });

        it('treats single-column table as single-column rows', () => {
            const html = wrap(`
                <table>
                    <tr><td><h1>Title</h1></td></tr>
                    <tr><td><p>Body</p></td></tr>
                </table>
            `);
            const { rows } = parseHtmlToTemplate(html);
            expect(rows.every(r => r.columns === 1)).toBe(true);
        });
    });

    describe('fallback', () => {
        it('returns a text block when nothing is extracted', () => {
            const html = '<html><body>Just plain text</body></html>';
            const { rows } = parseHtmlToTemplate(html);
            expect(rows.length).toBeGreaterThan(0);
        });
    });
});