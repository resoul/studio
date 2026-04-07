export interface Channel {
    id: string;
    workspace_id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    created_by: string;
    created_at: string;
    updated_at: string;
    unread_count?: number;
}

export interface DirectMessageConversation {
    id: string;
    workspace_id: string;
    user1_id: string;
    user2_id: string;
    name: string;
    is_group: boolean;
    created_by: string;
    created_at: string;
    unread_count?: number;
}

export interface MessageReactionSummary {
    emoji: string;
    count: number;
    reacted_by_me: boolean;
}

export interface ChatReactionEvent {
    message_id: string;
    channel_id?: string;
    conversation_id?: string;
    user_id: string;
    emoji: string;
    action: 'ADDED' | 'REMOVED';
}

export interface ChatReadEvent {
    channel_id?: string;
    conversation_id?: string;
    user_id: string;
    read_at: string;
}

export type MessageDeliveryStatus = 'sending' | 'delivered' | 'read';

export interface ChatMessage {
    id: string;
    channel_id?: string;
    conversation_id?: string;
    parent_message_id?: string;
    sender_id: string;
    content: string;
    created_at: string;
    thread_reply_count?: number;
    reactions?: MessageReactionSummary[];
    delivery_status?: MessageDeliveryStatus;
}

export interface SendMessageInput {
    content: string;
    is_channel: boolean;
    parent_message_id?: string;
}
