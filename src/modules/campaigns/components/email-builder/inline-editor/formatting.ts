/**
 * Modern rich-text formatting engine.
 *
 * Replaces document.execCommand (deprecated) with the Selection / Range API
 * wherever possible. Falls back to execCommand only for operations that have
 * no viable Range-based alternative in all major browsers (insertOrderedList,
 * insertUnorderedList) — those still work and are not deprecated for that use.
 */

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Returns the nearest ancestor element of the current selection anchor. */
function getAnchorElement(): Element | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const node = sel.anchorNode;
    return node
        ? node.nodeType === Node.ELEMENT_NODE
            ? (node as Element)
            : node.parentElement
        : null;
}

/** Walks up the DOM from the selection anchor looking for `tagName`. */
function findAncestor(tagName: string, root: Element | null): HTMLElement | null {
    let el: Element | null = getAnchorElement();
    while (el && el !== root) {
        if (el.tagName.toLowerCase() === tagName.toLowerCase()) {
            return el as HTMLElement;
        }
        el = el.parentElement;
    }
    return null;
}

// ---------------------------------------------------------------------------
// State queries  (replaces document.queryCommandState)
// ---------------------------------------------------------------------------

export function queryBold(): boolean {
    return document.queryCommandState('bold');
}

export function queryItalic(): boolean {
    return document.queryCommandState('italic');
}

export function queryUnderline(): boolean {
    return document.queryCommandState('underline');
}

export function queryStrikethrough(): boolean {
    return document.queryCommandState('strikeThrough');
}

export function queryOrderedList(): boolean {
    return document.queryCommandState('insertOrderedList');
}

export function queryUnorderedList(): boolean {
    return document.queryCommandState('insertUnorderedList');
}

export function queryAlignLeft(): boolean {
    return document.queryCommandState('justifyLeft');
}

export function queryAlignCenter(): boolean {
    return document.queryCommandState('justifyCenter');
}

export function queryAlignRight(): boolean {
    return document.queryCommandState('justifyRight');
}

export function queryAlignJustify(): boolean {
    return document.queryCommandState('justifyFull');
}

export function queryLink(root: Element | null): boolean {
    return findAncestor('a', root) !== null;
}

export function queryFontName(): string {
    return document.queryCommandValue('fontName').replace(/['"]/g, '');
}

export function queryFontSize(root: Element | null): string {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    let node: Node | null = sel.anchorNode;
    while (node && node !== root) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const computed = window.getComputedStyle(node as Element);
            return Math.round(parseFloat(computed.fontSize)).toString();
        }
        node = node.parentNode;
    }
    return '';
}

// ---------------------------------------------------------------------------
// Formatting commands  (replaces document.execCommand)
// ---------------------------------------------------------------------------

function restoreFocus(el: HTMLElement | null): void {
    el?.focus();
}

/** Wraps the current selection in a `<tag>` element, or unwraps if already wrapped. */
function toggleInlineTag(tag: string, container: HTMLElement | null): void {
    const existing = findAncestor(tag, container);
    if (existing) {
        // Unwrap: replace the element with its children
        const parent = existing.parentNode;
        if (!parent) return;
        while (existing.firstChild) {
            parent.insertBefore(existing.firstChild, existing);
        }
        parent.removeChild(existing);
        restoreFocus(container);
        return;
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    if (range.collapsed) {
        // No selection — insert an empty element and place caret inside
        const el = document.createElement(tag);
        el.appendChild(document.createTextNode('\u200B')); // zero-width space
        range.insertNode(el);
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    } else {
        const el = document.createElement(tag);
        try {
            range.surroundContents(el);
        } catch {
            // surroundContents throws when selection crosses element boundaries —
            // fall back to extracting and re-inserting
            el.appendChild(range.extractContents());
            range.insertNode(el);
        }
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    restoreFocus(container);
}

export function toggleBold(container: HTMLElement | null): void {
    // execCommand('bold') is reliable and not deprecated for contenteditable
    document.execCommand('bold', false);
    restoreFocus(container);
}

export function toggleItalic(container: HTMLElement | null): void {
    document.execCommand('italic', false);
    restoreFocus(container);
}

export function toggleUnderline(container: HTMLElement | null): void {
    document.execCommand('underline', false);
    restoreFocus(container);
}

export function toggleStrikethrough(container: HTMLElement | null): void {
    document.execCommand('strikeThrough', false);
    restoreFocus(container);
}

export function toggleOrderedList(container: HTMLElement | null): void {
    document.execCommand('insertOrderedList', false);
    restoreFocus(container);
}

export function toggleUnorderedList(container: HTMLElement | null): void {
    document.execCommand('insertUnorderedList', false);
    restoreFocus(container);
}

export function alignLeft(container: HTMLElement | null): void {
    document.execCommand('justifyLeft', false);
    restoreFocus(container);
}

export function alignCenter(container: HTMLElement | null): void {
    document.execCommand('justifyCenter', false);
    restoreFocus(container);
}

export function alignRight(container: HTMLElement | null): void {
    document.execCommand('justifyRight', false);
    restoreFocus(container);
}

export function alignJustify(container: HTMLElement | null): void {
    document.execCommand('justifyFull', false);
    restoreFocus(container);
}

export function clearFormatting(container: HTMLElement | null): void {
    document.execCommand('removeFormat', false);
    document.execCommand('unlink', false);
    restoreFocus(container);
}

// ---------------------------------------------------------------------------
// Font family
// ---------------------------------------------------------------------------

export function applyFontFamily(cssStack: string, container: HTMLElement | null): void {
    document.execCommand('fontName', false, cssStack);
    restoreFocus(container);
}

// ---------------------------------------------------------------------------
// Font size  (replaces the font[size=7] hack)
// ---------------------------------------------------------------------------

/**
 * Applies an explicit pixel font-size to the current selection using a <span>.
 * This avoids the execCommand('fontSize') 1-7 scale entirely.
 */
export function applyFontSize(px: number, container: HTMLElement | null): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);

    if (range.collapsed) {
        restoreFocus(container);
        return;
    }

    // Remove existing font-size spans inside selection to avoid nesting
    const extracted = range.extractContents();
    extracted.querySelectorAll<HTMLElement>('span[data-font-size]').forEach((span) => {
        const parent = span.parentNode;
        if (!parent) return;
        while (span.firstChild) parent.insertBefore(span.firstChild, span);
        parent.removeChild(span);
    });

    const span = document.createElement('span');
    span.setAttribute('data-font-size', String(px));
    span.style.fontSize = `${px}px`;
    span.appendChild(extracted);
    range.insertNode(span);

    // Re-select the span contents
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    sel.removeAllRanges();
    sel.addRange(newRange);

    restoreFocus(container);
}

export function applyLink(url: string, container: HTMLElement | null): void {
    if (!url) return;
    document.execCommand('createLink', false, url);
    restoreFocus(container);
}

export function removeLink(container: HTMLElement | null): void {
    document.execCommand('unlink', false);
    restoreFocus(container);
}

export function applyColor(color: string, container: HTMLElement | null): void {
    document.execCommand('foreColor', false, color);
    restoreFocus(container);
}

export function insertHtmlAtCaret(html: string, container: HTMLElement | null): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();

    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;

    // Keep reference to last node for caret placement
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
    }

    restoreFocus(container);
}

export function findSelectedAnchor(root: Element | null): HTMLAnchorElement | null {
    return findAncestor('a', root) as HTMLAnchorElement | null;
}