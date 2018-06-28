// run 'knex seed:run' in ../ to load example data
const data = require('../exampleData');

exports.seed = function (knex) {
    const allPromises = [];

    for (let each in data) {
        allPromises.push(knex(each).del()
            .then(function () {
                return knex(each).insert(data[each]);
            }));
    }

    return Promise.all(allPromises).then(() => console.log('loaded example data')).catch(err => console.log(err));

};
