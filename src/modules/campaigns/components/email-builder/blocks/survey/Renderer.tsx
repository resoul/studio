import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SurveyBlock } from '@/types/email-builder';

interface SurveyRendererProps {
    block: SurveyBlock;
}

function StarsPreview({ block }: { block: SurveyBlock }) {
    return (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'inherit' }}>
            {Array.from({ length: block.starCount }).map((_, i) => (
                <Star
                    key={i}
                    size={28}
                    fill={block.starColor}
                    stroke={block.starColor}
                    style={{ cursor: 'default' }}
                />
            ))}
        </div>
    );
}

function NpsPreview({ block }: { block: SurveyBlock }) {
    return (
        <div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'inherit' }}>
                {Array.from({ length: 11 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${block.starColor}`,
                            borderRadius: 6,
                            color: block.starColor,
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                        }}
                    >
                        {i}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: block.textColor, fontSize: 11 }}>
                <span>{block.labelLow}</span>
                <span>{block.labelHigh}</span>
            </div>
        </div>
    );
}

function ThumbsPreview({ block }: { block: SurveyBlock }) {
    return (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'inherit' }}>
            <ThumbsUp size={40} fill={block.starColor} stroke={block.starColor} />
            <ThumbsDown size={40} fill="#94A3B8" stroke="#94A3B8" />
        </div>
    );
}

export function SurveyRenderer({ block }: SurveyRendererProps) {
    const alignStyle: React.CSSProperties = { textAlign: block.align };
    const justifyContent =
        block.align === 'center' ? 'center' : block.align === 'right' ? 'flex-end' : 'flex-start';

    return (
        <div className="py-2 px-1" style={alignStyle}>
            {block.question && (
                <p
                    style={{
                        margin: '0 0 12px 0',
                        color: block.textColor,
                        fontWeight: 600,
                        fontSize: 15,
                    }}
                >
                    {block.question}
                </p>
            )}

            <div style={{ display: 'flex', justifyContent }}>
                {block.surveyType === 'stars' && <StarsPreview block={block} />}
                {block.surveyType === 'nps' && <NpsPreview block={block} />}
                {block.surveyType === 'thumbs' && <ThumbsPreview block={block} />}
            </div>
        </div>
    );
}