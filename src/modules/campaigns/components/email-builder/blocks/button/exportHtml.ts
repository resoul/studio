import { ButtonBlock } from '@/types/email-builder';

export function exportButtonHtml(block: ButtonBlock, fontFamily: string): string {
    return `<div style="text-align:${block.align};padding:12px 0;"><a href="${block.url}" style="display:inline-block;background:${block.bgColor};color:${block.textColor};padding:12px 28px;text-decoration:none;border-radius:${block.borderRadius}px;font-family:${fontFamily};font-weight:600;font-size:16px;">${block.text}</a></div>`;
}