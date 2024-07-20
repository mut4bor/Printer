import path from 'path';
import express from 'express';
import cors from 'cors';
import { SERVER_PORT } from '@/config';
import { listenToChannel } from '@/listenToChannel';
import { readImage } from '@/readImage';
import { makeBet } from '@/makeBet';

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

  listenToChannel(async ({ media }) => {
    if (!media) {
      throw new Error('');
    }

    const { winner, map } = await readImage(media);

    if (!winner) {
      throw new Error('');
    }
    if (!map) {
      throw new Error('');
    }

    await makeBet({ winner, map });
  });

  app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
}

startServer();
