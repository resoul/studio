import { ChatMessage } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import { useMembers } from '@/hooks/use-members';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Check, CheckCheck, MessageCircle, SmilePlus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { formatChatDay, getChatDateLocale, getMessagesDateRangeLabel, isSameCalendarDay } from './message-date';

interface MessageListProps {
    workspaceId: string;
    messages: ChatMessage[];
    currentUserId?: string;
    onReply: (message: ChatMessage) => void;
    onToggleReaction: (messageId: string, emoji: string) => void;
}

const QUICK_REACTIONS = ['👍', '🔥', '❤️', '😂', '🎉'] as const;

export function MessageList({
    workspaceId,
    messages,
    currentUserId,
    onReply,
    onToggleReaction,
}: MessageListProps) {
    const { t, language } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const { members } = useMembers(workspaceId);
    const dateLocale = getChatDateLocale(language);
    const dateRangeLabel = getMessagesDateRangeLabel(messages, dateLocale);

    const getMember = (userId: string) => {
        return members.find(m => m.user_id === userId);
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {dateRangeLabel && (
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        {dateRangeLabel}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>
            )}
            {messages.map((msg, index) => {
                const member = getMember(msg.sender_id);
                const isMine = currentUserId === msg.sender_id;
                const messageStatus = msg.delivery_status ?? (isMine ? 'delivered' : undefined);
                const previousMessage = index > 0 ? messages[index - 1] : null;
                const shouldShowDateDivider = !previousMessage || !isSameCalendarDay(previousMessage.created_at, msg.created_at);

                return (
                    <ContextMenu key={msg.id}>
                        <ContextMenuTrigger>
                            <div className="space-y-4">
                                {shouldShowDateDivider && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-border" />
                                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                                            {formatChatDay(msg.created_at, dateLocale)}
                                        </span>
                                        <div className="h-px flex-1 bg-border" />
                                    </div>
                                )}
                                <div className={`flex items-start gap-4 ${isMine ? 'justify-end' : ''}`}>
                                    {!isMine && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member?.avatar_url} />
                                            <AvatarFallback>
                                                {member?.first_name?.[0]}{member?.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`flex max-w-[80%] flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2">
                                            {!isMine && (
                                                <span className="text-sm font-semibold">
                                                    {member ? `${member.first_name} ${member.last_name}` : msg.sender_id}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(msg.created_at), 'HH:mm')}
                                            </span>
                                        </div>
                                        <div className={`mt-1 rounded-xl px-3 py-2 text-sm ${
                                            isMine
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-1">
                                            {msg.reactions?.map((reaction) => (
                                                <Button
                                                    key={`${msg.id}-${reaction.emoji}`}
                                                    type="button"
                                                    size="sm"
                                                    variant={reaction.reacted_by_me ? 'default' : 'outline'}
                                                    className="h-7 rounded-full px-2 text-xs"
                                                    onClick={() => onToggleReaction(msg.id, reaction.emoji)}
                                                >
                                                    <span>{reaction.emoji}</span>
                                                    <span className="ml-1">{reaction.count}</span>
                                                </Button>
                                            ))}
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 px-2 text-xs"
                                                onClick={() => onReply(msg)}
                                            >
                                                <MessageCircle className="mr-1 h-3 w-3" />
                                                {t('chat.reply')}
                                            </Button>
                                            {(msg.thread_reply_count ?? 0) > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                    {t('chat.repliesCount').replace('{count}', String(msg.thread_reply_count ?? 0))}
                                                </Badge>
                                            )}
                                            {isMine && messageStatus === 'delivered' && (
                                                <Check className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            {isMine && messageStatus === 'read' && (
                                                <CheckCheck className="h-3.5 w-3.5 text-primary" />
                                            )}
                                        </div>
                                    </div>
                                    {isMine && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member?.avatar_url} />
                                            <AvatarFallback>
                                                {member?.first_name?.[0]}{member?.last_name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-56">
                            <ContextMenuItem onSelect={() => onReply(msg)}>
                                <MessageCircle className="mr-2 h-4 w-4" />
                                {t('chat.replyInThread')}
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            {QUICK_REACTIONS.map((emoji) => (
                                <ContextMenuItem key={emoji} onSelect={() => onToggleReaction(msg.id, emoji)}>
                                    <SmilePlus className="mr-2 h-4 w-4" />
                                    {t('chat.reactWith').replace('{emoji}', emoji)}
                                </ContextMenuItem>
                            ))}
                        </ContextMenuContent>
                    </ContextMenu>
                );
            })}
            {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                    {t('chat.empty')}
                </div>
            )}
        </div>
    );
}
