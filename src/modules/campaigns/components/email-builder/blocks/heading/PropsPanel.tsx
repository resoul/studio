import { useCallback, ChangeEvent } from 'react';
import { HeadingBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface HeadingPropsProps {
    block: HeadingBlock;
    onUpdate: (updates: Partial<HeadingBlock>) => void;
}

export function HeadingProps({ block, onUpdate }: HeadingPropsProps) {
    const handleContent = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => onUpdate({ content: e.target.value }),
        [onUpdate],
    );
    const handleLevel = useCallback(
        (v: string) => onUpdate({ level: v as HeadingBlock['level'] }),
        [onUpdate],
    );
    const handleColor = useCallback((v: string) => onUpdate({ color: v }), [onUpdate]);
    const handleAlign = useCallback(
        (v: string) => onUpdate({ align: v as HeadingBlock['align'] }),
        [onUpdate],
    );

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Content</Label>
                <Input value={block.content} onChange={handleContent} className="mt-1" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Level</Label>
                <Select value={block.level} onValueChange={handleLevel}>
                    <SelectTrigger className="mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="h1">H1 — Large</SelectItem>
                        <SelectItem value="h2">H2 — Medium</SelectItem>
                        <SelectItem value="h3">H3 — Small</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <ColorInput label="Color" value={block.color} onChange={handleColor} />
            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}