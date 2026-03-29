import { TextBlock } from '@/types/email-builder';

export function exportTextHtml(block: TextBlock, fontFamily: string): string {
    return `<p style="margin:0;padding:8px 0;color:${block.color};font-size:${block.fontSize}px;text-align:${block.align};font-family:${fontFamily};line-height:1.6;">${block.content}</p>`;
}