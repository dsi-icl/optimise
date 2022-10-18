import PatientDiagnosisCore from '../core/patientDiagnosis';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import moment from 'moment';

class PatientDiagnosisController {

    static getPatientDiagnosis({ query }, res) {
        if (query.hasOwnProperty('patient')) {
            PatientDiagnosisCore.getPatientDiagnosis({ patient: parseInt(query.patient) }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
                return false;
            });
        } else {
            PatientDiagnosisCore.getPatientDiagnosis({}).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
                return false;
            });
        }
    }

    static createPatientDiagnosis({ body, user }, res) {
        const entryObj = {};
        if (body.hasOwnProperty('patient') && body.hasOwnProperty('diagnosis') && body.hasOwnProperty('diagnosisDate') &&
            typeof body.patient === 'number' && typeof body.diagnosis === 'number' && typeof body.diagnosisDate === 'string') {
            const momentDiagnos = moment(body.diagnosisDate, moment.ISO_8601);
            if (!momentDiagnos.isValid() && body.diagnosisDate !== null) {
                const msg = messages.dateError[momentDiagnos.invalidAt()] !== undefined ? messages.dateError[momentDiagnos.invalidAt()] : messages.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(messages.userError.INVALIDDATE)));
                return;
            }
            entryObj.patient = body.patient;
            entryObj.diagnosis = body.diagnosis;
            entryObj.createdByUser = user.id;
            if (body.hasOwnProperty('diagnosisDate') && body.diagnosisDate !== null)
                entryObj.diagnosisDate = momentDiagnos.valueOf();
            PatientDiagnosisCore.createPatientDiagnosis(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('patient') && body.hasOwnProperty('diagnosis') && body.hasOwnProperty('diagnosisDate'))) {
            res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        }
    }

    static updatePatientDiagnosis({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            const entryObj = body;
            const momentDiagnos = moment(body.diagnosisDate, moment.ISO_8601);
            if (body.hasOwnProperty('diagnosisDate') && body.diagnosisDate !== null && !momentDiagnos.isValid()) {
                const msg = messages.dateError[momentDiagnos.invalidAt()] !== undefined ? messages.dateError[momentDiagnos.invalidAt()] : messages.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(messages.userError.INVALIDDATE)));
                return;
            } else if (body.hasOwnProperty('diagnosisDate') && body.diagnosisDate !== null) {
                entryObj.diagnosisDate = momentDiagnos.valueOf();
            }
            entryObj.createdByUser = user.id;
            PatientDiagnosisCore.updatePatientDiagnosis(user, body.id, entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deletePatientDiagnosis({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PatientDiagnosisCore.deletePatientDiagnosis(user, { id: body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
            return;
        }
    }

    static getDiagnosisOptions(__unused__req, res) {
        PatientDiagnosisCore.getDiagnosisOptions().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default PatientDiagnosisController;