import { WebDriver } from 'selenium-webdriver';
import { locateElement } from '../locateElement';

export const getBalance = async (driver: WebDriver): Promise<number | null> => {
  try {
    const balance = await locateElement({
      driver,
      xpath:
        '//p[@class="Text-sc-1bwg3nr-0 DesktopBalance__BalanceAmount-sc-15xoz6u-4 leytvg edfVDs"]',
    });

    if (!balance) {
      return null;
    }
    const balanceText = await balance.getText();

    const cleanedBalanceText = balanceText.replace(/\s/g, '').replace('₽', '');

    const parsedCleanedBalanceText = parseInt(cleanedBalanceText);

    if (isNaN(parsedCleanedBalanceText)) {
      return null;
    }

    return parsedCleanedBalanceText;
  } catch (error) {
    console.error('Error getting balance:', error);
    return null;
  }
};
