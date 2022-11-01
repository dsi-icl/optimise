import ErrorHelper from '../utils/error_helper';
import clinicalEventCore from '../core/clinicalEvent';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import moment from 'moment';

class CeController {

    static createCe({ body, user }, res) {
        if ((body.hasOwnProperty('visitId') || body.hasOwnProperty('patient')) && body.hasOwnProperty('dateStartDate') && body.hasOwnProperty('type') &&
            typeof body.visitId === 'number' && typeof body.dateStartDate === 'string' && typeof body.type === 'number') {
            const momentStart = moment(body.dateStartDate, moment.ISO_8601);
            if (!momentStart.isValid()) {
                const msg = (momentStart.invalidAt() === undefined || momentStart.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentStart.invalidAt()];
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            const momentEnd = moment(body.endDate, moment.ISO_8601);
            if (body.hasOwnProperty('endDate') && body.endDate !== null && !momentEnd.isValid()) {
                const msg = (momentEnd.invalidAt() === undefined || momentEnd.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentEnd.invalidAt()];
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('meddra') && body.meddra !== null && isNaN(parseInt(body.meddra))) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            const ce = {};
            if (body.hasOwnProperty('visitId'))
                ce.recordedDuringVisit = body.visitId;
            if (body.hasOwnProperty('patient'))
                ce.patient = body.patient;
            if (body.hasOwnProperty('endDate') && body.endDate !== null)
                ce.endDate = momentEnd.valueOf();
            ce.type = body.type;
            ce.meddra = body.meddra ? parseInt(body.meddra) : undefined;
            ce.dateStartDate = momentStart.valueOf();
            ce.createdByUser = user.id;
            clinicalEventCore.createClinicalEvent(ce).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!((body.hasOwnProperty('visitId') || body.hasOwnProperty('patient')) && body.hasOwnProperty('dateStartDate') && body.hasOwnProperty('type'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static updateCe({ body, user }, res) {
        if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        const ce = Object.assign({}, body);
        const momentStart = moment(body.dateStartDate, moment.ISO_8601);
        if (body.hasOwnProperty('dateStartDate') && body.dateStartDate !== null && !momentStart.isValid()) {
            const msg = (momentStart.invalidAt() === undefined || momentStart.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentStart.invalidAt()];
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (body.hasOwnProperty('dateStartDate') && body.dateStartDate !== null) {
            ce.dateStartDate = momentStart.valueOf();
        }
        const momentEnd = moment(body.endDate, moment.ISO_8601);
        if (body.hasOwnProperty('endDate') && body.endDate !== null && !momentEnd.isValid()) {
            const msg = (momentEnd.invalidAt() === undefined || momentEnd.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[momentEnd.invalidAt()];
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (body.hasOwnProperty('endDate') && body.endDate !== null) {
            ce.endDate = momentEnd.valueOf();
        }
        clinicalEventCore.updateClinicalEvent(user, ce).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deleteCe({ body, user }, res) {
        if (body.hasOwnProperty('ceId')) {
            clinicalEventCore.deleteClinicalEvent(user, { id: body.ceId }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('ceId')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
}

export default CeController;