const PatientPregnancyCore = require('../core/patientPregnancy');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

const PatientPregnancyModel = {
    'patient': 0,
    'startDate': '',
    'outcome': '',
    'outcomeDate': '',
    'meddra': ''
};

function PatientPregnancyController() {
    this.patientPregnancy = new PatientPregnancyCore();

    this.getPatientPregnancy = PatientPregnancyController.prototype.getPatientPregnancy.bind(this);
    this.createPatientPregnancy = PatientPregnancyController.prototype.createPatientPregnancy.bind(this);
    this.updatePatientPregnancy = PatientPregnancyController.prototype.updatePatientPregnancy.bind(this);
    this.deletePatientPregnancy = PatientPregnancyController.prototype.deletePatientPregnancy.bind(this);
}

PatientPregnancyController.prototype.getPatientPregnancy = function (req, res) {
    if (req.query.hasOwnProperty('patient')) {
        this.patientPregnancy.getPatientPregnancy({ 'patient': parseInt(req.query.patient) }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    } else {
        this.patientPregnancy.getPatientPregnancy({}).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    }
};

PatientPregnancyController.prototype.createPatientPregnancy = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('outcome') && req.body.hasOwnProperty('outcomeDate') && req.body.hasOwnProperty('meddra')) {
        let entryObj = Object.assign({}, PatientPregnancyModel, req.body);
        entryObj.createdByUser = req.user.id;
        this.patientPregnancy.createPatientPregnancy(entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    }
};

PatientPregnancyController.prototype.updatePatientPregnancy = function (req, res) {
    if (req.body.hasOwnProperty('id')) {
        let entryObj = Object.assign({}, PatientPregnancyModel, req.body);
        delete entryObj.id;
        entryObj.createdByUser = req.user.id;
        this.patientPregnancy.updatePatientPregnancy(req.user, req.body.id, entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    }
};

PatientPregnancyController.prototype.deletePatientPregnancy = function (req, res) {
    if (req.body.hasOwnProperty('id')) {
        this.patientPregnancy.deletePatientPregnancy(req.user, { 'id': req.body.id }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.DELETEFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    }
};

module.exports = PatientPregnancyController;