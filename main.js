const express = require('express');
const app = express();

const path = require('path');






const {PatientController} = require('./src/controllers/patientController');

app.set('x-powered-by', false);



app.get('/api/patients', PatientController.searchPatientsById);
app.get('/api/patient/:patientID', PatientController.getPatientById);



app.listen(3000, ()=>{console.log('listening on port 3000!')});