import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import TreatmentCore from '../core/treatment';
import formatToJSON from '../utils/format-response';
import moment from 'moment';

class TreatmentController {

    static createTreatment({ body, user }, res) {
        if (!(body.hasOwnProperty('visitId') && body.hasOwnProperty('drugId') && body.hasOwnProperty('startDate'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (!(typeof body.visitId === 'number' && typeof body.drugId === 'number' && typeof body.startDate === 'string')) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if ((body.hasOwnProperty('dose') && typeof body.dose !== 'number') ||
            (body.hasOwnProperty('unit') && body.unit !== 'mg' && body.unit !== 'cc') ||
            (body.hasOwnProperty('form') && body.form !== 'OR' && body.form !== 'IV' && body.form !== 'IM' && body.form !== 'SC') ||
            (body.hasOwnProperty('times') && typeof body.times !== 'number') ||
            (body.hasOwnProperty('intervalUnit') && body.intervalUnit !== 'hour' && body.intervalUnit !== 'day' &&
                body.intervalUnit !== 'week' && body.intervalUnit !== '6weeks' && body.intervalUnit !== '8weeks' &&
                body.intervalUnit !== 'month' && body.intervalUnit !== 'year')) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        // No specific reason for 500 (max number of times) here
        if (body.hasOwnProperty('times') && (body.times < 0 || body.times > 500)) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if (body.hasOwnProperty('dose') && body.dose < 0) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if (body.hasOwnProperty('times') && !body.hasOwnProperty('intervalUnit') || body.hasOwnProperty('intervalUnit') && !body.hasOwnProperty('times')) {
            res.status(400).json(ErrorHelper(message.userError.FREQANDINTERVALMUSTCOPRESENT));
            return;
        }
        let momentStart = moment(body.startDate, moment.ISO_8601);
        let momentTerminated = moment(body.terminatedDate, moment.ISO_8601);
        if (!momentStart.isValid() && body.startDate !== null) {
            res.status(400).json(ErrorHelper(message.dateError[momentStart.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        if (body.hasOwnProperty('terminatedDate') && body.terminatedDate !== null && !momentTerminated.isValid()) {
            res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        let entryObj = {
            'orderedDuringVisit': body.visitId,
            'drug': body.drugId,
            'dose': (body.hasOwnProperty('dose') ? body.dose : null),
            'unit': (body.hasOwnProperty('unit') ? body.unit : null),   // hardcoded SQL: only mg or cc
            'form': (body.hasOwnProperty('form') ? body.form : null),   // hardcoded SQL: only OR, IV, IM or SC
            'times': (body.hasOwnProperty('times') ? body.times : null),
            'intervalUnit': (body.hasOwnProperty('intervalUnit') ? body.intervalUnit : null), // hardcoded: hour, day, week, month, year
            'startDate': body.startDate !== null ? momentStart.valueOf() : null,
            'terminatedDate': (body.hasOwnProperty('terminatedDate') && body.terminatedDate !== null ? momentTerminated.valueOf() : null),
            'terminatedReason': (body.hasOwnProperty('terminatedReason') ? body.terminatedReason : null),
            'createdByUser': user.id
        };
        TreatmentCore.createTreatment(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static addTerminationDate({ body }, res) {    //for adding termination date
        if ((body.hasOwnProperty('treatmentId') && body.hasOwnProperty('terminationDate')) && body.hasOwnProperty('terminatedReason') &&
            typeof body.treatmentId === 'number' && typeof body.terminatedDate === 'string' && typeof body.terminatedReason === 'number') {
            let momentTerminated = moment(body.terminatedDate, moment.ISO_8601);
            if (!momentTerminated.isValid() && body.terminatedDate !== null) {
                res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
                return;
            }
            TreatmentCore.addTerminationDateTreatment(body.treatmentId, { 'terminatedDate': body.terminatedDate !== null ? momentTerminated.valueOf() : null, 'terminatedReason': body.terminatedReason })
                .then((result) => {
                    res.status(200).json(formatToJSON(result));
                    return true;
                }).catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                    return false;
                });
        } else if (!((body.hasOwnProperty('treatmentId') && body.hasOwnProperty('terminationDate')) && body.hasOwnProperty('terminatedReason'))) {
            res.status(400).json(message.userError.MISSINGARGUMENT);
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editTreatment({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {

            let momentStart = moment(body.startDate, moment.ISO_8601);
            let momentTerminated = moment(body.terminatedDate, moment.ISO_8601);
            if (!momentStart.isValid()) {
                res.status(400).json(ErrorHelper(message.dateError[momentStart.invalidAt()], new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('terminatedDate') && body.terminatedDate !== null && !momentTerminated.isValid()) {
                res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
                return;
            }
            let newObj = Object.assign({}, body);
            newObj.startDate = momentStart.valueOf();
            newObj.terminatedDate = (body.hasOwnProperty('terminatedDate') && body.terminatedDate !== null ? momentTerminated.valueOf() : null);

            TreatmentCore.updateTreatment(user, body.id, newObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
            return;
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteTreatment({ body, user }, res) {
        if (!body.hasOwnProperty('treatmentId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.treatmentId !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        TreatmentCore.deleteTreatment(user, body.treatmentId).then((result) => {
            if (result.body === 0) {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
                return false;
            } else {
                res.status(200).json(formatToJSON(result));
                return true;
            }
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    }

    static addInterruption({ body, user }, res) {    //need to search if treatment exists
        if (body.hasOwnProperty('treatmentId') && body.hasOwnProperty('start_date') &&
            typeof body.treatmentId === 'number' && typeof body.start_date === 'string') {
            let momentStart = moment(body.start_date, moment.ISO_8601);
            let momentEnd = moment(body.end_date, moment.ISO_8601);
            if (!momentStart.isValid() && body.start_date !== null) {
                let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('end_date') && body.end_date !== null && !momentEnd.isValid()) {
                let msg = message.dateError[momentEnd.invalidAt()] !== undefined ? message.dateError[momentEnd.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('meddra') && body.meddra !== null && isNaN(parseInt(body.meddra))) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            let entryObj = {
                'treatment': body.treatmentId,
                'startDate': body.start_date !== null ? momentStart.valueOf() : null,
                'meddra': body.hasOwnProperty('meddra') ? body.meddra : null,
                'endDate': (body.hasOwnProperty('end_date') && body.end_date !== null ? momentEnd.valueOf() : null),
                'reason': body.hasOwnProperty('reason') ? body.reason : null,
                'createdByUser': user.id
            };
            TreatmentCore.addInterruption(user, entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('treatmentId') && body.hasOwnProperty('start_date'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editInterruption({ body, user }, res) {
        if (body.hasOwnProperty('treatmentInterId') && typeof body.treatmentInterId === 'number' &&
            body.hasOwnProperty('start_date') && typeof body.start_date === 'string') {
            let momentStart = body.hasOwnProperty('start_date') && body.start_date !== null ? moment(body.start_date, moment.ISO_8601) : null;
            let momentEnd = body.hasOwnProperty('end_date') && body.end_date !== null ? moment(body.end_date, moment.ISO_8601) : null;
            if (momentStart !== null && !momentStart.isValid()) {
                let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (momentEnd !== null && !momentEnd.isValid()) {
                let msg = message.dateError[momentEnd.invalidAt()] !== undefined ? message.dateError[momentEnd.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('meddra') && body.meddra !== null && isNaN(parseInt(body.meddra))) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            let newObj = {
                'startDate': body.hasOwnProperty('start_date') && momentStart !== null ? momentStart.valueOf() : null,
                'meddra': body.hasOwnProperty('meddra') ? parseInt(body.meddra) : null,
                'endDate': body.hasOwnProperty('end_date') && momentEnd !== null ? momentEnd.valueOf() : null,
                'reason': body.hasOwnProperty('reason') ? body.reason : null,
                'createdByUser': user.id
            };
            TreatmentCore.updateInterruption(user, body.treatmentInterId, newObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('treatmentInterId') && body.hasOwnProperty('start_date'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteInterruption({ body, user }, res) {
        if (body.hasOwnProperty('treatmentInterId') && typeof body.treatmentInterId === 'number') {
            TreatmentCore.deleteInterruption(user, body.treatmentInterId).then((result) => {
                if (result.body === 0) {
                    res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
                    return false;
                } else {
                    res.status(200).json(formatToJSON(result));
                    return true;
                }
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('treatmentInterId'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static getReasons({ query }, res) {
        if (Object.keys(query).length !== 0 && query.hasOwnProperty('name')) {
            TreatmentCore.searchReasons(`%${query.name}%`).then((result) => {
                res.status(200).json(result);
                return true;
            }).catch((error) => {
                res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
            return;
        } else {
            TreatmentCore.getReasons().then((result) => {
                res.status(200).json(result);
                return true;
            }).catch((error) => {
                res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
            return;
        }
    }

    static getDrugs({ query }, res) {
        if (Object.keys(query).length !== 0 && query.hasOwnProperty('name')) {
            TreatmentCore.searchDrugs(`%${query.name}%`).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
            return;
        } else {
            TreatmentCore.getDrugs().then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
            return;
        }
    }
}

export default TreatmentController;