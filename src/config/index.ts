import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Getting env-variable
 * @throwable
 */

const getEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`);
  }
  return process.env[key] || '';
};

const SERVER_PORT = getEnvVar('SERVER_PORT');

const API_ID = getEnvVar('API_ID');
const API_HASH = getEnvVar('API_HASH');
const API_SESSION = getEnvVar('API_SESSION');

const TELEGRAM_PHONE_NUMBER = getEnvVar('TELEGRAM_PHONE_NUMBER');
const TELEGRAM_PASSWORD = getEnvVar('TELEGRAM_PASSWORD');
const TELEGRAM_CHANNEL_NAME = getEnvVar('TELEGRAM_CHANNEL_NAME');
const TELEGRAM_CHANNEL_LINK = getEnvVar('TELEGRAM_CHANNEL_LINK');

const BETTING_SITE_URL = getEnvVar('BETTING_SITE_URL');
const BETTING_PHONE_NUMBER = getEnvVar('BETTING_PHONE_NUMBER');
const BETTING_PASSWORD = getEnvVar('BETTING_PASSWORD');
const BETTING_COOKIES = getEnvVar('BETTING_COOKIES');

export {
  SERVER_PORT,
  API_ID,
  API_HASH,
  API_SESSION,
  TELEGRAM_PHONE_NUMBER,
  TELEGRAM_PASSWORD,
  TELEGRAM_CHANNEL_NAME,
  TELEGRAM_CHANNEL_LINK,
  BETTING_SITE_URL,
  BETTING_PHONE_NUMBER,
  BETTING_PASSWORD,
  BETTING_COOKIES,
};
