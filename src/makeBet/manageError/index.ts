import { BetResult } from '@/makeBet/types';
import { makeScreenshot } from '../makeScreenshot';
import { WebDriver } from 'selenium-webdriver';

export const manageError = async ({
  driver,
  errorText,
}: {
  driver: WebDriver;
  errorText: string;
}): Promise<BetResult> => {
  const { screenshot } = await makeScreenshot(driver);
  return {
    success: false,
    screenshot: screenshot,
    message: `Произошла ошибка: ${errorText}`,
  };
};
