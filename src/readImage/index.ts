import sharp from 'sharp';
import Tesseract from 'tesseract.js';

export const readImage: (
  imagePath: string | Buffer
) => Promise<{ winner: string | null; map: number | null }> = async (
  imagePath
) => {
  try {
    const imageBuffer = await sharp(imagePath)
      .grayscale()
      .modulate({ brightness: 2 })
      .toBuffer();

    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, 'eng+rus', {
      // logger: (log) => console.log(log),
    });

    if (!text || text.trim() === '') {
      throw new Error('No text was recognized.');
    }

    const splittedText = text.trim().split('\n');
    const regex = /(Карта)\s+(\d+)/;
    const splitIndex = splittedText.findIndex(
      (line) => line.includes('Исход') && regex.test(line)
    );

    if (splitIndex === -1) {
      return {
        winner: null,
        map: null,
      };
    }

    const resultString = splittedText[splitIndex];

    const parsedString = resultString
      .replace(';', ':')
      .replace(/(\d+(\.\d+)?)(?!.*\d)/, '')
      .trim();

    const winner = parsedString.replace('Исход:', '').replace(regex, '').trim();
    const map = parseInt(
      parsedString
        .replace(/.*?(Карта\s+\d+).*/, '$1')
        .replace('Карта', '')
        .trim()
    );

    if (winner === '' || isNaN(map)) {
      return {
        winner: null,
        map: null,
      };
    }

    return { winner, map };
  } catch (error) {
    console.error('Error during processing:', error);
    throw error;
  }
};
