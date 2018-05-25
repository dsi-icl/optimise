/**
 * Route patient
 * @description Redirect request from /api/patients to the proper controller call 
 */

const express = require('express');
const patient = express();
const bodyParser = require("body-parser");

const PatientController = require('../controllers/patientController');

patient.set('x-powered-by', false);
patient.use(bodyParser.json());
patient.use(bodyParser.urlencoded({ extended: true }));

patient.route('/')
   .get(PatientController.searchPatients)
   .post(PatientController.createPatient)
   .delete(PatientController.setPatientAsDeleted);

module.exports = patient;