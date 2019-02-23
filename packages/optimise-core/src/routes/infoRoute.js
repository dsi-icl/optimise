/**
 * Route info
 * @description Redirect request from /internalapi/info to the proper controller call
 */

import express from 'express';

const info = express();

import InfoController from '../controllers/infoController';

info.route('/')
    .get(InfoController.getInfo);

export default info;