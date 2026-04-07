import { Language } from '@/config/i18n/types';
import { ChatMessage } from '@/types/chat';

const DATE_LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  uk: 'uk-UA',
  it: 'it-IT',
  es: 'es-ES',
  fr: 'fr-FR',
};

function normalizeDateLabel(value: string): string {
  return value.replace(/\sг\.$/u, '').trim();
}

export function getChatDateLocale(language: Language): string {
  return DATE_LOCALE_BY_LANGUAGE[language];
}

export function formatChatDay(dateValue: string, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue));

  return normalizeDateLabel(formatted);
}

export function isSameCalendarDay(first: string, second: string): boolean {
  const firstDate = new Date(first);
  const secondDate = new Date(second);

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function getMessagesDateRangeLabel(messages: ChatMessage[], locale: string): string | null {
  if (messages.length === 0) {
    return null;
  }

  const firstDateLabel = formatChatDay(messages[0].created_at, locale);
  const lastDateLabel = formatChatDay(messages[messages.length - 1].created_at, locale);

  if (firstDateLabel === lastDateLabel) {
    return firstDateLabel;
  }

  return `${firstDateLabel} - ${lastDateLabel}`;
}
