const path = require('path');
const extend = require('extend'); // eslint-disable-line import/no-extraneous-dependencies
const util = require('util');

module.exports = function initConfig(baseConfig) {
  const config = {
    baseUrl: 'http://localhost:1337/',
    artifactsPath: 'test/__artifacts__',
    directConnect: true,
    capabilities: {
      browserName: 'chrome',
      unexpectedAlertBehaviour: 'accept',
      chromeOptions: {
        args: ['--disable-infobars'],
      },
    },
    mochaOpts: {
      bail: true,
    },
    specs: [
      path.resolve(__dirname, './*.spec.js'),
    ],
    beforeLaunch() { },
    onComplete() {
      browser.manage().logs().get('browser').then((browserLog) => {
        console.log(`log: ${util.inspect(browserLog)}`); //eslint-disable-line
      });
    },
  };
  return extend(true, baseConfig, config);
};
