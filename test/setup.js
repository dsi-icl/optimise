const { eraseAndMigrate } = require('../src/utils/db-handler');

module.exports = () => new Promise(function (resolve, __unused__reject) {
    process.env.NODE_ENV = 'test';
    resolve(eraseAndMigrate('testing'));
});
