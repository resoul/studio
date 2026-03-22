import { EmailTemplate, EmailRow, EmailBlock } from '@/types/email-builder';

let idCounter = 1000;
const uid = () => `imported-${++idCounter}-${Date.now()}`;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ParsedColumn {
    blocks: EmailBlock[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function styleValue(style: CSSStyleDeclaration | null, prop: string): string {
    if (!style) return '';
    return style.getPropertyValue(prop).trim();
}

/**
 * Converts an `rgb(r, g, b)` string to its `#rrggbb` hex equivalent.
 * Returns the input unchanged when it is already in hex or any other format.
 * JSDOM normalises inline hex colours to rgb() when reading el.style, so we
 * always normalise back to hex so callers get stable, predictable values.
 */
function normalizeColor(color: string): string {
    const match = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (!match) return color;
    const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function inlineStyleValue(el: Element, prop: string): string {
    const raw = (el as HTMLElement).style?.getPropertyValue(prop)?.trim();
    if (raw) return raw;
    const attrStyle = el.getAttribute('style') || '';
    const match = attrStyle.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'i'));
    return match ? match[1].trim() : '';
}

function resolveAlign(el: Element): 'left' | 'center' | 'right' {
    const candidates = [
        inlineStyleValue(el, 'text-align'),
        el.getAttribute('align') || '',
    ];
    for (const val of candidates) {
        if (val === 'center') return 'center';
        if (val === 'right') return 'right';
    }
    return 'left';
}

function resolveColor(el: Element, fallback = '#0F172A'): string {
    const c = inlineStyleValue(el, 'color');
    return c ? normalizeColor(c) : fallback;
}

function resolveBgColor(el: Element, fallback = '#F8FAFC'): string {
    const c = inlineStyleValue(el, 'background-color') || inlineStyleValue(el, 'background');
    // Skip "transparent" and empty
    if (!c || c === 'transparent' || c === 'initial' || c === 'inherit') return fallback;
    return normalizeColor(c);
}

function hasBackground(el: Element): boolean {
    const bg = inlineStyleValue(el, 'background-color') || inlineStyleValue(el, 'background');
    return !!bg && bg !== 'transparent' && bg !== 'initial';
}

/** Strips all HTML tags, collapses whitespace. */
function textContent(el: Element): string {
    return el.textContent?.replace(/\s+/g, ' ').trim() || '';
}

/** True if the element's text is meaningful (non-empty, non-whitespace). */
function hasMeaningfulText(el: Element): boolean {
    return textContent(el).length > 0;
}

/**
 * Returns true if `el` is a layout wrapper (table/tr/td/div/section/a)
 * rather than a content leaf.
 * Note: <a> is included so we recurse into anchor-wrapped images.
 */
function isLayoutNode(el: Element): boolean {
    const tag = el.tagName.toLowerCase();
    return [
        'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th',
        'div', 'section', 'article', 'main', 'center',
        'a',  // recurse into anchors so wrapped <img> tags are found
    ].includes(tag);
}

// ---------------------------------------------------------------------------
// Block extractors
// ---------------------------------------------------------------------------

function extractHeading(el: Element): EmailBlock | null {
    const tag = el.tagName.toLowerCase();
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return null;
    const level = (['h1', 'h2', 'h3'].includes(tag) ? tag : 'h3') as 'h1' | 'h2' | 'h3';
    return {
        id: uid(),
        type: 'heading',
        content: el.innerHTML.trim(),
        level,
        color: resolveColor(el),
        align: resolveAlign(el),
    };
}

function extractImage(el: Element): EmailBlock | null {
    if (el.tagName.toLowerCase() !== 'img') return null;
    const src = el.getAttribute('src') || 'https://placehold.co/600x200';
    const alt = el.getAttribute('alt') || '';
    const widthAttr = el.getAttribute('width');
    const styleWidth = inlineStyleValue(el, 'width');
    let width = 100;
    if (styleWidth && styleWidth.endsWith('%')) {
        width = parseInt(styleWidth, 10) || 100;
    } else if (widthAttr && widthAttr.endsWith('%')) {
        width = parseInt(widthAttr, 10) || 100;
    }

    // Check if the image is wrapped in a link
    const parent = el.parentElement;
    const href = parent?.tagName.toLowerCase() === 'a' ? (parent.getAttribute('href') || '') : '';

    return {
        id: uid(),
        type: 'image',
        src,
        alt,
        href,
        width,
        align: resolveAlign(parent ?? el),
    };
}

function extractButton(el: Element): EmailBlock | null {
    const tag = el.tagName.toLowerCase();
    if (tag !== 'a') return null;

    const rawBg = inlineStyleValue(el, 'background-color') || inlineStyleValue(el, 'background');
    if (!rawBg || rawBg === 'transparent') return null;

    const bgColor = normalizeColor(rawBg);

    return {
        id: uid(),
        type: 'button',
        text: el.innerHTML.trim(),
        url: el.getAttribute('href') || '#',
        bgColor,
        textColor: resolveColor(el, '#FFFFFF'),
        borderRadius: parseInt(inlineStyleValue(el, 'border-radius') || '6', 10) || 6,
        align: resolveAlign(el.parentElement ?? el),
    };
}

function extractDivider(el: Element): EmailBlock | null {
    if (el.tagName.toLowerCase() !== 'hr') return null;
    const color = inlineStyleValue(el, 'border-color')
        || inlineStyleValue(el, 'border-top-color')
        || '#E2E8F0';
    const thicknessRaw = inlineStyleValue(el, 'border-top-width')
        || inlineStyleValue(el, 'border-width')
        || '1px';
    const thickness = parseInt(thicknessRaw, 10) || 1;
    const styleAttr = inlineStyleValue(el, 'border-style')
        || inlineStyleValue(el, 'border-top-style')
        || 'solid';
    const style = (['solid', 'dashed', 'dotted'].includes(styleAttr)
        ? styleAttr
        : 'solid') as 'solid' | 'dashed' | 'dotted';

    return { id: uid(), type: 'divider', color: normalizeColor(color), thickness, style };
}

function extractSpacer(el: Element): EmailBlock | null {
    // Detect spacer divs: empty content, explicit height
    if (!isLayoutNode(el)) return null;
    if (hasMeaningfulText(el)) return null;
    if (el.querySelector('img, a, h1, h2, h3, h4, h5, h6, p, table')) return null;

    const heightRaw = inlineStyleValue(el, 'height') || inlineStyleValue(el, 'min-height');
    if (!heightRaw) return null;
    const height = parseInt(heightRaw, 10);
    if (!height || height < 4) return null;

    return { id: uid(), type: 'spacer', height };
}

function extractText(el: Element): EmailBlock | null {
    const tag = el.tagName.toLowerCase();
    if (!['p', 'span', 'div', 'td', 'th', 'li'].includes(tag)) return null;
    if (!hasMeaningfulText(el)) return null;
    // Skip if the element contains images or buttons as direct children — those are separate blocks
    if (el.querySelector('img')) return null;

    const fontSizeRaw = inlineStyleValue(el, 'font-size');
    const fontSize = fontSizeRaw ? parseInt(fontSizeRaw, 10) || 16 : 16;

    return {
        id: uid(),
        type: 'text',
        content: el.innerHTML.trim(),
        fontSize,
        color: resolveColor(el),
        align: resolveAlign(el),
    };
}

// ---------------------------------------------------------------------------
// Column / Row detection
// ---------------------------------------------------------------------------

/**
 * Extracts all content blocks from a subtree, depth-first.
 * Stops recursing into a node once it extracts a block from it.
 */
function extractBlocksFromSubtree(root: Element, visited: Set<Element>): EmailBlock[] {
    const blocks: EmailBlock[] = [];

    function walk(el: Element): void {
        if (visited.has(el)) return;

        // Try each extractor in priority order
        const block =
            extractHeading(el) ??
            extractDivider(el) ??
            extractButton(el) ??
            extractImage(el) ??
            extractSpacer(el) ??
            extractText(el);

        if (block) {
            visited.add(el);
            // Also mark the parent <a> as visited if this was an image inside a link
            if (el.tagName.toLowerCase() === 'img' && el.parentElement?.tagName.toLowerCase() === 'a') {
                visited.add(el.parentElement);
            }
            blocks.push(block);
            return;
        }

        // Recurse into children
        for (const child of Array.from(el.children)) {
            walk(child);
        }
    }

    walk(root);
    return blocks;
}

/**
 * Detects multi-column layout from a <tr> element.
 * Returns an array of ParsedColumn, one per <td>/<th>.
 */
function extractColumnsFromRow(tr: Element, visited: Set<Element>): ParsedColumn[] {
    const cells = Array.from(tr.querySelectorAll(':scope > td, :scope > th'));
    if (cells.length === 0) return [];

    return cells.map(cell => ({
        blocks: extractBlocksFromSubtree(cell, visited),
    }));
}

/**
 * Attempts to find a multi-column pattern in `el`.
 * Looks for the first <tr> with 2 or 3 <td>/<th> children.
 */
function findMultiColumnRow(el: Element, visited: Set<Element>): ParsedColumn[] | null {
    const rows = el.querySelectorAll('tr');
    for (const tr of Array.from(rows)) {
        if (visited.has(tr)) continue;
        const cells = Array.from(tr.querySelectorAll(':scope > td, :scope > th'));
        if (cells.length >= 2 && cells.length <= 3) {
            const cols = extractColumnsFromRow(tr, visited);
            // Only treat as multi-column if at least 2 columns have content
            const nonEmpty = cols.filter(c => c.blocks.length > 0);
            if (nonEmpty.length >= 2) {
                visited.add(tr);
                cells.forEach(c => visited.add(c));
                return cols;
            }
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// Row builder
// ---------------------------------------------------------------------------

function makeRow(columns: ParsedColumn[]): EmailRow {
    const colCount = Math.min(Math.max(columns.length, 1), 3) as 1 | 2 | 3;
    return {
        id: uid(),
        columns: colCount,
        blocks: columns.slice(0, colCount).map(c => c.blocks),
    };
}

// ---------------------------------------------------------------------------
// Main parser
// ---------------------------------------------------------------------------

export function parseHtmlToTemplate(html: string): EmailTemplate {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Resolve background colour from body or top-level wrapper
    const body = doc.body;
    const bgColor = resolveBgColor(body) || '#F8FAFC';

    // Resolve content width hint
    let contentWidth = 600;
    const widthHints = body.querySelectorAll('[width]');
    for (const el of Array.from(widthHints)) {
        const w = parseInt(el.getAttribute('width') || '0', 10);
        if (w >= 400 && w <= 1200) {
            contentWidth = w;
            break;
        }
    }

    const rows: EmailRow[] = [];
    const visited = new Set<Element>();

    /**
     * Processes a subtree, emitting one or more rows.
     * Multi-column <tr> patterns produce a single multi-column row.
     * Everything else is emitted as individual single-column rows.
     */
    function processSubtree(root: Element): void {
        if (visited.has(root)) return;

        // Try multi-column detection first
        const multiCol = findMultiColumnRow(root, visited);
        if (multiCol) {
            const row = makeRow(multiCol);
            if (row.blocks.some(col => col.length > 0)) {
                rows.push(row);
            }
        }

        // Walk direct children for remaining content
        for (const child of Array.from(root.children)) {
            if (visited.has(child)) continue;

            // Attempt multi-column inside this child
            const childMultiCol = findMultiColumnRow(child, visited);
            if (childMultiCol) {
                const row = makeRow(childMultiCol);
                if (row.blocks.some(col => col.length > 0)) {
                    rows.push(row);
                    visited.add(child);
                }
                continue;
            }

            // Try extracting a single block directly
            const block =
                extractHeading(child) ??
                extractDivider(child) ??
                extractButton(child) ??
                extractImage(child) ??
                extractSpacer(child) ??
                extractText(child);

            if (block) {
                visited.add(child);
                if (child.tagName.toLowerCase() === 'img' && child.parentElement?.tagName.toLowerCase() === 'a') {
                    visited.add(child.parentElement);
                }
                rows.push({ id: uid(), columns: 1, blocks: [[block]] });
                continue;
            }

            // Recurse into layout containers (including <a> so wrapped images are found)
            if (isLayoutNode(child) && child.children.length > 0) {
                processSubtree(child);
            }
        }
    }

    processSubtree(body);

    // Fallback: if nothing was extracted, put body text into a single text block
    if (rows.length === 0 && body.textContent?.trim()) {
        rows.push({
            id: uid(),
            columns: 1,
            blocks: [[{
                id: uid(),
                type: 'text',
                content: body.textContent.trim().slice(0, 1000),
                fontSize: 16,
                color: '#0F172A',
                align: 'left',
            }]],
        });
    }

    return {
        rows,
        bgColor,
        contentWidth,
        fontFamily: 'Arial, Helvetica, sans-serif',
    };
}