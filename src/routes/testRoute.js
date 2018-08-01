/**
 * Route test
 * @description Redirect request from /tests to the proper controller call
 */

const express = require('express');
const test = express();

const TestController = require('../controllers/testController');

const testCtrl = new TestController();

test.route('/')
    .post(testCtrl.createTest)
    .delete(testCtrl.deleteTest)
    .put(testCtrl.updateTest);

module.exports = test;