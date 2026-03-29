import { SocialBlock } from '@/types/email-builder';
import { SOCIAL_NETWORK_MAP, renderSocialSvg } from '@/config/social-networks';

export function exportSocialHtml(block: SocialBlock, _fontFamily: string): string {
    if (block.links.length === 0) return '';

    const justifyMap: Record<string, string> = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };

    const iconsHtml = block.links.map((link) => {
        const cfg = SOCIAL_NETWORK_MAP[link.network];
        if (!cfg) return '';
        const color =
            block.iconColor === 'brand'  ? cfg.brandColor :
                block.iconColor === 'black'  ? '#000000' :
                    block.iconColor === 'white'  ? '#ffffff' :
                        block.customColor;
        const svg = renderSocialSvg(link.network, block.iconSize, color);
        return `<a href="${link.url || '#'}" title="${cfg.label}" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;">${svg}</a>`;
    }).join('');

    return `<div style="display:flex;justify-content:${justifyMap[block.align]};gap:${block.gap}px;flex-wrap:wrap;padding:8px 0;">${iconsHtml}</div>`;
}