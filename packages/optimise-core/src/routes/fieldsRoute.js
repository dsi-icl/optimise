/**
 * Route available fields
 * @description Redirect request from /available/{} to the proper controller call
 */

import express from 'express';

import AvailableFieldController from '../controllers/availableFieldController';

const fields = express();

fields.route('/:dataType')
    .get(AvailableFieldController.getFields);

export default fields;