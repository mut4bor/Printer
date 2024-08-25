import { Api, TelegramClient } from 'telegram';
import { TELEGRAM_LOG_CHANNEL_LINK } from '@/config';
import fs from 'fs';
import { CustomFile } from 'telegram/client/uploads';

export const sendMedia = async ({
  client,
  filePath,
  message,
}: {
  client: TelegramClient;
  filePath: string;
  message: string;
}) => {
  await client.invoke(
    new Api.messages.SendMedia({
      peer: TELEGRAM_LOG_CHANNEL_LINK,
      media: new Api.InputMediaUploadedPhoto({
        file: await client.uploadFile({
          file: new CustomFile(filePath, fs.statSync(filePath).size, filePath),
          workers: 1,
        }),
      }),
      message: message,
    })
  );
};
