/**
 * Route patientPii
 * @description Redirect request from /patientPii to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientController = require('../controllers/patientPiiController');
const PatientPiiCtrl = new PatientController();
// Interacts with the patientsPII in the DB
patient.route('/')
    .get(PatientPiiCtrl.getPatientPii)
    .post(PatientPiiCtrl.createPatientPii)
    .put(PatientPiiCtrl.updatePatientPii)
    .delete(PatientPiiCtrl.deletePatientPii);

module.exports = patient;
