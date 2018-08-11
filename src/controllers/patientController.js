const ActionCore = require('../core/actionLog');
const PatientCore = require('../core/patient');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { getEntry, eraseEntry } = require('../utils/controller-utils');
const formatToJSON = require('../utils/format-response');

function PatientController() {
    this.patient = new PatientCore();
    this.action = new ActionCore();

    this.searchPatients = PatientController.prototype.searchPatients.bind(this);
    this.createPatient = PatientController.prototype.createPatient.bind(this);
    this.deletePatient = PatientController.prototype.deletePatient.bind(this);
    this.getPatientProfileById = PatientController.prototype.getPatientProfileById.bind(this);
    this.updatePatient = PatientController.prototype.updatePatient.bind(this);
    this.erasePatient = PatientController.prototype.erasePatient.bind(this);
}

PatientController.prototype.searchPatients = function (req, res) {  //get all list of patient if no query string; get similar if querystring is provided
    let queryfield = '';
    let queryvalue = '';
    if (Object.keys(req.query).length > 2) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return false;
    }
    if (typeof req.query.field === 'string')
        queryfield = req.query.field;
    else if (req.query.field !== undefined) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return false;
    }
    if (typeof req.query.value === 'string')
        queryvalue = req.query.value;
    else if (req.query.value !== undefined) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return false;
    }
    this.patient.searchPatients(queryfield, queryvalue).then((result) => {
        result.forEach((__unused__r, i) => { result[i].uuid = undefined; });
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
        return false;
    });
};

PatientController.prototype.createPatient = function (req, res) {
    if (req.body.hasOwnProperty('aliasId') && req.body.hasOwnProperty('study') && req.body.hasOwnProperty('consent')) {
        let entryObj = {
            aliasId: req.body.aliasId,
            study: req.body.study,
            createdByUser: req.user.id,
            consent: req.body.consent
        };
        this.patient.createPatient(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(error));
            return false;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return false;
    }
};

PatientController.prototype.updatePatient = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return false;
    }
    this.patient.updatePatient(req.user, req.body).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return false;
    });
};

PatientController.prototype.deletePatient = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('aliasId')) {
        this.patient.deletePatient(req.user, { aliasId: req.body.aliasId, deleted: '-' }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return false;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return false;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return false;
    }
};

PatientController.prototype.getPatientProfileById = function (req, res) {
    if (req.params.hasOwnProperty('patientId')) {
        return this.patient.getPatientProfile({ 'aliasId': req.params.patientId }, true, req.body.getOnly)
            .then(function (result) {
                res.status(200).json(result);
                return true;
            }, function (error) {
                res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                return false;
            });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return false;
    }
};

PatientController.prototype.erasePatient = function (req, res) {
    let patientId = undefined;
    let that = this;
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return false;
    }
    if (!req.body.hasOwnProperty('patientId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return false;
    }
    if (typeof req.body.patientId !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return false;
    }
    patientId = req.body.patientId;
    return getEntry('PATIENTS', { id: patientId }).then((result) => {
        if (result.length !== 1) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL));
            return false;
        }

        // Erasing log entries referencing the user
        return this.patient.getPatientProfile({ id: patientId }, false)
            .then(function (result) {
                let promiseContainer = [];
                promiseContainer.push(that.action.erasePatients(result.id, result.patientId, undefined));
                if (result.visits.length >= 1)
                    for (let i = 0; i < result.visits.length; i++)
                        promiseContainer.push(that.action.eraseVisits(result.visits[i].id));
                if (result.clinicalEvents.length >= 1)
                    for (let i = 0; i < result.clinicalEvents.length; i++)
                        promiseContainer.push(that.action.eraseCE(result.clinicalEvents[i].id));
                if (result.treatments.length >= 1)
                    for (let i = 0; i < result.clinicalEvents.length; i++) {
                        if (result.clinicalEvents[i].interruptions.length >= 1)
                            for (let j = 0; j < result.clinicalEvents[i].interruptions.length; j++)
                                promiseContainer.push(that.action.eraseTreatmentsInters(result.clinicalEvents[i].interruptions[j].id));
                        promiseContainer.push(that.action.eraseTreatments(result.clinicalEvents[i].id));
                        promiseContainer.push(that.action.eraseIdOnRoute('/treatments', result.clinicalEvents[i].id));
                    }
                if (result.tests.length >= 1)
                    for (let i = 0; i < result.tests.length; i++)
                        promiseContainer.push(that.action.eraseTests(result.tests[i].id));
                if (result.immunisations.length >= 1)
                    for (let i = 0; i < result.immunisations.length; i++)
                        promiseContainer.push(that.action.eraseIdOnRoute('/demographics/Immunisation', result.immunisations[i].id));
                if (result.medicalHistory.length >= 1)
                    for (let i = 0; i < result.medicalHistory.length; i++)
                        promiseContainer.push(that.action.eraseIdOnRoute('/demographics/MedicalCondition', result.medicalHistory[i].id));
                if (result.hasOwnProperty('demographicData') && result.demographicData !== undefined)
                    promiseContainer.push(that.action.eraseIdOnRoute('/demographics/Demographic', result.demographicData.id));
                if (result.hasOwnProperty('diagnosis') && result.diagnosis.lenght >= 1)
                    for (let i = 0; i < result.diagnosis.length; i++)
                        promiseContainer.push(that.action.eraseIdOnRoute('/patientDiagnosis', result.diagnosis[i].id));
                if (result.pregnancy.length >= 1)
                    for (let i = 0; i < result.pregnancy.length; i++)
                        promiseContainer.push(that.action.eraseIdOnRoute('/demographics/Pregnancy', result.pregnancy[i].id));
                let promises = Promise.all(promiseContainer);
                return promises.then(function (subResult) {
                    if (subResult === 0 && process.env.NODE_ENV !== 'production')
                        console.error('No logs were found corresponding to the patient. Please check the LOG_ACTIONS table.'); // eslint-disable-line no-console
                    return eraseEntry('PATIENTS', { id: patientId }).then((__unused__result) => {
                        res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                        return true;
                    }).catch((error) => {
                        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                        return false;
                    });
                }, function (subError) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error(JSON.stringify(ErrorHelper('An error occured while erasing logs.', subError))); // eslint-disable-line no-console
                    }
                    return eraseEntry('PATIENTS', { id: patientId }).then((__unused__result) => {
                        res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                        return true;
                    }).catch((error) => {
                        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                        return false;
                    });
                });
            }, function (error) {
                return eraseEntry('PATIENTS', { id: patientId }).then((__unused__result) => {
                    res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                    return true;
                }).catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                    return false;
                });
            });
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
    });
};

module.exports = PatientController;