/**
 * Route action
 * @description Redirect request from /internalapi/logs to the proper controller call
 */

const express = require('express');
const action = express();

const ActionController = require('../controllers/actionController');
const ActionCtrl = new ActionController();

action.route('/')
    .get(ActionCtrl.getLogs);

module.exports = action;