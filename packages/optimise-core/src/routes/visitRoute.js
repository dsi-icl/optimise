/**
 * Route visit.
 * @description Redirect request from /visits to the proper controller call
 */


import express from 'express';

import VisitController from '../controllers/visitController';

const visit = express();

visit.route('/report')
    .get(VisitController.getReportOfVisit)
    .post(VisitController.createReport)
    .put(VisitController.updateReport)
    .delete(VisitController.deleteReport);

visit.route('/')
    .get(VisitController.getVisitsOfPatient)
    .post(VisitController.createVisit)
    .put(VisitController.updateVisit)
    .delete(VisitController.deleteVisit);

export default visit;
