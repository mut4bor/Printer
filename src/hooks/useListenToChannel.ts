import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';
import {
  API_ID,
  API_HASH,
  API_SESSION,
  TELEGRAM_PHONE_NUMBER,
  TELEGRAM_PASSWORD,
  TELEGRAM_CHANNEL_LINK,
} from '@/config/index';

interface MessageResult {
  message: string;
  media: string | Buffer | undefined;
}

const apiID = parseInt(API_ID);
const apiHash = API_HASH;
const phoneNumber = TELEGRAM_PHONE_NUMBER;
const password = TELEGRAM_PASSWORD;
const channelLink = TELEGRAM_CHANNEL_LINK;
const stringSession = new StringSession(API_SESSION);

const client = new TelegramClient(stringSession, apiID, apiHash, {
  connectionRetries: 5,
  retryDelay: 500,
});

export const useListenToChannel = (
  callback: (result: MessageResult) => void
) => {
  client
    .start({
      phoneNumber: async () => phoneNumber,
      password: async () => password,
      phoneCode: async () => {
        console.log('Введите код, полученный на ваш телефон:');
        return await new Promise((resolve) => {
          process.stdin.once('data', (data) => resolve(data.toString().trim()));
        });
      },
      onError: (err) => console.log(err),
    })
    .then(async () => {
      console.log('Вы вошли в систему!');

      const channel = await client.getEntity(channelLink);

      client.addEventHandler(async (event) => {
        try {
          const message = event.message;
          if (
            message.peerId.className === 'PeerChannel' &&
            message.peerId.channelId.valueOf().toString() ===
              channel.id.toString()
          ) {
            console.log('New message in the channel:', message.message);

            if (message.media) {
              const media = await client.downloadMedia(message.media, {});
              console.log('Media downloaded:', media);
              callback({ message: message.message, media });
            } else {
              console.log('No media in the new message.');
              callback({ message: message.message, media: undefined });
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, new NewMessage({}));

      console.log('Клиент запущен и слушает канал');
    })
    .catch((err) => console.error('Ошибка при старте клиента:', err));
};
