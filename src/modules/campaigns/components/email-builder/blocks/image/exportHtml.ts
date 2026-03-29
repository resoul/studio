import { ImageBlock } from '@/types/email-builder';

export function exportImageHtml(block: ImageBlock, _fontFamily: string): string {
    const img = `<img src="${block.src}" alt="${block.alt}" style="max-width:${block.width}%;height:auto;display:inline-block;border:none;outline:none;text-decoration:none;" />`;
    const inner = block.href
        ? `<a href="${block.href}" target="_blank" style="text-decoration:none;border:none;">${img}</a>`
        : img;
    return `<div style="text-align:${block.align};padding:8px 0;">${inner}</div>`;
}