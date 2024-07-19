import Chrome from 'selenium-webdriver/chrome';
import { BETTING_SITE_URL, BETTING_COOKIES } from '@/config';
import { setTimeout } from 'timers/promises';
import { By, until } from 'selenium-webdriver';
import { findDivRoleButton } from '@/hooks/findDivRoleButton';
import { findSecondTeam } from '@/hooks/findSecondTeam';
import { getWinnerIndex } from './getWinnerIndex';
import fs from 'fs';

export const useMakeBet = async ({
  winner,
  map,
}: {
  winner: string;
  map: number;
}) => {
  const service = new Chrome.ServiceBuilder().build();
  const options = new Chrome.Options()
    .addArguments('headless')
    .addArguments('disable-gpu')
    .addArguments('window-size=1920,1080');

  const driver = Chrome.Driver.createSession(options, service);

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

    const liveBetsButton = await driver.wait(
      until.elementLocated(By.css('button[data-at-el="live-filter-btn"]')),
      10000
    );

    await driver.wait(until.elementIsVisible(liveBetsButton), 10000);

    await setTimeout(2000);

    liveBetsButton.click();

    await setTimeout(2000);

    const winnerSpan = await driver.wait(
      until.elementLocated(By.xpath(`//span[text()="${winner}"]`)),
      10000
    );

    await driver.wait(until.elementIsVisible(winnerSpan), 10000);

    const secondTeamSpan = await findSecondTeam({
      element: winnerSpan,
      winnerSpan,
    });

    const winnerSpanClassName = await winnerSpan.getAttribute('class');

    if (secondTeamSpan) {
      const winnerIndex = await getWinnerIndex({
        driver: driver,
        winnerTeam: winnerSpan,
        secondTeam: secondTeamSpan,
        spanClassName: winnerSpanClassName,
      });

      const divRoleButton = await findDivRoleButton(winnerSpan);

      if (divRoleButton) {
        await driver.executeScript('arguments[0].click();', divRoleButton);
      }

      const mapButton = await driver.wait(
        until.elementLocated(By.xpath(`//button[text()="Карта ${map}"]`)),
        10000
      );

      await setTimeout(2000);

      if (mapButton) {
        mapButton.click();
      }

      await setTimeout(2000);

      const matchResultHeading = await driver.wait(
        until.elementLocated(By.xpath("//div[text()='Исход']")),
        10000
      );

      await driver.wait(until.elementIsVisible(matchResultHeading), 10000);

      const section = await driver.findElement(
        By.xpath("//div[text()='Исход']/ancestor::section[1]")
      );

      await driver.wait(until.elementIsVisible(section), 10000);

      const winnerButton = section.findElement(
        By.xpath(`//div[text()="П${winnerIndex}"]/ancestor::button`)
      );

      await driver.wait(until.elementIsVisible(winnerButton), 10000);

      await setTimeout(1000);

      winnerButton.click();

      await setTimeout(2000);

      const betInputContainer = await driver.wait(
        until.elementLocated(
          By.xpath('//span[text()="Сумма ставки"]/ancestor::div[1]')
        ),
        10000
      );

      const betInput = await betInputContainer.findElement(
        By.xpath('.//input')
      );

      await driver.wait(until.elementIsVisible(betInput), 10000);

      betInput.sendKeys(200);

      await setTimeout(2000);

      const makeBetButton = await driver.wait(
        until.elementLocated(By.xpath('//button[text()="Пополнить"]')),
        10000
      );

      await driver.wait(until.elementIsVisible(makeBetButton), 10000);

      makeBetButton.click();

      console.log('bet has been made!');
    }
  } catch (error) {
    console.error('Ошибка при выполнении ставки:', error);
  } finally {
    await setTimeout(2000);
    await driver.quit();
  }
};
