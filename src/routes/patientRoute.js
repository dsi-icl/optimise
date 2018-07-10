/**
 * Route patient
 * @description Redirect request from /api/patients and /api/patientProfile to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientCtrl = require('../controllers/patientController');
const PatientController = new PatientCtrl();
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
