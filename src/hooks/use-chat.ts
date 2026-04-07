import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import api from '@/lib/api';
import {
    Channel,
    ChatReadEvent,
    ChatMessage,
    ChatReactionEvent,
    DirectMessageConversation,
    MessageReactionSummary,
    SendMessageInput,
} from '@/types/chat';
import { usePresence } from './use-presence';
import { useAuth } from './use-auth';

// ─── standalone hook — call at top level, not inside another hook ─────────────
export const useMessages = (workspaceId: string | undefined, targetId: string | undefined) => {
    return useQuery({
        queryKey: ['chat', 'messages', targetId],
        queryFn: async () => {
            if (!workspaceId || !targetId) return [];
            const { data } = await api.get<ChatMessage[]>(
                `/workspaces/${workspaceId}/chat/messages/${targetId}`,
            );
            // Reverse once here so oldest-first; the array from the server is newest-first
            return [...data].reverse();
        },
        enabled: !!workspaceId && !!targetId,
    });
};

export const useThreadMessages = (
    workspaceId: string | undefined,
    chatId: string | undefined,
    parentMessageId: string | undefined,
) => {
    return useQuery({
        queryKey: ['chat', 'thread', chatId, parentMessageId],
        queryFn: async () => {
            if (!workspaceId || !chatId || !parentMessageId) return [];
            const { data } = await api.get<ChatMessage[]>(
                `/workspaces/${workspaceId}/chat/messages/${chatId}/thread/${parentMessageId}`,
            );
            return data;
        },
        enabled: !!workspaceId && !!chatId && !!parentMessageId,
    });
};

// ─── main hook ────────────────────────────────────────────────────────────────
interface UseChatOptions {
    enableRealtime?: boolean;
}

