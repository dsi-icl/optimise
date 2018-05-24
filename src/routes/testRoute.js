const express = require('express');
const test = express();

const TestController = require('./controllers/testController');

test.route('/')
   .post(TestController.createTest)
   .delete(TestController.deleteTest);

test.route('/addOccurredDate')
   .post(TestController.addActualOccurredDate);

module.exports = test;