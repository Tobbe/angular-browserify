exports.config = {
    directConnect: true,
    rootElement: '.content',
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {'args': ['--disable-extensions --disable-web-security --disk-cache-size=1 --media-cache-size=1']}
    },
};
