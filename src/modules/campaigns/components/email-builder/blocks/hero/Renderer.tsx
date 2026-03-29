import { HeroBlock } from '@/types/email-builder';

export function HeroRenderer({ block }: { block: HeroBlock }) {
    return (
        <div className="py-2">
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                <tr>
                    <td style={{ padding: '0 0 12px 0' }}>
                        <img
                            src={block.imageUrl}
                            alt={block.imageAlt}
                            className="w-full h-auto rounded-md"
                        />
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, color: block.titleColor }}>
                        <div className="text-2xl font-bold leading-tight">{block.title}</div>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, color: block.textColor, paddingTop: 8 }}>
                        <p className="m-0 text-base leading-relaxed">{block.description}</p>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, paddingTop: 14 }}>
                        <a
                            href={block.buttonUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                backgroundColor: block.buttonBgColor,
                                color: block.buttonTextColor,
                            }}
                            className="inline-block rounded-md px-6 py-3 text-base font-semibold no-underline"
                        >
                            {block.buttonText}
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}