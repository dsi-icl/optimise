/**
 * Route treatment
 * @description Redirect request from /api/treatments to the proper controller call
 */

const express = require('express');
const treatment = express();

const TreatmentController = require('../controllers/treatmentController');

treatment.route('/')
    .post(TreatmentController.createTreatment)
    .patch(TreatmentController.addTerminationDate)
    .put(TreatmentController.editTreatment)
    .delete(TreatmentController.deleteTreatment);

treatment.route('/interrupt')
    .post(TreatmentController.addInterruption)
    .delete(TreatmentController.deleteInterruption);

module.exports = treatment;