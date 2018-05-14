const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class DemographicDataController {
    constructor(){
        this._Router = this._Router.bind(this);
     }


    _Router(req, res){
        try {
            this[`${req.method}${req.params.dataType}`](req, res);
        } catch(e) {
            if (e instanceof TypeError){
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
            } else {
                res.status(500).send('Server Error!');
            }

        }
    }

    POSTDemographic(req, res){       //create demographic data
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

    POSTImmunisation(req, res){
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

    POSTMedicalConditions(req, res){
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



module.exports = new DemographicDataController();

        // switch ([req.method,req.params.dataType].toString()) {   //refactor this to this['functionanme']
        //     case 'POST,demographic,create':
        //         break
        //     case 'POST,immunisation,create':
        //         break
        //     case 'POST,medicalCondition,create':
        //         break
        //     case 'POST,demographic,edit':
        //         break
        //     case 'POST,immunisation,edit':
        //         break
        //     case 'POST,medicalCondition,edit':
        //         break
        //     case 'GET,demographic':
        //         break
        //     case 'GET,immunisation':
        //         break
        //     case 'GET,medicalCondition':
        //         break
        //     case 'DELETE,demographic':
        //         break
        //     case 'DELETE,immunisation':
        //         break
        //     case 'DELETE,medicalCondition':
        //         break
        //     default:
        //         res.status(400)
    