const PatientDiagnosisCore = require('../core/patientDiagnosis');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

const PatientDiagnosisModel = {
    'patient': 0,
    'diagnosis': '',
    'diagnosisDate': ''
};

function PatientDiagnosisController() {
    this.patientDiagnosis = new PatientDiagnosisCore();

    this.getPatientDiagnosis = PatientDiagnosisController.prototype.getPatientDiagnosis.bind(this);
    this.createPatientDiagnosis = PatientDiagnosisController.prototype.createPatientDiagnosis.bind(this);
    this.updatePatientDiagnosis = PatientDiagnosisController.prototype.updatePatientDiagnosis.bind(this);
    this.deletePatientDiagnosis = PatientDiagnosisController.prototype.deletePatientDiagnosis.bind(this);
}

PatientDiagnosisController.prototype.getPatientDiagnosis = function (req, res) {
    if (req.query.hasOwnProperty('patient')) {
        this.patientDiagnosis.getPatientDiagnosis({ 'patient': parseInt(req.query.patient) }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    } else {
        this.patientDiagnosis.getPatientDiagnosis({}).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    }
};

PatientDiagnosisController.prototype.createPatientDiagnosis = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('diagnosis') && req.body.hasOwnProperty('diagnosisDate')) {
        let entryObj = Object.assign({}, PatientDiagnosisModel, req.body);
        entryObj.createdByUser = req.user.id;
        this.patientDiagnosis.createPatientDiagnosis(entryObj).then(function (result) {
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

PatientDiagnosisController.prototype.updatePatientDiagnosis = function (req, res) {
    if (req.body.hasOwnProperty('id')) {
        let entryObj = Object.assign({}, PatientDiagnosisModel, req.body);
        delete entryObj.id;
        entryObj.createdByUser = req.user.id;
        this.patientDiagnosis.updatePatientDiagnosis(req.user, req.body.id, entryObj).then(function (result) {
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

PatientDiagnosisController.prototype.deletePatientDiagnosis = function (req, res) {
    if (req.body.hasOwnProperty('id')) {
        this.patientDiagnosis.deletePatientDiagnosis(req.user, { 'id': req.body.id }).then(function (result) {
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

module.exports = PatientDiagnosisController;