import { VideoBlock } from '@/types/email-builder';
import { getAutoThumbnail } from './utils';

export function exportVideoHtml(block: VideoBlock, _fontFamily: string): string {
    const thumbnail = block.thumbnailUrl || getAutoThumbnail(block.url);
    const alignAttr = block.align === 'center' ? 'center' : block.align === 'right' ? 'right' : 'left';
    const widthStyle = `${block.width}%`;

    // Email-safe approach: background-image on a table cell + centered play button.
    // position:absolute is unreliable in email clients, so we use a min-height +
    // vertical-align trick to overlay the play button over the background image.
    const playButtonHtml = block.showPlayButton
        ? `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="min-height:200px;">
  <tr>
    <td align="center" valign="middle" style="text-align:center;vertical-align:middle;padding:80px 0;">
      <a href="${block.url}" style="display:inline-block;text-decoration:none;" target="_blank">
        <div style="width:68px;height:68px;border-radius:50%;background:${block.playButtonBgColor};line-height:68px;text-align:center;mso-line-height-rule:exactly;">
          <span style="color:${block.playButtonColor};font-size:28px;mso-line-height-rule:exactly;">&#9654;</span>
        </div>
      </a>
    </td>
  </tr>
</table>`
        : '';

    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td align="${alignAttr}" style="padding:8px 0;">
      <a href="${block.url}" target="_blank" style="display:inline-block;width:${widthStyle};text-decoration:none;max-width:${widthStyle};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="border-collapse:collapse;background-image:url('${thumbnail}');background-size:cover;background-position:center;border-radius:8px;overflow:hidden;min-height:200px;">
          <tr>
            <td>${playButtonHtml}</td>
          </tr>
        </table>
      </a>
    </td>
  </tr>
</table>`;
}