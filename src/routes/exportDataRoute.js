/**
 * Route export
 * @description Redirect request from /api/exportDatabase to the proper controller call
 */

const express = require('express');
const exportDB = express();
const ExportDataController = require('../controllers/exportDataController');

exportDB.route('/')
    .get(ExportDataController.exportDatabase);

module.exports = exportDB;