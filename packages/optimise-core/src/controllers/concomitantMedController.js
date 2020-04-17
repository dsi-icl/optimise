import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import ConcomitantMed from '../core/concomitantMeds';

class ConcomitantMedController {
    static createConcomitantMed({ body, user }, res) {
        if (!body.visitId
            || !body.concomitantMedId
            || !body.indication
            || !body.startDate
        ) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }

        const { visitId, concomitantMedId, indication, startDate, endDate } = body;
        if (typeof visitId !== 'number'
            || typeof concomitantMedId !== 'number'
            || typeof indication !== 'string'
            || typeof startDate !== 'number'
        ) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if (endDate && typeof endDate !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

        let entryObj = {
            visit: visitId,
            concomitantMedId,
            indication,
            startDate,
            endDate,
            createdByUser: user.id
        };
        ConcomitantMed.createConcomitantMed(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }


    static editConcomitantMed({ body, user }, res) {
        if (body.concomitantMedEntryId && typeof body.concomitantMedEntryId === 'number') {
            let entryObj = { id: body.concomitantMedEntryId };
            const { concomitantMedId, indication, startDate, endDate } = body;
            if (concomitantMedId) {
                if (typeof concomitantMedId === 'number') {
                    entryObj.concomitantMedId = concomitantMedId;
                } else {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }
            }
            if (indication) {
                if (typeof indication === 'string') {
                    entryObj.indication = indication;
                } else {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }
            }
            if (startDate) {
                if (typeof startDate === 'number') {
                    entryObj.startDate = startDate;
                } else {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }
            }
            if (typeof endDate === 'number' || endDate === null || endDate === undefined) {
                entryObj.endDate = endDate;
            } else {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            ConcomitantMed.updateConcomitantMed(user, entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.concomitantMedEntryId) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteConcomitantMed({ body, user }, res) {
        if (body.concomitantMedEntryId && typeof body.concomitantMedEntryId === 'number') {
            ConcomitantMed.deleteConcomitantMed(user, { 'id': body.concomitantMedEntryId }).then((result) => {
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

export default ConcomitantMedController;