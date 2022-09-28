/**
 * Route info
 * @description Redirect request from /internalapi/info to the proper controller call
 */

import express from 'express';

import InfoController from '../controllers/infoController';

const info = express();

info.route('/')
    .get(InfoController.getInfo);

export default info;