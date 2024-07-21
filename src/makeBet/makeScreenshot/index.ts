import { WebDriver } from 'selenium-webdriver';
import { CustomFile } from 'telegram/client/uploads';

export const makeScreenshot = async (driver: WebDriver) => {
  const screenshot = await driver.takeScreenshot();

  return { screenshot };
};
