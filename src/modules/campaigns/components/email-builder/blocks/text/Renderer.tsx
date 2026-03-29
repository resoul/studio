import { TextBlock } from '@/types/email-builder';
import { InlineEditor } from '@/modules/campaigns/components/email-builder/inline-editor';

interface TextRendererProps {
    block: TextBlock;
    isSelected?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<TextBlock>) => void;
}

export function TextRenderer({ block, isSelected, onInlineUpdate }: TextRendererProps) {
    const canInlineEdit = isSelected && !!onInlineUpdate;

    if (canInlineEdit) {
        return (
            <InlineEditor
                value={block.content}
                onChange={(v) => onInlineUpdate(block.id, { content: v })}
                style={{ color: block.color, fontSize: block.fontSize, textAlign: block.align }}
                className="py-1 leading-relaxed"
                tag="p"
            />
        );
    }

    return (
        <p
            style={{ color: block.color, fontSize: block.fontSize, textAlign: block.align }}
            className="py-1 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.content }}
        />
    );
}