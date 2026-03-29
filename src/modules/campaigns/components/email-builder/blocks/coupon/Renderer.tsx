import { CouponBlock } from '@/types/email-builder';

export function CouponRenderer({ block }: { block: CouponBlock }) {
    return (
        <div
            className="my-2 rounded-lg border p-4"
            style={{
                backgroundColor: block.bgColor,
                borderColor: block.borderColor,
                textAlign: block.align,
            }}
        >
            <div className="text-lg font-bold" style={{ color: block.titleColor }}>
                {block.title}
            </div>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: block.textColor }}>
                {block.description}
            </p>
            <div className="mt-3">
                <span
                    className="inline-block rounded border border-dashed px-4 py-2 text-base font-bold tracking-widest"
                    style={{
                        backgroundColor: block.codeBgColor,
                        color: block.codeTextColor,
                        borderColor: block.borderColor,
                    }}
                >
                    {block.code}
                </span>
            </div>
            <div className="mt-4">
                <a
                    href={block.buttonUrl}
                    onClick={(e) => e.preventDefault()}
                    style={{ backgroundColor: block.titleColor, color: '#FFFFFF' }}
                    className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold no-underline"
                >
                    {block.buttonText}
                </a>
            </div>
        </div>
    );
}