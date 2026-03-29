import { useState, useCallback, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact } from '@/types/contacts';

interface AddContactModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    listId: string;
    onAdded: (contact: Contact) => void;
}

interface FormErrors {
    firstName?: string;
    email?: string;
}

export function AddContactModal({ open, onOpenChange, listId, onAdded }: AddContactModalProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = useCallback((): boolean => {
        const next: FormErrors = {};
        if (!firstName.trim()) next.firstName = 'First name is required.';
        if (!email.trim() || !email.includes('@')) next.email = 'A valid email is required.';
        setErrors(next);
        return Object.keys(next).length === 0;
    }, [firstName, email]);

    const handleSubmit = useCallback(() => {
        if (!validate()) return;
        const contact: Contact = {
            id: `contact-${Date.now()}`,
            listId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            status: 'active',
            addedAt: new Date().toISOString().split('T')[0],
            tags: [],
        };
        onAdded(contact);
        onOpenChange(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setErrors({});
    }, [validate, listId, firstName, lastName, email, phone, onAdded, onOpenChange]);

    const handleClose = useCallback(() => {
        onOpenChange(false);
        setErrors({});
    }, [onOpenChange]);

    const handleFirstName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
        setErrors((prev) => ({ ...prev, firstName: undefined }));
    }, []);
    const handleLastName  = useCallback((e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value), []);
    const handleEmail     = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors((prev) => ({ ...prev, email: undefined }));
    }, []);
    const handlePhone     = useCallback((e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value), []);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add contact</DialogTitle>
                    <DialogDescription>Add a single contact to this list.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="c-first">First name <span className="text-destructive">*</span></Label>
                            <Input
                                id="c-first"
                                value={firstName}
                                onChange={handleFirstName}
                                placeholder="Alice"
                                autoFocus
                                className={errors.firstName ? 'border-destructive' : ''}
                            />
                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="c-last">Last name</Label>
                            <Input id="c-last" value={lastName} onChange={handleLastName} placeholder="Johnson" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="c-email">Email <span className="text-destructive">*</span></Label>
                        <Input
                            id="c-email"
                            type="email"
                            value={email}
                            onChange={handleEmail}
                            placeholder="alice@example.com"
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="c-phone">Phone <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
                        <Input id="c-phone" value={phone} onChange={handlePhone} placeholder="+1 555-0100" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit}>Add contact</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}