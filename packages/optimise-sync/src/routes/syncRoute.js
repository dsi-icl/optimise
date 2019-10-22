/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

const ce = express();

import CeController from '../controllers/syncController';

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