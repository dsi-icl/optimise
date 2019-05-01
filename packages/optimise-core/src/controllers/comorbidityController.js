import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import Comorbidity from '../core/comorbidity';

class ComorbidityController {
    static getComorbidityForVisit({ body }, res) {
        if (!body.hasOwnProperty('visitId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.visitId !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        const whereObj = {
            visit: body.visitId,
            deleted: '-'
        };
        Comorbidity.getComorbidity(whereObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static createComorbidity({ body, user }, res) {
        if (!body.hasOwnProperty('visitId') || !body.hasOwnProperty('comorbidity')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.visitId !== 'number' || typeof body.comorbidity !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        let entryObj = {
            visit: body.visitId,
            comorbidity: body.comorbidity,
            createdByUser: user.id
        };
        Comorbidity.createComorbidity(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static deleteComorbidity({ body, user }, res) {
        if (body.hasOwnProperty('comorbidityId') && typeof body.comorbidityId === 'number') {
            Comorbidity.deleteComorbidity(user, { 'id': body.comorbidityId }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }
}

export default ComorbidityController;