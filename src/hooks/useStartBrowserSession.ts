import Chrome from 'selenium-webdriver/chrome';

export const useStartBrowserSession = async () => {
  const service = new Chrome.ServiceBuilder().build();

  const options = new Chrome.Options();

  const driver = Chrome.Driver.createSession(options, service);

  return { driver };
};
