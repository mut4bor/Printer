import { WebDriver } from 'selenium-webdriver';

export const getCookies = async (driver: WebDriver) => {
  const cookies = await driver.manage().getCookies();

  return JSON.stringify(cookies);
};
