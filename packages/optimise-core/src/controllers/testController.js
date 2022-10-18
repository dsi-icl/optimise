import TestCore from '../core/test';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import moment from 'moment';

class TestController {

    static createTest({ body, user }, res) {
        if (!body.hasOwnProperty('visitId') || !body.hasOwnProperty('expectedOccurDate') || !body.hasOwnProperty('type')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.visitId !== 'number' || typeof body.expectedOccurDate !== 'string' || typeof body.type !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        const momentExpect = moment(body.expectedOccurDate, moment.ISO_8601);
        if (!momentExpect.isValid() && body.expectedOccurDate !== null) {
            const msg = message.dateError[momentExpect.invalidAt()] !== undefined ? message.dateError[momentExpect.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const momentOccur = moment(body.actualOccurredDate, moment.ISO_8601);
        if (body.hasOwnProperty('actualOccurredDate') && body.actualOccurredDate !== null && !momentOccur.isValid()) {
            const msg = message.dateError[momentOccur.invalidAt()] !== undefined ? message.dateError[momentOccur.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const entryObj = {
            orderedDuringVisit: body.visitId,
            type: body.type,
            createdByUser: user.id
        };
        if (body.hasOwnProperty('expectedOccurDate') && body.expectedOccurDate !== null)
            entryObj.expectedOccurDate = momentExpect.valueOf();
        if (body.hasOwnProperty('actualOccurredDate') && body.actualOccurredDate !== null)
            entryObj.actualOccurredDate = momentOccur.valueOf();
        TestCore.createTest(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static updateTest({ body, user }, res) {
        if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        const entryObj = Object.assign({}, body);
        const momentExpect = moment(body.expectedOccurDate, moment.ISO_8601);
        if (body.hasOwnProperty('expectedOccurDate') && body.expectedOccurDate !== null && !momentExpect.isValid()) {
            const msg = message.dateError[momentExpect.invalidAt()] !== undefined ? message.dateError[momentExpect.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (body.hasOwnProperty('expectedOccurDate') && body.expectedOccurDate !== null) {
            entryObj.expectedOccurDate = momentExpect.valueOf();
        }
        const momentOccur = moment(body.actualOccurredDate, moment.ISO_8601);
        if (body.hasOwnProperty('actualOccurredDate') && body.actualOccurredDate !== null && !momentOccur.isValid()) {
            const msg = message.dateError[momentOccur.invalidAt()] !== undefined ? message.dateError[momentOccur.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (body.hasOwnProperty('actualOccurredDate') && body.actualOccurredDate !== null) {
            entryObj.actualOccurredDate = momentOccur.valueOf();
        }
        TestCore.updateTest(user, entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deleteTest({ body, user }, res) {
        if (body.hasOwnProperty('testId') && typeof body.testId === 'number') {
            TestCore.deleteTest(user, { id: body.testId }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        }
        else if (!body.hasOwnProperty('testId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
}

export default TestController;