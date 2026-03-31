import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Info, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MediaFile } from '@/types/storage';
import { uid } from '@/utils/storage';

// ─── Upload Panel ─────────────────────────────────────────────────────────────

interface UploadPanelProps {
    folderId: string | null;
    onUpload: (files: MediaFile[]) => void;
}

export function UploadPanel({ folderId, onUpload }: UploadPanelProps) {
    return (
        <div className="space-y-4">
            <UploadZone folderId={folderId} onUpload={onUpload} />
            <div className="rounded-lg border border-border bg-secondary/10 px-4 py-3 space-y-1.5">
                <p className="text-xs font-semibold text-foreground">Upload tips</p>
                {[
                    'Use descriptive file names for easier search.',
                    'Images are stored as-is — optimize before upload.',
                    'WebP format gives the best compression for email.',
                ].map(tip => (
                    <p key={tip} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Info className="h-3 w-3 shrink-0 mt-0.5 text-primary/60" />{tip}
                    </p>
                ))}
            </div>
        </div>
    );
}

function UploadZone({ folderId, onUpload }: UploadPanelProps) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFiles = useCallback((rawFiles: File[]) => {
        const imageFiles = rawFiles.filter(f => f.type.startsWith('image/'));
        const now = new Date().toISOString().slice(0, 10);
        const mediaFiles: MediaFile[] = imageFiles.map(f => ({
            id: uid(),
            folderId,
            name: f.name,
            url: URL.createObjectURL(f),
            thumbUrl: URL.createObjectURL(f),
            type: 'image',
            size: f.size,
            width: 1200,
            height: 800,
            alt: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
            tags: [],
            starred: false,
            usageCount: 0,
            source: 'upload',
            createdAt: now,
        }));
        onUpload(mediaFiles);
    }, [folderId, onUpload]);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        processFiles(Array.from(e.dataTransfer.files));
    }, [processFiles]);

    const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) processFiles(Array.from(e.target.files));
        e.target.value = '';
    }, [processFiles]);

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={cn(
                'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10',
                dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/30',
            )}
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                    {dragging ? 'Drop files here' : 'Drop images here or click to browse'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, SVG, WebP · Max 10 MB</p>
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInput} />
        </div>
    );
}
