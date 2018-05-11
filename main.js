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



function isEmptyObject(object) {
  if (typeof(object) === 'object' && arguments.length === 1) {
    return Object.keys(object).length === 0;
  } else {
    throw TypeError('isEmptyObject() function only takes one object as parameter')
  } 
}

app.set('x-powered-by', false);



app.get('/api/patients', (req, res) => {
  let queryid;
  if (isEmptyObject(req.query)) {
    queryid = '';
  } else if (Object.keys(req.query).length === 1 && typeof(req.query.id) === 'string') {
    queryid = req.query.id;
  } else {
    res.status(400);
    res.send('The query string can only have one parameter "id"');
    return
  }
  queryid = 'patients.alias_id LIKE "%' + queryid + '%"';
  knex('patients')
    .select('patients.id', 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
    .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
    .whereRaw(queryid)
    .then(result => {
      res.status(200);
      res.json(result);
    });
});



app.get('/api/patients/:patientID', (req, res) => {
  knex('patients')
    .select('patients.id', 'patients.alias_id', 'patients.study', 'patient_demographic_data.DOB', 'patient_demographic_data.gender')
    .leftOuterJoin('patient_demographic_data', 'patients.id', 'patient_demographic_data.patient')
    .whereRaw("patients.alias_id IS '" +  req.params.patientID + "'")
    .then(result => {
      res.status(200);
      res.json(result);
    });
});



app.listen(3000, ()=>{console.log('listening on port 3000!')});