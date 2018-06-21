/**
 * Route test
 * @description Redirect request from /api/tests to the proper controller call
 */

const express = require('express');
const test = express();
const bodyParser = require('body-parser');

const TestController = require('../controllers/testController');

test.set('x-powered-by', false);
test.use(bodyParser.json());
test.use(bodyParser.urlencoded({ extended: true }));

test.route('/')
    .post(TestController.createTest)
    .delete(TestController.deleteTest);

test.route('/addOccurredDate')
    .post(TestController.addActualOccurredDate);

module.exports = test;