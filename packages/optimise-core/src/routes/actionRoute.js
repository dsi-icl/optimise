/**
 * Route action
 * @description Redirect request from /internalapi/logs to the proper controller call
 */

import express from 'express';

const action = express();

import ActionController from '../controllers/actionController';

action.route('/')
    .get(ActionController.getLogs);

export default action;