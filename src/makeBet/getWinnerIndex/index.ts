import { By, WebDriver, WebElement } from 'selenium-webdriver';

export const getWinnerIndex = async ({
  driver,
  winnerTeamSpan,
  loserTeamSpan,
  spanClassName,
}: {
  driver: WebDriver;
  winnerTeamSpan: WebElement;
  loserTeamSpan: WebElement;
  spanClassName: string;
}) => {
  const spanArray = await driver.findElements(By.css(`span.${spanClassName}`));

  const winnerTeamIndex = spanArray.indexOf(winnerTeamSpan);
  const secondTeamIndex = spanArray.indexOf(loserTeamSpan);

  return winnerTeamIndex > secondTeamIndex ? 2 : 1;
};
