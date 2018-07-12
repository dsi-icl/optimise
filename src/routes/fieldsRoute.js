/**
 * Route available fields
 * @description Redirect request from /available/{} to the proper controller call
 */

const express = require('express');
const fields = express();

const AvailableFieldController = require('../controllers/availableFieldController');

fields.route('/:dataType')
    .get(AvailableFieldController.getFields);

module.exports = fields;