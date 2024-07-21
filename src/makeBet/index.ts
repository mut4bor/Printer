import { By } from 'selenium-webdriver';
import { setTimeout } from 'timers/promises';
import { BETTING_SITE_URL, BETTING_COOKIES } from '@/config';
import { initializeDriver } from './initializeDriver';
import { addCookies } from './addCookies';
import { locateElement } from './locateElement';
import { findLoserTeam } from './findLoserTeam';
import { getWinnerIndex } from './getWinnerIndex';
import { findDivRoleButton } from './findDivRoleButton';
import { getBalance } from './getBalance';
import { manageError } from './manageError';
import { BetResult } from './types';

export const makeBet = async ({
  winner,
  map,
}: {
  winner: string;
  map: number;
}): Promise<BetResult> => {
  const driver = initializeDriver();

  try {
    const cookies = JSON.parse(BETTING_COOKIES);

    await driver.get(BETTING_SITE_URL);
    await addCookies(driver, cookies);
    await setTimeout(2000);
    await driver.get(BETTING_SITE_URL);

    const liveButton = await locateElement({
      driver,
      xpath: '//button[@data-at-el="live-filter-btn"]',
    });

    if (!liveButton) {
      return manageError('Live button not found');
    }

    await setTimeout(2000);
    liveButton.click();

    const winnerSpan = await locateElement({
      driver,
      xpath: `//span[text()="${winner}"]`,
    });

    if (!winnerSpan) {
      return manageError('Winner not found on live page');
    }

    const winnerSpanClassName = await winnerSpan.getAttribute('class');

    if (!winnerSpanClassName) {
      return manageError('Winner class name not found on live page');
    }

    const loserTeamSpan = await findLoserTeam({
      element: winnerSpan,
      winnerSpan,
    });

    if (!loserTeamSpan) {
      return manageError('Loser team not found on live page');
    }

    const loserTeamName = await loserTeamSpan.getText();

    if (!loserTeamName) {
      return manageError('Loser team name not found');
    }

    const winnerIndex = await getWinnerIndex({
      driver,
      winnerTeamSpan: winnerSpan,
      loserTeamSpan: loserTeamSpan,
      spanClassName: winnerSpanClassName,
    });

    const liveMatchLink = await findDivRoleButton(winnerSpan);

    if (!liveMatchLink) {
      return manageError('Live match link not found');
    }

    await setTimeout(2000);

    await driver.executeScript('arguments[0].click();', liveMatchLink);

    await setTimeout(2000);

    const mapPickButton = await locateElement({
      driver,
      xpath: `//button[text()="Карта ${map}"]`,
    });

    if (!mapPickButton) {
      return manageError('Map pick button not found');
    }

    await setTimeout(1000);
    mapPickButton.click();

    const matchResultSection = await locateElement({
      driver,
      xpath: "//div[text()='Исход']/ancestor::section[1]",
    });

    if (!matchResultSection) {
      return manageError('Match result section not found');
    }

    const winnerButton = await matchResultSection.findElement(
      By.xpath(`//div[text()="П${winnerIndex}"]/ancestor::button`)
    );

    await setTimeout(1000);
    await winnerButton.click();

    const betInputContainer = await locateElement({
      driver,
      xpath: '//span[text()="Сумма ставки"]/ancestor::div[1]',
    });

    if (!betInputContainer) {
      return manageError('Bet input container not found');
    }

    const betInput = await betInputContainer.findElement(By.xpath('.//input'));

    const balance = await getBalance(driver);

    if (!balance) {
      return manageError('Balance not found');
    }

    if (balance < 10) {
      return manageError('Balance is below 10 rubles');
    }

    const betAmount = Math.max(balance * 0.05, 10);

    await betInput.sendKeys(betAmount);

    const makeBetButton = await locateElement({
      driver,
      xpath: '//button[text()="Заключить"]',
    });

    if (!makeBetButton) {
      return manageError('Make bet button not found');
    }

    makeBetButton.click();

    return {
      success: true,
      message: `Ставка сделана: ${winner} против ${loserTeamName} ${map} карта (Исход: ${winner}) \n Текущий баланс: ${balance - betAmount}`,
    };
  } catch (error) {
    return error instanceof Error
      ? { success: false, message: `Произошла ошибка: ${error.message}` }
      : {
          success: false,
          message: `Произошла неизвестная ошибка: ${error}`,
        };
  } finally {
    await setTimeout(10000);
    await driver.quit();
  }
};
