/**
 * Route clinical events
 * @description Redirect request from /clinicalEvents to the proper controller call
 */

const express = require('express');
const ce = express();

const CECtrl = require('../controllers/ceController');
const CeController = new CECtrl();

ce.route('/')
    .post(CeController.createCe)
    .delete(CeController.deleteCe);

module.exports = ce;