/**
 * Route patient
 * @description Redirect request from /api/patients and /api/patientProfile to the proper controller call
 */

const express = require('express');
const demogdata = express();

const DemogdataCrtrl = require('../controllers/demographicDataController');
const DemographicController = new DemogdataCrtrl();
// Interacts with the patients in the DB
// Real path expected is /api/patients

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

// Get the profile of a certain user
// Real path expected is /api/patientProfile
demogdata.route('/:dataType')
    .get(DemographicController.getDemogData);

demogdata.route('/Fields/:dataType')
    .get(DemographicController.getFields);

module.exports = demogdata;
