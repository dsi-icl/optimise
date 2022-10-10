/**
 * Route clinical events
 * @description Redirect request from /clinicalEvents to the proper controller call
 */

import express from 'express';

import CeController from '../controllers/ceController';

const ce = express();

ce.route('/')
    .post(CeController.createCe)
    .put(CeController.updateCe)
    .delete(CeController.deleteCe);

export default ce;