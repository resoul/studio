import { useTranslation } from '@/hooks/useTranslation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberInfo } from '@/hooks/use-members';
import { usePresence } from '@/hooks/use-presence';
import { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface StartDMDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (userId: string) => void;
    onCreateGroup: (userIds: string[], name: string) => void;
    members: MemberInfo[];
    currentUserId?: string;
}

export function StartDMDialog({
    open,
    onOpenChange,
    onSelect,
    onCreateGroup,
    members,
    currentUserId
}: StartDMDialogProps) {
    const { t } = useTranslation();
    const { isOnline } = usePresence();
    const [mode, setMode] = useState<'direct' | 'group'>('direct');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');

    // Filter out the current user
    const otherMembers = useMemo(() => members.filter(m => m.user_id !== currentUserId), [members, currentUserId]);

    const toggleUser = useCallback((userId: string) => {
        setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
    }, []);

    const handleCreateGroup = useCallback(() => {
        if (selectedUsers.length < 2) {
            return;
        }
        onCreateGroup(selectedUsers, groupName);
        setSelectedUsers([]);
        setGroupName('');
        setMode('direct');
        onOpenChange(false);
    }, [selectedUsers, groupName, onCreateGroup, onOpenChange]);

    const handleSelectDirect = useCallback((userId: string) => {
        onSelect(userId);
        onOpenChange(false);
    }, [onSelect, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>{t('chat.directMessage')}</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-2 flex items-center gap-2">
                    <Button
                        type="button"
                        variant={mode === 'direct' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMode('direct')}
                    >
                        {t('chat.directMessage')}
                    </Button>
                    <Button
                        type="button"
                        variant={mode === 'group' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setMode('group')}
                    >
                        {t('chat.group')}
                    </Button>
                </div>
                {mode === 'group' && (
                    <div className="px-4 pb-2">
                        <Input
                            placeholder={t('chat.groupName')}
                            value={groupName}
                            onChange={(event) => setGroupName(event.target.value)}
                        />
                    </div>
                )}
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder={t('chat.searchMembers')} />
                    <CommandList>
                        <CommandEmpty>{t('common.noResults')}</CommandEmpty>
                        <CommandGroup heading={t('chat.members')}>
                            {otherMembers.map((member) => (
                                <CommandItem
                                    key={member.user_id}
                                    value={`${member.first_name} ${member.last_name} ${member.email}`}
                                    onSelect={() => {
                                        if (mode === 'direct') {
                                            handleSelectDirect(member.user_id);
                                        } else {
                                            toggleUser(member.user_id);
                                        }
                                    }}
                                    className="cursor-pointer"
                                >
                                    <div className="flex items-center space-x-3 w-full">
                                        {mode === 'group' && (
                                            <Checkbox
                                                checked={selectedUsers.includes(member.user_id)}
                                                onCheckedChange={() => toggleUser(member.user_id)}
                                            />
                                        )}
                                        <div className="relative">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback>
                                                    {member.first_name[0]}{member.last_name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isOnline(member.user_id) && (
                                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {member.first_name} {member.last_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {member.email}
                                            </span>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
                {mode === 'group' && (
                    <div className="p-4 border-t">
                        <Button
                            type="button"
                            className="w-full"
                            onClick={handleCreateGroup}
                            disabled={selectedUsers.length < 2}
                        >
                            {t('chat.createGroup')}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
