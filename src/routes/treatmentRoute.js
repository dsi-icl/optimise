/**
 * Route treatment
 * @description Redirect request from /treatments to the proper controller call
 */

const express = require('express');
const treatment = express();

const TreatmentController = require('../controllers/treatmentController');
const TreatmentCtrl = new TreatmentController();

treatment.route('/')
    .post(TreatmentCtrl.createTreatment)
    .patch(TreatmentCtrl.addTerminationDate)
    .put(TreatmentCtrl.editTreatment)
    .delete(TreatmentCtrl.deleteTreatment);

treatment.route('/interrupt')
    .post(TreatmentCtrl.addInterruption)
    .delete(TreatmentCtrl.deleteInterruption);

treatment.route('/drugs')
    .get(TreatmentCtrl.getDrugs);

treatment.route('/reasons')
    .get(TreatmentCtrl.getReasons);

module.exports = treatment;