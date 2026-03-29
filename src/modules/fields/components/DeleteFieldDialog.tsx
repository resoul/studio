import { useCallback } from 'react';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader,
    AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { CustomField } from '@/types/fields';
import { FieldTypeIcon } from './FieldTypeIcon';

interface DeleteFieldDialogProps {
    field: CustomField | null;
    onClose: () => void;
    onConfirm: (id: string) => void;
}

export function DeleteFieldDialog({ field, onClose, onConfirm }: DeleteFieldDialogProps) {
    const handleConfirm = useCallback(() => {
        if (field) onConfirm(field.id);
    }, [field, onConfirm]);

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
                            <p className="text-sm text-muted-foreground">
                                This will permanently remove the field and all its data from existing contacts and campaigns.
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
                        Delete field
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}