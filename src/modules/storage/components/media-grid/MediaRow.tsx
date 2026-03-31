import { useState } from 'react';
import { CheckSquare, Eye, Globe, ImageOff, Link2, Square, Star, Trash2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fmtDims, fmtSize } from '@/utils/storage';
import type { MediaFile } from '@/types/storage';

interface MediaRowProps {
    file: MediaFile;
    selected: boolean;
    onSelect: (id: string) => void;
    onToggleStar: (id: string) => void;
    onDelete: (file: MediaFile) => void;
    onCopyUrl: (url: string, name: string) => void;
    onPreview: (file: MediaFile) => void;
    onShowUsage: (file: MediaFile) => void;
}

export function MediaRow({ file, selected, onSelect, onToggleStar, onDelete, onCopyUrl, onPreview, onShowUsage }: MediaRowProps) {
    const [imgError, setImgError] = useState(false);

    return (
        <div
            className={cn(
                'group flex items-center gap-4 rounded-xl border-2 bg-card px-4 py-3 transition-all cursor-pointer',
                selected ? 'border-primary/50 bg-primary/5' : 'border-transparent hover:border-border hover:bg-secondary/20',
            )}
            onClick={() => onSelect(file.id)}
        >
            {/* Checkbox */}
            <button
                onClick={(e) => { e.stopPropagation(); onSelect(file.id); }}
                className="shrink-0"
            >
                {selected
                    ? <CheckSquare className="h-4 w-4 text-primary" />
                    : <Square className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>

            {/* Thumb */}
            <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                {!imgError ? (
                    <img
                        src={file.thumbUrl}
                        alt={file.alt}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <ImageOff className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                )}
            </div>

            {/* Name + tags */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    {file.starred && <Star className="h-3 w-3 shrink-0 text-amber-400 fill-amber-400" />}
                    {file.source !== 'upload' && (
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            <Globe className="h-2.5 w-2.5" />{file.source}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {file.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-block rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Dims */}
            <div className="hidden md:block text-right shrink-0 w-28">
                <p className="text-xs text-foreground tabular-nums">{fmtDims(file.width, file.height)}</p>
                <p className="text-[10px] text-muted-foreground">{file.type.toUpperCase()}</p>
            </div>

            {/* Size */}
            <div className="hidden sm:block text-right shrink-0 w-20">
                <p className="text-xs font-medium text-foreground tabular-nums">{fmtSize(file.size)}</p>
            </div>

            {/* Usage — clickable */}
            <div className="hidden lg:block text-right shrink-0 w-24">
                {file.usageCount > 0 ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShowUsage(file); }}
                        className="flex items-center justify-end gap-1 text-xs text-primary hover:text-primary/80 transition-colors w-full"
                    >
                        <Zap className="h-3 w-3" />{file.usageCount}x used
                    </button>
                ) : (
                    <p className="text-xs text-muted-foreground/50">—</p>
                )}
            </div>

            {/* Date */}
            <div className="hidden xl:block text-right shrink-0 w-24">
                <p className="text-xs text-muted-foreground">{file.createdAt}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onPreview(file); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Eye className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onCopyUrl(file.url, file.name); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Link2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Star className={cn('h-3.5 w-3.5', file.starred && 'text-amber-400 fill-amber-400')} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(file); }} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}