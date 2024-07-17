import { WebDriver } from 'selenium-webdriver';
import { BETTING_SITE_URL, BETTING_COOKIES } from '@/config';
import { setTimeout } from 'timers/promises';

export const useMakeBet = async (
  driver: WebDriver,
  callback: (driver: WebDriver) => void
) => {
  try {
    const cookies = JSON.parse(BETTING_COOKIES);
    await driver.get(BETTING_SITE_URL);

    cookies.forEach(
      (cookie: {
        domain: string;
        expiry: number;
        httpOnly: boolean;
        name: string;
        path: string;
        sameSite: string;
        secure: boolean;
        value: string;
      }) => {
        const { domain, name, value } = cookie;
        driver.manage().addCookie({ domain: domain, name: name, value: value });
      }
    );

    await setTimeout(1000);

    await driver.get(BETTING_SITE_URL);

    callback(driver);
  } catch (error) {
    console.error('Ошибка при выполнении ставки:', error);
  } finally {
    // Закрытие драйвера, если нужно
    // await driver.quit();
  }
};
