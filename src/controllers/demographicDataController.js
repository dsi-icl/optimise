const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class DemographicDataController {
    constructor(){
        this.placeHolderRouter = this.placeHolderRouter.bind(this);  //test
     }

    placeHolderRouter(req, res){         //test
        this.placeHolderTest(req, res);   //test
    }   //test

    static placeHolderTest (req, res) {  //test
        res.status(200).send([req.method,req.params.dataType, req.params.action].toString());  //test
    } //test



    Router(req, res){
        let _this = this;
        switch ([req.method,req.params.dataType, req.params.action].toString()) {   //refactor this to this['functionanme']
            case 'POST,demographic,create':
                break
            case 'POST,immunisation,create':
                break
            case 'POST,medicalCondition,create':
                break
            case 'POST,demographic,edit':
                break
            case 'POST,immunisation,edit':
                break
            case 'POST,medicalCondition,edit':
                break
            case 'GET,demographic':
                break
            case 'GET,immunisation':
                break
            case 'GET,medicalCondition':
                break
            case 'DELETE,demographic':
                break
            case 'DELETE,immunisation':
                break
            case 'DELETE,medicalCondition':
                break
            default:
                res.status(400)
                
        }
    }
    


    addDemographicData(req, res){
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

    addImmunisationData(req, res){
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

    addMedicalCondition(req, res){
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