/**
 * Route patientPii
 * @description Redirect request from /patientPii to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientPiiCtrl = require('../controllers/patientPiiController');
const PatientController = new PatientPiiCtrl();
// Interacts with the patientsPII in the DB
patient.route('/')
    .get(PatientController.getPatientPii)
    .post(PatientController.createPatientPii)
    .patch(PatientController.updatePatientPii)
    .delete(PatientController.deletePatientPii);

module.exports = patient;
