import ActionCore from '../core/actionLog';
import PatientCore from '../core/patient';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import { getEntry, eraseEntry } from '../utils/controller-utils';
import formatToJSON from '../utils/format-response';

class PatientController {

    static searchPatients({ query }, res) {  //get all list of patient if no query string; get similar if querystring is provided
        let queryfield = '';
        let queryvalue = '';
        if (Object.keys(query).length > 2) {
            res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
            return false;
        }
        if (typeof query.field === 'string')
            queryfield = query.field;
        else if (query.field !== undefined) {
            res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
            return false;
        }
        if (typeof query.value === 'string')
            queryvalue = query.value;
        else if (query.value !== undefined) {
            res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
            return false;
        }
        PatientCore.searchPatients(queryfield, queryvalue).then((result) => {
            result.forEach((__unused__r, i) => { result[i].uuid = undefined; });
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return false;
        });
    }

    static createPatient({ body, user }, res) {
        if (!(body.hasOwnProperty('aliasId') && body.hasOwnProperty('consent'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        if (typeof body.aliasId !== 'string' || typeof body.study !== 'string' || typeof body.consent !== 'boolean') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return false;
        }

        if (body.study && body.study !== 'NA') { //study is placeholder for consent date
            if (typeof body.study !== 'string' || !new Date(body.study).valueOf()) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return false;
            }
        }

        const entryObj = {
            aliasId: body.aliasId,
            createdByUser: user.id,
            consent: body.consent
        };
        if (body.study && body.study !== 'NA') { // study is placeholder for consent date
            entryObj.study = body.study;
        }
        PatientCore.createPatient(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(error));
            return false;
        });
    }

    static updatePatient({ body, user }, res) {
        if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        PatientCore.updatePatient(user, body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deletePatient({ user, body }, res) {
        if (user.priv === 1 && body.hasOwnProperty('aliasId')) {
            PatientCore.deletePatient(user, { aliasId: body.aliasId, deleted: '-' }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                return false;
            });
        } else if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return false;
        }
    }

    static getPatientProfileById({ params, query }, res) {
        if (params.hasOwnProperty('patientId')) {
            return PatientCore.getPatientProfile({ aliasId: params.patientId }, false, query.getOnly)
                .then(result => {
                    res.status(200).json(result);
                    return true;
                }, error => {
                    res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                    return false;
                });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return false;
        }
    }

    static erasePatient({ user, body }, res) {
        let patientId = undefined;
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!body.hasOwnProperty('patientId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        if (typeof body.patientId !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return false;
        }
        patientId = body.patientId;
        return getEntry('PATIENTS', { id: patientId }).then(({ length }) => {
            if (length !== 1) {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL));
                return false;
            }

            // Erasing log entries referencing the user
            return PatientCore.getPatientProfile({ id: patientId }, false)
                .then(result => {
                    const promiseContainer = [];
                    promiseContainer.push(ActionCore.erasePatients(result.id, result.patientId, undefined));
                    if (result.visits.length >= 1)
                        for (let i = 0; i < result.visits.length; i++)
                            promiseContainer.push(ActionCore.eraseVisits(result.visits[i].id));
                    if (result.clinicalEvents.length >= 1)
                        for (let i = 0; i < result.clinicalEvents.length; i++)
                            promiseContainer.push(ActionCore.eraseCE(result.clinicalEvents[i].id));
                    if (result.treatments.length >= 1)
                        for (let i = 0; i < result.treatments.length; i++) {
                            if (result.treatments[i].interruptions.length >= 1)
                                for (let j = 0; j < result.treatments[i].interruptions.length; j++)
                                    promiseContainer.push(ActionCore.eraseTreatmentsInters(result.treatments[i].interruptions[j].id));
                            promiseContainer.push(ActionCore.eraseTreatments(result.treatments[i].id));
                            promiseContainer.push(ActionCore.eraseIdOnRoute('/treatments', result.treatments[i].id));
                        }
                    if (result.tests.length >= 1)
                        for (let i = 0; i < result.tests.length; i++)
                            promiseContainer.push(ActionCore.eraseTests(result.tests[i].id));
                    if (result.immunisations.length >= 1)
                        for (let i = 0; i < result.immunisations.length; i++)
                            promiseContainer.push(ActionCore.eraseIdOnRoute('/demographics/Immunisation', result.immunisations[i].id));
                    if (result.medicalHistory.length >= 1)
                        for (let i = 0; i < result.medicalHistory.length; i++)
                            promiseContainer.push(ActionCore.eraseIdOnRoute('/demographics/MedicalCondition', result.medicalHistory[i].id));
                    if (result.hasOwnProperty('demographicData') && result.demographicData !== undefined)
                        promiseContainer.push(ActionCore.eraseIdOnRoute('/demographics/Demographic', result.demographicData.id));
                    if (result.hasOwnProperty('diagnosis') && result.diagnosis.length >= 1)
                        for (let i = 0; i < result.diagnosis.length; i++)
                            promiseContainer.push(ActionCore.eraseIdOnRoute('/patientDiagnosis', result.diagnosis[i].id));
                    if (result.pregnancy.length >= 1)
                        for (let i = 0; i < result.pregnancy.length; i++)
                            promiseContainer.push(ActionCore.eraseIdOnRoute('/demographics/Pregnancy', result.pregnancy[i].id));
                    const promises = Promise.all(promiseContainer);
                    return promises.then(subResult => {
                        if (subResult === 0 && process.env.NODE_ENV !== 'production')
                            console.error('No logs were found corresponding to the patient. Please check the LOG_ACTIONS table.'); // eslint-disable-line no-console
                        return eraseEntry('PATIENTS', { id: patientId }).then(() => {
                            res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                            return true;
                        }).catch((error) => {
                            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                            return false;
                        });
                    }, subError => {
                        if (process.env.NODE_ENV !== 'production') {
                            console.error(JSON.stringify(ErrorHelper('An error occured while erasing logs.', subError))); // eslint-disable-line no-console
                        }
                        return eraseEntry('PATIENTS', { id: patientId }).then(() => {
                            res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                            return true;
                        }).catch((error) => {
                            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                            return false;
                        });
                    });
                }, () => eraseEntry('PATIENTS', { id: patientId }).then(() => {
                    res.status(200).json({ success: true, message: 'Erasure completed. Check for any data retreivable if needed.' });
                    return true;
                }).catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                    return false;
                }));
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default PatientController;
