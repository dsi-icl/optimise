const express = require('express');
const app = express();

const path = require('path');


const knex = require('knex')({
    client: 'sqlite3',
    connection: {filename: "./db/optimise-db.sqlite"},
    pool: {
        afterCreate: function (conn, cb) {
          conn.run('PRAGMA foreign_keys = ON', cb)      ///set timezone ="UTC" ????
        }
      }, 
    useNullAsDefault: true
});



const {PatientController} = require('./src/controllers/patientController');

app.set('x-powered-by', false);



app.get('/api/patients', PatientController.searchPatientsById.bind(knex));



app.get('/api/patient/:patientID', PatientController.getPatientById.bind(knex));



app.listen(3000, ()=>{console.log('listening on port 3000!')});