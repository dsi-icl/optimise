import dbcon from '../utils/db-connection';

class SelectorUtils {

    getConcomitantMeds(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj.deleted = '-';
        return dbcon()('VISITS').select({ id: 'id' }).where(whereObj).then(resu => {
            const ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            const innerWhereObj = {};
            if (deleted !== true)
                innerWhereObj['CONCOMITANT_MED.deleted'] = '-';
            return dbcon()('CONCOMITANT_MED')
                .select({ id: 'CONCOMITANT_MED.id', concomitantMedId: 'CONCOMITANT_MED.concomitantMedId', concomitantMedId_name: 'AVAILABLE_CONCOMITANT_MED.name', visit: 'CONCOMITANT_MED.visit', indication: 'CONCOMITANT_MED.indication', startDate: 'CONCOMITANT_MED.startDate', endDate: 'CONCOMITANT_MED.endDate' })
                .leftJoin('AVAILABLE_CONCOMITANT_MED', 'AVAILABLE_CONCOMITANT_MED.id', 'CONCOMITANT_MED.concomitantMedId')
                .whereIn('CONCOMITANT_MED.visit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    const returnObj = { concomitantMeds: result };
                    return returnObj;
                });
        });
    }

    getDemographicData(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj['PATIENT_DEMOGRAPHIC.deleted'] = '-';
        return dbcon()('PATIENT_DEMOGRAPHIC')
            .select({ id: 'PATIENT_DEMOGRAPHIC.id', DOB: 'PATIENT_DEMOGRAPHIC.DOB', gender: 'PATIENT_DEMOGRAPHIC.gender', gender_value: 'GENDERS.value', dominantHand: 'PATIENT_DEMOGRAPHIC.dominantHand', dominantHand_value: 'DOMINANT_HANDS.value', ethnicity: 'PATIENT_DEMOGRAPHIC.ethnicity', ethnicity_value: 'ETHNICITIES.value', countryOfOrigin: 'PATIENT_DEMOGRAPHIC.countryOfOrigin', countryOfOrigin_value: 'COUNTRIES.value', deleted: 'PATIENT_DEMOGRAPHIC.deleted' })
            .leftJoin('GENDERS', 'GENDERS.id', 'PATIENT_DEMOGRAPHIC.gender')
            .leftJoin('DOMINANT_HANDS', 'DOMINANT_HANDS.id', 'PATIENT_DEMOGRAPHIC.dominantHand')
            .leftJoin('ETHNICITIES', 'ETHNICITIES.id', 'PATIENT_DEMOGRAPHIC.ethnicity')
            .leftJoin('COUNTRIES', 'COUNTRIES.id', 'PATIENT_DEMOGRAPHIC.countryOfOrigin')
            .where(whereObj)
            .then(result => {
                const returnObj = { demographicData: result[0] };
                return returnObj;
            });
    }

    getImmunisations(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj.deleted = '-';
        return dbcon()('PATIENT_IMMUNISATION')
            .select('id', 'vaccineName', 'immunisationDate', 'deleted')
            .where({ patient: patientId, deleted: '-' })
            .then(result => {
                const returnObj = { immunisations: result };
                return returnObj;
            });
    }

    getMedicalHistory(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj['MEDICAL_HISTORY.deleted'] = '-';
        return dbcon()('MEDICAL_HISTORY')
            .select({ id: 'MEDICAL_HISTORY.id', relation: 'MEDICAL_HISTORY.relation', relation_value: 'RELATIONS.value', conditionName: 'MEDICAL_HISTORY.conditionName', conditionName_value: 'CONDITIONS.value', startDate: 'MEDICAL_HISTORY.startDate', outcome: 'MEDICAL_HISTORY.outcome', resolvedYear: 'MEDICAL_HISTORY.resolvedYear', deleted: 'MEDICAL_HISTORY.deleted' })
            .leftJoin('RELATIONS', 'RELATIONS.id', 'MEDICAL_HISTORY.relation')
            .leftJoin('CONDITIONS', 'CONDITIONS.id', 'MEDICAL_HISTORY.conditionName')
            .where(whereObj)
            .then(result => {
                const returnObj = { medicalHistory: result };
                return returnObj;
            });
    }

    getVisitsWithoutData(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj['VISITS.deleted'] = '-';
        return dbcon()('VISITS')
            .select({ visitId: 'VISITS.id', visitDate: 'VISITS.visitDate', type: 'VISITS.type', type_name: 'AVAILABLE_VISIT_TYPES.name', type_module: 'AVAILABLE_VISIT_TYPES.module', communication: 'VISITS.communication', deleted: 'VISITS.deleted' })
            .leftJoin('AVAILABLE_VISIT_TYPES', 'AVAILABLE_VISIT_TYPES.id', 'VISITS.type')
            .where(whereObj)
            .then(result => {
                const returnObj = { visitsWithoutData: result };
                return returnObj;
            });
    }

    getVisits(patientId, deleted) {
        const _this = this;
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj['VISITS.deleted'] = '-';
        return dbcon()('VISITS')
            .select({ id: 'VISITS.id', visitDate: 'VISITS.visitDate', type: 'VISITS.type', type_name: 'AVAILABLE_VISIT_TYPES.name', type_module: 'AVAILABLE_VISIT_TYPES.module', communication: 'VISITS.communication', deleted: 'VISITS.deleted' })
            .leftJoin('AVAILABLE_VISIT_TYPES', 'AVAILABLE_VISIT_TYPES.id', 'VISITS.type')
            .where(whereObj)
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++) {
                        promiseArr.push(_this._getVisitData(result[i].id, deleted));
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

    getTestsWithoutData(patientId, deleted) {
        const whereObj = { patient: patientId };
        if (deleted !== true)
            whereObj.deleted = '-';
        return dbcon()('VISITS').select({ id: 'id' }).where(whereObj).then(resu => {
            const ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            const innerWhereObj = {};
            if (deleted !== true)
                innerWhereObj['ORDERED_TESTS.deleted'] = '-';
            return dbcon()('ORDERED_TESTS')
                .select({ orderedDuringVisit: 'ORDERED_TESTS.orderedDuringVisit', type: 'ORDERED_TESTS.type', type_name: 'AVAILABLE_TEST_TYPES.name', type_module: 'AVAILABLE_TEST_TYPES.module', expectedOccurDate: 'ORDERED_TESTS.expectedOccurDate', actualOccurredDate: 'ORDERED_TESTS.actualOccurredDate', deleted: 'ORDERED_TESTS.deleted' })
                .leftJoin('AVAILABLE_TEST_TYPES', 'AVAILABLE_TEST_TYPES.id', 'ORDERED_TESTS.type')
                .whereIn('ORDERED_TESTS.orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    const returnObj = { testsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getTests(patientId, deleted) {
        const _this = this;
        const whereObj = { patient: patientId };
        const innerWhereObj = {};
        if (deleted !== true) {
            whereObj.deleted = '-';
            innerWhereObj['ORDERED_TESTS.deleted'] = '-';
        }
        return dbcon()('VISITS').select('id').where(whereObj).then(resu => {
            const ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return dbcon()('ORDERED_TESTS')
                .select({ orderedDuringVisit: 'ORDERED_TESTS.orderedDuringVisit', type: 'ORDERED_TESTS.type', type_name: 'AVAILABLE_TEST_TYPES.name', type_module: 'AVAILABLE_TEST_TYPES.module', expectedOccurDate: 'ORDERED_TESTS.expectedOccurDate', actualOccurredDate: 'ORDERED_TESTS.actualOccurredDate', deleted: 'ORDERED_TESTS.deleted' })
                .leftJoin('AVAILABLE_TEST_TYPES', 'AVAILABLE_TEST_TYPES.id', 'ORDERED_TESTS.type')
                .whereIn('ORDERED_TESTS.orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTestData(result[i].id, deleted));
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

    getTreatments(patientId, deleted) {
        const _this = this;
        const whereObj = { patient: patientId };
        const innerWhereObj = {};
        if (deleted !== true) {
            whereObj.deleted = '-';
            innerWhereObj['TREATMENTS.deleted'] = '-';
        }
        return dbcon()('VISITS').select({ id: 'id', visitDate: 'visitDate', type: 'type', deleted: 'deleted' }).where(whereObj).then(resu => {
            const ids = [];
            const dates = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
                dates[resu[i].id] = resu[i].visitDate;
            }
            return dbcon()('TREATMENTS')
                .select({ id: 'TREATMENTS.id', orderedDuringVisit: 'TREATMENTS.orderedDuringVisit', drug: 'TREATMENTS.drug', drug_name: 'AVAILABLE_DRUGS.name', drug_module: 'AVAILABLE_DRUGS.module', dose: 'TREATMENTS.dose', unit: 'TREATMENTS.unit', form: 'TREATMENTS.form', times: 'TREATMENTS.times', intervalUnit: 'TREATMENTS.intervalUnit', startDate: 'TREATMENTS.startDate', terminatedDate: 'TREATMENTS.terminatedDate', terminatedReason: 'TREATMENTS.terminatedReason', terminatedReason_value: 'REASONS.value', deleted: 'TREATMENTS.deleted' })
                .leftJoin('AVAILABLE_DRUGS', 'AVAILABLE_DRUGS.id', 'TREATMENTS.drug')
                .leftJoin('REASONS', 'REASONS.id', 'TREATMENTS.terminatedReason')
                .whereIn('TREATMENTS.orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    for (let i = 0; i < result.length; i++) {
                        result[i].visitDate = dates[result[i].orderedDuringVisit];
                    }
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTreatmentInterruptions(result[i].id, deleted));
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

    getPregnancy(patientId, deleted) {
        const whereObj = { 'PATIENT_PREGNANCY.patient': patientId };
        if (deleted !== true)
            whereObj['PATIENT_PREGNANCY.deleted'] = '-';
        return dbcon()('PATIENT_PREGNANCY')
            .select({ id: 'PATIENT_PREGNANCY.id', startDate: 'PATIENT_PREGNANCY.startDate', outcome: 'PATIENT_PREGNANCY.outcome', outcome_value: 'PREGNANCY_OUTCOMES.value', outcomeDate: 'PATIENT_PREGNANCY.outcomeDate', meddra: 'PATIENT_PREGNANCY.meddra', meddra_code: 'ADVERSE_EVENT_MEDDRA.code', deleted: 'PATIENT_PREGNANCY.deleted' })
            .leftJoin('PREGNANCY_OUTCOMES', 'PREGNANCY_OUTCOMES.id', 'PATIENT_PREGNANCY.outcome')
            .leftJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'PATIENT_PREGNANCY.meddra')
            .where(whereObj)
            .then(result => {
                const returnObj = { pregnancy: result };
                return returnObj;
            });
    }

    _getVisitData(visitId, deleted) {
        const whereObj = { visit: visitId };
        if (deleted !== true)
            whereObj['VISIT_DATA.deleted'] = '-';
        return dbcon()('VISIT_DATA')
            .select({ id: 'VISIT_DATA.id', field: 'VISIT_DATA.field', field_idname: 'AVAILABLE_FIELDS_VISITS.idname', field_module: 'AVAILABLE_FIELDS_VISITS.module', value: 'VISIT_DATA.value', deleted: 'VISIT_DATA.deleted' })
            .leftJoin('AVAILABLE_FIELDS_VISITS', 'AVAILABLE_FIELDS_VISITS.id', 'VISIT_DATA.field')
            .where(whereObj);
    }

    _getTestData(testId, deleted) {
        const whereObj = { test: testId };
        if (deleted !== true)
            whereObj['TEST_DATA.deleted'] = '-';
        return dbcon()('TEST_DATA')
            .select({ id: 'TEST_DATA.id', field: 'TEST_DATA.field', field_idname: 'AVAILABLE_FIELDS_TESTS.idname', field_module: 'AVAILABLE_FIELDS_TESTS.module', field_unit: 'AVAILABLE_FIELDS_TESTS.unit', value: 'TEST_DATA.value', deleted: 'TEST_DATA.deleted' })
            .leftJoin('AVAILABLE_FIELDS_TESTS', 'AVAILABLE_FIELDS_TESTS.id', 'TEST_DATA.field')
            .where(whereObj);
    }

    _getTreatmentInterruptions(treatmentId, deleted) {
        const whereObj = { treatment: treatmentId };
        if (deleted !== true)
            whereObj['TREATMENTS_INTERRUPTIONS.deleted'] = '-';
        return dbcon()('TREATMENTS_INTERRUPTIONS')
            .select({ id: 'TREATMENTS_INTERRUPTIONS.id', reason: 'TREATMENTS_INTERRUPTIONS.reason', reason_value: 'REASON.value', startDate: 'TREATMENTS_INTERRUPTIONS.startDate', endDate: 'TREATMENTS_INTERRUPTIONS.endDate', meddra: 'TREATMENTS_INTERRUPTIONS.meddra', meddra_code: 'ADVERSE_EVENT_MEDDRA.code', deleted: 'TREATMENTS_INTERRUPTIONS.deleted' })
            .leftJoin('REASONS', 'REASONS.id', 'TREATMENTS_INTERRUPTIONS.reason')
            .leftJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'TREATMENTS_INTERRUPTIONS.meddra')
            .where(whereObj);
    }

    _getCeData(ceId, deleted) {
        const whereObj = { clinicalEvent: ceId };
        if (deleted !== true)
            whereObj['CLINICAL_EVENTS_DATA.deleted'] = '-';
        return dbcon()('CLINICAL_EVENTS_DATA')
            .select({ id: 'CLINICAL_EVENTS_DATA.id', field: 'CLINICAL_EVENTS_DATA.field', field_idname: 'CLINICAL_EVENTS_DATA.idname', field_module: 'CLINICAL_EVENTS_DATA.module', value: 'CLINICAL_EVENTS_DATA.value', deleted: 'CLINICAL_EVENTS_DATA.deleted' })
            .leftJoin('AVAILABLE_FIELDS_CE', 'AVAILABLE_FIELDS_CE.id', 'CLINICAL_EVENTS_DATA.field')
            .where(whereObj);
    }

    getClinicalEventsWithoutData(patientId, deleted) {
        const whereObj = { patient: patientId };
        const innerWhereObj = {};
        if (deleted !== true) {
            whereObj.deleted = '-';
            innerWhereObj['CLINICAL_EVENTS.deleted'] = '-';
        }
        return dbcon()('VISITS').select('id', 'deleted').where(whereObj).then(resu => {
            const ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return dbcon()('CLINICAL_EVENTS')
                .select({ id: 'CLINICAL_EVENTS.id', recordedDuringVisit: 'CLINICAL_EVENTS.recordedDuringVisit', type: 'CLINICAL_EVENTS.type', type_name: 'AVAILABLE_CLINICAL_EVENT_TYPES.name', type_module: 'AVAILABLE_CLINICAL_EVENT_TYPES.module', dateStartDate: 'CLINICAL_EVENTS.dateStartDate', endDate: 'CLINICAL_EVENTS.endDate', meddra: 'CLINICAL_EVENTS.meddra', meddra_code: 'ADVERSE_EVENT_MEDDRA.code', deleted: 'CLINICAL_EVENTS.deleted' })
                .leftJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
                .leftJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
                .where(builder => builder.where('CLINICAL_EVENTS.patient', patientId).orWhere('CLINICAL_EVENTS.recordedDuringVisit', 'in', ids))
                .andWhere(innerWhereObj)
                .then(result => {
                    const returnObj = { clinicalEventsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getClinicalEvents(patientId, deleted) {
        const _this = this;
        const whereObj = { patient: patientId };
        const innerWhereObj = {};
        if (deleted !== true) {
            whereObj.deleted = '-';
            innerWhereObj['CLINICAL_EVENTS.deleted'] = '-';
        }
        return dbcon()('VISITS').select('id', 'deleted').where(whereObj).then(resu => {
            const ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return dbcon()('CLINICAL_EVENTS')
                .select({ id: 'CLINICAL_EVENTS.id', recordedDuringVisit: 'CLINICAL_EVENTS.recordedDuringVisit', type: 'CLINICAL_EVENTS.type', type_name: 'AVAILABLE_CLINICAL_EVENT_TYPES.name', type_module: 'AVAILABLE_CLINICAL_EVENT_TYPES.module', dateStartDate: 'CLINICAL_EVENTS.dateStartDate', endDate: 'CLINICAL_EVENTS.endDate', meddra: 'CLINICAL_EVENTS.meddra', meddra_code: 'ADVERSE_EVENT_MEDDRA.code', deleted: 'CLINICAL_EVENTS.deleted' })
                .leftJoin('AVAILABLE_CLINICAL_EVENT_TYPES', 'AVAILABLE_CLINICAL_EVENT_TYPES.id', 'CLINICAL_EVENTS.type')
                .leftJoin('ADVERSE_EVENT_MEDDRA', 'ADVERSE_EVENT_MEDDRA.id', 'CLINICAL_EVENTS.meddra')
                .where(builder => builder.where('CLINICAL_EVENTS.patient', patientId).orWhere('CLINICAL_EVENTS.recordedDuringVisit', 'in', ids))
                .andWhere(innerWhereObj)
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getCeData(result[i].id, deleted));
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

    getDiagnosis(patientId, deleted) {
        const whereObj = { 'PATIENT_DIAGNOSIS.patient': patientId };
        if (deleted !== true)
            whereObj['PATIENT_DIAGNOSIS.deleted'] = '-';
        return dbcon()('PATIENT_DIAGNOSIS')
            .select({ id: 'PATIENT_DIAGNOSIS.id', diagnosis: 'PATIENT_DIAGNOSIS.diagnosis', diagnosis_value: 'AVAILABLE_DIAGNOSES.value', diagnosisDate: 'PATIENT_DIAGNOSIS.diagnosisDate', deleted: 'PATIENT_DIAGNOSIS.deleted' })
            .leftJoin('AVAILABLE_DIAGNOSES', 'AVAILABLE_DIAGNOSES.id', 'PATIENT_DIAGNOSIS.diagnosis')
            .where(whereObj)
            .then(result => {
                const returnObj = { diagnosis: result };
                return returnObj;
            });
    }

    getComorbidities(patientId, deleted) {
        const whereObj = { patient: patientId };
        const innerWhereObj = {};
        if (deleted !== true) {
            whereObj.deleted = '-';
            innerWhereObj['COMORBIDITY.deleted'] = '-';
        }
        return dbcon()('VISITS').select({ id: 'id', visitDate: 'visitDate', type: 'type', deleted: 'deleted' }).where(whereObj).then(resu => {
            const ids = [];
            const dates = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
                dates[resu[i].id] = resu[i].visitDate;
            }
            return dbcon()('COMORBIDITY')
                .select({ id: 'COMORBIDITY.id', visit: 'COMORBIDITY.visit', comorbidity: 'COMORBIDITY.comorbidity', comorbidity_code: 'ICD11.code' })
                .leftJoin('ICD11', 'ICD11.id', 'COMORBIDITY.comorbidity')
                .whereIn('COMORBIDITY.visit', ids)
                .andWhere(innerWhereObj)
                .then(result => ({ comorbidities: result }));
        });
    }
}

const _singleton = new SelectorUtils();
export default _singleton;
