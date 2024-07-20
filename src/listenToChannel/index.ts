import { MessageResult } from './types';
import { StringSession } from 'telegram/sessions';
import { createTelegramClient } from '@/createTelegramClient';
import { NewMessage } from 'telegram/events';
import {
  TELEGRAM_API_SESSION,
  TELEGRAM_PHONE_NUMBER,
  TELEGRAM_PASSWORD,
  TELEGRAM_CHANNEL_LINK,
} from '@/config/index';

const stringSession = new StringSession(TELEGRAM_API_SESSION);
const { client } = createTelegramClient(stringSession);

export const listenToChannel = (callback: (result: MessageResult) => void) => {
  client
    .start({
      phoneNumber: async () => TELEGRAM_PHONE_NUMBER,
      password: async () => TELEGRAM_PASSWORD,
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

      const channel = await client.getEntity(TELEGRAM_CHANNEL_LINK);

      client.addEventHandler(async (event) => {
        try {
          const message = event.message;
          if (
            message.peerId.className === 'PeerChannel' &&
            message.peerId.channelId.valueOf().toString() ===
              channel.id.toString()
          ) {
            if (message.media) {
              const media = await client.downloadMedia(message.media, {});
              console.log('Media downloaded:', media);
              callback({ media });
            } else {
              console.log('No media in the new message.');
              callback({ media: undefined });
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
