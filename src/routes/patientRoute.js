const express = require('express');
const patient = express();

const PatientController = require('./controllers/patientController');

app.route('/api/patients')
   .get(PatientController.searchPatients)
   .post(PatientController.createPatient)
   .delete(PatientController.setPatientAsDeleted);

module.exports = patient;