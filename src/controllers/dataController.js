const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class DataController {
    static addDemographicData(req, res){
        knex('patient_demographic_data')
            .insert({
                patient: 1,
                DOB: '1/4/1995',
                gender: 'male',
                dominant_hand: 'left',
                ethnicity: 'chinese',
                country_of_origin: 'china',
                alcohol_usage: 'More than 3 units a day',
                smoking_history: 'unknown',
                created_by_user: 1,
                deleted: 0 })
            .then(id => console.log(id))
            .catch(res => console.log(res));
    }

    static addImmunisationData(req, res){
        knex('patient_immunisation')
            .insert({
                patient: 16,
                vaccine_name: 'BCG',
                immunisation_date: '5/2/1989',
                created_by_user: 1,
                deleted: 0 })
            .then(id => console.log(id))
            .catch(res => console.log(res));
    }

    static addMedicalCondition(req, res){
        knex('existing_or_familial_medical_conditions')
            .insert({
                patient: 15,
                relation: 'self',
                condition_name: 'MS',
                start_date: '1/6/1025',
                outcome: 'resolved',
                resolved_year: 1954,
                created_by_user: 1,
                deleted:0 })
            .then(id => console.log(id))
            .catch(res => console.log(res));
    }
}



module.exports = DataController;