import { ConditionalBlock, EmailBlock } from '@/types/email-builder';

// renderBlock is passed in to avoid a circular dependency
// (exportHtml.ts already has renderBlock defined)
type RenderBlockFn = (block: EmailBlock, fontFamily: string) => string;

export function exportConditionalHtml(
    block: ConditionalBlock,
    fontFamily: string,
    renderBlock: RenderBlockFn,
): string {
    const v = block.variable || 'unknown';

    let openTag: string;
    switch (block.operator) {
        case 'is_set':      openTag = `{{#if ${v}}}`;                              break;
        case 'is_not_set':  openTag = `{{#unless ${v}}}`;                         break;
        case 'equals':      openTag = `{{#ifEquals ${v} "${block.value}"}}`;       break;
        case 'not_equals':  openTag = `{{#ifNotEquals ${v} "${block.value}"}}`;   break;
        case 'contains':    openTag = `{{#ifContains ${v} "${block.value}"}}`;    break;
        default:            openTag = `{{#if ${v}}}`;
    }

    const closeTag =
        block.operator === 'is_not_set'  ? '{{/unless}}' :
            block.operator === 'equals'      ? '{{/ifEquals}}' :
                block.operator === 'not_equals'  ? '{{/ifNotEquals}}' :
                    block.operator === 'contains'    ? '{{/ifContains}}' :
                        '{{/if}}';

    const ifHtml   = block.ifBlocks.map((b) => renderBlock(b, fontFamily)).join('\n');
    const elseHtml = block.elseBlocks.map((b) => renderBlock(b, fontFamily)).join('\n');

    let result = `${openTag}\n${ifHtml}`;
    if (elseHtml) result += `\n{{else}}\n${elseHtml}`;
    result += `\n${closeTag}`;
    return result;
}