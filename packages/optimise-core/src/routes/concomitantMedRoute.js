/**
 * Route concomitantMed
 * @description Redirect request from /concomitantMeds to the proper controller call
 */

import express from 'express';

const concomitantMed = express();

import ConcomitantMedController from '../controllers/concomitantMedController';

concomitantMed.route('/')
    .post(ConcomitantMedController.createConcomitantMed)
    .put(ConcomitantMedController.editConcomitantMed)
    .delete(ConcomitantMedController.deleteConcomitantMed);

export default concomitantMed;
