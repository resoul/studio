import { useCallback, useState } from 'react';
import { Search, ExternalLink, Loader2, ImageIcon, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { type StockImage } from '@/config/stock-images';
import { useStockImageSearch } from '@/hooks/useStockImageSearch';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ImageCard({
                       image,
                       onSelect,
                   }: {
    image: StockImage;
    onSelect: (image: StockImage) => void;
}) {
    const handleClick = useCallback(() => onSelect(image), [image, onSelect]);

    return (
        <button
            onClick={handleClick}
            className="group relative overflow-hidden rounded-md border border-border bg-secondary aspect-video focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all hover:border-primary hover:shadow-md"
            title={image.alt}
        >
            <img
                src={image.thumbUrl}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
            />
            {/* Photographer attribution overlay */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="truncate text-[10px] text-white/90 leading-tight">
                    {image.photographerName}
                </span>
                <a
                    href={image.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-white/70 hover:text-white transition-colors"
                >
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </button>
    );
}

function NoApiKeyBanner() {
    return (
        <div className="flex items-start gap-3 rounded-md border border-border bg-secondary/50 p-3 mb-3">
            <Key className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">Add Unsplash API key for search.</span>
                {' '}Set{' '}
                <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[10px]">
                    VITE_UNSPLASH_ACCESS_KEY
                </code>
                {' '}in your <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[10px]">.env</code> file.{' '}
                <a
                    href="https://unsplash.com/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                >
                    Get a free key ↗
                </a>
                . Showing curated library below.
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main picker (embeddable)
// ---------------------------------------------------------------------------

interface StockImagePickerProps {
    onSelect: (url: string, alt: string) => void;
    className?: string;
}

export function StockImagePicker({ onSelect, className = '' }: StockImagePickerProps) {
    const [query, setQuery] = useState('');
    const { images, isLoading, error, hasApiKey, trackDownload } = useStockImageSearch(query);

    const handleSelect = useCallback(
        (image: StockImage) => {
            trackDownload(image);
            onSelect(image.url, image.alt);
        },
        [onSelect, trackDownload],
    );

    const handleQueryChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
        [],
    );

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {!hasApiKey && <NoApiKeyBanner />}

            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Search photos…"
                    className="pl-8 h-8 text-sm"
                />
                {isLoading && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
                )}
            </div>

            {error && (
                <p className="text-xs text-destructive px-1">{error}</p>
            )}

            <div className="overflow-y-auto max-h-[420px] pr-0.5">
                {images.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                        <ImageIcon className="h-8 w-8" />
                        <p className="text-sm">No photos found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((img) => (
                            <ImageCard key={img.id} image={img} onSelect={handleSelect} />
                        ))}
                    </div>
                )}
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
                Photos from{' '}
                <a
                    href="https://unsplash.com?utm_source=email_builder&utm_medium=referral"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                    Unsplash
                </a>
            </p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------

interface StockImagePickerModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (url: string, alt: string) => void;
}

export function StockImagePickerModal({
                                          open,
                                          onOpenChange,
                                          onSelect,
                                      }: StockImagePickerModalProps) {
    const handleSelect = useCallback(
        (url: string, alt: string) => {
            onSelect(url, alt);
            onOpenChange(false);
        },
        [onSelect, onOpenChange],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-primary" />
                        Browse Free Stock Photos
                    </DialogTitle>
                    <DialogDescription>
                        Millions of free photos from Unsplash. Click to insert.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <StockImagePicker onSelect={handleSelect} />
                </div>
            </DialogContent>
        </Dialog>
    );
}