export const useChat = (workspaceId?: string, options?: UseChatOptions) => {
    const { enableRealtime = false } = options ?? {};
    const queryClient = useQueryClient();
    const { addMessageListener } = usePresence();
    const { user } = useAuth();

    const toggleReactionInMessages = (
        messages: ChatMessage[] | undefined,
        messageId: string,
        emoji: string,
    ): ChatMessage[] | undefined => {
        if (!messages) return messages;
        return messages.map((message) => {
            if (message.id !== messageId) {
                return message;
            }

            const reactions = [...(message.reactions ?? [])];
            const myReactionIndex = reactions.findIndex((reaction) => reaction.reacted_by_me);

            if (myReactionIndex !== -1 && reactions[myReactionIndex].emoji === emoji) {
                const current = reactions[myReactionIndex];
                const nextCount = current.count - 1;
                if (nextCount <= 0) {
                    reactions.splice(myReactionIndex, 1);
                } else {
                    reactions[myReactionIndex] = {
                        ...current,
                        count: nextCount,
                        reacted_by_me: false,
                    };
                }
            } else {
                if (myReactionIndex !== -1) {
                    const currentMine = reactions[myReactionIndex];
                    const nextMineCount = currentMine.count - 1;
                    if (nextMineCount <= 0) {
                        reactions.splice(myReactionIndex, 1);
                    } else {
                        reactions[myReactionIndex] = {
                            ...currentMine,
                            count: nextMineCount,
                            reacted_by_me: false,
                        };
                    }
                }

                const updatedIndex = reactions.findIndex((reaction) => reaction.emoji === emoji);
                if (updatedIndex === -1) {
                    reactions.push({
                        emoji,
                        count: 1,
                        reacted_by_me: true,
                    });
                } else {
                    const current = reactions[updatedIndex];
                    reactions[updatedIndex] = {
                        ...current,
                        count: current.count + 1,
                        reacted_by_me: true,
                    };
                }
            }

            return {
                ...message,
                reactions,
            };
        });
    };

    const replaceReactionsInMessages = (
        messages: ChatMessage[] | undefined,
        messageId: string,
        reactions: MessageReactionSummary[],
    ): ChatMessage[] | undefined => {
        if (!messages) return messages;
        return messages.map((message) => {
            if (message.id !== messageId) {
                return message;
            }
            return {
                ...message,
                reactions,
            };
        });
    };

    const applyReactionEventToMessages = (
        messages: ChatMessage[] | undefined,
        event: ChatReactionEvent,
        isCurrentUser: boolean,
    ): ChatMessage[] | undefined => {
        if (!messages) return messages;
        return messages.map((message) => {
            if (message.id !== event.message_id) {
                return message;
            }

            const reactions = [...(message.reactions ?? [])];
            const reactionIndex = reactions.findIndex((reaction) => reaction.emoji === event.emoji);

            if (event.action === 'ADDED') {
                if (reactionIndex === -1) {
                    reactions.push({
                        emoji: event.emoji,
                        count: 1,
                        reacted_by_me: isCurrentUser,
                    });
                } else {
                    const current = reactions[reactionIndex];
                    reactions[reactionIndex] = {
                        ...current,
                        count: current.count + 1,
                        reacted_by_me: current.reacted_by_me || isCurrentUser,
                    };
                }
            } else if (reactionIndex !== -1) {
                const current = reactions[reactionIndex];
                const nextCount = current.count - 1;

                if (nextCount <= 0) {
                    reactions.splice(reactionIndex, 1);
                } else {
                    reactions[reactionIndex] = {
                        ...current,
                        count: nextCount,
                        reacted_by_me: isCurrentUser ? false : current.reacted_by_me,
                    };
                }
            }

            return {
                ...message,
                reactions,
            };
        });
    };

    const applyReadEventToMessages = useCallback((
        messages: ChatMessage[] | undefined,
        event: ChatReadEvent,
    ): ChatMessage[] | undefined => {
        if (!messages) return messages;
        const readAt = new Date(event.read_at).getTime();

        return messages.map((message) => {
            if (message.sender_id !== user?.id) {
                return message;
            }

            if (new Date(message.created_at).getTime() > readAt) {
                return message;
            }

            return {
                ...message,
                delivery_status: 'read',
            };
        });
    }, [user?.id]);

    const channelsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'channels'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<Channel[]>(`/workspaces/${workspaceId}/chat/channels`);
            return data;
        },
        enabled: !!workspaceId,
    });

    const conversationsQuery = useQuery({
        queryKey: ['workspaces', workspaceId, 'chat', 'conversations'],
        queryFn: async () => {
            if (!workspaceId) return [];
            const { data } = await api.get<DirectMessageConversation[]>(
                `/workspaces/${workspaceId}/chat/conversations`,
            );
            return data;
        },
        enabled: !!workspaceId,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async ({ targetId, input }: { targetId: string; input: SendMessageInput }) => {
            if (!workspaceId) return;
            const { data } = await api.post<ChatMessage>(
                `/workspaces/${workspaceId}/chat/messages/${targetId}`,
                input,
            );
            return data;
        },
        onMutate: async ({ targetId, input }) => {
            const tempId = `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            const optimisticMessage: ChatMessage = {
                id: tempId,
                channel_id: input.is_channel ? targetId : undefined,
                conversation_id: input.is_channel ? undefined : targetId,
                parent_message_id: input.parent_message_id,
                sender_id: user?.id ?? '',
                content: input.content,
                created_at: new Date().toISOString(),
                reactions: [],
                delivery_status: 'sending',
            };

            await queryClient.cancelQueries({ queryKey: ['chat', 'messages', targetId] });
            const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat', 'messages', targetId]);

            if (input.parent_message_id) {
                await queryClient.cancelQueries({
                    queryKey: ['chat', 'thread', targetId, input.parent_message_id],
                });
                const previousThread = queryClient.getQueryData<ChatMessage[]>([
                    'chat',
                    'thread',
                    targetId,
                    input.parent_message_id,
                ]);

                queryClient.setQueryData<ChatMessage[] | undefined>(
                    ['chat', 'thread', targetId, input.parent_message_id],
                    (old) => (old ? [...old, optimisticMessage] : [optimisticMessage]),
                );

                return { targetId, tempId, previousMessages, previousThread, parentMessageId: input.parent_message_id };
            }

            queryClient.setQueryData<ChatMessage[] | undefined>(
                ['chat', 'messages', targetId],
                (old) => (old ? [...old, optimisticMessage] : [optimisticMessage]),
            );

            return { targetId, tempId, previousMessages };
        },
        onError: (_, variables, context) => {
            if (!context) return;

            queryClient.setQueryData(['chat', 'messages', context.targetId], context.previousMessages);
            if (context.parentMessageId) {
                queryClient.setQueryData(
                    ['chat', 'thread', context.targetId, context.parentMessageId],
                    context.previousThread,
                );
            }
            if (!variables.input.parent_message_id) {
                queryClient.invalidateQueries({ queryKey: ['chat', 'messages', context.targetId] });
            }
        },
        onSuccess: (data, variables, context) => {
            if (!data || !context) {
                return;
            }

            const targetId = data.channel_id ?? data.conversation_id;
            const deliveredMessage: ChatMessage = {
                ...data,
                delivery_status: 'delivered',
            };

            const replaceTempMessage = (old: ChatMessage[] | undefined) => {
                if (!old) return [deliveredMessage];

                const withoutTemp = old.filter((message) => message.id !== context.tempId);
                if (withoutTemp.some((message) => message.id === deliveredMessage.id)) {
                    return withoutTemp.map((message) =>
                        message.id === deliveredMessage.id ? deliveredMessage : message,
                    );
                }
                return [...withoutTemp, deliveredMessage];
            };

            if (variables.input.parent_message_id) {
                queryClient.setQueryData<ChatMessage[] | undefined>(
                    ['chat', 'thread', context.targetId, variables.input.parent_message_id],
                    replaceTempMessage,
                );
                queryClient.invalidateQueries({
                    queryKey: ['chat', 'messages', context.targetId],
                });
                return;
            }

            queryClient.setQueryData<ChatMessage[] | undefined>(
                ['chat', 'messages', targetId],
                replaceTempMessage,
            );
        },
    });

    const createChannelMutation = useMutation({
        mutationFn: async (input: {
            name: string;
            description?: string;
            is_private: boolean;
            participants?: string[];
        }) => {
            if (!workspaceId) return;
            const { data } = await api.post<Channel>(
                `/workspaces/${workspaceId}/chat/channels`,
                input,
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces', workspaceId, 'chat', 'channels'],
            });
        },
    });

    const getOrCreateConversationMutation = useMutation({
        mutationFn: async (input: { targetUserId?: string; targetUserIds?: string[]; name?: string; isGroup?: boolean }) => {
            if (!workspaceId) return;
            const { data } = await api.post<DirectMessageConversation>(
                `/workspaces/${workspaceId}/chat/conversations`,
                {
                    target_user_id: input.targetUserId,
                    target_user_ids: input.targetUserIds,
                    name: input.name,
                    is_group: !!input.isGroup,
                },
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces', workspaceId, 'chat', 'conversations'],
            });
        },
    });

    const markAsReadMutation = useMutation({
        mutationFn: async ({ targetId, isChannel }: { targetId: string; isChannel: boolean }) => {
            if (!workspaceId) return;
            await api.post(`/workspaces/${workspaceId}/chat/messages/${targetId}/read`, {
                is_channel: isChannel,
            });
        },
        onSuccess: (_, { isChannel }) => {
            const queryKey = isChannel
                ? ['workspaces', workspaceId, 'chat', 'channels']
                : ['workspaces', workspaceId, 'chat', 'conversations'];
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const toggleReactionMutation = useMutation({
        mutationFn: async ({ messageId, emoji, chatId }: { messageId: string; emoji: string; chatId: string }) => {
            if (!workspaceId) return;
            const { data } = await api.post<MessageReactionSummary[]>(
                `/workspaces/${workspaceId}/chat/reactions/${messageId}`,
                { emoji },
            );
            return { chatId, messageId, reactions: data };
        },
        onMutate: async ({ messageId, emoji, chatId }) => {
            await queryClient.cancelQueries({ queryKey: ['chat', 'messages', chatId] });
            await queryClient.cancelQueries({ queryKey: ['chat', 'thread', chatId] });

            const previousMessages = queryClient.getQueryData<ChatMessage[]>(['chat', 'messages', chatId]);
            queryClient.setQueryData<ChatMessage[] | undefined>(
                ['chat', 'messages', chatId],
                (old) => toggleReactionInMessages(old, messageId, emoji),
            );

            const previousThreadQueries = queryClient.getQueriesData<ChatMessage[]>({ queryKey: ['chat', 'thread', chatId] });
            queryClient.setQueriesData<ChatMessage[] | undefined>(
                { queryKey: ['chat', 'thread', chatId] },
                (old) => toggleReactionInMessages(old, messageId, emoji),
            );

            return { previousMessages, previousThreadQueries, chatId };
        },
        onError: (_, __, context) => {
            if (!context) return;
            queryClient.setQueryData(['chat', 'messages', context.chatId], context.previousMessages);
            context.previousThreadQueries.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSuccess: (data) => {
            if (!data) return;
            queryClient.setQueryData<ChatMessage[] | undefined>(
                ['chat', 'messages', data.chatId],
                (old) => replaceReactionsInMessages(old, data.messageId, data.reactions),
            );
            queryClient.setQueriesData<ChatMessage[] | undefined>(
                { queryKey: ['chat', 'thread', data.chatId] },
                (old) => replaceReactionsInMessages(old, data.messageId, data.reactions),
            );
        },
    });

    // Real-time message updates for the messages cache
    useEffect(() => {
        if (!workspaceId || !enableRealtime) return;

        return addMessageListener((event: unknown) => {
            const envelope = event as Record<string, unknown>;

            if (envelope.type === 'CHAT_REACTION' && envelope.payload) {
                const reactionEvent = envelope.payload as ChatReactionEvent;
                const targetId = reactionEvent.channel_id ?? reactionEvent.conversation_id;
                if (!targetId) return;

                const isCurrentUser = reactionEvent.user_id === user?.id;
                if (isCurrentUser) {
                    return;
                }
                queryClient.setQueryData<ChatMessage[] | undefined>(
                    ['chat', 'messages', targetId],
                    (old) => applyReactionEventToMessages(old, reactionEvent, isCurrentUser),
                );
                queryClient.setQueriesData<ChatMessage[] | undefined>(
                    { queryKey: ['chat', 'thread', targetId] },
                    (old) => applyReactionEventToMessages(old, reactionEvent, isCurrentUser),
                );
                return;
            }

            if (envelope.type === 'CHAT_READ' && envelope.payload) {
                const readEvent = envelope.payload as ChatReadEvent;
                if (readEvent.user_id === user?.id) return;
                if (readEvent.channel_id) return;

                const targetId = readEvent.conversation_id;
                if (!targetId) return;

                queryClient.setQueryData<ChatMessage[] | undefined>(
                    ['chat', 'messages', targetId],
                    (old) => applyReadEventToMessages(old, readEvent),
                );
                queryClient.setQueriesData<ChatMessage[] | undefined>(
                    { queryKey: ['chat', 'thread', targetId] },
                    (old) => applyReadEventToMessages(old, readEvent),
                );
                return;
            }

            if (envelope.type !== 'CHAT_MESSAGE' || !envelope.payload) return;

            const msg = envelope.payload as ChatMessage;
            const targetId = msg.channel_id ?? msg.conversation_id;
            const isChannel = !!msg.channel_id;

            // Update messages cache
            queryClient.setQueryData(
                ['chat', 'messages', targetId],
                (old: ChatMessage[] | undefined) => {
                    const exists = old?.some(m => m.id === msg.id);
                    if (exists) return old;
                    if (msg.parent_message_id) {
                        return old;
                    }
                    return old ? [...old, { ...msg, delivery_status: msg.sender_id === user?.id ? 'delivered' : undefined }] : [{ ...msg, delivery_status: msg.sender_id === user?.id ? 'delivered' : undefined }];
                },
            );

            if (msg.parent_message_id) {
                queryClient.invalidateQueries({ queryKey: ['chat', 'thread', targetId, msg.parent_message_id] });
                queryClient.invalidateQueries({ queryKey: ['chat', 'messages', targetId] });
            }

            // Invalidate channels/conversations to update unread counts
            const queryKey = isChannel
                ? ['workspaces', workspaceId, 'chat', 'channels']
                : ['workspaces', workspaceId, 'chat', 'conversations'];
            queryClient.invalidateQueries({ queryKey });
        });
    }, [workspaceId, enableRealtime, addMessageListener, queryClient, user?.id, applyReadEventToMessages]);

    return {
        channels: channelsQuery.data ?? [],
        conversations: conversationsQuery.data ?? [],
        isLoading: channelsQuery.isLoading || conversationsQuery.isLoading,
        sendMessage: sendMessageMutation,
        createChannel: createChannelMutation,
        getOrCreateConversation: getOrCreateConversationMutation,
        markAsRead: markAsReadMutation,
        toggleReaction: toggleReactionMutation,
    };
};
