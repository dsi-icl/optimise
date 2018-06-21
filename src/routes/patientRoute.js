/**
 * Route patient
 * @description Redirect request from /api/patients and /api/patientProfile to the proper controller call
 */

const express = require('express');
const patient = express();
const bodyParser = require('body-parser');

const PatientController = require('../controllers/patientController');

patient.set('x-powered-by', false);
patient.use(bodyParser.json());
patient.use(bodyParser.urlencoded({ extended: true }));

// Interacts with the patients in the DB
// Real path expected is /api/patients
patient.route('/')
    .get(PatientController.searchPatients)
    .post(PatientController.createPatient)
    .patch(PatientController.setPatientAsDeleted)
    .delete(PatientController.erasePatientInfo);

// Get the profile of a certain user
// Real path expected is /api/patientProfile
patient.route('/:patientId')
    .get(PatientController.getPatientProfileById);

module.exports = patient;
