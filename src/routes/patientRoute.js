/**
 * Route patient
 * @description Redirect request from /patients to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientController = require('../controllers/patientController');
const PatientCtrl = new PatientController();
// Interacts with the patients in the DB
patient.route('/')
    .get(PatientCtrl.searchPatients)
    .post(PatientCtrl.createPatient)
    .patch(PatientCtrl.deletePatient)
    .put(PatientCtrl.updatePatient)
    .delete(PatientCtrl.erasePatient);

// Get the profile of a certain user
patient.route('/:patientId')
    .get(PatientCtrl.getPatientProfileById);

module.exports = patient;
