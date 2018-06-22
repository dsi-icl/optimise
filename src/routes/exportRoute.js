/**
 * Route export
 * @description Redirect request from /api/exportDb to the proper controller call 
 */

const express = require('express');
const exportDatabase = express();
const bodyParser = require("body-parser");

const ExportController = require('../controllers/exportController');

exportDatabase.set('x-powered-by', false);
exportDatabase.use(bodyParser.json());
exportDatabase.use(bodyParser.urlencoded({ extended: true }));

exportDatabase.route('/exportDb')
   .get(ExportController.exportDb);

// TODO: export search results

module.exports = exportDatabase;