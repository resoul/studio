import { describe, expect, it } from 'vitest';
import { ChatMessage } from '../../../src/types/chat';
import {
  formatChatDay,
  getChatDateLocale,
  getMessagesDateRangeLabel,
  isSameCalendarDay,
} from '../../../src/modules/chat/components/message-date';

const createMessage = (createdAt: string): ChatMessage => ({
  id: createdAt,
  sender_id: 'user-1',
  content: 'Message',
  created_at: createdAt,
});

describe('chat message date helpers', () => {
  it('maps translation language to locale', () => {
    expect(getChatDateLocale('ru')).toBe('ru-RU');
    expect(getChatDateLocale('en')).toBe('en-US');
  });

  it('detects same calendar day correctly', () => {
    expect(isSameCalendarDay('2025-03-05T10:00:00.000Z', '2025-03-05T23:30:00.000Z')).toBe(true);
    expect(isSameCalendarDay('2025-03-05T23:59:59.000Z', '2025-03-06T00:00:00.000Z')).toBe(false);
  });

  it('returns single-day label when all messages are from one day', () => {
    const messages = [
      createMessage('2025-03-05T10:00:00.000Z'),
      createMessage('2025-03-05T12:00:00.000Z'),
    ];

    const label = getMessagesDateRangeLabel(messages, 'en-US');
    expect(label).toBe(formatChatDay('2025-03-05T10:00:00.000Z', 'en-US'));
  });

  it('returns day range label when messages span multiple days', () => {
    const messages = [
      createMessage('2025-03-05T10:00:00.000Z'),
      createMessage('2025-03-06T12:00:00.000Z'),
    ];

    const label = getMessagesDateRangeLabel(messages, 'ru-RU');
    const expected = `${formatChatDay('2025-03-05T10:00:00.000Z', 'ru-RU')} - ${formatChatDay('2025-03-06T12:00:00.000Z', 'ru-RU')}`;
    expect(label).toBe(expected);
  });
});
