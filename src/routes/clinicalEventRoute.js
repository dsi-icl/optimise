/**
 * Route clinical events
 * @description Redirect request from /api/clinicalEvents to the proper controller call
 */

const express = require('express');
const ce = express();

const CeController = require('../controllers/ceController');

ce.route('/')
    .post(CeController.createCe)
    .delete(CeController.deleteCe);

module.exports = ce;