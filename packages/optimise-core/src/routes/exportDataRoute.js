/**
 * Route export
 * @description Redirect request from /export to the proper controller call
 */

import express from 'express';

const exportDB = express();
import ExportDataController from '../controllers/exportDataController';

exportDB.route('/')
    .get(ExportDataController.exportDatabase);

export default exportDB;