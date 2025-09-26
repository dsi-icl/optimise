import { getEntry, createEntry, updateEntry, deleteEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import { v4 as uuidv4 } from 'uuid';

class SubStudyPregController {
    static createPregnancy({ body, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!body.hasOwnProperty('patientId') || !body.hasOwnProperty('data')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            body.pregnancyAlias = uuidv4();
            body.createdByUser = user.id;
            createEntry('SUBSTUDY_PREGNANCY', body, true).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        }
    }

    static updatePregnancy({ params, body, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!params.hasOwnProperty('pregnancyId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.pregnancyId, 10)
            };
            // body.id = query.id;
            updateEntry('SUBSTUDY_PREGNANCY', user, '*', query, body, true).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        }
    }

    static searchPregnancies({ query, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!query.hasOwnProperty('patientId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            query.patientId = parseInt(query.patientId, 10);
            query.deleted = '-';
            getEntry('SUBSTUDY_PREGNANCY', query, '*').then((result) => {
                res.status(200).json(formatToJSON(result));
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        }
    }

    static getPregnancy({ params, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!params.hasOwnProperty('pregnancyId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.pregnancyId, 10)
            };
            getEntry('SUBSTUDY_PREGNANCY', query, '*').then((result) => {
                res.status(200).json(formatToJSON(result[0]));
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        }
    }

    static deletePregnancy({ params, body, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!params.hasOwnProperty('pregnancyId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.pregnancyId, 10)
            };
            body.id = query.id;
            deleteEntry('SUBSTUDY_PREGNANCY', user, query).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        }
    }

    static createOffspring({ body, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!body.hasOwnProperty('pregnancyId') || !body.hasOwnProperty('data')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            body.offspringAlias = uuidv4();
            body.createdByUser = user.id;
            createEntry('SUBSTUDY_OFFSPRING', body, true).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        }
    }

    static updateOffspring({ params, body, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!params.hasOwnProperty('offspringId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.offspringId, 10)
            };
            // body.id = query.id;
            updateEntry('SUBSTUDY_OFFSPRING', user, '*', query, body, true).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        }
    }

    static searchOffsprings({ query, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        try {
            query.deleted = '-';
            getEntry('SUBSTUDY_OFFSPRING', query, '*').then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        }
    }

    static getOffspring({ params, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.offspringId, 10)
            };
            getEntry('SUBSTUDY_OFFSPRING', query, '*').then((result) => {
                res.status(200).json(formatToJSON(result[0]));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        }
    }

    static deleteOffspring({ params, user }, res) {
        if (!user || user.adminPriv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return false;
        }
        if (!params.hasOwnProperty('offspringId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return false;
        }
        try {
            const query = {
                id: parseInt(params.offspringId, 10)
            };
            deleteEntry('SUBSTUDY_OFFSPRING', user, query).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        }
        catch (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        }
    }
}

export default SubStudyPregController;
