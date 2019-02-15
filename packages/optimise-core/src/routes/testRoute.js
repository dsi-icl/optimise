/**
 * Route test
 * @description Redirect request from /tests to the proper controller call
 */

import express from 'express';

const test = express();

import TestController from '../controllers/testController';

test.route('/')
    .post(TestController.createTest)
    .delete(TestController.deleteTest)
    .put(TestController.updateTest);

export default test;