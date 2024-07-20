import { By, WebDriver, WebElement, until } from 'selenium-webdriver';

export const locateElement = async ({
  driver,
  xpath,
  timeout = 10000,
}: {
  driver: WebDriver;
  xpath: string;
  timeout?: number;
}): Promise<WebElement | null> => {
  const element = await driver.wait(
    until.elementLocated(By.xpath(xpath)),
    timeout
  );
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
};
