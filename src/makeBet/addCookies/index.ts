import { WebDriver } from 'selenium-webdriver';

export const addCookies = async (
  driver: WebDriver,
  cookies: {
    domain: string;
    expiry: number;
    httpOnly: boolean;
    name: string;
    path: string;
    sameSite: string;
    secure: boolean;
    value: string;
  }[]
) => {
  cookies.forEach((cookie) => {
    const { domain, name, value } = cookie;
    driver.manage().addCookie({ domain, name, value });
  });
};
