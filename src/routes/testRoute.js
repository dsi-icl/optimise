/**
 * Route test
 * @description Redirect request from /api/tests to the proper controller call
 */

const express = require('express');
const test = express();

const TestController = require('../controllers/testController');

test.route('/')
    .post(TestController.createTest)
    .patch(TestController.deleteTest);

test.route('/addOccurredDate')
    .post(TestController.addActualOccurredDate);

module.exports = test;