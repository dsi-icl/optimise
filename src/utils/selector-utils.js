const knex = require('../utils/db-connection');
const { PregnancyCore } = require('../core/demographic');
const DiagnosisCore = require('../core/patientDiagnosis');

class SelectorUtils {
    getVisitsWithoutData(patientId) {
        return knex('VISITS')
            .select({ visitId: 'id', visitDate: 'visitDate' })
            .where({ 'patient': patientId, deleted: '-' })
            .then(result => {
                const returnObj = { visitsWithoutData: result };
                return returnObj;
            });
    }

    getDemographicData(patientId) {
        return knex('PATIENT_DEMOGRAPHIC')
            .select('DOB', 'gender', 'dominantHand', 'ethnicity', 'countryOfOrigin', 'alcoholUsage', 'smokingHistory')
            .where({ 'patient': patientId, deleted: '-' })
            .then(result => {
                const returnObj = { demographicData: result[0] };
                return returnObj;
            });
    }

    getTestsWithoutData(patientId) {
        return knex('VISITS').select({ 'id': 'id' }).where({ 'patient': patientId, deleted: '-' }).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('ORDERED_TESTS')
                .select('orderedDuringVisit', 'type', 'expectedOccurDate')
                .whereIn('orderedDuringVisit', ids)
                .andWhere({ deleted: '-' })
                .then(result => {
                    const returnObj = { testsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getImmunisations(patientId) {
        return knex('PATIENT_IMMUNISATION')
            .select('vaccineName', 'immunisationDate')
            .where({ 'patient': patientId, 'deleted': '-' })
            .then(result => {
                const returnObj = { immunisations: result };
                return returnObj;
            });
    }

    getMedicalHistory(patientId) {
        return knex('MEDICAL_HISTORY')
            .select('relation', 'conditionName', 'startDate', 'outcome', 'resolvedYear')
            .where({ 'patient': patientId, 'deleted': '-' })
            .then(result => {
                const returnObj = { medicalHistory: result };
                return returnObj;
            });
    }

    getVisits(patientId) {
        const _this = this;
        return knex('VISITS')
            .select({ visitId: 'id', visitDate: 'visitDate' })
            .where({ 'patient': patientId, 'deleted': '-' })
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++) {
                        promiseArr.push(_this._getVisitData(result[i].visitId));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++) {
                                result[i].data = data[i];
                            }
                            const returnObj = { visits: result };
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = { visits: result };
                    return returnObj;
                }
            });
    }

    getTests(patientId) {
        const _this = this;
        return knex('VISITS').select('id').where({ 'patient': patientId, deleted: '-' }).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('ORDERED_TESTS')
                .select({ 'testId': 'id' }, 'orderedDuringVisit', 'type', 'expectedOccurDate')
                .whereIn('orderedDuringVisit', ids)
                .andWhere({ 'deleted': '-' })
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTestData(result[i].testId));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            data => {
                                for (let i = 0; i < data.length; i++) {
                                    result[i].data = data[i];
                                }
                                const returnObj = { tests: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { tests: result };
                        return returnObj;
                    }
                });
        });
    }

    getTreatments(patientId) {
        const _this = this;
        return knex('VISITS').select({ 'id': 'id', 'visitDate': 'visitDate' }).where({ 'patient': patientId, deleted: '-' }).then(resu => {
            let ids = [];
            let dates = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
                dates[resu[i].id] = resu[i].visitDate;
            }
            return knex('TREATMENTS')
                .select('id', 'orderedDuringVisit', 'drug', 'dose', 'unit', 'form', 'timesPerDay', 'durationWeeks', 'terminatedDate', 'terminatedReason')
                .whereIn('orderedDuringVisit', ids)
                .andWhere({ 'deleted': '-' })
                .then(result => {
                    for (let i = 0; i < result.length; i++) {
                        result[i].visitDate = dates[result[i].orderedDuringVisit];
                    }
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTreatmentInterruptions(result[i].id));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            interruptions => {
                                for (let i = 0; i < interruptions.length; i++) {
                                    result[i].interruptions = interruptions[i];
                                }
                                const returnObj = { treatments: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { treatments: result };
                        return returnObj;
                    }
                });
        });
    }

    getPregnancy(patientId) {
        let pregnancy = new PregnancyCore();
        return pregnancy.getPregnancy({ 'patient': patientId, 'deleted': '-' }).then(function (result) {
            return { 'pregnancy': result };
        }, function (__unused__error) {
            return { 'pregnancy': [] };
        });
    }

    _getVisitData(visitId) {
        return knex('VISIT_DATA')
            .select('field', 'value')
            .where({ 'visit': visitId, 'deleted': '-' });
    }

    _getTestData(testId) {
        return knex('TEST_DATA')
            .select('field', 'value')
            .where({ 'test': testId, 'deleted': '-' });
    }

    _getTreatmentInterruptions(treatmentId) {
        return knex('TREATMENTS_INTERRUPTIONS')
            .select('reason', 'startDate', 'endDate', 'meddra')
            .where({ 'treatment': treatmentId, 'deleted': '-' });
    }

    _getCeData(ceId) {
        return knex('CLINICAL_EVENTS_DATA')
            .select('field', 'value')
            .where({ 'clinicalEvent': ceId, 'deleted': '-' });
    }

    getClinicalEventsWithoutData(patientId) {
        return knex('VISITS').select('id').where({ 'patient': patientId, deleted: '-' }).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('CLINICAL_EVENTS')
                .select('recordedDuringVisit', 'type', 'dateStartDate', 'endDate')
                .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', ids))
                .andWhere({ 'deleted': '-' })
                .then(result => {
                    const returnObj = { clinicalEventsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getClinicalEvents(patientId) {
        const _this = this;
        return knex('VISITS').select('id').where({ 'patient': patientId, deleted: '-' }).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('CLINICAL_EVENTS')
                .select('id', 'recordedDuringVisit', 'type', 'dateStartDate', 'endDate')
                .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', ids))
                .andWhere({ 'deleted': '-' })
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getCeData(result[i].id));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            data => {
                                for (let i = 0; i < data.length; i++) {
                                    result[i].data = data[i];
                                }
                                const returnObj = { clinicalEvents: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { clinicalEvents: result };
                        return returnObj;
                    }
                });
        });
    }

    getDiagnosis(patientId) {
        let diagnosis = new DiagnosisCore();
        return diagnosis.getPatientDiagnosis({ 'patient': patientId, 'deleted': '-' }).then(function (result) {
            return { 'diagnosis': result };
        }, function (__unused__error) {
            return { 'diagnosis': [] };
        });
    }
}

const _singleton = new SelectorUtils();
module.exports = _singleton;
