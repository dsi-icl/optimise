const SelectorUtils = require('../utils/selector-utils');
const PatientCore = require('../core/patient');
const knex = require('../utils/db-connection');
const ErrorHelper = require('../utils/error_helper');
const eraseEntry = require('../utils/controller-utils');
const message = require('../utils/message-utils');

function PatientController() {
    this.patient = new PatientCore();

    this.searchPatients = PatientController.prototype.searchPatients.bind(this);
    this.createPatient = PatientController.prototype.createPatient.bind(this);
    this.setPatientAsDeleted = PatientController.prototype.setPatientAsDeleted.bind(this);
    this.getPatientProfileById = PatientController.prototype.getPatientProfileById.bind(this);
    this.erasePatientInfo = PatientController.prototype.erasePatientInfo.bind(this);
}

PatientController.prototype.searchPatients = function (req, res) {  //get all list of patient if no query string; get similar if querystring is provided
    let queryid;
    if (Object.keys(req.query).length === 0) {
        queryid = '';
    } else if (Object.keys(req.query).length === 1 && typeof (req.query.id) === 'string') {
        queryid = req.query.id;
    } else {
        res.status(400).send('The query string can only have one parameter "id"');
        return;
    }
    queryid = `%${queryid}%`;
    this.patient.searchPatients(queryid).then(function (result) {
        res.status(200).json(result);
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
            createdByUser: req.requester.id
        };
        this.patient.createPatient(req.requester, entryObj).then(function (result) {
            res.status(200).json(result);
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

PatientController.prototype.setPatientAsDeleted = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('aliasId')) {
        this.patient.deletePatient(req.requester, { aliasId: req.body.aliasId, deleted: '-' }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.getPatientProfileById = function (req, res) {
    if (req.params.hasOwnProperty('patientId')) {
        this.patient.getPatient({ 'aliasId': req.params.patientId, deleted: '-' }, { patientId: 'id', study: 'study' }).then(function (Patientresult) {
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
                        res.status(400).send('something in your ?getOnly is not permitted! The options are "getDemographicData", "getImmunisations", "getMedicalHistory", "getVisits", "getTests", "getTreatments", "ClinicalEvents"');
                        throw 'stopping the chain';
                    }
                }
                return Promise.all(promiseArr);
            } else if (req.query.getOnly) {
                res.status(400).json(ErrorHelper('please format your ?getOnly with fields separated by commas'));
                return;
            } else {
                const promiseArr = [];
                const availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents'];
                for (let i = 0; i < availableFunctions.length; i++) {
                    promiseArr.push(SelectorUtils[availableFunctions[i]](patientId));
                }
                let selectorPromises = Promise.all(promiseArr);
                selectorPromises.then(function (result) {
                    const responseObj = {};
                    responseObj.patientId = req.params.patientId;
                    responseObj.id = patientId;
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

/**
 * TODO : Patch flow
 */
PatientController.prototype.erasePatientInfo = function (req, res) {
    let patientId = undefined;
    let visitId = [];
    if (req.requester.priv !== 1) {
        res.status(403).send('Sorry! Only admins are able to edit / delete data');
        return;
    }
    if (Object.keys(req.query).length === 0 || Object.keys(req.query).length > 1 && typeof (req.query.id) !== 'string') {
        res.status(400).send('No query found');
        return;
    }
    knex('PATIENTS')
        .select({ patientId: 'id' })
        .where('aliasId', 'like', `%${req.query.id}%`)
        .then(resultPatient => {
            patientId = resultPatient[0].patientId;
            if (resultPatient.length > 1) {
                res.status(400).send('Asked id too similar to others. Please refine your request');
                throw ('Too much results.');
            }
            if (patientId === undefined) {
                res.status(400).send('Error while retreiving the asked user. Check information sent');
                throw ('Too much results.');
            }
            eraseEntry(res, 'patient_immunisation', { 'patient': patientId }, 'Row for patient immunisation', null, false);
            eraseEntry(res, 'PATIENT_DEMOGRAPHIC', { 'patient': patientId }, 'Row for patient demographic data', null, false);
            eraseEntry(res, 'patient_existing_or_familial_medical_conditions', { 'patient': patientId }, 'Row for patient medical history', null, false);
            //Erase the visit and all the linked row in other tables depending on visitId
            knex('VISITS')
                .select({ visitId: 'id' })
                .where({ 'patient': patientId })
                .then(resultVisit => {
                    if (resultVisit.length > 0) {
                        for (let i = 0; i < resultVisit.length; i++) {
                            visitId[i] = resultVisit[i].visitId;
                            eraseEntry(res, 'VISIT_DATA', { 'visit': visitId[i] }, 'Row for visit data', null, false);
                            for (let i = 0; !visitId && i < visitId.length; i++) {
                                //Erase Ordered test and test data
                                knex('ORDERED_TESTS')
                                    .select({ testId: 'id' })
                                    .where({ 'orderedDuringVisit': visitId[i] })
                                    .then(resultTest => {
                                        for (let j = 0; resultTest.length !== 0 && j < resultTest.length; j++) {
                                            eraseEntry(res, 'TEST_DATA', { 'test': resultTest[j].testId }, 'Row for test data', null, false);
                                        }
                                    });
                                eraseEntry(res, 'ORDERED_TEST', { 'orderedDuringVisit': visitId[i] }, 'Row for tests', null, false);
                                //Erase Treatment and Treatment Data
                                knex('TREATMENTS')
                                    .select({ treatmentId: 'id' })
                                    .where({ 'orderedDuringVisit': visitId[i] })
                                    .then(resultTreatment => {
                                        for (let j = 0; resultTreatment.length !== 0 && j < resultTreatment.length; j++) {
                                            eraseEntry(res, 'TREATMENTS_INTERRUPTION', { 'treatment': resultTreatment[j] }, 'Row for treatment interuption', null, false);
                                        }
                                    });
                                eraseEntry(res, 'TREATMENTS', { 'orderedDuringVisit': visitId[i] }, 'Row for treatments', null, false);
                                //Erase Clinical Event and Clinical Event Data
                                knex('CLINICAL_EVENTS')
                                    .select({ ceId: 'id' })
                                    .where({ 'recordedDuringVisit': visitId })
                                    .then(resultCE => {
                                        for (let j = 0; resultCE.length !== 0 && j < resultCE.length; j++) {
                                            eraseEntry(res, 'CLINICQL_EVENT_DATA', { 'clinicalEvent': resultCE[j] }, 'Row for clinical event data', null, false);
                                        }
                                    });
                                eraseEntry(res, 'CLINICAL_EVENTS', { 'recordedDuringVisit': visitId[i] }, 'Row for clinical event', null, false);
                                eraseEntry(res, 'VISITS', { 'id': visitId[i] }, 'Row for visits', null, false);
                            }
                        }
                    }
                });
        }).catch(__unused__err => {
            if (process.env.NODE_ENV !== 'production')
                ; //console.log(err);
            return;
        });
    res.status(200).send('Erasure completed. Check for any data retreivable if needed.');
};

module.exports = PatientController;