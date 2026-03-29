import { SocialBlock } from '@/types/email-builder';
import { SOCIAL_NETWORK_MAP } from '@/config/social-networks';

export function SocialRenderer({ block }: { block: SocialBlock }) {
    const justifyMap: Record<string, string> = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: justifyMap[block.align],
                gap: block.gap,
                flexWrap: 'wrap',
                padding: '8px 0',
            }}
        >
            {block.links.length === 0 ? (
                <span style={{ fontSize: 12, color: '#94A3B8' }}>No social links added yet</span>
            ) : (
                block.links.map((link) => {
                    const cfg = SOCIAL_NETWORK_MAP[link.network];
                    if (!cfg) return null;

                    const iconColor =
                        block.iconColor === 'brand'  ? cfg.brandColor :
                            block.iconColor === 'black'  ? '#000000' :
                                block.iconColor === 'white'  ? '#ffffff' :
                                    block.customColor;

                    const paths = Array.isArray(cfg.svgPath) ? cfg.svgPath : [cfg.svgPath];

                    return (
                        <a
                            key={link.id}
                            href={link.url || '#'}
                            title={cfg.label}
                            onClick={(e) => e.preventDefault()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: block.iconSize,
                                height: block.iconSize,
                                flexShrink: 0,
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width={block.iconSize}
                                height={block.iconSize}
                                fill="none"
                                stroke={iconColor}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {paths.map((d, i) => <path key={i} d={d} />)}
                            </svg>
                        </a>
                    );
                })
            )}
        </div>
    );
}