import { By } from 'selenium-webdriver';
import { setTimeout } from 'timers/promises';
import { BETTING_SITE_URL, BETTING_COOKIES } from '@/config';
import { initializeDriver } from './initializeDriver';
import { addCookies } from './addCookies';
import { locateElement } from './locateElement';
import { findSecondTeam } from './findSecondTeam';
import { getWinnerIndex } from './getWinnerIndex';
import { findDivRoleButton } from './findDivRoleButton';
import { getBalance } from './getBalance';
import { manageError } from './manageError';

export const makeBet = async ({
  winner,
  map,
}: {
  winner: string;
  map: number;
}) => {
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
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    await setTimeout(2000);
    liveButton.click();
    const winnerSpan = await locateElement({
      driver,
      xpath: `//span[text()="${winner}"]`,
    });

    if (!winnerSpan) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    const secondTeamSpan = await findSecondTeam({
      element: winnerSpan,
      winnerSpan,
    });

    if (!secondTeamSpan) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    const winnerSpanClassName = await winnerSpan.getAttribute('class');

    if (!winnerSpanClassName) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    const winnerIndex = await getWinnerIndex({
      driver,
      winnerTeamSpan: winnerSpan,
      secondTeamSpan: secondTeamSpan,
      spanClassName: winnerSpanClassName,
    });
    const divRoleButton = await findDivRoleButton(winnerSpan);

    if (!divRoleButton) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    await setTimeout(2000);
    await driver.executeScript('arguments[0].click();', divRoleButton);
    const balance = await getBalance(driver);

    if (!balance) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    await setTimeout(2000);
    const mapButton = await locateElement({
      driver,
      xpath: `//button[text()="Карта ${map}"]`,
    });

    if (!mapButton) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    await setTimeout(1000);
    mapButton.click();
    const section = await locateElement({
      driver,
      xpath: "//div[text()='Исход']/ancestor::section[1]",
    });

    if (!section) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    const winnerButton = await section.findElement(
      By.xpath(`//div[text()="П${winnerIndex}"]/ancestor::button`)
    );
    await setTimeout(1000);
    await winnerButton.click();
    const betInputContainer = await locateElement({
      driver,
      xpath: '//span[text()="Сумма ставки"]/ancestor::div[1]',
    });

    if (!betInputContainer) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    const betInput = await betInputContainer.findElement(By.xpath('.//input'));

    if (!betInput) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    await betInput.sendKeys(balance * 0.05);
    const makeBetButton = await locateElement({
      driver,
      xpath: '//button[text()="Заключить"]',
    });

    if (!makeBetButton) {
      const errorText = '';
      manageError(errorText);
      throw new Error(errorText);
    }

    makeBetButton.click();
  } catch (error) {
    console.error('Ошибка при выполнении ставки:', error);
  } finally {
    await setTimeout(10000);
    await driver.quit();
  }
};
