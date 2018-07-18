const knexconfig = require('../../knexfile');
const knex = require('knex')(knexconfig);

const database = new Proxy(knex, {
    get: function (target, name) {
        if (name === 'then') {
            return new Promise((resolve, reject) => target.then(resolve, reject));
        } else {
            return target[name];
        }
    }
});

module.exports = database;