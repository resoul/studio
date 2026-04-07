import { useTranslation } from '@/hooks/useTranslation';
import { Channel, DirectMessageConversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Hash, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMembers } from '@/hooks/use-members';
import { CreateChannelDialog } from './create-channel-dialog';
import { StartDMDialog } from './start-dm-dialog';
import { useChat } from '@/hooks/use-chat';
import { useState, useCallback } from 'react';

interface ChatSidebarProps {
    workspaceId?: string;
    channels: Channel[];
    conversations: DirectMessageConversation[];
    activeId?: string;
    onSelect: (id: string, isChannel: boolean) => void;
    currentUserId?: string;
}

export function ChatSidebar({
    workspaceId,
    channels,
    conversations,
    activeId,
    onSelect,
    currentUserId,
}: ChatSidebarProps) {
    const { t } = useTranslation();
    const { members } = useMembers(workspaceId);
    const { createChannel, getOrCreateConversation } = useChat(workspaceId);

    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
    const [isStartDMOpen, setIsStartDMOpen] = useState(false);

    const getConversationLabel = useCallback(
        (conv: DirectMessageConversation) => {
            if (conv.is_group) {
                return conv.name || t('chat.group');
            }
            const isSelf = conv.user1_id === conv.user2_id;
            if (isSelf) {
                const member = members.find(m => m.user_id === currentUserId);
                const name = member ? `${member.first_name} ${member.last_name}`.trim() : '';
                return name ? `${name} (you)` : t('chat.you');
            }
            const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
            const member = members.find(m => m.user_id === otherUserId);
            return member ? `${member.first_name} ${member.last_name}`.trim() || otherUserId : otherUserId;
        },
        [members, currentUserId, t],
    );

    const handleCreateChannel = useCallback(
        async (data: { name: string; description: string; is_private: boolean; participants: string[] }) => {
            try {
                const channel = await createChannel.mutateAsync(data);
                if (channel) {
                    onSelect(channel.id, true);
                }
            } catch (err) {
                console.error('Failed to create channel', err);
            }
        },
        [createChannel, onSelect],
    );

    const handleStartDM = useCallback(
        async (userId: string) => {
            try {
                const conv = await getOrCreateConversation.mutateAsync({ targetUserId: userId });
                if (conv) {
                    onSelect(conv.id, false);
                }
            } catch (err) {
                console.error('Failed to start conversation', err);
            }
        },
        [getOrCreateConversation, onSelect],
    );

    const handleCreateGroup = useCallback(
        async (userIds: string[], name: string) => {
            try {
                const conv = await getOrCreateConversation.mutateAsync({
                    targetUserIds: userIds,
                    name,
                    isGroup: true,
                });
                if (conv) {
                    onSelect(conv.id, false);
                }
            } catch (err) {
                console.error('Failed to create group conversation', err);
            }
        },
        [getOrCreateConversation, onSelect],
    );

    return (
        <div className="flex h-full w-64 flex-col border-r bg-muted/30">
            <div className="flex h-14 items-center justify-between px-4 border-b">
                <span className="font-semibold">{t('layout.sidebar.chat')}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
                {/* Channels */}
                <div className="px-3">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        {t('chat.channels')}
                        <Plus
                            className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => setIsCreateChannelOpen(true)}
                        />
                    </h3>
                    <div className="space-y-1">
                        {channels.map((channel) => {
                            const hasUnread = channel.unread_count !== undefined && channel.unread_count > 0;
                            const isActive = activeId === channel.id;
                            return (
                                <Button
                                    key={channel.id}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start h-9 px-3',
                                        isActive && 'bg-secondary text-secondary-foreground',
                                        hasUnread && !isActive && 'font-semibold text-foreground',
                                    )}
                                    onClick={() => onSelect(channel.id, true)}
                                >
                                    <Hash
                                        className={cn(
                                            'mr-2 h-4 w-4 shrink-0',
                                            hasUnread && !isActive ? 'opacity-100' : 'opacity-70',
                                        )}
                                    />
                                    <span className="flex-1 truncate text-left">{channel.name}</span>
                                    {hasUnread && !isActive && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                            {channel.unread_count! > 99 ? '99+' : channel.unread_count}
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Direct + Group Conversations */}
                <div className="px-3">
                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                        {t('chat.messages')}
                        <Plus
                            className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => setIsStartDMOpen(true)}
                        />
                    </h3>
                    <div className="space-y-1">
                        {conversations.map((conv) => {
                            const hasUnread = conv.unread_count !== undefined && conv.unread_count > 0;
                            const isActive = activeId === conv.id;
                            const isSelf = conv.user1_id === conv.user2_id;
                            return (
                                <Button
                                    key={conv.id}
                                    variant="ghost"
                                    className={cn(
                                        'w-full justify-start h-9 px-3',
                                        isActive && 'bg-secondary text-secondary-foreground',
                                        hasUnread && !isActive && 'font-semibold text-foreground',
                                    )}
                                    onClick={() => onSelect(conv.id, false)}
                                >
                                    <MessageSquare
                                        className={cn(
                                            'mr-2 h-4 w-4 shrink-0',
                                            hasUnread && !isActive ? 'opacity-100' : 'opacity-70',
                                            (isSelf || conv.is_group) && 'text-primary opacity-100',
                                        )}
                                    />
                                    <span className="flex-1 truncate text-left">
                                        {getConversationLabel(conv)}
                                    </span>
                                    {hasUnread && !isActive && (
                                        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                            {conv.unread_count! > 99 ? '99+' : conv.unread_count}
                                        </span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <CreateChannelDialog
                open={isCreateChannelOpen}
                onOpenChange={setIsCreateChannelOpen}
                onSubmit={handleCreateChannel}
                members={members}
                isLoading={createChannel.isPending}
            />

            <StartDMDialog
                open={isStartDMOpen}
                onOpenChange={setIsStartDMOpen}
                onSelect={handleStartDM}
                onCreateGroup={handleCreateGroup}
                members={members}
                currentUserId={currentUserId}
            />
        </div>
    );
}
