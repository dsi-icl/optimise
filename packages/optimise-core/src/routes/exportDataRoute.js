/**
 * Route export
 * @description Redirect request from /export to the proper controller call
 */

import express from 'express';
import ExportDataController from '../controllers/exportDataController';

const exportDB = express();

exportDB.route('/')
    .get(ExportDataController.exportDatabase);

export default exportDB;