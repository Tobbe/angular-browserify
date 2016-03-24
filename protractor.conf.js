exports.config = {

  chromeOnly: true,
  chromeDriver: './node_modules/protractor/selenium/chromedriver',

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['e2e/**/*_spec.js'],

  rootElement: '.content',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
