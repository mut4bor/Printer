import { By, WebElement } from 'selenium-webdriver';

export const findLiveMatchLink = async (
  element: WebElement
): Promise<WebElement | null> => {
  try {
    const parent = await element.findElement(By.xpath('..'));
    if (parent) {
      try {
        const divRoleButton = await parent.findElement(
          By.xpath('./div[@role="button"]')
        );
        if (divRoleButton) {
          return divRoleButton;
        }
      } catch (err) {
        return findLiveMatchLink(parent);
      }
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};
