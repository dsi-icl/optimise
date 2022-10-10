/**
 * Route treatment
 * @description Redirect request from /treatments to the proper controller call
 */

import express from 'express';

import TreatmentController from '../controllers/treatmentController';

const treatment = express();

treatment.route('/')
    .post(TreatmentController.createTreatment)
    .patch(TreatmentController.addTerminationDate)
    .put(TreatmentController.editTreatment)
    .delete(TreatmentController.deleteTreatment);

treatment.route('/interrupt')
    .post(TreatmentController.addInterruption)
    .put(TreatmentController.editInterruption)
    .delete(TreatmentController.deleteInterruption);

treatment.route('/drugs')
    .get(TreatmentController.getDrugs);

treatment.route('/reasons')
    .get(TreatmentController.getReasons);

export default treatment;