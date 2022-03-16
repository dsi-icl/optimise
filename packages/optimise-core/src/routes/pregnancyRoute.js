/**
 * Route Pregnancy
 * @description Redirect request from /patients to the proper controller call
 */

import express from 'express';

const pregnancy = express();

import PregnancyController from '../controllers/pregnancyController';

// Get the pregnancy by patientId
pregnancy
    .route('/:patientId')
    .get(PregnancyController.getPatientPregnanciesById);

pregnancy
    .route('/:patientId/:pregancyId')
    .post(PregnancyController.createPregnancyData);

export default pregnancy;
