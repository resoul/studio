import { ProductCardBlock } from '@/types/email-builder';

export function exportProductCardHtml(block: ProductCardBlock, fontFamily: string): string {
    const oldPrice = block.oldPrice
        ? `<span style="color:${block.textColor};font-size:14px;text-decoration:line-through;margin-right:8px;">${block.oldPrice}</span>`
        : '';
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr><td style="text-align:${block.align};padding:8px 0 0 0;"><img src="${block.imageUrl}" alt="${block.imageAlt}" style="display:inline-block;width:100%;max-width:100%;height:auto;border:0;" /></td></tr>
  <tr><td style="text-align:${block.align};padding:12px 0 0 0;color:${block.titleColor};font-family:${fontFamily};font-size:22px;line-height:1.3;font-weight:600;">${block.name}</td></tr>
  <tr><td style="text-align:${block.align};padding:8px 0 0 0;color:${block.textColor};font-family:${fontFamily};font-size:14px;line-height:1.6;">${block.description}</td></tr>
  <tr><td style="text-align:${block.align};padding:10px 0 0 0;font-family:${fontFamily};">${oldPrice}<span style="color:${block.priceColor};font-size:22px;font-weight:700;">${block.price}</span></td></tr>
  <tr><td style="text-align:${block.align};padding:14px 0 0 0;"><a href="${block.buttonUrl}" style="display:inline-block;background:${block.buttonBgColor};color:${block.buttonTextColor};padding:10px 20px;text-decoration:none;font-family:${fontFamily};font-weight:600;border-radius:6px;font-size:14px;">${block.buttonText}</a></td></tr>
</table>`;
}