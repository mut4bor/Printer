import path from 'path';
import express from 'express';
import cors from 'cors';
import { useReadImage } from '@/hooks/useReadImage';
import { SERVER_PORT } from '@/config';
import { useListenToChannel } from '@/hooks/useListenToChannel';
import { useMakeBet } from './hooks/useMakeBet';
import { useStartBrowserSession } from './hooks/useStartBrowserSession';

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

  useListenToChannel(async ({ message, media }) => {
    console.log('Message:', message);
    if (media) {
      const text = await useReadImage(media);
      if (text) {
        console.log(text);
      }
    }
  });

  const { driver } = await useStartBrowserSession();

  useMakeBet(driver, async () => {});

  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
}

startServer();
