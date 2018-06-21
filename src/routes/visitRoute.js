/**
 * Route visit.
 * @description Redirect request from /api/visits to the proper controller call
 */


const express = require('express');
const visit = express();
const bodyParser = require('body-parser');

const VisitController = require('../controllers/visitController');

visit.set('x-powered-by', false);
visit.use(bodyParser.json());
visit.use(bodyParser.urlencoded({ extended: true }));

visit.route('/')
    .get(VisitController.getVisitsOfPatient)
    .post(VisitController.createVisit)
    .delete(VisitController.deleteVisit);

module.exports = visit;