/**
 * Route clinical events
 * @description Redirect request from /clinicalEvents to the proper controller call
 */

import express from 'express';

const ce = express();

import CeController from '../controllers/ceController';

ce.route('/')
    .post(CeController.createCe)
    .put(CeController.updateCe)
    .delete(CeController.deleteCe);

export default ce;