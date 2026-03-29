import { useCallback, ChangeEvent } from 'react';
import { CouponBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';

interface CouponPropsProps {
    block: CouponBlock;
    onUpdate: (updates: Partial<CouponBlock>) => void;
}

export function CouponProps({ block, onUpdate }: CouponPropsProps) {
    const handleTitle       = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ title: e.target.value }), [onUpdate]);
    const handleCode        = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ code: e.target.value.toUpperCase() }), [onUpdate]);
    const handleDescription = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => onUpdate({ description: e.target.value }), [onUpdate]);
    const handleButtonText  = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ buttonText: e.target.value }), [onUpdate]);
    const handleButtonUrl   = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ buttonUrl: e.target.value }), [onUpdate]);
    const handleBgColor       = useCallback((v: string) => onUpdate({ bgColor: v }), [onUpdate]);
    const handleBorderColor   = useCallback((v: string) => onUpdate({ borderColor: v }), [onUpdate]);
    const handleTitleColor    = useCallback((v: string) => onUpdate({ titleColor: v }), [onUpdate]);
    const handleTextColor     = useCallback((v: string) => onUpdate({ textColor: v }), [onUpdate]);
    const handleCodeBgColor   = useCallback((v: string) => onUpdate({ codeBgColor: v }), [onUpdate]);
    const handleCodeTextColor = useCallback((v: string) => onUpdate({ codeTextColor: v }), [onUpdate]);
    const handleAlign         = useCallback((v: string) => onUpdate({ align: v as CouponBlock['align'] }), [onUpdate]);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={block.title} onChange={handleTitle} className="mt-1" />
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Coupon Code</Label>
                <Input value={block.code} onChange={handleCode} className="mt-1 font-mono tracking-wider" />
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea value={block.description} onChange={handleDescription} className="mt-1" rows={3} />
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Button Text</Label>
                <Input value={block.buttonText} onChange={handleButtonText} className="mt-1" />
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Button URL</Label>
                <Input value={block.buttonUrl} onChange={handleButtonUrl} className="mt-1" placeholder="https://" />
            </div>

            <ColorInput label="Background"      value={block.bgColor}       onChange={handleBgColor} />
            <ColorInput label="Border"          value={block.borderColor}   onChange={handleBorderColor} />
            <ColorInput label="Title Color"     value={block.titleColor}    onChange={handleTitleColor} />
            <ColorInput label="Text Color"      value={block.textColor}     onChange={handleTextColor} />
            <ColorInput label="Code Background" value={block.codeBgColor}   onChange={handleCodeBgColor} />
            <ColorInput label="Code Text Color" value={block.codeTextColor} onChange={handleCodeTextColor} />
            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}