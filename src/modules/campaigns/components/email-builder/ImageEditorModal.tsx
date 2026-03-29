import { useState, useRef, useEffect, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Crop as CropIcon, SlidersHorizontal, Loader2, Eraser, MoveDiagonal, ImageIcon } from 'lucide-react';
import { uploadImage } from '@/config/image-storage';
import { mockRemoveBackground, mockAIUpscale } from '@/utils/aiImageMock';
import { StockImagePicker } from './StockImagePicker';

interface ImageEditorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentSrc: string;
    onSave: (newSrc: string) => void;
}

type TabMode = 'crop' | 'adjust' | 'ai' | 'stock';

export function ImageEditorModal({ open, onOpenChange, currentSrc, onSave }: ImageEditorModalProps) {
    const [mode, setMode] = useState<TabMode>('crop');
    const [imageSrc, setImageSrc] = useState(currentSrc);

    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (open) {
            setImageSrc(currentSrc);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
            setBlur(0);
            setMode('crop');
        }
    }, [open, currentSrc]);

    const handleAITool = async (tool: 'remove-bg' | 'upscale') => {
        setIsProcessing(true);
        try {
            const result = tool === 'remove-bg'
                ? await mockRemoveBackground(imageSrc)
                : await mockAIUpscale(imageSrc);
            setImageSrc(result);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
            setBlur(0);
        } catch (error) {
            console.error('AI Processing error', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleStockSelect = useCallback((url: string) => {
        setImageSrc(url);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        // Switch to crop tab after selecting so user can crop if needed
        setMode('crop');
    }, []);

    const handleSave = async () => {
        if (!imgRef.current) return;
        setIsProcessing(true);

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('No 2d context');

            const sourceImage = imgRef.current;
            const targetCrop = completedCrop || {
                x: 0, y: 0,
                width: sourceImage.naturalWidth,
                height: sourceImage.naturalHeight,
                unit: 'px',
            };

            const scaleX = sourceImage.naturalWidth  / sourceImage.width;
            const scaleY = sourceImage.naturalHeight / sourceImage.height;

            canvas.width  = targetCrop.width  * scaleX;
            canvas.height = targetCrop.height * scaleY;

            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;

            ctx.drawImage(
                sourceImage,
                targetCrop.x * scaleX, targetCrop.y * scaleY,
                targetCrop.width  * scaleX, targetCrop.height * scaleY,
                0, 0,
                targetCrop.width  * scaleX, targetCrop.height * scaleY,
            );

            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Canvas is empty');

            const uploadedUrl = await uploadImage(blob);
            onSave(uploadedUrl);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to save edited image', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const currentFilterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isProcessing) onOpenChange(v); }}>
            <DialogContent className="sm:max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden bg-background border-border">
                <DialogHeader className="px-6 py-4 border-b border-border bg-card">
                    <DialogTitle>Image Editor</DialogTitle>
                    <DialogDescription className="sr-only">Edit your image using crop, filters, AI, or browse stock photos.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-72 border-r border-border bg-card overflow-y-auto flex flex-col">
                        <div className="p-2 border-b border-border flex gap-1 flex-wrap">
                            <ToolbarTab active={mode === 'crop'}   onClick={() => setMode('crop')}   icon={<CropIcon className="h-4 w-4" />}         label="Crop"    />
                            <ToolbarTab active={mode === 'adjust'} onClick={() => setMode('adjust')} icon={<SlidersHorizontal className="h-4 w-4" />} label="Adjust"  />
                            <ToolbarTab active={mode === 'ai'}     onClick={() => setMode('ai')}     icon={<Sparkles className="h-4 w-4" />}          label="AI"      />
                            <ToolbarTab active={mode === 'stock'}  onClick={() => setMode('stock')}  icon={<ImageIcon className="h-4 w-4" />}         label="Stock"   />
                        </div>

                        <div className={`flex-1 ${mode === 'stock' ? 'p-2' : 'p-4'}`}>
                            {mode === 'crop' && (
                                <div className="space-y-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Crop Overlay</p>
                                    <p className="text-xs text-muted-foreground">Drag on the image to select a cropping area.</p>
                                    {completedCrop && (
                                        <div className="pt-4 space-y-2 border-t border-border mt-4">
                                            <p className="text-xs font-medium">Selected Size:</p>
                                            <p className="text-xs font-mono bg-secondary px-2 py-1 rounded inline-block">
                                                {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                                            </p>
                                            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => { setCrop(undefined); setCompletedCrop(undefined); }}>
                                                Clear Crop
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {mode === 'adjust' && (
                                <div className="space-y-6">
                                    <SliderControl label="Brightness" value={brightness} min={0} max={200} step={1} onChange={setBrightness} suffix="%" />
                                    <SliderControl label="Contrast"   value={contrast}   min={0} max={200} step={1} onChange={setContrast}   suffix="%" />
                                    <SliderControl label="Saturation" value={saturation} min={0} max={200} step={1} onChange={setSaturation} suffix="%" />
                                    <SliderControl label="Blur"       value={blur}       min={0} max={20}  step={1} onChange={setBlur}       suffix="px" />
                                    <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); }}>
                                        Reset Adjustments
                                    </Button>
                                </div>
                            )}

                            {mode === 'ai' && (
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" disabled={isProcessing} onClick={() => handleAITool('remove-bg')}>
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Eraser className="h-4 w-4 text-primary" />
                                                Remove Background
                                            </div>
                                            <span className="text-xs text-muted-foreground font-normal">Extract subject and make background transparent</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-auto py-3 px-4" disabled={isProcessing} onClick={() => handleAITool('upscale')}>
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="flex items-center gap-2 font-medium">
                                                <MoveDiagonal className="h-4 w-4 text-accent" />
                                                AI Upscale
                                            </div>
                                            <span className="text-xs text-muted-foreground font-normal">Enhance resolution and details</span>
                                        </div>
                                    </Button>
                                </div>
                            )}

                            {mode === 'stock' && (
                                <StockImagePicker onSelect={handleStockSelect} />
                            )}
                        </div>
                    </div>

                    {/* Canvas — hidden when in stock mode since picker is the main UI */}
                    {mode !== 'stock' && (
                        <div className="flex-1 bg-secondary/50 relative overflow-hidden flex items-center justify-center p-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlZWVlZWUiPjwvcmVjdD4KPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2VlZWVlZSI+PC9yZWN0Pgo8L3N2Zz4=')] bg-repeat">
                            {isProcessing && (
                                <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-2 bg-card p-4 rounded-lg border border-border shadow-xl">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        <p className="text-sm font-medium">Processing...</p>
                                    </div>
                                </div>
                            )}

                            <div className="max-w-full max-h-full overflow-auto inline-block border border-border/50 shadow-md">
                                {mode === 'crop' ? (
                                    <ReactCrop crop={crop} onChange={(_, p) => setCrop(p)} onComplete={(c) => setCompletedCrop(c)}>
                                        <img ref={imgRef} src={imageSrc} alt="Edit preview" className="max-w-full block" style={currentFilterStyle} crossOrigin="anonymous" />
                                    </ReactCrop>
                                ) : (
                                    <img ref={imgRef} src={imageSrc} alt="Edit preview" className="max-w-full block" style={currentFilterStyle} crossOrigin="anonymous" />
                                )}
                            </div>
                        </div>
                    )}

                    {/* When in stock mode, show a preview of the selected image on the right */}
                    {mode === 'stock' && imageSrc && (
                        <div className="flex-1 bg-secondary/50 flex items-center justify-center p-8">
                            <div className="max-w-full max-h-full overflow-auto inline-block border border-border/50 shadow-md rounded-md">
                                <img src={imageSrc} alt="Preview" className="max-w-full block max-h-[400px] object-contain" />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t border-border bg-card">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isProcessing || mode === 'stock'}>
                        {isProcessing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {mode === 'stock' ? 'Select image to apply' : 'Apply & Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ToolbarTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-md text-xs font-medium transition-colors min-w-[52px] ${
                active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
        >
            {icon}
            {label}
        </button>
    );
}

function SliderControl({ label, value, min, max, step, onChange, suffix = '' }: {
    label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-medium">{label}</label>
                <span className="text-xs text-muted-foreground font-mono">{value}{suffix}</span>
            </div>
            <input
                type="range"
                className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
                min={min} max={max} step={step} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}
