const knexconfig = require('../../knexfile');
const knex = require('knex')(knexconfig);

module.exports = knex;