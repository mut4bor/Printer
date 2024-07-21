import { By } from 'selenium-webdriver';
import { setTimeout } from 'timers/promises';
import { BETTING_SITE_URL, BETTING_COOKIES } from '@/config';
import { initializeDriver } from './initializeDriver';
import { addCookies } from './addCookies';
import { locateElement } from './locateElement';
import { findLoserTeam } from './findLoserTeam';
import { getWinnerIndex } from './getWinnerIndex';
import { findLiveMatchLink } from './findLiveMatchLink';
import { getBalance } from './getBalance';
import { manageError } from './manageError';
import { BetResult } from './types';
import { makeScreenshot } from './makeScreenshot';

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
      return manageError({ driver, errorText: 'Live button not found' });
    }

    await setTimeout(2000);
    liveButton.click();

    const winnerSpan = await locateElement({
      driver,
      xpath: `//span[text()="${winner}"]`,
    });

    if (!winnerSpan) {
      return manageError({
        driver,
        errorText: 'Winner not found on live page',
      });
    }

    const winnerSpanClassName = await winnerSpan.getAttribute('class');

    if (!winnerSpanClassName) {
      return manageError({
        driver,
        errorText: 'Winner class name not found on live page',
      });
    }

    const loserTeamSpan = await findLoserTeam({
      element: winnerSpan,
      winnerSpan,
    });

    if (!loserTeamSpan) {
      return manageError({
        driver,
        errorText: 'Loser team not found on live page',
      });
    }

    const loserTeamName = await loserTeamSpan.getText();

    if (!loserTeamName) {
      return manageError({ driver, errorText: 'Loser team name not found' });
    }

    const winnerIndex = await getWinnerIndex({
      driver,
      winnerTeamSpan: winnerSpan,
      loserTeamSpan: loserTeamSpan,
      spanClassName: winnerSpanClassName,
    });

    if (!winnerIndex) {
      return manageError({ driver, errorText: 'Winner index not found' });
    }

    const liveMatchLink = await findLiveMatchLink(winnerSpan);

    if (!liveMatchLink) {
      return manageError({ driver, errorText: 'Live match link not found' });
    }

    await setTimeout(2000);

    await driver.executeScript('arguments[0].click();', liveMatchLink);

    await setTimeout(2000);

    const mapPickButton = await locateElement({
      driver,
      xpath: `//button[text()="Карта ${map}"]`,
    });

    if (!mapPickButton) {
      return manageError({ driver, errorText: 'Map pick button not found' });
    }

    await setTimeout(1000);
    mapPickButton.click();

    const matchResultSection = await locateElement({
      driver,
      xpath: "//div[text()='Исход']/ancestor::section[1]",
    });

    if (!matchResultSection) {
      return manageError({
        driver,
        errorText: 'Match result section not found',
      });
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
      return manageError({
        driver,
        errorText: 'Bet input container not found',
      });
    }

    const betInput = await betInputContainer.findElement(By.xpath('.//input'));

    const balance = await getBalance(driver);

    if (!balance) {
      return manageError({ driver, errorText: 'Balance not found' });
    }

    if (balance < 10) {
      return manageError({ driver, errorText: 'Balance is below 10 rubles' });
    }

    const betAmount = Math.round(Math.max(balance * 0.05, 10));

    await betInput.sendKeys(betAmount);

    const makeBetButton = await locateElement({
      driver,
      xpath: '//button[text()="ЗаключитьЗаключить"]',
    });

    if (!makeBetButton) {
      return manageError({ driver, errorText: 'Make bet button not found' });
    }

    makeBetButton.click();

    const { screenshot } = await makeScreenshot(driver);

    return {
      success: true,
      screenshot: screenshot,
      message: `Ставка сделана: ${winner} против ${loserTeamName} ${map} карта (Исход: ${winner}) \n Текущий баланс: ${balance - betAmount}`,
    };
  } catch (error) {
    const { screenshot } = await makeScreenshot(driver);
    return error instanceof Error
      ? {
          success: false,
          screenshot: screenshot,
          message: `Произошла ошибка: ${error.message}`,
        }
      : {
          success: false,
          screenshot: screenshot,
          message: `Произошла неизвестная ошибка: ${error}`,
        };
  } finally {
    await setTimeout(10000);
    await driver.quit();
  }
};
