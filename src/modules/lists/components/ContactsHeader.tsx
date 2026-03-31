import { useCallback } from 'react';
import { ContactsViewMode } from '@/types/contacts';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Target } from 'lucide-react';

interface ContactsHeaderProps {
    mode: ContactsViewMode;
    onSwitchToLists: () => void;
    onCreateList: () => void;
    onCreateSegment: () => void;
}

export function ContactsHeader({
                                   mode,
                                   onSwitchToLists,
                                   onCreateList,
                                   onCreateSegment,
                               }: ContactsHeaderProps) {
    const handleCreate = useCallback(() => {
        if (mode === 'lists') onCreateList();
        else onCreateSegment();
    }, [mode, onCreateList, onCreateSegment]);

    return (
        <div className="flex items-center justify-end gap-3 w-full">
            {mode === 'segments' && (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={onSwitchToLists}
                >
                    <Target className="h-3.5 w-3.5" />
                    Save segment
                </Button>
            )}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={handleCreate}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        {mode === 'lists' ? 'New list' : 'New segment'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    {mode === 'lists' ? 'Create a new contact list' : 'Create a new audience segment'}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}