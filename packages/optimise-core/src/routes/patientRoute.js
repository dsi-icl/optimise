/**
 * Route patient
 * @description Redirect request from /patients to the proper controller call
 */

import express from 'express';

import PatientController from '../controllers/patientController';

const patient = express();

// Interacts with the patients in the DB
patient.route('/')
    .get(PatientController.searchPatients)
    .post(PatientController.createPatient)
    .patch(PatientController.deletePatient)
    .put(PatientController.updatePatient)
    .delete(PatientController.erasePatient);

// Get the profile of a certain user
patient.route('/:patientId')
    .get(PatientController.getPatientProfileById);

export default patient;
