import { getEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import dbcon from '../utils/db-connection';

class ActionLog {
    static getLogs(limitOffset) {
        return new Promise((resolve, reject) => getEntry('LOG_ACTIONS', {}, '*', {
            limitOffset,
            orderBy: [{ column: 'id', order: 'desc' }]
        })
            .then(
                result => resolve(result),
                error => reject(ErrorHelper(message.errorMessages.GETFAIL, error)))
        );
    }

    static erasePatients(patientId, patientAlias) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"aliasId":"${patientAlias}"%`)
            .orWhere('body', 'like', `%"patient":${patientId},%`)
            .orWhere('body', 'like', `%"patient":${patientId}}%`)
            .orWhere('body', 'like', `%"patientId":${patientId},%`)
            .orWhere('body', 'like', `%"patientId":${patientId}}%`)
            .orWhere('router', 'like', `%/${patientAlias}`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseVisits(visitId) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"visit":${visitId},%`)
            .orWhere('body', 'like', `%"visit":${visitId}}%`)
            .orWhere('body', 'like', `%"visitId":${visitId},%`)
            .orWhere('body', 'like', `%"visitId":${visitId}}%`)
            .orWhere('body', 'like', `%"orderedDuringVisit":${visitId},%`)
            .orWhere('body', 'like', `%"orderedDuringVisit":${visitId}}%`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseCE(clinicalEventId) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"clinicalEventId":${clinicalEventId},%`)
            .orWhere('body', 'like', `%"clinicalEventId":${clinicalEventId}}%`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseTreatments(treatmentsId) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"treatmentId":${treatmentsId},%`)
            .orWhere('body', 'like', `%"treatmentId":${treatmentsId}"%`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseTreatmentsInters(treatmentsInterId) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"treatmentInterId":${treatmentsInterId},%`)
            .orWhere('body', 'like', `%"treatmentInterId":${treatmentsInterId}}%`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseTests(testId) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where('body', 'like', `%"testId":${testId},%`)
            .orWhere('body', 'like', `%"testId":${testId}}%`)
            .then(result => resolve(result), error => reject(error)));
    }

    static eraseIdOnRoute(route, id) {
        return new Promise((resolve, reject) => dbcon()('LOG_ACTIONS')
            .del()
            .where({ 'router': route })
            .andWhere('body', 'like', `%"id":${id},%`)
            .then(result => resolve(result), error => reject(error)));
    }
}

export default ActionLog;