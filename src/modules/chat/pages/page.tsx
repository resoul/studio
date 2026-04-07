import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from '@/hooks/useTranslation';
import {useWorkspaces} from '@/hooks/use-workspaces';
import {useChat, useMessages, useThreadMessages} from '@/hooks/use-chat';
import {useAuth} from '@/hooks/use-auth';
import {useChatNavigation} from '@/hooks/use-chat-navigation';
import {useMembers} from '@/hooks/use-members';
import {ChatSidebar} from '../components/sidebar';
import {MessageList} from '../components/message-list';
import {MessageInput} from '../components/message-input';
import {Content} from '@/layout/components/content';
import {Hash, MessageSquare} from 'lucide-react';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import {ChatMessage} from '@/types/chat';

export default function ChatPage() {
    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();
    const { user } = useAuth();
    const { activeChat, navigateToChat } = useChatNavigation();
    const { channels, conversations, sendMessage, markAsRead, toggleReaction } = useChat(
        currentWorkspace?.id,
        { enableRealtime: true },
    );
    const { members } = useMembers(currentWorkspace?.id);
    const { data: messages = [] } = useMessages(currentWorkspace?.id, activeChat?.id);
    const [threadRootMessage, setThreadRootMessage] = useState<ChatMessage | null>(null);
    const { data: threadMessages = [] } = useThreadMessages(currentWorkspace?.id, activeChat?.id, threadRootMessage?.id);
    const lastAutoReadMessageIdRef = useRef<string>('');

    const handleSelect = useCallback((id: string, isChannel: boolean) => {
        navigateToChat(id, isChannel);
        markAsRead.mutate({ targetId: id, isChannel });
    }, [navigateToChat, markAsRead]);

    const handleSend = useCallback(async (content: string) => {
        if (!activeChat) return;
        await sendMessage.mutateAsync({
            targetId: activeChat.id,
            input: { content, is_channel: activeChat.isChannel },
        });
    }, [activeChat, sendMessage]);

    const handleSendThreadReply = useCallback(async (content: string) => {
        if (!activeChat || !threadRootMessage) return;
        await sendMessage.mutateAsync({
            targetId: activeChat.id,
            input: {
                content,
                is_channel: activeChat.isChannel,
                parent_message_id: threadRootMessage.id,
            },
        });
    }, [activeChat, threadRootMessage, sendMessage]);

    const handleToggleReaction = useCallback((messageId: string, emoji: string) => {
        if (!activeChat) {
            return;
        }
        toggleReaction.mutate({ messageId, emoji, chatId: activeChat.id });
    }, [activeChat, toggleReaction]);

    const activeTitle = useMemo(() => {
        if (!activeChat) return '';
        if (activeChat.isChannel) {
            return channels.find(c => c.id === activeChat.id)?.name ?? '';
        }
        const conv = conversations.find(c => c.id === activeChat.id);
        if (!conv) return '';
        if (conv.is_group) {
            return conv.name || t('chat.group');
        }
        // Self-DM
        if (conv.user1_id === conv.user2_id) {
            const member = members.find(m => m.user_id === user?.id);
            const name = member ? `${member.first_name} ${member.last_name}`.trim() : '';
            return name ? `${name} (${t('chat.you')})` : t('chat.you');
        }
        const otherUserId = conv.user1_id === user?.id ? conv.user2_id : conv.user1_id;
        const member = members.find(m => m.user_id === otherUserId);
        return member ? `${member.first_name} ${member.last_name}`.trim() || otherUserId : otherUserId;
    }, [activeChat, channels, conversations, user?.id, members, t]);

    const threadTitle = useMemo(() => {
        if (!threadRootMessage) {
            return '';
        }
        return t('chat.thread');
    }, [threadRootMessage, t]);

    const handleThreadReplySelect = useCallback((message: ChatMessage) => {
        setThreadRootMessage(message);
    }, []);

    useEffect(() => {
        if (!activeChat || !user?.id || messages.length === 0) {
            return;
        }

        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.sender_id === user.id) {
            return;
        }

        const autoReadKey = `${activeChat.id}:${lastMessage.id}`;
        if (lastAutoReadMessageIdRef.current === autoReadKey) {
            return;
        }

        lastAutoReadMessageIdRef.current = autoReadKey;
        markAsRead.mutate({ targetId: activeChat.id, isChannel: activeChat.isChannel });
    }, [activeChat, user?.id, messages, markAsRead]);

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
                            currentUserId={user?.id}
                            onReply={setThreadRootMessage}
                            onToggleReaction={handleToggleReaction}
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

            <Sheet open={!!threadRootMessage} onOpenChange={(open) => {
                if (!open) {
                    setThreadRootMessage(null);
                }
            }}>
                <SheetContent side="right" className="w-[460px] sm:max-w-[460px]">
                    <SheetHeader>
                        <SheetTitle>{threadTitle}</SheetTitle>
                    </SheetHeader>
                    {threadRootMessage && (
                        <div className="flex h-full flex-col">
                            <div className="rounded-lg border p-3 text-sm">
                                {threadRootMessage.content}
                            </div>
                            <div className="mt-3 flex-1 overflow-y-auto">
                                <MessageList
                                    workspaceId={currentWorkspace?.id ?? ''}
                                    messages={threadMessages}
                                    currentUserId={user?.id}
                                    onReply={handleThreadReplySelect}
                                    onToggleReaction={handleToggleReaction}
                                />
                            </div>
                            <MessageInput onSend={handleSendThreadReply} disabled={sendMessage.isPending} />
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
