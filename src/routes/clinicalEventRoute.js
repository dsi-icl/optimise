/**
 * Route clinical events
 * @description Redirect request from /api/clinicalEvents to the proper controller call 
 */

const express = require('express');
const ce = express();
const bodyParser = require("body-parser");

const CeController = require('../controllers/ceController');

ce.set('x-powered-by', false);
ce.use(bodyParser.json());
ce.use(bodyParser.urlencoded({ extended: true }));

ce.route('/')
    .post(CeController.createCe);

module.exports = ce;