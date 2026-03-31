import type { MediaFile } from '@/types/storage';

export function uid(): string {
    return `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function fmtSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function fmtDims(w: number, h: number): string {
    return `${w} × ${h}`;
}

export function totalStorageUsed(files: MediaFile[]): number {
    return files.reduce((s, f) => s + f.size, 0);
}