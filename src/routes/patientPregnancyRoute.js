/**
 * Route patientPregnancy
 * @description Redirect request from /patientPregnancy to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientPregnancyCtrl = require('../controllers/patientPregnancyController');
const PatientController = new PatientPregnancyCtrl();
// Interacts with the patientsPregnancy in the DB
patient.route('/')
    .get(PatientController.getPatientPregnancy)
    .post(PatientController.createPatientPregnancy)
    .patch(PatientController.updatePatientPregnancy)
    .delete(PatientController.deletePatientPregnancy);

module.exports = patient;
