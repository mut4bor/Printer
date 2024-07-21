import { By, WebDriver, WebElement } from 'selenium-webdriver';

const getElementId = async (element: WebElement): Promise<string> => {
  return await element.getId();
};

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
}): Promise<number | null> => {
  const spanArray = await driver.findElements(By.css(`span.${spanClassName}`));

  const winnerTeamId = await getElementId(winnerTeamSpan);
  const loserTeamId = await getElementId(loserTeamSpan);

  const spanArrayIds = await Promise.all(
    spanArray.map(async (element) => await getElementId(element))
  );

  const winnerTeamIndex = spanArrayIds.indexOf(winnerTeamId);
  const loserTeamIndex = spanArrayIds.indexOf(loserTeamId);

  if (winnerTeamIndex === -1 || loserTeamIndex === -1) {
    return null;
  }

  return winnerTeamIndex > loserTeamIndex ? 2 : 1;
};
