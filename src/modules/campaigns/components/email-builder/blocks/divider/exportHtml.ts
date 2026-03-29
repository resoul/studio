import { DividerBlock } from '@/types/email-builder';

export function exportDividerHtml(block: DividerBlock, _fontFamily: string): string {
    return `<hr style="border:none;border-top:${block.thickness}px ${block.style} ${block.color};margin:12px 0;" />`;
}