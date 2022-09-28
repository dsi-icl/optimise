/**
 * Route patient
 * @description Redirect request from /demographics to the proper controller call
 */

import express from 'express';

import DemographicController from '../controllers/demographicDataController';

const demogdata = express();
// Interacts with the patients in the DB
// Real path expected is /patients

demogdata.route('/Demographic')
    .post(DemographicController.createDemographic)
    .put(DemographicController.editDemographic)
    .delete(DemographicController.deleteDemographic);

demogdata.route('/Immunisation')
    .post(DemographicController.createImmunisation)
    .put(DemographicController.editImmunisation)
    .delete(DemographicController.deleteImmunisation);

demogdata.route('/MedicalCondition')
    .post(DemographicController.createMedicalCondition)
    .put(DemographicController.editMedicalCondition)
    .delete(DemographicController.deleteMedicalCondition);

demogdata.route('/Pregnancy')
    .post(DemographicController.createPregnancy)
    .put(DemographicController.editPregnancy)
    .delete(DemographicController.deletePregnancy);

// Get the profile of a certain user
// Real path expected is /patientProfile
demogdata.route('/:dataType')
    .get(DemographicController.getDemogData);

demogdata.route('/Fields/:dataType')
    .get(DemographicController.getFields);

export default demogdata;
