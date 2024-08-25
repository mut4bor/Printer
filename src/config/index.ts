import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const getEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`);
  }
  return process.env[key] || '';
};

const SERVER_PORT = getEnvVar('SERVER_PORT');

const TELEGRAM_API_ID = getEnvVar('TELEGRAM_API_ID');
const TELEGRAM_API_HASH = getEnvVar('TELEGRAM_API_HASH');
const TELEGRAM_API_SESSION = getEnvVar('TELEGRAM_API_SESSION');

const TELEGRAM_PHONE_NUMBER = getEnvVar('TELEGRAM_PHONE_NUMBER');
const TELEGRAM_PASSWORD = getEnvVar('TELEGRAM_PASSWORD');
const TELEGRAM_CHANNEL_LINK = getEnvVar('TELEGRAM_CHANNEL_LINK');

const TELEGRAM_LOG_CHANNEL_LINK = getEnvVar('TELEGRAM_LOG_CHANNEL_LINK');
const TELEGRAM_LOG_SESSION = getEnvVar('TELEGRAM_LOG_SESSION');

const BETTING_SITE_URL = getEnvVar('BETTING_SITE_URL');
const BETTING_PHONE_NUMBER = getEnvVar('BETTING_PHONE_NUMBER');
const BETTING_PASSWORD = getEnvVar('BETTING_PASSWORD');
const BETTING_COOKIES = getEnvVar('BETTING_COOKIES');

export {
  SERVER_PORT,
  TELEGRAM_API_ID,
  TELEGRAM_API_HASH,
  TELEGRAM_API_SESSION,
  TELEGRAM_PHONE_NUMBER,
  TELEGRAM_PASSWORD,
  TELEGRAM_CHANNEL_LINK,
  TELEGRAM_LOG_CHANNEL_LINK,
  TELEGRAM_LOG_SESSION,
  BETTING_SITE_URL,
  BETTING_PHONE_NUMBER,
  BETTING_PASSWORD,
  BETTING_COOKIES,
};
