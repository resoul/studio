import { CouponBlock } from '@/types/email-builder';

export function exportCouponHtml(block: CouponBlock, fontFamily: string): string {
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:0;background:${block.bgColor};border:1px solid ${block.borderColor};border-radius:8px;">
  <tr><td style="text-align:${block.align};padding:18px 18px 0 18px;color:${block.titleColor};font-family:${fontFamily};font-size:24px;line-height:1.2;font-weight:700;">${block.title}</td></tr>
  <tr><td style="text-align:${block.align};padding:10px 18px 0 18px;color:${block.textColor};font-family:${fontFamily};font-size:14px;line-height:1.6;">${block.description}</td></tr>
  <tr><td style="text-align:${block.align};padding:12px 18px 0 18px;"><span style="display:inline-block;background:${block.codeBgColor};color:${block.codeTextColor};border:1px dashed ${block.borderColor};border-radius:6px;padding:10px 16px;font-family:${fontFamily};font-size:20px;font-weight:700;letter-spacing:2px;">${block.code}</span></td></tr>
  <tr><td style="text-align:${block.align};padding:14px 18px 18px 18px;"><a href="${block.buttonUrl}" style="display:inline-block;background:${block.titleColor};color:#FFFFFF;padding:10px 20px;text-decoration:none;font-family:${fontFamily};font-weight:600;border-radius:6px;font-size:14px;">${block.buttonText}</a></td></tr>
</table>`;
}