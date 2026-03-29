import { ButtonBlock } from '@/types/email-builder';
import { InlineEditor } from '@/modules/campaigns/components/email-builder/inline-editor';

interface ButtonRendererProps {
    block: ButtonBlock;
    isSelected?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<ButtonBlock>) => void;
}

export function ButtonRenderer({ block, isSelected, onInlineUpdate }: ButtonRendererProps) {
    const canInlineEdit = isSelected && !!onInlineUpdate;

    return (
        <div style={{ textAlign: block.align }} className="py-2">
            {canInlineEdit ? (
                <InlineEditor
                    value={block.text}
                    onChange={(v) => onInlineUpdate(block.id, { text: v })}
                    style={{
                        backgroundColor: block.bgColor,
                        color: block.textColor,
                        borderRadius: block.borderRadius,
                        display: 'inline-block',
                    }}
                    className="px-7 py-3 font-semibold text-base"
                    tag="span"
                />
            ) : (
                <a
                    href={block.url}
                    onClick={(e) => e.preventDefault()}
                    style={{
                        backgroundColor: block.bgColor,
                        color: block.textColor,
                        borderRadius: block.borderRadius,
                    }}
                    className="inline-block px-7 py-3 font-semibold text-base no-underline"
                    dangerouslySetInnerHTML={{ __html: block.text }}
                />
            )}
        </div>
    );
}