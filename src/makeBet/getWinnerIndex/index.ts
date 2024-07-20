import { By, WebDriver, WebElement } from 'selenium-webdriver';

export const getWinnerIndex = async ({
  driver,
  winnerTeamSpan,
  secondTeamSpan,
  spanClassName,
}: {
  driver: WebDriver;
  winnerTeamSpan: WebElement;
  secondTeamSpan: WebElement;
  spanClassName: string;
}) => {
  const spanArray = await driver.findElements(By.css(`span.${spanClassName}`));

  const winnerTeamIndex = spanArray.indexOf(winnerTeamSpan);
  const secondTeamIndex = spanArray.indexOf(secondTeamSpan);

  return winnerTeamIndex > secondTeamIndex ? 2 : 1;
};
