/**
 * Route comorbidity
 * @description Redirect request from /tests to the proper controller call
 */

import express from 'express';

const comorbidity = express();

import ComorbidityController from '../controllers/comorbidityController';

comorbidity.route('/')
    .post(ComorbidityController.createComorbidity)
    .delete(ComorbidityController.deleteComorbidity);

export default comorbidity;
