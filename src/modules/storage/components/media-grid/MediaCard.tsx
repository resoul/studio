import { useState } from 'react';
import {
    Check, Download, Eye, Globe, ImageOff, Link2, MoreHorizontal,
    Star, StarOff, Trash2, Zap,
} from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { fmtDims, fmtSize } from '@/utils/storage';
import type { MediaFile } from '@/types/storage';

interface MediaCardProps {
    file: MediaFile;
    selected: boolean;
    onSelect: (id: string) => void;
    onToggleStar: (id: string) => void;
    onDelete: (file: MediaFile) => void;
    onCopyUrl: (url: string, name: string) => void;
    onPreview: (file: MediaFile) => void;
    onShowUsage: (file: MediaFile) => void;
}

export function MediaCard({ file, selected, onSelect, onToggleStar, onDelete, onCopyUrl, onPreview, onShowUsage }: MediaCardProps) {
    const [imgError, setImgError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={cn(
                'group relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                selected ? 'border-primary shadow-md shadow-primary/20' : 'border-transparent hover:border-border',
            )}
            onClick={() => onSelect(file.id)}
        >
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                {!imgError ? (
                    <>
                        {!loaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            </div>
                        )}
                        <img
                            src={file.thumbUrl}
                            alt={file.alt}
                            className={cn(
                                'w-full h-full object-cover transition-all duration-300 group-hover:scale-105',
                                loaded ? 'opacity-100' : 'opacity-0',
                            )}
                            onLoad={() => setLoaded(true)}
                            onError={() => setImgError(true)}
                        />
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground">Failed to load</span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPreview(file); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onCopyUrl(file.url, file.name); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white transition-colors shadow-sm"
                    >
                        <Link2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Selection checkbox */}
                <div className={cn(
                    'absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded transition-opacity',
                    selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                )}>
                    {selected ? (
                        <div className="h-5 w-5 rounded bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                        </div>
                    ) : (
                        <div className="h-5 w-5 rounded border-2 border-white bg-black/30" />
                    )}
                </div>

                {/* Star */}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleStar(file.id); }}
                    className={cn(
                        'absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full transition-all',
                        file.starred ? 'opacity-100 bg-amber-400/90' : 'opacity-0 group-hover:opacity-100 bg-black/30',
                    )}
                >
                    <Star className={cn('h-3 w-3', file.starred ? 'text-white fill-white' : 'text-white')} />
                </button>

                {/* Source badge */}
                {file.source !== 'upload' && (
                    <div className="absolute bottom-2 left-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] text-white font-medium">
                            <Globe className="h-2.5 w-2.5" />
                            {file.source}
                        </span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-card px-3 py-2.5 border-t border-border">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {fmtSize(file.size)} · {fmtDims(file.width, file.height)}
                        </p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => onPreview(file)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCopyUrl(file.url, file.name)}>
                                <Link2 className="h-3.5 w-3.5 mr-2" />Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href={file.url} download={file.name} onClick={(e) => e.stopPropagation()}>
                                    <Download className="h-3.5 w-3.5 mr-2" />Download
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onToggleStar(file.id)}>
                                {file.starred
                                    ? <><StarOff className="h-3.5 w-3.5 mr-2" />Unstar</>
                                    : <><Star className="h-3.5 w-3.5 mr-2" />Star</>}
                            </DropdownMenuItem>
                            {file.usageCount > 0 && (
                                <DropdownMenuItem onClick={() => onShowUsage(file)}>
                                    <Zap className="h-3.5 w-3.5 mr-2" />View usage
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(file)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {file.usageCount > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShowUsage(file); }}
                        className="mt-1 flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                    >
                        <Zap className="h-2.5 w-2.5" />
                        Used in {file.usageCount} email{file.usageCount !== 1 ? 's' : ''}
                    </button>
                )}
            </div>
        </div>
    );
}