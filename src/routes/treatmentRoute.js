/**
 * Route treatment
 * @description Redirect request from /treatments to the proper controller call
 */

const express = require('express');
const treatment = express();

const Treatment = require('../controllers/treatmentController');
const TreatmentController = new Treatment();

treatment.route('/')
    .post(TreatmentController.createTreatment)
    .patch(TreatmentController.addTerminationDate)
    .put(TreatmentController.editTreatment)
    .delete(TreatmentController.deleteTreatment);

treatment.route('/interrupt')
    .post(TreatmentController.addInterruption)
    .delete(TreatmentController.deleteInterruption);

treatment.route('/drugs')
    .get(TreatmentController.getDrugs);

module.exports = treatment;