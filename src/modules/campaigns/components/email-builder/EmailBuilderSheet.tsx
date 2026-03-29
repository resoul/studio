import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface EmailBuilderSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
    children: ReactNode;
}

export function EmailBuilderSheet({
    open,
    onOpenChange,
    title,
    description,
    side = 'right',
    className,
    children,
}: EmailBuilderSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={className}>
                <SheetHeader className="pr-8">
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="mt-4 min-h-0 flex-1 overflow-auto">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}
