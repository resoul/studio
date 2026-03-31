import { Check, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyFilesProps {
    query: string;
    onUpload: () => void;
}

export function EmptyFiles({ query, onUpload }: EmptyFilesProps) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="rounded-full bg-secondary p-5 mb-4">
                <Image className="h-10 w-10 text-muted-foreground" />
            </div>
            {query ? (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No files found</p>
                    <p className="text-xs text-muted-foreground">No files match <span className="font-mono">"{query}"</span></p>
                </>
            ) : (
                <>
                    <p className="text-sm font-semibold text-foreground mb-1">No files here yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Upload images to start building your media library.</p>
                    <Button size="sm" onClick={onUpload}>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />Upload files
                    </Button>
                </>
            )}
        </div>
    );
}

interface CopyToastProps {
    name: string | null;
}

export function CopyToast({ name }: CopyToastProps) {
    if (!name) return null;
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 shadow-lg text-sm font-medium">
            <Check className="h-4 w-4 text-emerald-400" />
            URL copied — <span className="font-mono text-xs opacity-70">{name}</span>
        </div>
    );
}