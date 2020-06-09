/**
 * Route comorbidity
 * @description Redirect request from /comorbidities to the proper controller call
 */

import express from 'express';

const comorbidity = express();

import ComorbidityController from '../controllers/comorbidityController';

comorbidity.route('/')
    .post(ComorbidityController.createComorbidity)
    .put(ComorbidityController.editComorbidity)
    .delete(ComorbidityController.deleteComorbidity);

export default comorbidity;
