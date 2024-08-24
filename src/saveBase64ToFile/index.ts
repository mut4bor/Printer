import fs from 'fs';

export const saveBase64ToFile = async (base64: string, filepath: string) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFile(filepath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filepath);
      }
    });
  });
};
