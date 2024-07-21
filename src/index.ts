import path from 'path';
import express from 'express';
import cors from 'cors';
import {
  SERVER_PORT,
  TELEGRAM_ERROR_CHANNEL_LINK,
  TELEGRAM_ERROR_SESSION,
  TELEGRAM_PASSWORD,
  TELEGRAM_PHONE_NUMBER,
} from '@/config';
import { listenToChannel } from '@/listenToChannel';
import { readImage } from '@/readImage';
import { makeBet } from '@/makeBet';
import { StringSession } from 'telegram/sessions';
import { createTelegramClient } from './createTelegramClient';
import { Api } from 'telegram';

async function startServer() {
  const app = express();
  const PORT = SERVER_PORT || 3000;
  const __publicPath = path.join(__dirname, '../', 'public');

  app.use(express.static(__dirname));
  app.use(cors());
  app.options('*', cors());

  app.get('/*', async (req, res) => {
    res.sendFile(path.join(__publicPath, 'index.html'));
  });

  const stringSession = new StringSession(TELEGRAM_ERROR_SESSION);
  const { client } = createTelegramClient(stringSession);

  listenToChannel(async ({ media }) => {
    await client.connect();
    if (!media) return;

    const { winner, map } = await readImage(media);

    if (!winner || !map) return;

    const { message } = await makeBet({ winner, map });

    await client.invoke(
      new Api.messages.SendMessage({
        peer: TELEGRAM_ERROR_CHANNEL_LINK,
        message: message,
      })
    );
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
}

startServer();
