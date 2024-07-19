import { By, WebElement } from 'selenium-webdriver';

export const findSecondTeam = async ({
  element,
  winnerSpan,
}: {
  element: WebElement;
  winnerSpan: WebElement;
}): Promise<WebElement | null> => {
  try {
    const winnerSpanClass = await winnerSpan.getAttribute('class');
    const winnerSpanText = await winnerSpan.getText();
    const xpathExpression = `//span[@class="${winnerSpanClass}" and not(contains(text(), '${winnerSpanText}'))]`;
    const parent = await element.findElement(By.xpath('..'));

    if (parent) {
      try {
        const secondTeamName = await parent.findElement(
          By.xpath(xpathExpression)
        );

        if (secondTeamName) {
          return secondTeamName;
        }
      } catch (err) {
        return findSecondTeam({ element: parent, winnerSpan });
      }
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};
