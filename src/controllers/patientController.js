const SelectorUtils = require('../utils/selector-utils');
const PatientCore = require('../core/patient');
const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { getEntry, eraseEntry } = require('../utils/controller-utils');
const formatToJSON = require('../utils/format-response');

function PatientController() {
    this.patient = new PatientCore();

    this.searchPatients = PatientController.prototype.searchPatients.bind(this);
    this.createPatient = PatientController.prototype.createPatient.bind(this);
    this.setPatientAsDeleted = PatientController.prototype.setPatientAsDeleted.bind(this);
    this.getPatientProfileById = PatientController.prototype.getPatientProfileById.bind(this);
    this.updateConsent = PatientController.prototype.updateConsent.bind(this);
    this.erasePatientInfo = PatientController.prototype.erasePatientInfo.bind(this);
}

PatientController.prototype.searchPatients = function (req, res) {  //get all list of patient if no query string; get similar if querystring is provided
    let queryid;
    if (Object.keys(req.query).length === 0) {
        queryid = '';
    } else if (Object.keys(req.query).length === 1 && typeof (req.query.id) === 'string') {
        queryid = req.query.id;
    } else {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return;
    }
    queryid = `%${queryid}%`;
    this.patient.searchPatients(queryid).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
        return;
    });
};

PatientController.prototype.createPatient = function (req, res) {
    if (req.body.hasOwnProperty('aliasId') && req.body.hasOwnProperty('study')) {
        let entryObj = {
            aliasId: req.body.aliasId,
            study: req.body.study,
            createdByUser: req.user.id
        };
        this.patient.createPatient(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.updateConsent = function (req, res) {
    if (!(req.body.hasOwnProperty('patientId') && req.body.hasOwnProperty('consent'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } if (!(typeof req.body.patientId === 'number' && typeof req.body.consent === 'boolean')) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    } if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    knex('PATIENTS').update({ consent: req.body.consent }).where({ id: req.body.patientId }).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return;
    });
};

PatientController.prototype.setPatientAsDeleted = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('aliasId')) {
        this.patient.deletePatient(req.user, { aliasId: req.body.aliasId, deleted: '-' }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.getPatientProfileById = function (req, res) {
    if (req.params.hasOwnProperty('patientId')) {
        this.patient.getPatient({ 'aliasId': req.params.patientId, deleted: '-' }, { patientId: 'id', study: 'study', consent: 'consent' }).then(function (Patientresult) {
            let patientId;
            if (Patientresult.length === 1) {
                patientId = Patientresult[0].patientId;
            } else {
                res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND));
                return;
            }
            if (req.query.getOnly && typeof (req.query.getOnly) === 'string') {
                let getOnlyArr = req.query.getOnly.split(',');
                getOnlyArr = new Set(getOnlyArr);      //prevent if someone put loads of the same parameters, slowing down the server
                getOnlyArr = Array.from(getOnlyArr);    //prevent if someone put loads of the same parameters, slowing down the server
                const promiseArr = [];
                for (let i = 0; i < getOnlyArr.length; i++) {
                    try {
                        promiseArr.push(SelectorUtils[`get${getOnlyArr[i]}`](patientId));
                    } catch (e) {
                        res.status(400).send('something in your ?getOnly is not permitted! The options are "getDemographicData", "getImmunisations", "getMedicalHistory", "getVisits", "getTests", "getTreatments", "ClinicalEvents", "Pregnancy", "Diagnosis"');
                        throw 'stopping the chain';
                    }
                }
                return Promise.all(promiseArr);
            } else if (req.query.getOnly) {
                res.status(400).json(ErrorHelper('please format your ?getOnly with fields separated by commas'));
                return;
            } else {
                const promiseArr = [];
                const availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents', 'getPregnancy', 'getDiagnosis'];
                for (let i = 0; i < availableFunctions.length; i++) {
                    promiseArr.push(SelectorUtils[availableFunctions[i]](patientId));
                }
                let selectorPromises = Promise.all(promiseArr);
                selectorPromises.then(function (result) {
                    const responseObj = {};
                    responseObj.patientId = req.params.patientId;
                    responseObj.id = patientId;
                    responseObj.consent = Boolean(Patientresult[0].consent);
                    for (let i = 0; i < result.length; i++) {
                        responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                    }
                    res.status(200).json(responseObj);
                    return;
                }, function (error) {
                    res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                    return;
                });
            }
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.erasePatientInfo = function (req, res) {
    let patientId = undefined;
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('patientId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.patientId !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    patientId = req.body.patientId;
    getEntry('PATIENTS', { id: patientId }).then(function (result) {
        if (result.length !== 1) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL));
            return;
        }
        eraseEntry('PATIENTS', { id: patientId }).then(function (__unused__result) {
            res.status(200).json({ success: true, messageg: 'Erasure completed. Check for any data retreivable if needed.' });
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

module.exports = PatientController;