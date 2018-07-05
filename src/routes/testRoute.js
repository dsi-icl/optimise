/**
 * Route test
 * @description Redirect request from /api/tests to the proper controller call
 */

const express = require('express');
const test = express();

const TestController = require('../controllers/testController');

const testCtrl = new TestController();

test.route('/')
    .post(testCtrl.createTest)
    .patch(testCtrl.deleteTest);

test.route('/addOccurredDate')
    .post(testCtrl.addActualOccurredDate);

module.exports = test;