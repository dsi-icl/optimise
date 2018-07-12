/**
 * Route Patient Diagnosis
 * @description Redirect request from /patientDiagnosis to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientDiagnosisCtrl = require('../controllers/patientDiagnosisController');
const PatientController = new PatientDiagnosisCtrl();
// Interacts with the patientsPregnancy in the DB
patient.route('/')
    .get(PatientController.getPatientDiagnosis)
    .post(PatientController.createPatientDiagnosis)
    .patch(PatientController.updatePatientDiagnosis)
    .delete(PatientController.deletePatientDiagnosis);

module.exports = patient;