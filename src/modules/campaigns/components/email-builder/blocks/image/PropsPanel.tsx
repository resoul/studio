import { useCallback, useState, ChangeEvent } from 'react';
import { ImageBlock } from '@/types/email-builder';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, ImageIcon } from 'lucide-react';
import { AlignSelect } from '@/modules/campaigns/components/email-builder/properties-panel/shared';
import { ImageEditorModal } from '@/modules/campaigns/components/email-builder/ImageEditorModal';
import { StockImagePickerModal } from '@/modules/campaigns/components/email-builder/StockImagePicker';

interface ImagePropsProps {
    block: ImageBlock;
    onUpdate: (updates: Partial<ImageBlock>) => void;
}

export function ImageProps({ block, onUpdate }: ImagePropsProps) {
    const [editorOpen, setEditorOpen] = useState(false);
    const [stockOpen, setStockOpen]   = useState(false);

    const handleSrc    = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ src: e.target.value }), [onUpdate]);
    const handleHref   = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ href: e.target.value }), [onUpdate]);
    const handleAlt    = useCallback((e: ChangeEvent<HTMLInputElement>) => onUpdate({ alt: e.target.value }), [onUpdate]);
    const handleWidth  = useCallback((v: number[]) => onUpdate({ width: v[0] }), [onUpdate]);
    const handleAlign  = useCallback((v: string) => onUpdate({ align: v as ImageBlock['align'] }), [onUpdate]);
    const handleSave   = useCallback((src: string) => onUpdate({ src }), [onUpdate]);
    const handleStock  = useCallback(
        (url: string, alt: string) => onUpdate({ src: url, alt: alt || block.alt }),
        [block.alt, onUpdate],
    );
    const openEditor = useCallback(() => setEditorOpen(true), []);
    const openStock  = useCallback(() => setStockOpen(true), []);

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-xs text-muted-foreground">Image URL</Label>
                <div className="flex gap-2 mt-1">
                    <Input value={block.src} onChange={handleSrc} className="flex-1" />
                    <Button variant="secondary" size="icon" onClick={openEditor} title="Edit Image & AI Magic" className="shrink-0">
                        <Sparkles className="h-4 w-4 text-accent" />
                    </Button>
                </div>
                <Button variant="outline" size="sm" onClick={openStock} className="w-full mt-2 text-xs gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Browse Free Stock Photos
                </Button>
            </div>

            <StockImagePickerModal open={stockOpen} onOpenChange={setStockOpen} onSelect={handleStock} />
            <ImageEditorModal open={editorOpen} onOpenChange={setEditorOpen} currentSrc={block.src} onSave={handleSave} />

            <div>
                <Label className="text-xs text-muted-foreground">Link (Optional)</Label>
                <Input value={block.href || ''} onChange={handleHref} className="mt-1" placeholder="https://" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Alt Text</Label>
                <Input value={block.alt} onChange={handleAlt} className="mt-1" />
            </div>

            <div>
                <Label className="text-xs text-muted-foreground">Width: {block.width}%</Label>
                <Slider
                    value={[block.width]}
                    onValueChange={handleWidth}
                    min={10}
                    max={100}
                    step={5}
                    className="mt-2"
                />
            </div>

            <AlignSelect value={block.align} onChange={handleAlign} />
        </div>
    );
}