import { useCallback, ChangeEvent } from 'react';
import { ButtonBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface ButtonPropsProps {
    block: ButtonBlock;
    onUpdate: (updates: Partial<ButtonBlock>) => void;
}

export function ButtonProps({ block, onUpdate }: ButtonPropsProps) {
    const handleText         = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ text: e.target.value }), [onUpdate]);
    const handleUrl          = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ url: e.target.value }), [onUpdate]);
    const handleBgColor      = useCallback((v: string) => onUpdate({ bgColor: v }), [onUpdate]);
    const handleTextColor    = useCallback((v: string) => onUpdate({ textColor: v }), [onUpdate]);
    const handleBorderRadius = useCallback((v: number[]) => onUpdate({ borderRadius: v[0] }), [onUpdate]);
    const handleAlign        = useCallback((v: string) => onUpdate({ align: v as ButtonBlock['align'] }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Button Text</Label>
                <Input value={block.text} onChange={handleText} className="mt-1" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">URL</Label>
                <Input value={block.url} onChange={handleUrl} className="mt-1" placeholder="https://" />
            </div>

            <ColorInput label="Background"  value={block.bgColor}    onChange={handleBgColor} />
            <ColorInput label="Text Color"  value={block.textColor}  onChange={handleTextColor} />

            <div>
                <Label className="text-xs text-muted-foreground">
                    Border Radius: {block.borderRadius}px
                </Label>
                <Slider
                    value={[block.borderRadius]}
                    onValueChange={handleBorderRadius}
                    min={0}
                    max={32}
                    step={1}
                    className="mt-2"
                />
            </div>

            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}