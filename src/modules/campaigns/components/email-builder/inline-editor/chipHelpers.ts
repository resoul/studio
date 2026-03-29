export function isVarChip(node: Node | null): node is HTMLElement {
    return node instanceof HTMLElement && node.hasAttribute('data-var');
}

const CHIP_OUTLINE = 'outline: 2px solid #4F46E5; outline-offset: 1px;';

export function selectChip(chip: HTMLElement) {
    chip.setAttribute('data-chip-selected', 'true');
    chip.setAttribute('style', (chip.getAttribute('style') ?? '').replace(CHIP_OUTLINE, '') + CHIP_OUTLINE);
}

export function deselectChip(chip: HTMLElement) {
    chip.removeAttribute('data-chip-selected');
    chip.setAttribute('style', (chip.getAttribute('style') ?? '').replace(CHIP_OUTLINE, ''));
}

export function clearAllSelectedChips(container: HTMLElement | null) {
    container?.querySelectorAll<HTMLElement>('[data-chip-selected]').forEach(deselectChip);
}

/**
 * Deletes a variable chip adjacent to the current caret position.
 * Restores the caret to the exact position where the chip was.
 * Returns true if a chip was found and removed.
 */
export function tryDeleteAdjacentChip(direction: 'before' | 'after'): boolean {
    const sel = window.getSelection();
    if (!sel || !sel.isCollapsed) return false;

    const { startContainer, startOffset } = sel.getRangeAt(0);
    let candidate: Node | null = null;

    if (direction === 'before') {
        if (startContainer.nodeType === Node.TEXT_NODE) {
            if (startOffset > 0) return false;
            candidate = startContainer.previousSibling;
        } else {
            candidate = startOffset > 0
                ? startContainer.childNodes[startOffset - 1]
                : startContainer.previousSibling;
        }
    } else {
        if (startContainer.nodeType === Node.TEXT_NODE) {
            if (startOffset < (startContainer.textContent?.length ?? 0)) return false;
            candidate = startContainer.nextSibling;
        } else {
            candidate = startOffset < startContainer.childNodes.length
                ? startContainer.childNodes[startOffset]
                : startContainer.nextSibling;
        }
    }

    if (isVarChip(candidate)) {
        const parent = candidate.parentNode!;
        // Save index BEFORE removal — range to removed node is invalid after
        const index = Array.from(parent.childNodes).indexOf(candidate as ChildNode);
        candidate.remove();
        const range = document.createRange();
        range.setStart(parent, Math.min(index, parent.childNodes.length));
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
    }
    return false;
}