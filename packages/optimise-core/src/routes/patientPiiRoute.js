/**
 * Route patientPii
 * @description Redirect request from /patientPii to the proper controller call
 */

import express from 'express';

import PatientController from '../controllers/patientPiiController';

const patient = express();

// Interacts with the patientsPII in the DB
patient.route('/')
    .get(PatientController.getPatientPii)
    .post(PatientController.createPatientPii)
    .put(PatientController.updatePatientPii)
    .delete(PatientController.deletePatientPii);

export default patient;
