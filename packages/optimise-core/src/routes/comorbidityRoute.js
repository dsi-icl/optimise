/**
 * Route comorbidity
 * @description Redirect request from /comorbidities to the proper controller call
 */

import express from 'express';

import ComorbidityController from '../controllers/comorbidityController';

const comorbidity = express();

comorbidity.route('/')
    .post(ComorbidityController.createComorbidity)
    .put(ComorbidityController.editComorbidity)
    .delete(ComorbidityController.deleteComorbidity);

export default comorbidity;
