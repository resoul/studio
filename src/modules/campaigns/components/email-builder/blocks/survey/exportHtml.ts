import { SurveyBlock } from '@/types/email-builder';

/** Appends the rating value to the base URL as a query param or path segment. */
function ratingUrl(baseUrl: string, value: string | number): string {
    const base = baseUrl.endsWith('=') || baseUrl.endsWith('/')
        ? baseUrl
        : `${baseUrl}=`;
    return `${base}${value}`;
}

function exportStars(block: SurveyBlock, fontFamily: string): string {
    const cells = Array.from({ length: block.starCount })
        .map((_, i) => {
            const rating = i + 1;
            return `<td style="padding:0 3px;">
  <a href="${ratingUrl(block.baseUrl, rating)}"
     title="Rate ${rating} out of ${block.starCount}"
     style="display:inline-block;text-decoration:none;font-size:32px;line-height:1;color:${block.starColor};">&#9733;</a>
</td>`;
        })
        .join('\n');

    return `<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
  <tr>${cells}</tr>
</table>`;
}

function exportNps(block: SurveyBlock, fontFamily: string): string {
    const cells = Array.from({ length: 11 })
        .map((_, i) => {
            return `<td style="padding:2px;">
  <a href="${ratingUrl(block.baseUrl, i)}"
     title="Rate ${i}/10"
     style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;text-decoration:none;border:2px solid ${block.starColor};border-radius:6px;color:${block.starColor};font-family:${fontFamily};font-size:13px;font-weight:700;">${i}</a>
</td>`;
        })
        .join('\n');

    return `<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
  <tr>${cells}</tr>
  <tr>
    <td colspan="5" style="padding-top:6px;font-family:${fontFamily};font-size:11px;color:${block.textColor};text-align:left;">${block.labelLow}</td>
    <td></td>
    <td colspan="5" style="padding-top:6px;font-family:${fontFamily};font-size:11px;color:${block.textColor};text-align:right;">${block.labelHigh}</td>
  </tr>
</table>`;
}

function exportThumbs(block: SurveyBlock, fontFamily: string): string {
    return `<table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
  <tr>
    <td style="padding:0 8px;">
      <a href="${ratingUrl(block.baseUrl, 'up')}" title="Thumbs up"
         style="display:inline-block;text-decoration:none;font-size:36px;line-height:1;">👍</a>
    </td>
    <td style="padding:0 8px;">
      <a href="${ratingUrl(block.baseUrl, 'down')}" title="Thumbs down"
         style="display:inline-block;text-decoration:none;font-size:36px;line-height:1;">👎</a>
    </td>
  </tr>
</table>`;
}

export function exportSurveyHtml(block: SurveyBlock, fontFamily: string): string {
    const alignAttr =
        block.align === 'center' ? 'center' : block.align === 'right' ? 'right' : 'left';

    const questionHtml = block.question
        ? `<tr><td style="text-align:${alignAttr};padding:0 0 12px 0;font-family:${fontFamily};font-size:15px;font-weight:600;color:${block.textColor};">${block.question}</td></tr>\n`
        : '';

    const widgetHtml =
        block.surveyType === 'stars' ? exportStars(block, fontFamily) :
            block.surveyType === 'nps'   ? exportNps(block, fontFamily)   :
                exportThumbs(block, fontFamily);

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
${questionHtml}<tr><td style="text-align:${alignAttr};padding:4px 0;">${widgetHtml}</td></tr>
</table>`;
}