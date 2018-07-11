/**
 * Route action
 * @description Redirect request from /internalapi/logs to the proper controller call
 */

const express = require('express');
const action = express();

const ActionCtrl = require('../controllers/actionController');
const ActionController = new ActionCtrl();

action.route('/')
    .get(ActionController.getLogs);

module.exports = action;