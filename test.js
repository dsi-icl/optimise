var webdriver = require('selenium-webdriver');

// Input capabilities
var capabilities = {
    'browserName': 'IE',
    'browser_version': '11.0',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1024x768',
    'browserstack.user': 'florianguitton1',
    'browserstack.key': 'sGpqJBeAqejQFbpVwYws',
    'project': 'optimise'
};

var driver = new webdriver.Builder().
    usingServer('http://hub-cloud.browserstack.com/wd/hub').
    withCapabilities(capabilities).
    build();

driver.get('http://www.google.com').then(function () {
    driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack\n').then(function () {
        driver.getTitle().then(function (title) {
            console.log(title);
            driver.quit();
        });
    });
});