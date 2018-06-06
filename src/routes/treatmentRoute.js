/**
 * Route treatment
 * @description Redirect request from /api/treatments to the proper controller call 
 */

const express = require('express');
const treatment = express();
const bodyParser = require("body-parser");

const TreatmentController = require('../controllers/treatmentController');

treatment.set('x-powered-by', false);
treatment.use(bodyParser.json());
treatment.use(bodyParser.urlencoded({ extended: true }));

treatment.route('/')
   .post(TreatmentController.createTreatment)
   .put(TreatmentController.editTreatment)
   .delete(TreatmentController.deleteTreatment);

treatment.route('/interrupt')
    .post(TreatmentController.addInterruption)
    .delete(TreatmentController.deleteInterruption);

module.exports = treatment;