/**
 * Route Patient Diagnosis
 * @description Redirect request from /patientDiagnosis to the proper controller call
 */

import express from 'express';

import PatientDiagnosisController from '../controllers/patientDiagnosisController';

const patient = express();

// Interacts with the patientsPregnancy in the DB
patient.route('/')
    .get(PatientDiagnosisController.getPatientDiagnosis)
    .post(PatientDiagnosisController.createPatientDiagnosis)
    .put(PatientDiagnosisController.updatePatientDiagnosis)
    .delete(PatientDiagnosisController.deletePatientDiagnosis);

patient.route('/fields')
    .get(PatientDiagnosisController.getDiagnosisOptions);

export default patient;