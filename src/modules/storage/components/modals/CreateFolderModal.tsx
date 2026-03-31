import { useCallback, useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateFolderModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSave: (name: string) => void;
}

export function CreateFolderModal({ open, onOpenChange, onSave }: CreateFolderModalProps) {
    const [name, setName] = useState('');

    const handleSubmit = useCallback(() => {
        if (!name.trim()) return;
        onSave(name.trim());
        onOpenChange(false);
        setName('');
    }, [name, onSave, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderPlus className="h-4 w-4 text-primary" />
                        New folder
                    </DialogTitle>
                    <DialogDescription>Create a folder to organize your media files.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="folder-name">Folder name</Label>
                        <Input
                            id="folder-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Campaign Assets"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={!name.trim()}>Create</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
