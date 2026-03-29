import { ChangeEvent, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { BlockType, ConditionalBlock, ConditionalOperator, EmailBlock } from '@/types/email-builder';
import { DEFAULT_PERSONALIZATION_VARIABLES, CONDITIONAL_OPERATORS } from '@/config/personalization';
import { createDefaultBlock } from '@/hooks/createDefaultBlock';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CHILD_BLOCK_TYPES: { type: BlockType; label: string }[] = [
    { type: 'heading',      label: 'Heading'      },
    { type: 'text',         label: 'Text'         },
    { type: 'image',        label: 'Image'        },
    { type: 'button',       label: 'Button'       },
    { type: 'hero',         label: 'Hero'         },
    { type: 'product-card', label: 'Product Card' },
    { type: 'coupon',       label: 'Coupon'       },
    { type: 'survey',       label: 'Survey'       },
    { type: 'divider',      label: 'Divider'      },
    { type: 'spacer',       label: 'Spacer'       },
    { type: 'html',         label: 'HTML'         },
    { type: 'timer',        label: 'Timer'  },
    { type: 'video',        label: 'Video'  },
];

function BranchBlockList({
                             branchLabel,
                             branchColor,
                             blocks,
                             onAdd,
                             onRemove,
                         }: {
    branchLabel: string;
    branchColor: string;
    blocks: EmailBlock[];
    onAdd: (type: BlockType) => void;
    onRemove: (index: number) => void;
}) {
    const blockLabel = useCallback((b: EmailBlock) => {
        switch (b.type) {
            case 'heading':      return `Heading: ${b.content.slice(0, 20)}`;
            case 'text':         return `Text: ${b.content.replace(/<[^>]*>/g, '').slice(0, 20)}`;
            case 'button':       return `Button: ${b.text.replace(/<[^>]*>/g, '').slice(0, 20)}`;
            case 'image':        return 'Image';
            case 'hero':         return `Hero: ${b.title.slice(0, 20)}`;
            case 'product-card': return `Product: ${b.name.slice(0, 20)}`;
            case 'coupon':       return `Coupon: ${b.code.slice(0, 20)}`;
            case 'survey':       return `Survey: ${b.question.slice(0, 20)}`;
            case 'divider':      return 'Divider';
            case 'spacer':       return `Spacer (${b.height}px)`;
            case 'html':         return 'HTML';
            default:             return (b as EmailBlock).type;
        }
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-semibold" style={{ color: branchColor }}>
                    {branchLabel} Branch
                </Label>
                <Select onValueChange={(v) => onAdd(v as BlockType)}>
                    <SelectTrigger className="h-7 w-[110px] text-xs">
                        <SelectValue placeholder="+ Add block" />
                    </SelectTrigger>
                    <SelectContent>
                        {CHILD_BLOCK_TYPES.map((bt) => (
                            <SelectItem key={bt.type} value={bt.type}>{bt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {blocks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center border border-dashed rounded-md">
                    No blocks yet — add one above
                </p>
            ) : (
                <div className="space-y-1">
                    {blocks.map((b, i) => {
                        const handleRemove = () => onRemove(i);
                        return (
                            <div key={b.id} className="flex items-center justify-between rounded border border-border px-2 py-1.5 text-xs">
                                <span className="truncate">{blockLabel(b)}</span>
                                <button onClick={handleRemove} className="shrink-0 rounded p-1 text-destructive hover:bg-destructive/10 transition-colors">
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function ConditionalProps({ block, onUpdate }: { block: ConditionalBlock; onUpdate: (u: Partial<ConditionalBlock>) => void }) {
    const needsValue = !['is_set', 'is_not_set'].includes(block.operator);

    const addToIf    = useCallback((type: BlockType) => { onUpdate({ ifBlocks:   [...block.ifBlocks,   createDefaultBlock(type)] }); }, [block.ifBlocks,   onUpdate]);
    const removeFromIf   = useCallback((index: number)  => { onUpdate({ ifBlocks:   block.ifBlocks.filter((_, i) => i !== index)  }); }, [block.ifBlocks,   onUpdate]);
    const addToElse  = useCallback((type: BlockType) => { onUpdate({ elseBlocks: [...block.elseBlocks, createDefaultBlock(type)] }); }, [block.elseBlocks, onUpdate]);
    const removeFromElse = useCallback((index: number)  => { onUpdate({ elseBlocks: block.elseBlocks.filter((_, i) => i !== index) }); }, [block.elseBlocks, onUpdate]);

    const handleVariableChange = useCallback((v: string)              => onUpdate({ variable: v }),                           [onUpdate]);
    const handleOperatorChange = useCallback((v: string)              => onUpdate({ operator: v as ConditionalOperator }),    [onUpdate]);
    const handleValueChange    = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ value: e.target.value }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Variable</Label>
                <Select value={block.variable} onValueChange={handleVariableChange}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select variable…" /></SelectTrigger>
                    <SelectContent>
                        {DEFAULT_PERSONALIZATION_VARIABLES.map((v) => (
                            <SelectItem key={v.name} value={v.name}>{v.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Condition</Label>
                <Select value={block.operator} onValueChange={handleOperatorChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {CONDITIONAL_OPERATORS.map((op) => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {needsValue && (
                <div>
                    <Label className="text-xs text-muted-foreground">Value</Label>
                    <Input value={block.value} onChange={handleValueChange} placeholder="Enter comparison value…" className="mt-1" />
                </div>
            )}

            <BranchBlockList branchLabel="IF"   branchColor="#8B5CF6" blocks={block.ifBlocks}   onAdd={addToIf}   onRemove={removeFromIf}   />
            <BranchBlockList branchLabel="ELSE" branchColor="#F97316" blocks={block.elseBlocks} onAdd={addToElse} onRemove={removeFromElse} />
        </div>
    );
}
