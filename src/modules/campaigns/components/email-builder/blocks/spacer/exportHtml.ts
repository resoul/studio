import { SpacerBlock } from '@/types/email-builder';

export function exportSpacerHtml(block: SpacerBlock, _fontFamily: string): string {
    return `<div style="height:${block.height}px;"></div>`;
}