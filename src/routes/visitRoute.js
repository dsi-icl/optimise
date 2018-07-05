/**
 * Route visit.
 * @description Redirect request from /api/visits to the proper controller call
 */


const express = require('express');
const visit = express();

const VisitController = require('../controllers/visitController');

visit.route('/')
    .get(VisitController.getVisitsOfPatient)
    .post(VisitController.createVisit)
    .delete(VisitController.deleteVisit);

module.exports = visit;