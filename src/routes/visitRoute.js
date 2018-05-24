const express = require('express');
const visit = express();

const VisitController = require('../controllers/visitController');

visit.route('/')
    .get(VisitController.getVisitsOfPatient)
    .post(VisitController.createVisit)
    .delete(VisitController.deleteVisit);

module.exports = visit;