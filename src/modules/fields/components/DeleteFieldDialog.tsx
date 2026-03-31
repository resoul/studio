import { useCallback } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { CustomField } from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';
import { AlertTriangle } from 'lucide-react';

interface DeleteFieldDialogProps {
    field:     CustomField | null;
    onClose:   () => void;
    onConfirm: (id: string) => void;
}

export function DeleteFieldDialog({ field, onClose, onConfirm }: DeleteFieldDialogProps) {
    const handleConfirm = useCallback(() => {
        if (field) onConfirm(field.id);
    }, [field, onConfirm]);

    const hasUsage = (field?.usageCount ?? 0) > 0;

    return (
        <AlertDialog open={!!field} onOpenChange={(v) => !v && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete field?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3">
                            {field && (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                                    <FieldTypeIcon type={field.type} size="sm" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{field.label}</p>
                                        <p className="text-xs font-mono text-muted-foreground">{field.key}</p>
                                    </div>
                                </div>
                            )}

                            {/* Usage warning */}
                            {hasUsage && (
                                <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-3 py-2.5">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                            This field is in use
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                                            Used by <strong>{field?.usageCount}</strong> record{(field?.usageCount ?? 0) !== 1 ? 's' : ''}.
                                            Deleting it will remove all stored values permanently.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <p className="text-sm text-muted-foreground">
                                This will permanently remove the field and all its data.
                                This action cannot be undone.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {hasUsage ? 'Delete anyway' : 'Delete field'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}