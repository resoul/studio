import {useCallback, useMemo} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {useWorkspaces} from '@/hooks/use-workspaces';
import {useChat, useMessages} from '@/hooks/use-chat';
import {useAuth} from '@/hooks/use-auth';
import {useChatNavigation} from '@/hooks/use-chat-navigation';
import {ChatSidebar} from '../components/sidebar';
import {MessageList} from '../components/message-list';
import {MessageInput} from '../components/message-input';
import {Content} from '@/layout/components/content';
import {Hash, MessageSquare} from 'lucide-react';

export default function ChatPage() {
    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();
    const { user } = useAuth();
    const { activeChat, navigateToChat } = useChatNavigation();
    const { channels, conversations, sendMessage } = useChat(currentWorkspace?.id);
    const { data: messages = [] } = useMessages(currentWorkspace?.id, activeChat?.id);

    const handleSelect = useCallback((id: string, isChannel: boolean) => {
        navigateToChat(id, isChannel);
    }, [navigateToChat]);

    const handleSend = useCallback(async (content: string) => {
        if (!activeChat) return;
        await sendMessage.mutateAsync({
            targetId: activeChat.id,
            input: { content, is_channel: activeChat.isChannel },
        });
    }, [activeChat, sendMessage]);

    const activeTitle = useMemo(() => {
        if (!activeChat) return '';
        if (activeChat.isChannel) {
            return channels.find(c => c.id === activeChat.id)?.name ?? '';
        }
        const conv = conversations.find(c => c.id === activeChat.id);
        if (!conv) return '';
        return conv.user1_id === user?.id ? conv.user2_id : conv.user1_id;
    }, [activeChat, channels, conversations, user?.id]);

    return (
        <div className="flex flex-1 overflow-hidden">
            <ChatSidebar
                workspaceId={currentWorkspace?.id}
                channels={channels}
                conversations={conversations}
                activeId={activeChat?.id}
                onSelect={handleSelect}
                currentUserId={user?.id}
            />

            <Content className="flex flex-col p-0">
                {activeChat ? (
                    <>
                        <div className="h-14 flex items-center px-6 border-b bg-background font-semibold">
                            {activeChat.isChannel
                                ? <Hash className="mr-2 h-4 w-4 opacity-70" />
                                : <MessageSquare className="mr-2 h-4 w-4 opacity-70" />
                            }
                            {activeTitle}
                        </div>
                        <MessageList
                            workspaceId={currentWorkspace?.id ?? ''}
                            messages={messages}
                        />
                        <MessageInput
                            onSend={handleSend}
                            disabled={sendMessage.isPending}
                        />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-2">
                        <MessageSquare className="h-12 w-12 opacity-20" />
                        <span className="text-xl font-medium">{t('chat.welcome')}</span>
                        <p>{t('chat.selectChannel')}</p>
                    </div>
                )}
            </Content>
        </div>
    );
}