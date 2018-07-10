/*eslint no-console: "off"*/
const { erase, migrate } = require('../src/utils/db-handler');

module.exports = () => new Promise(function (resolve, reject) {
    process.env.NODE_ENV = 'test';
    if (process.env.NODE_ENV !== 'production') console.log('\n');
    erase().then(() => migrate('testing').then(() => resolve(true)).catch(err => reject(err))).catch(err => reject(err));
});
