const { isEmptyObject } = require('../utils/basic-utils');
const { createEntry, deleteEntry, updateEntry, eraseEntry } = require('../utils/controller-utils');
const SelectorUtils = require('../utils/selector-utils');
const knex = require('../utils/db-connection');

class PatientController {
    searchPatients(req, res) {  //get all list of patient if no query string; get similar if querystring is provided
        let queryid;
        if (isEmptyObject(req.query)) {
            queryid = '';
        } else if (Object.keys(req.query).length === 1 && typeof (req.query.id) === 'string') {
            queryid = req.query.id;
        } else {
            res.status(400).send('The query string can only have one parameter "id"');
            return;
        }
        queryid = `%${  queryid  }%`;
        knex('PATIENTS')
            .select({ patientId: 'PATIENTS.id' }, 'PATIENTS.aliasId', 'PATIENTS.study', 'PATIENT_DEMOGRAPHIC.DOB', 'PATIENT_DEMOGRAPHIC.gender')
            .leftOuterJoin('PATIENT_DEMOGRAPHIC', 'PATIENTS.id', 'PATIENT_DEMOGRAPHIC.patient')
            .where('PATIENTS.aliasId', 'like', queryid)
            .andWhere('PATIENTS.deleted', '-')
            .then(result => {
                res.status(200).json(result);
            });
    }

    createPatient(req, res) {
        let entryObj = {
            aliasId: req.body.aliasId,
            study: req.body.study
        };
        let databaseErrMsg = 'Cannot create patient. ID might already exist. Also, make sure you provide "aliasId" and "study" as keys.';
        createEntry(req, res, 'PATIENTS', entryObj, databaseErrMsg);
    }

    setPatientAsDeleted(req, res) {
        if (req.requester.priv === 1) {
            deleteEntry(req, res, 'PATIENTS', { 'aliasId': req.body.aliasId, 'deleted': '-' }, req.body.aliasId, 1);
        } else {
            res.status(401).send('Sorry! Only admins are able to edit / delete data');
        }
    }

    getPatientProfileById(req, res) {
        knex('PATIENTS')
            .select({ patientId: 'id', study: 'study' })
            .where({ 'aliasId': req.params.patientId, deleted: '-' })
            .then(patientResult => {
                if (patientResult.length === 1) {
                    const patientId = patientResult[0].patientId;
                    return patientId;
                } else {
                    res.status(404).send('cannot find your patient');
                    throw 'stopping the chain';
                }
            })
            .then(patientId => {
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
                    res.status(400).send('please format your ?getOnly with fields separated by commas');
                    throw 'stopping the chain';
                } else {
                    const promiseArr = [];
                    const availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents'];
                    for (let i = 0; i < availableFunctions.length; i++) {
                        promiseArr.push(SelectorUtils[availableFunctions[i]](patientId));
                    }
                    return Promise.all(promiseArr);
                }
            })
            .then(
                result => {
                    const responseObj = {};
                    responseObj.patientId = req.params.patientId;
                    for (let i = 0; i < result.length; i++) {
                        responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                    }
                    res.status(200).send(responseObj);
                })
            .catch(err => console.log(err));
    }

    /**
     * @description Erase every information about te patient (demo / medical history / visists / treatments and so on).
     *
     * @param {*} req Request send by the client. Excpected to send the id of a patient in the query.
     * @param {*} res Response that will be answered by the server.
     * TODO : Add error handling (try/catch)
     */
    erasePatientInfo(req, res) {
        let patientId = undefined;
        let visitId = [];
        if (req.requester.priv !== 1) {
            res.status(403).send('Sorry! Only admins are able to edit / delete data');
            return;
        }
        if (isEmptyObject(req.query) || Object.keys(req.query).length > 1 && typeof (req.query.id) !== 'string') {
            res.status(400).send('No query found');
            return;
        }
        knex('PATIENTS')
            .select({ patientId: 'id' })
            .where('aliasId', 'like', `%${  req.query.id  }%`)
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
                eraseEntry(req, res, 'patient_immunisation', { 'patient': patientId }, 'Row for patient immunisation', null, false);
                eraseEntry(req, res, 'PATIENT_DEMOGRAPHIC', { 'patient': patientId }, 'Row for patient demographic data', null, false);
                eraseEntry(req, res, 'patient_existing_or_familial_medical_conditions', { 'patient': patientId }, 'Row for patient medical history', null, false);
                //Erase the visit and all the linked row in other tables depending on visitId
                knex('VISITS')
                    .select({ visitId: 'id' })
                    .where({ 'patient': patientId })
                    .then(resultVisit => {
                        if (!isEmptyObject(resultVisit) || resultVisit.length > 0) {
                            for (let i = 0; i < resultVisit.length; i++) {
                                visitId[i] = resultVisit[i].visitId;
                                eraseEntry(req, res, 'VISIT_DATA', { 'visit': visitId[i] }, 'Row for visit data', null, false);
                                for (let i = 0; !visitId && i < visitId.length; i++) {
                                    //Erase Ordered test and test data
                                    knex('ORDERED_TESTS')
                                        .select({ testId: 'id' })
                                        .where({ 'orderedDuringVisit': visitId[i] })
                                        .then(resultTest => {
                                            for (let j = 0; !isEmptyObject(resultTest) && j < resultTest.length; j++) {
                                                eraseEntry(req, res, 'TEST_DATA', { 'test': resultTest[j].testId }, 'Row for test data', null, false);
                                            }
                                        });
                                    eraseEntry(req, res, 'ORDERED_TEST', { 'orderedDuringVisit': visitId[i] }, 'Row for tests', null, false);
                                    //Erase Treatment and Treatment Data
                                    knex('TREATMENTS')
                                        .select({ treatmentId: 'id' })
                                        .where({ 'orderedDuringVisit': visitId[i] })
                                        .then(resultTreatment => {
                                            for (let j = 0; !isEmptyObject(resultTreatment) && j < resultTreatment.length; j++) {
                                                eraseEntry(req, res, 'TREATMENTS_INTERRUPTION', { 'treatment': resultTreatment[j] }, 'Row for treatment interuption', null, false);
                                            }
                                        });
                                    eraseEntry(req, res, 'TREATMENTS', { 'orderedDuringVisit': visitId[i] }, 'Row for treatments', null, false);
                                    //Erase Clinical Event and Clinical Event Data
                                    knex('CLINICAL_EVENTS')
                                        .select({ ceId : 'id' })
                                        .where({ 'recordedDuringVisit' : visitId })
                                        .then(resultCE => {
                                            for (let j = 0; !isEmptyObject(resultCE) && j < resultCE.length; j++) {
                                                eraseEntry(req, res, 'CLINICQL_EVENT_DATA', { 'clinicalEvent': resultCE[j] }, 'Row for clinical event data', null, false);
                                            }
                                        });
                                    eraseEntry(req, res, 'CLINICAL_EVENTS', { 'recordedDuringVisit': visitId[i] }, 'Row for clinical event', null, false);
                                    eraseEntry(req, res, 'VISITS', { 'id':visitId[i] }, 'Row for visits', null, false);
                                }
                            }
                        }
                    });
            });
        res.status(200).send('Erasure completed. Check for any data retreivable if needed.');
    }
}


const _singleton = new PatientController();
module.exports = _singleton;