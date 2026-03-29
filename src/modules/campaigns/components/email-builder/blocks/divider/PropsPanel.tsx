import { useCallback } from 'react';
import { DividerBlock } from '@/types/email-builder';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface DividerPropsProps {
    block: DividerBlock;
    onUpdate: (updates: Partial<DividerBlock>) => void;
}

export function DividerProps({ block, onUpdate }: DividerPropsProps) {
    const handleColor     = useCallback((v: string) => onUpdate({ color: v }), [onUpdate]);
    const handleThickness = useCallback((v: number[]) => onUpdate({ thickness: v[0] }), [onUpdate]);
    const handleStyle     = useCallback(
        (v: string) => onUpdate({ style: v as DividerBlock['style'] }),
        [onUpdate],
    );

    return (
        <div className="space-y-4">
            <ColorInput label="Color" value={block.color} onChange={handleColor} />

            <div>
                <Label className="text-xs text-muted-foreground">
                    Thickness: {block.thickness}px
                </Label>
                <Slider
                    value={[block.thickness]}
                    onValueChange={handleThickness}
                    min={1}
                    max={6}
                    step={1}
                    className="mt-2"
                />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Style</Label>
                <Select value={block.style} onValueChange={handleStyle}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}