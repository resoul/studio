import { useCallback, useState, ChangeEvent } from 'react';
import { HeroBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ImageIcon } from 'lucide-react';
import { AlignSelect, ColorInput } from '@/modules/campaigns/components/email-builder/properties-panel/shared';
import { ImageEditorModal } from '@/modules/campaigns/components/email-builder/ImageEditorModal';
import { StockImagePickerModal } from '@/modules/campaigns/components/email-builder/StockImagePicker';

interface HeroPropsProps {
    block: HeroBlock;
    onUpdate: (updates: Partial<HeroBlock>) => void;
}

export function HeroProps({ block, onUpdate }: HeroPropsProps) {
    const [editorOpen, setEditorOpen] = useState(false);
    const [stockOpen, setStockOpen]   = useState(false);

    const handleImageUrl    = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ imageUrl: e.target.value }), [onUpdate]);
    const handleImageAlt    = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ imageAlt: e.target.value }), [onUpdate]);
    const handleTitle       = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ title: e.target.value }), [onUpdate]);
    const handleDescription = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => onUpdate({ description: e.target.value }), [onUpdate]);
    const handleButtonText  = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ buttonText: e.target.value }), [onUpdate]);
    const handleButtonUrl   = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ buttonUrl: e.target.value }), [onUpdate]);
    const handleTitleColor      = useCallback((v: string) => onUpdate({ titleColor: v }), [onUpdate]);
    const handleTextColor       = useCallback((v: string) => onUpdate({ textColor: v }), [onUpdate]);
    const handleButtonBgColor   = useCallback((v: string) => onUpdate({ buttonBgColor: v }), [onUpdate]);
    const handleButtonTextColor = useCallback((v: string) => onUpdate({ buttonTextColor: v }), [onUpdate]);
    const handleAlign           = useCallback((v: string) => onUpdate({ align: v as HeroBlock['align'] }), [onUpdate]);
    const handleSave            = useCallback((src: string) => onUpdate({ imageUrl: src }), [onUpdate]);
    const handleStock           = useCallback((url: string) => onUpdate({ imageUrl: url }), [onUpdate]);
    const openEditor = useCallback(() => setEditorOpen(true), []);
    const openStock  = useCallback(() => setStockOpen(true), []);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Image URL</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={block.imageUrl} onChange={handleImageUrl} className="flex-1" />
                    <Button variant="secondary" size="icon" onClick={openEditor} title="Edit Image" className="shrink-0">
                        <Sparkles className="h-4 w-4 text-accent" />
                    </Button>
                </div>
                <Button variant="outline" size="sm" onClick={openStock} className="w-full mt-2 text-xs gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Browse Free Stock Photos
                </Button>
            </div>

            <StockImagePickerModal open={stockOpen} onOpenChange={setStockOpen} onSelect={handleStock} />
            <ImageEditorModal open={editorOpen} onOpenChange={setEditorOpen} currentSrc={block.imageUrl} onSave={handleSave} />

            <div>
                <Label className="text-xs text-muted-foreground">Image Alt</Label>
                <Input value={block.imageAlt} onChange={handleImageAlt} className="mt-1" />
            </div>
            <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <Input value={block.title} onChange={handleTitle} className="mt-1" />
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

            <ColorInput label="Title Color"        value={block.titleColor}       onChange={handleTitleColor} />
            <ColorInput label="Text Color"         value={block.textColor}        onChange={handleTextColor} />
            <ColorInput label="Button Background"  value={block.buttonBgColor}    onChange={handleButtonBgColor} />
            <ColorInput label="Button Text Color"  value={block.buttonTextColor}  onChange={handleButtonTextColor} />
            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}