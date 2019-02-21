/**
 * Route available fields
 * @description Redirect request from /available/{} to the proper controller call
 */

import express from 'express';

const fields = express();

import AvailableFieldController from '../controllers/availableFieldController';

fields.route('/:dataType')
    .get(AvailableFieldController.getFields);

export default fields;