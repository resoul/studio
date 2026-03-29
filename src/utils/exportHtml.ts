import { EmailTemplate, EmailBlock, EmailRow } from '@/types/email-builder';
import { getGoogleFontHrefForFamily } from '@/config/email-fonts';
import { exportHeadingHtml }         from '@/modules/campaigns/components/email-builder/blocks/heading';
import { exportTextHtml }            from '@/modules/campaigns/components/email-builder/blocks/text';
import { exportImageHtml }           from '@/modules/campaigns/components/email-builder/blocks/image';
import { exportButtonHtml }          from '@/modules/campaigns/components/email-builder/blocks/button';
import { exportDividerHtml }         from '@/modules/campaigns/components/email-builder/blocks/divider';
import { exportSpacerHtml }          from '@/modules/campaigns/components/email-builder/blocks/spacer';
import { exportHtmlBlockHtml }       from '@/modules/campaigns/components/email-builder/blocks/html';
import { exportHeroHtml }            from '@/modules/campaigns/components/email-builder/blocks/hero';
import { exportProductCardHtml }     from '@/modules/campaigns/components/email-builder/blocks/product-card';
import { exportCouponHtml }          from '@/modules/campaigns/components/email-builder/blocks/coupon';
import { exportSurveyHtml }          from '@/modules/campaigns/components/email-builder/blocks/survey';
import { exportTimerHtml }           from '@/modules/campaigns/components/email-builder/blocks/timer';
import { exportVideoHtml }           from '@/modules/campaigns/components/email-builder/blocks/video';
import { exportSocialHtml }          from '@/modules/campaigns/components/email-builder/blocks/social';
import { exportConditionalHtml }     from '@/modules/campaigns/components/email-builder/blocks/conditional';

interface ExportHtmlOptions {
    includeGoogleFonts?: boolean;
}

function renderBlock(block: EmailBlock, fontFamily: string): string {
    switch (block.type) {
        case 'heading':      return exportHeadingHtml(block, fontFamily);
        case 'text':         return exportTextHtml(block, fontFamily);
        case 'image':        return exportImageHtml(block, fontFamily);
        case 'button':       return exportButtonHtml(block, fontFamily);
        case 'hero':         return exportHeroHtml(block, fontFamily);
        case 'product-card': return exportProductCardHtml(block, fontFamily);
        case 'coupon':       return exportCouponHtml(block, fontFamily);
        case 'divider':      return exportDividerHtml(block, fontFamily);
        case 'spacer':       return exportSpacerHtml(block, fontFamily);
        case 'html':         return exportHtmlBlockHtml(block, fontFamily);
        case 'social':       return exportSocialHtml(block, fontFamily);
        case 'survey':       return exportSurveyHtml(block, fontFamily);
        case 'timer':        return exportTimerHtml(block, fontFamily);
        case 'video':        return exportVideoHtml(block, fontFamily);
        case 'conditional':  return exportConditionalHtml(block, fontFamily, renderBlock);
    }
}

function renderRow(row: EmailRow, contentWidth: number, fontFamily: string): string {
    const colWidth = Math.floor(100 / row.columns);
    const cols = row.blocks
        .map((col) => {
            const blocksHtml = col.map((b) => renderBlock(b, fontFamily)).join('\n');
            return `<td style="width:${colWidth}%;vertical-align:top;padding:0 8px;">${blocksHtml}</td>`;
        })
        .join('\n');

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>${cols}</tr></table>`;
}

export function exportToHtml(template: EmailTemplate, options: ExportHtmlOptions = {}): string {
    const { includeGoogleFonts = true } = options;
    const rowsHtml = template.rows
        .map((row) => renderRow(row, template.contentWidth, template.fontFamily))
        .join('\n');
    const googleFontHref = includeGoogleFonts ? getGoogleFontHrefForFamily(template.fontFamily) : null;
    const googleFontHead = googleFontHref
        ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${googleFontHref}" rel="stylesheet">`
        : '';

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
${googleFontHead}
<title>Email</title>
</head>
<body style="margin:0;padding:0;background-color:${template.bgColor};font-family:${template.fontFamily};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${template.bgColor};">
<tr><td align="center" style="padding:20px 0;">
<table width="${template.contentWidth}" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:24px;">
${rowsHtml}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}