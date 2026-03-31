import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fmtSize } from '@/utils/storage';
import type { MediaFile } from '@/types/storage';

interface DeleteConfirmModalProps {
    file: MediaFile | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmModal({ file, onConfirm, onCancel }: DeleteConfirmModalProps) {
    if (!file) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-xl border border-border shadow-2xl p-6 max-w-sm w-full mx-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Delete file?</h3>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 mb-3">
                    <div className="h-10 w-14 rounded-md overflow-hidden bg-secondary shrink-0">
                        <img src={file.thumbUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{fmtSize(file.size)}</p>
                    </div>
                </div>
                {file.usageCount > 0 && (
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 mb-3">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                            This image is used in {file.usageCount} email{file.usageCount !== 1 ? 's' : ''}. Deleting it will break those emails.
                        </p>
                    </div>
                )}
                <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={onConfirm}>Delete</Button>
                </div>
            </div>
        </div>
    );
}