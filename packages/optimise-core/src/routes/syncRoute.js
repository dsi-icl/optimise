/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

const sync = express();

import syncController from '../controllers/syncController';

sync.route('/')
    .put(syncController.triggerSync);

sync.route('/options')
    .post(syncController.setSyncOptions)
    .get(syncController.getSyncOptions);

sync.route('/status')
    .get(syncController.getSyncStatus);

export default sync;