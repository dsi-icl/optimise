const PatientDiagnosisCore = require('../core/patientDiagnosis');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

function PatientDiagnosisController() {
    this.patientDiagnosis = new PatientDiagnosisCore();

    this.getPatientDiagnosis = PatientDiagnosisController.prototype.getPatientDiagnosis.bind(this);
    this.createPatientDiagnosis = PatientDiagnosisController.prototype.createPatientDiagnosis.bind(this);
    this.updatePatientDiagnosis = PatientDiagnosisController.prototype.updatePatientDiagnosis.bind(this);
    this.deletePatientDiagnosis = PatientDiagnosisController.prototype.deletePatientDiagnosis.bind(this);
    this.getDiagnosisOptions = PatientDiagnosisController.prototype.getDiagnosisOptions.bind(this);
}

PatientDiagnosisController.prototype.getPatientDiagnosis = function (req, res) {
    if (req.query.hasOwnProperty('patient')) {
        this.patientDiagnosis.getPatientDiagnosis({ 'patient': parseInt(req.query.patient) }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    } else {
        this.patientDiagnosis.getPatientDiagnosis({}).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return;
        });
    }
};

PatientDiagnosisController.prototype.createPatientDiagnosis = function (req, res) {
    let entryObj = {};
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('diagnosis') && req.body.hasOwnProperty('diagnosisDate') &&
        typeof req.body.patient === 'number' && typeof req.body.diagnosis === 'number' && typeof req.body.diagnosisDate === 'string') {
        let momentDiagnos = moment(req.body.diagnosisDate, moment.ISO_8601);
        if (!momentDiagnos.isValid()) {
            let msg = messages.dateError[momentDiagnos.invalidAt()] !== undefined ? messages.dateError[momentDiagnos.invalidAt()] : messages.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(messages.userError.INVALIDDATE)));
            return;
        }
        entryObj.patient = req.body.patient;
        entryObj.diagnosis = req.body.diagnosis;
        entryObj.diagnosisDate = momentDiagnos.valueOf();
        entryObj.createdByUser = req.user.id;
        this.patientDiagnosis.createPatientDiagnosis(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!(req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('diagnosis') && req.body.hasOwnProperty('diagnosisDate'))) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
    }
};

PatientDiagnosisController.prototype.updatePatientDiagnosis = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        let entryObj = req.body;
        entryObj.createdByUser = req.user.id;
        this.patientDiagnosis.updatePatientDiagnosis(req.user, req.body.id, entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        return;
    }
};

PatientDiagnosisController.prototype.deletePatientDiagnosis = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.patientDiagnosis.deletePatientDiagnosis(req.user, { 'id': req.body.id }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(messages.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        return;
    }
};

PatientDiagnosisController.prototype.getDiagnosisOptions = function (__unused__req, res) {
    this.patientDiagnosis.getDiagnosisOptions().then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
        return;
    });
};

module.exports = PatientDiagnosisController;