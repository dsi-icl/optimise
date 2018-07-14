/**
 * Route clinical events
 * @description Redirect request from /clinicalEvents to the proper controller call
 */

const express = require('express');
const ce = express();

const CeController = require('../controllers/ceController');
const CECtrl = new CeController();

ce.route('/')
    .post(CECtrl.createCe)
    .delete(CECtrl.deleteCe);

module.exports = ce;