/**
 * Route patient
 * @description Redirect request from /patients to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientCtrl = require('../controllers/patientController');
const PatientController = new PatientCtrl();
// Interacts with the patients in the DB
patient.route('/')
    .get(PatientController.searchPatients)
    .post(PatientController.createPatient)
    .patch(PatientController.setPatientAsDeleted)
    .put(PatientController.updateConsent)
    .delete(PatientController.erasePatientInfo);

// Get the profile of a certain user
patient.route('/:patientId')
    .get(PatientController.getPatientProfileById);

module.exports = patient;
