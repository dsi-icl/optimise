const { eraseDatabase } = require('../src/utils/db-handler');

module.exports = () => new Promise(function (resolve, __unused__reject) {
    resolve(eraseDatabase());
});
