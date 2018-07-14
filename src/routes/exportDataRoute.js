/**
 * Route export
 * @description Redirect request from /export to the proper controller call
 */

const express = require('express');
const exportDB = express();
const ExportDataController = require('../controllers/exportDataController');
const ExportDataCtrl = new ExportDataController();

exportDB.route('/')
    .get(ExportDataCtrl.exportDatabase);

module.exports = exportDB;