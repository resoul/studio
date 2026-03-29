import { useCallback } from 'react';
import { SpacerBlock } from '@/types/email-builder';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SpacerPropsProps {
    block: SpacerBlock;
    onUpdate: (updates: Partial<SpacerBlock>) => void;
}

export function SpacerProps({ block, onUpdate }: SpacerPropsProps) {
    const handleHeight = useCallback((v: number[]) => onUpdate({ height: v[0] }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Height: {block.height}px</Label>
                <Slider
                    value={[block.height]}
                    onValueChange={handleHeight}
                    min={8}
                    max={120}
                    step={4}
                    className="mt-2"
                />
            </div>
        </div>
    );
}