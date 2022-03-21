/**
 * Route Pregnancy
 * @description Redirect request from /patients to the proper controller call
 */

import express from 'express';

const pregnancy = express();

import PregnancyController from '../controllers/pregnancyController';

// Get the pregnancy & pregnancy data by patientId
pregnancy
    .route('/:patientId')
    .get(PregnancyController.getPatientPregnanciesById);

// Create new pregnancy data record
pregnancy
    .route('/:patientId/:pregnancyId')
    .post(PregnancyController.createPregnancyData);

// Delete pregnancy data record
pregnancy
    .route('/:pregnancyDataId')
    .delete(PregnancyController.deletePregnancyData);

export default pregnancy;
