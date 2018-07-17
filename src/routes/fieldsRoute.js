/**
 * Route available fields
 * @description Redirect request from /available/{} to the proper controller call
 */

const express = require('express');
const fields = express();

const AvailableFieldController = require('../controllers/availableFieldController');
const AvailableFieldCtrl = new AvailableFieldController();

fields.route('/:dataType')
    .get(AvailableFieldCtrl.getFields);

module.exports = fields;