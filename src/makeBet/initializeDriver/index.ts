import Chrome from 'selenium-webdriver/chrome';

export const initializeDriver = () => {
  const service = new Chrome.ServiceBuilder().build();
  const options = new Chrome.Options();
  // .addArguments('headless')
  // .addArguments('disable-gpu')
  // .addArguments('window-size=1920,1080');

  return Chrome.Driver.createSession(options, service);
};
