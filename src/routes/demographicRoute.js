/**
 * Route patient
 * @description Redirect request from /demographics to the proper controller call
 */

const express = require('express');
const demogdata = express();

const DemographicController = require('../controllers/demographicDataController');
const DemogdataCrtrl = new DemographicController();
// Interacts with the patients in the DB
// Real path expected is /patients

demogdata.route('/Demographic')
    .post(DemogdataCrtrl.createDemographic)
    .put(DemogdataCrtrl.editDemographic)
    .delete(DemogdataCrtrl.deleteDemographic);

demogdata.route('/Immunisation')
    .post(DemogdataCrtrl.createImmunisation)
    .put(DemogdataCrtrl.editImmunisation)
    .delete(DemogdataCrtrl.deleteImmunisation);

demogdata.route('/MedicalCondition')
    .post(DemogdataCrtrl.createMedicalCondition)
    .put(DemogdataCrtrl.editMedicalCondition)
    .delete(DemogdataCrtrl.deleteMedicalCondition);

demogdata.route('/Pregnancy')
    .post(DemogdataCrtrl.createPregnancy)
    .put(DemogdataCrtrl.editPregnancy)
    .delete(DemogdataCrtrl.deletePregnancy);

// Get the profile of a certain user
// Real path expected is /patientProfile
demogdata.route('/:dataType')
    .get(DemogdataCrtrl.getDemogData);

demogdata.route('/Fields/:dataType')
    .get(DemogdataCrtrl.getFields);

module.exports = demogdata;
