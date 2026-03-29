import { useState, useCallback, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactList } from '@/types/contacts';

const PALETTE = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#F97316', '#EC4899',
];

interface CreateListModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (list: ContactList) => void;
}

export function CreateListModal({ open, onOpenChange, onCreated }: CreateListModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(PALETTE[0]);
    const [error, setError] = useState('');

    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setError('');
    }, []);

    const handleDescChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        if (!name.trim()) {
            setError('List name is required.');
            return;
        }
        const list: ContactList = {
            id: `list-${Date.now()}`,
            name: name.trim(),
            description: description.trim(),
            contactCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
            color,
        };
        onCreated(list);
        onOpenChange(false);
        setName('');
        setDescription('');
        setColor(PALETTE[0]);
        setError('');
    }, [name, description, color, onCreated, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create new list</DialogTitle>
                    <DialogDescription>
                        Organise your contacts into targeted groups.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="list-name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="list-name"
                            value={name}
                            onChange={handleNameChange}
                            placeholder="e.g. Newsletter subscribers"
                            autoFocus
                            className={error ? 'border-destructive' : ''}
                        />
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="list-desc">Description <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
                        <Input
                            id="list-desc"
                            value={description}
                            onChange={handleDescChange}
                            placeholder="What is this list for?"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Colour</Label>
                        <div className="flex gap-2 flex-wrap">
                            {PALETTE.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                                    style={{
                                        backgroundColor: c,
                                        borderColor: color === c ? '#0F172A' : 'transparent',
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create list</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}