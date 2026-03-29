import { ProductCardBlock } from '@/types/email-builder';

export function ProductCardRenderer({ block }: { block: ProductCardBlock }) {
    return (
        <div className="py-2">
            <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
                <tbody>
                <tr>
                    <td style={{ textAlign: block.align }}>
                        <img
                            src={block.imageUrl}
                            alt={block.imageAlt}
                            className="inline-block h-auto w-full rounded-md"
                        />
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, color: block.titleColor, paddingTop: 10 }}>
                        <div className="text-xl font-semibold">{block.name}</div>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, color: block.textColor, paddingTop: 6 }}>
                        <p className="m-0 text-sm leading-relaxed">{block.description}</p>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, paddingTop: 8 }}>
                        {block.oldPrice && (
                            <span className="mr-2 text-sm line-through" style={{ color: block.textColor }}>
                                    {block.oldPrice}
                                </span>
                        )}
                        <span className="text-lg font-bold" style={{ color: block.priceColor }}>
                                {block.price}
                            </span>
                    </td>
                </tr>
                <tr>
                    <td style={{ textAlign: block.align, paddingTop: 12 }}>
                        <a
                            href={block.buttonUrl}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                backgroundColor: block.buttonBgColor,
                                color: block.buttonTextColor,
                            }}
                            className="inline-block rounded-md px-5 py-2.5 text-sm font-semibold no-underline"
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