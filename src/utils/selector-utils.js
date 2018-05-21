const knex = require('../utils/db-connection');

class SelectorUtils {
    getVisitsWithoutData(patientId) {
        return knex('visits')
            .select({visitId: 'id', visitDate: 'visit_date'})
            .where({'patient': patientId, deleted: 0})
            .then(result => {
                const returnObj = {visitsWithoutData: result};
                return returnObj;
            })
    }

    getDemographicData(patientId) {
        return knex('patient_demographic_data')
            .select('DOB', 'gender', 'dominant_hand', 'ethnicity', 'country_of_origin', 'alcohol_usage', 'smoking_history')
            .where({'patient': patientId, deleted: 0})
            .then(result => {
                const returnObj = {demographicData: result[0]};
                return returnObj;
            })
    }
    
    getTestsWithoutData(patientId) {
        const subquery = knex('visits').select({'id': 'ordered_during_visit'}).where({'patient': patientId, deleted: 0});
        return knex('ordered_tests')
            .select('ordered_during_visit', 'type', 'expected_occur_date')
            .where('ordered_during_visit', 'in', subquery)
            .andWhere({deleted: 0})
            .then(result => {
                const returnObj = {testsWithoutData: result};
                return returnObj;
            })
    }

    getImmunisations(patientId) {
        return knex('patient_immunisation')
            .select('vaccine_name', 'immunisation_date')
            .where({patient: patientId, deleted: 0})
            .then(result => {
                const returnObj = {immunisations: result};
                return returnObj
            })
    }

    getMedicalHistory(patientId) {
        return knex('existing_or_familial_medical_conditions')
            .select('relation', 'condition_name', 'start_date', 'outcome', 'resolved_year')
            .where({patient: patientId, deleted: 0})
            .then(result => {
                const returnObj = {medicalHistory: result};
                return returnObj
            })
    }

    getVisits(patientId){
        const _this = this;
        return knex('visits')
            .select({visitId: 'id', visitDate: 'visit_date'})
            .where({'patient': patientId, deleted: 0})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = []
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getVisitData(result[i].visitId));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++){
                                result[i].data = data[i];
                            }
                            const returnObj = {visits: result};
                            return returnObj;
                        }
                    )
                    return allPromisesResolving;
                } else {
                    const returnObj = {visits: result};
                    return returnObj;
                }
            })
    }

    getTests(patientId){
        const _this = this;
        const subquery = knex('visits').select({'id': 'ordered_during_visit'}).where({'patient': patientId, deleted: 0});
        return knex('ordered_tests')
                .select({'testId': 'id'},'ordered_during_visit', 'type', 'expected_occur_date')
                .where('ordered_during_visit', 'in', subquery)
                .andWhere({deleted: 0})
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = []
                        for (let i = 0; i < result.length; i++){
                            promiseArr.push(_this._getTestData(result[i].testId));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            data => {
                                for (let i = 0; i < data.length; i++){
                                    result[i].data = data[i];
                                }
                                const returnObj = {tests: result};
                                return returnObj;
                            }
                        )
                        return allPromisesResolving;
                    } else {
                        const returnObj = {tests: result};
                        return returnObj;
                    }
            })
    }

    getTreatments(patientId) {
        const _this = this;
        const subquery = knex('visits').select({'id': 'ordered_during_visit'}).where({'patient': patientId, deleted: 0});
        return knex('treatments')
            .select('id', 'ordered_during_visit', 'drug', 'dose', 'unit', 'form', 'times_per_day', 'duration_weeks', 'terminated_date', 'terminated_reason')
            .where('ordered_during_visit', 'in', subquery)
            .andWhere({deleted: 0})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = []
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getTreatmentInterruptions(result[i].id));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        interruptions => {
                            for (let i = 0; i < interruptions.length; i++){
                                result[i].interruptions = interruptions[i];
                            }
                            const returnObj = {treatments: result};
                            return returnObj;
                        }
                    )
                    return allPromisesResolving;
                } else {
                    const returnObj = {treatments: result};
                    return returnObj;
                }
            })
    }

    _getVisitData(visitId){
        return knex('visit_collected_data')
            .select('field', 'value')
            .where({'visit': visitId, 'deleted': 0});
    }

    _getTestData(testId){
        return knex('test_data')
            .select('field', 'value')
            .where({'test': testId, 'deleted': 0});
    }

    _getTreatmentInterruptions(treatmentId) {
        return knex('treatments_interruptions')
            .select('reason', 'start_date', 'end_date')
            .where({'treatment': treatmentId, deleted: 0});
    }

    _getCeData(ceId){
        return knex('clinical_events_data')
            .select('field', 'value')
            .where({'clinical_event': ceId, 'deleted': 0});
    }

    getClinicalEventsWithoutData(patientId) {
        const subquery = knex('visits').select('id').where({'patient': patientId, deleted: 0});
        return knex('clinical_events')
            .select('recorded_during_visit', 'type', 'date_start_date', 'end_date')
            .where(builder => builder.where('patient', patientId).orWhere('recorded_during_visit', 'in', subquery))
            .andWhere({deleted: 0})
            .then(result => {
                const returnObj = {clinicalEventsWithoutData: result};
                return returnObj;
            })
    }

    getClinicalEvents(patientId) {
        const _this = this;
        const subquery = knex('visits').select('id').where({'patient': patientId, deleted: 0});
        return knex('clinical_events')
            .select('id', 'recorded_during_visit', 'type', 'date_start_date', 'end_date')
            .where(builder => builder.where('patient', patientId).orWhere('recorded_during_visit', 'in', subquery))
            .andWhere({deleted: 0})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = []
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getCeData(result[i].id));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++){
                                result[i].data = data[i];
                            }
                            const returnObj = {clinicalEvents: result};
                            return returnObj;
                        }
                    )
                    return allPromisesResolving;
                } else {
                    const returnObj = {clinicalEvents: result};
                    return returnObj;
                }
            })
    }
}

const _singleton = new SelectorUtils();
module.exports = _singleton;
