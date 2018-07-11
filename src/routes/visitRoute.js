/**
 * Route visit.
 * @description Redirect request from /visits to the proper controller call
 */


const express = require('express');
const visit = express();

const VisitCtrl = require('../controllers/visitController');
const VisitController = new VisitCtrl();

visit.route('/')
    .get(VisitController.getVisitsOfPatient)
    .post(VisitController.createVisit)
    .delete(VisitController.deleteVisit);

module.exports = visit;