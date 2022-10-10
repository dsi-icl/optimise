/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

import CeController from '../controllers/syncController';

const ce = express();

ce.route('/v1')
    .post(CeController.createSyncV1_0)
    .get(CeController.checkSync);

ce.route('/v1.0')
    .post(CeController.createSyncV1_0)
    .get(CeController.checkSync);

ce.route('/v1.1')
    .post(CeController.createSyncV1_1)
    .get(CeController.checkSync);

export default ce;