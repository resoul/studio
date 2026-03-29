import { ConditionalBlock, EmailBlock } from '@/types/email-builder';
import { DEFAULT_PERSONALIZATION_VARIABLES } from '@/config/personalization';
import { BlockRenderer } from '@/modules/campaigns/components/email-builder/BlockRenderer';

const OPERATOR_LABELS: Record<string, string> = {
    is_set:     'is set',
    is_not_set: 'is not set',
    equals:     'equals',
    not_equals: 'not equals',
    contains:   'contains',
};

interface ConditionalRendererProps {
    block: ConditionalBlock;
    isPreview?: boolean;
    onInlineUpdate?: (blockId: string, updates: Partial<EmailBlock>) => void;
}

export function ConditionalRenderer({ block, isPreview, onInlineUpdate }: ConditionalRendererProps) {
    const varLabel =
        DEFAULT_PERSONALIZATION_VARIABLES.find((v) => v.name === block.variable)?.label ||
        block.variable ||
        '(no variable)';
    const opLabel = OPERATOR_LABELS[block.operator] ?? block.operator;
    const needsValue = !['is_set', 'is_not_set'].includes(block.operator);
    const conditionText = needsValue
        ? `${varLabel} ${opLabel} "${block.value}"`
        : `${varLabel} ${opLabel}`;

    return (
        <div style={{ border: '2px dashed #8B5CF6', borderRadius: 8, overflow: 'hidden' }}>
            {/* IF header */}
            <div style={{
                background: '#F5F3FF', padding: '6px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
                borderBottom: '1px solid #DDD6FE',
            }}>
                <span style={{
                    background: '#8B5CF6', color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>IF</span>
                <span style={{ fontSize: 12, color: '#6D28D9', fontWeight: 500 }}>{conditionText}</span>
            </div>

            {/* IF branch */}
            <div style={{ padding: 8, minHeight: 40, background: '#FAFAF9' }}>
                {block.ifBlocks.length === 0 ? (
                    <div style={{
                        textAlign: 'center', color: '#A1A1AA', fontSize: 12,
                        padding: '12px 0', border: '1px dashed #D4D4D8', borderRadius: 4,
                    }}>
                        IF branch — add blocks in the properties panel
                    </div>
                ) : (
                    block.ifBlocks.map((child) => (
                        <BlockRenderer
                            key={child.id}
                            block={child}
                            isPreview={isPreview}
                            onInlineUpdate={onInlineUpdate}
                        />
                    ))
                )}
            </div>

            {/* ELSE header */}
            <div style={{
                background: '#FFF7ED', padding: '6px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
                borderTop: '1px solid #FED7AA', borderBottom: '1px solid #FED7AA',
            }}>
                <span style={{
                    background: '#F97316', color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>ELSE</span>
                <span style={{ fontSize: 12, color: '#C2410C', fontWeight: 500 }}>Otherwise</span>
            </div>

            {/* ELSE branch */}
            <div style={{ padding: 8, minHeight: 40, background: '#FAFAF9' }}>
                {block.elseBlocks.length === 0 ? (
                    <div style={{
                        textAlign: 'center', color: '#A1A1AA', fontSize: 12,
                        padding: '12px 0', border: '1px dashed #D4D4D8', borderRadius: 4,
                    }}>
                        ELSE branch — add blocks in the properties panel
                    </div>
                ) : (
                    block.elseBlocks.map((child) => (
                        <BlockRenderer
                            key={child.id}
                            block={child}
                            isPreview={isPreview}
                            onInlineUpdate={onInlineUpdate}
                        />
                    ))
                )}
            </div>
        </div>
    );
}