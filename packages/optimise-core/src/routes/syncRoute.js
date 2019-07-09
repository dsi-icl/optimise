/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

const ce = express();

import CeController from '../controllers/syncController';

ce.route('/')
    .post(CeController.setSyncOptions)
    .put(CeController.triggerSync)
    .get(CeController.getSyncOptions);

export default ce;