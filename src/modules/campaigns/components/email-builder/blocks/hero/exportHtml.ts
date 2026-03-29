import { HeroBlock } from '@/types/email-builder';

export function exportHeroHtml(block: HeroBlock, fontFamily: string): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr><td style="padding:8px 0 12px 0;"><img src="${block.imageUrl}" alt="${block.imageAlt}" style="display:block;width:100%;max-width:100%;height:auto;border:0;" /></td></tr>
  <tr><td style="text-align:${block.align};padding:0;color:${block.titleColor};font-family:${fontFamily};font-size:28px;line-height:1.2;font-weight:700;">${block.title}</td></tr>
  <tr><td style="text-align:${block.align};padding:10px 0 0 0;color:${block.textColor};font-family:${fontFamily};font-size:16px;line-height:1.6;">${block.description}</td></tr>
  <tr><td style="text-align:${block.align};padding:16px 0 0 0;"><a href="${block.buttonUrl}" style="display:inline-block;background:${block.buttonBgColor};color:${block.buttonTextColor};padding:12px 24px;text-decoration:none;font-family:${fontFamily};font-weight:600;border-radius:6px;">${block.buttonText}</a></td></tr>
</table>`;
}