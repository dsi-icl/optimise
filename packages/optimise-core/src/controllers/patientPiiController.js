import PatientPiiCore from '../core/patientPii';
import ErrorHelper from '../utils/error_helper';
import messages from '../utils/message-utils';
import formatToJSON from '../utils/format-response';

const PatientPiiModel = {
    patient: 0,
    firstName: '',
    surname: '',
    fullAddress: '',
    postcode: ''
};

class PatientPiiController {

    static getPatientPii({ query }, res) {
        if (query.hasOwnProperty('patient')) {
            PatientPiiCore.getPatientPii({ patient: parseInt(query.patient), deleted: '-' }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
                return false;
            });
        } else {
            res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
            return;
        }
    }

    static createPatientPii({ body, user }, res) {
        if (body.hasOwnProperty('patient') && body.hasOwnProperty('firstName') && body.hasOwnProperty('surname') && body.hasOwnProperty('fullAddress') && body.hasOwnProperty('postcode') &&
            typeof body.patient === 'number' && typeof body.firstName === 'string' && typeof body.surname === 'string' && typeof body.fullAddress === 'string' && typeof body.postcode === 'string') {
            let entryObj = Object.assign({}, PatientPiiModel, body);
            entryObj.createdByUser = user.id;
            PatientPiiCore.createPatientPii(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(messages.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('patient') && body.hasOwnProperty('firstName') && body.hasOwnProperty('surname') && body.hasOwnProperty('fullAddress') && body.hasOwnProperty('postcode'))) {
            res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
            return;
        }
    }

    static updatePatientPii({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            let entryObj = body;
            entryObj.createdByUser = user.id;
            PatientPiiCore.updatePatientPii(user, body.id, entryObj).then((result) => {
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

    static deletePatientPii({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PatientPiiCore.deletePatientPii(user, { id: body.id }).then((result) => {
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
}

export default PatientPiiController;