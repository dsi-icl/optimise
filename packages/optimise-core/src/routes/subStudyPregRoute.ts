/**
 * Route synchronisation requests
 * @description Redirect request from /sync to the proper controller call
 */

import express from 'express';

import SubStudyPregController from '../controllers/subStudyPregController';

const sync = express();

sync.route('/pregnancies')
    .post(SubStudyPregController.createPregnancy)
    .get(SubStudyPregController.searchPregnancies)

sync.route('/pregnancy/:pregnancyId')
    .put(SubStudyPregController.updatePregnancy)
    .get(SubStudyPregController.getPregnancy)
    .delete(SubStudyPregController.deletePregnancy);

sync.route('/offsprings')
    .post(SubStudyPregController.createOffspring)
    .get(SubStudyPregController.searchOffsprings)

sync.route('/offspring/:offspringId')
    .put(SubStudyPregController.updateOffspring)
    .get(SubStudyPregController.getOffspring)
    .delete(SubStudyPregController.deleteOffspring);

export default sync;
