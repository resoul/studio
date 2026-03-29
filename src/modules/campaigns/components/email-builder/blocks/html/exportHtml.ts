import { HtmlBlock } from '@/types/email-builder';

export function exportHtmlBlockHtml(block: HtmlBlock, _fontFamily: string): string {
    return block.content;
}