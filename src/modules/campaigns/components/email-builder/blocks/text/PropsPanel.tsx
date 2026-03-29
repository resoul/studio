import { useCallback, ChangeEvent } from 'react';
import { TextBlock } from '@/types/email-builder';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface TextPropsProps {
    block: TextBlock;
    onUpdate: (updates: Partial<TextBlock>) => void;
}

export function TextProps({ block, onUpdate }: TextPropsProps) {
    const handleContent = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => onUpdate({ content: e.target.value }),
        [onUpdate],
    );
    const handleFontSize = useCallback((v: number[]) => onUpdate({ fontSize: v[0] }), [onUpdate]);
    const handleColor = useCallback((v: string) => onUpdate({ color: v }), [onUpdate]);
    const handleAlign = useCallback(
        (v: string) => onUpdate({ align: v as TextBlock['align'] }),
        [onUpdate],
    );

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Content</Label>
                <Textarea
                    value={block.content}
                    onChange={handleContent}
                    className="mt-1"
                    rows={4}
                />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">
                    Font Size: {block.fontSize}px
                </Label>
                <Slider
                    value={[block.fontSize]}
                    onValueChange={handleFontSize}
                    min={10}
                    max={36}
                    step={1}
                    className="mt-2"
                />
            </div>

            <ColorInput label="Color" value={block.color} onChange={handleColor} />
            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}