import path from 'path';
import express from 'express';
import cors from 'cors';
import { SERVER_PORT, TELEGRAM_ERROR_SESSION } from '@/config';
import { listenToChannel } from '@/listenToChannel';
import { readImage } from '@/readImage';
import { makeBet } from '@/makeBet';
import { StringSession } from 'telegram/sessions';
import { createTelegramClient } from './createTelegramClient';
import fs from 'fs';
import { saveBase64ToFile } from './saveBase64ToFile';
import { sendMedia } from './sendMedia';

const startServer = async () => {
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

  const filePath = './temp_image.jpg';
  listenToChannel(async ({ media }) => {
    await client.connect();
    if (!media) return;

    const { winner, map } = await readImage(media);

    if (!winner || !map) return;

    const { message, screenshot } = await makeBet({ winner, map });

    await saveBase64ToFile(screenshot, filePath);

    await sendMedia({
      client,
      filePath,
      message,
    });

    fs.unlinkSync(filePath);
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
};

startServer();
