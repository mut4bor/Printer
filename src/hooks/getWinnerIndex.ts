import { By, WebDriver, WebElement } from 'selenium-webdriver';

export const getWinnerIndex = async ({
  driver,
  winnerTeam,
  secondTeam,
  spanClassName,
}: {
  driver: WebDriver;
  winnerTeam: WebElement;
  secondTeam: WebElement;
  spanClassName: string;
}) => {
  const spanArray = await driver.findElements(By.css(`span.${spanClassName}`));

  const winnerTeamIndex = spanArray.indexOf(winnerTeam);
  const secondTeamIndex = spanArray.indexOf(secondTeam);

  return winnerTeamIndex > secondTeamIndex ? 2 : 1;
};
