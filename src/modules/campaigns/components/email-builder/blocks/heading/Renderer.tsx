import { HeadingBlock } from '@/types/email-builder';
import { InlineEditor } from '@/modules/campaigns/components/email-builder/inline-editor';

interface HeadingRendererProps {
    block: HeadingBlock;
    isSelected?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<HeadingBlock>) => void;
}

const SIZE_MAP: Record<HeadingBlock['level'], string> = {
    h1: 'text-2xl',
    h2: 'text-xl',
    h3: 'text-lg',
};

export function HeadingRenderer({ block, isSelected, onInlineUpdate }: HeadingRendererProps) {
    const canInlineEdit = isSelected && !!onInlineUpdate;

    if (canInlineEdit) {
        return (
            <InlineEditor
                value={block.content}
                onChange={(v) => onInlineUpdate(block.id, { content: v })}
                style={{ color: block.color, textAlign: block.align }}
                className={`${SIZE_MAP[block.level]} font-bold py-1`}
            />
        );
    }

    return (
        <div
            style={{ color: block.color, textAlign: block.align }}
            className={`${SIZE_MAP[block.level]} font-bold py-1`}
            dangerouslySetInnerHTML={{ __html: block.content }}
        />
    );
}