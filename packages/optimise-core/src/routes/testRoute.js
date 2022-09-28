/**
 * Route test
 * @description Redirect request from /tests to the proper controller call
 */

import express from 'express';

import TestController from '../controllers/testController';

const test = express();

test.route('/')
    .post(TestController.createTest)
    .delete(TestController.deleteTest)
    .put(TestController.updateTest);

export default test;