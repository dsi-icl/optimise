const express = require('express');
const treatment = express();

const TreatmentController = require('../controllers/treatmentController');

treatment.route('/')
   .post(TreatmentController.createTreatment)
   .put(TreatmentController.editTreatment);

module.exports = treatment;
