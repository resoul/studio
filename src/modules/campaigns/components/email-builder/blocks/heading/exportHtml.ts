import { HeadingBlock } from '@/types/email-builder';

const FONT_SIZES: Record<HeadingBlock['level'], string> = {
    h1: '28px',
    h2: '22px',
    h3: '18px',
};

export function exportHeadingHtml(block: HeadingBlock, fontFamily: string): string {
    const tag = block.level;
    const size = FONT_SIZES[tag];
    return `<${tag} style="margin:0;padding:8px 0;color:${block.color};text-align:${block.align};font-family:${fontFamily};font-size:${size};font-weight:700;">${block.content}</${tag}>`;
}