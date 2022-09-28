/**
 * Route action
 * @description Redirect request from /internalapi/logs to the proper controller call
 */

import express from 'express';

import ActionController from '../controllers/actionController';

const action = express();

action.route('/')
    .get(ActionController.getLogs);

export default action;