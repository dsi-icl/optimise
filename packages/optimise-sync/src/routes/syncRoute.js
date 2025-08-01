/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

import SyncController from '../controllers/syncController';

const sr = express();

sr.route('/v1')
    .post(SyncController.createSyncV1_0)
    .get(SyncController.checkSync);

sr.route('/v1.0')
    .post(SyncController.createSyncV1_0)
    .get(SyncController.checkSync);

sr.route('/v1.1')
    .post(SyncController.createSyncV1_1)
    .get(SyncController.checkSync);

export default sr;
