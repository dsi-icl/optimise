//const express = require('express');
//const app = express();

//const path = require('path');


const knex = require('knex')({
    client: 'sqlite3',
    connection: {filename: "./db/optimise-db.sqlite"}
});


let hey = knex('available_test_types').select('*');