import { By, WebElement } from 'selenium-webdriver';

export const findLoserTeam = async ({
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
        const loserTeam = await parent.findElement(By.xpath(xpathExpression));

        if (loserTeam) {
          return loserTeam;
        }
      } catch (err) {
        return findLoserTeam({ element: parent, winnerSpan });
      }
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};
