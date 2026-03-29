import { ImageBlock } from '@/types/email-builder';

interface ImageRendererProps {
    block: ImageBlock;
    isSelected?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<ImageBlock>) => void;
}

export function ImageRenderer({ block, isSelected, onInlineUpdate }: ImageRendererProps) {
    const canInlineEdit = isSelected && !!onInlineUpdate;

    const imgElement = (
        <img
            src={block.src}
            alt={block.alt}
            style={{ maxWidth: `${block.width}%` }}
            className="inline-block h-auto"
        />
    );

    return (
        <div style={{ textAlign: block.align }} className="py-1">
            {block.href ? (
                <a
                    href={block.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    onClick={(e) => canInlineEdit && e.preventDefault()}
                >
                    {imgElement}
                </a>
            ) : imgElement}
        </div>
    );
}