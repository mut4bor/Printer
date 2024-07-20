import { TelegramClient } from 'telegram';
import { TELEGRAM_API_ID, TELEGRAM_API_HASH } from '@/config/index';
import { StringSession } from 'telegram/sessions';

export const createTelegramClient = (stringSession: StringSession) => {
  const client = new TelegramClient(
    stringSession,
    parseInt(TELEGRAM_API_ID),
    TELEGRAM_API_HASH,
    {
      connectionRetries: 5,
      retryDelay: 500,
    }
  );
  return { client };
};
