/**
 * Route Patient Diagnosis
 * @description Redirect request from /patientDiagnosis to the proper controller call
 */

const express = require('express');
const patient = express();

const PatientDiagnosisController = require('../controllers/patientDiagnosisController');
const PatientDiagnosisCtrl = new PatientDiagnosisController();
// Interacts with the patientsPregnancy in the DB
patient.route('/')
    .get(PatientDiagnosisCtrl.getPatientDiagnosis)
    .post(PatientDiagnosisCtrl.createPatientDiagnosis)
    .patch(PatientDiagnosisCtrl.updatePatientDiagnosis)
    .delete(PatientDiagnosisCtrl.deletePatientDiagnosis);

module.exports = patient;