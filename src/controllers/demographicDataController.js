const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DemographicDataController {
    constructor(){
        this._Router = this._Router.bind(this);
        this.GETImmunisation = this.GETDemographic.bind(this);
        this.GETMedicalCondition = this.GETDemographic.bind(this);
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

    POSTDemographic(req, res){//create demographic data
        knex('patients')
            .select('id')
            .where({'alias_id': req.body['patient'], 'deleted': 0})
            .then(result => {
                if (result.length === 1){
                    let entryObj = Object.assign({}, req.body);
                    entryObj['patient'] = result[0].id;
                    if (validateAndFormatDate(req.body.DOB)){
                        entryObj.DOB = validateAndFormatDate(req.body.DOB);
                        let databaseErrMsg = 'Cannot create entry. Please check your parameters, and that the values be one of the permitted values. Or the entry might already exist.';
                        createEntry(req, res, 'patient_demographic_data', entryObj, databaseErrMsg);
                    } else {
                        res.status(400).send('Malformed date object.');
                    }
                } else {
                    res.status(404).send('Cannot seem to find your patient!');
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Server error.');
            });
    }

    POSTImmunisation(req, res){
        if (req.body.patient && req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate) && req.body.vaccineName){
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patient, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const entryObj = {'patient': result[0]['id'], 
                                            'immunisation_date': validateAndFormatDate(req.body.immunisationDate),
                                            'vaccine_name': req.body.vaccineName};
                        createEntry(req, res, 'patient_immunisation', entryObj, 'Eror. Entry might already exists.')
                    } else {
                        res.status(500).send('Database error');
                    }
                })
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    POSTMedicalCondition(req, res){    //check resolved year >= year
        if (req.body.patient && req.body.year && req.body.outcome && req.body['condition_name'] && req.body.relation){
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patient, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const entryObj = {'patient': result[0]['id'], 
                                            'start_date': req.body.year,
                                            'relation': req.body.relation,
                                            'outcome': req.body.outcome,
                                            'condition_name': req.body['condition_name']};
                        if (req.body['resolved_year']) {entryObj['resolved_year'] = req.body['resolved_year'];}
                        createEntry(req, res, 'existing_or_familial_medical_conditions', entryObj, 'Error. Entry might already exists. Or body might be malformed')
                    } else {
                        res.status(500).send('Database error');
                    }
                })
                .catch(err => {console.log(err); res.status(400).send('bad request')});
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    GETDemographic(req, res) {        //reference shared by GETImmunisation and GETMedicalCondition; bound in constructor
        if(req.query.patientId){
        knex('patients')
            .select('id')
            .where({'alias_id': req.query.patientId, 'deleted': 0})
            .then(result => {
                if (result.length === 0) {
                    res.status(404).send("Can't seem to find your patient!");
                } else if (result.length === 1) {
                    let querytable;
                    switch (req.params.dataType){
                        case 'Demographic':
                            querytable = 'patient_demographic_data';
                            break
                        case 'Immunisation':
                            querytable = 'patient_immunisation';
                            break
                        case 'MedicalCondition':
                            querytable = 'existing_or_familial_medical_conditions';
                            break
                    }
                    knex(querytable)
                        .select('*')
                        .where({'patient': result[0].id, 'deleted': 0})
                        .then(result => {
                            for (let i = 0; i < result.length; i++){
                                result[i]['patient'] = req.query.patientId;
                                delete result[i]['id'];
                                delete result[i]['deleted'];
                                delete result[i]['created_time'];
                                delete result[i]['created_by_user'];
                            }
                            res.status(200).json(result);
                        })
                } else {
                    res.status(500).send('Database error');
                }
            })
        } else {
            res.status(400).send('Please provide patient ID in the form of "?patientId="');
        }
    }
    
    DELETEImmunisation(req, res){
        if (req.requester.priv === 1 && req.body.patientId && req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate) && req.body.vaccineName) {
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patientId, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const whereObj = {'patient': result[0]['id'], 'immunisation_date': validateAndFormatDate(req.body.immunisationDate), 'vaccine_name': req.body.vaccineName};
                        deleteEntry(req, res, 'patient_immunisation', whereObj, 'Immunisation on ' + validateAndFormatDate(req.body.immunisationDate) + ' of patient ' + req.body.patientId, 1);
                    } else {
                        res.status(500).send('Database error');
                    }
                })
        } else {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        }
    }

    DELETEMedicalCondition(req, res){
        if (req.requester.priv === 1 && req.body.patientId && req.body.relation && req.body.startYear && req.body.condition && req.body.outcome) {
            knex('patients')
                .select('id')
                .where({'alias_id': req.body.patientId, 'deleted': 0})
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send("Can't seem to find your patient!");
                    } else if (result.length === 1) {
                        const whereObj = {'patient': result[0]['id'], 'relation': req.body.relation, 'start_date': req.body.startYear, 'condition_name': req.body.condition, 'outcome': req.body.outcome};
                        deleteEntry(req, res, 'existing_or_familial_medical_conditions', whereObj, 'Entry', 1);
                    } else {
                        res.status(500).send('Database error');
                    }
                })
        } else {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        }
    }

}



module.exports = new DemographicDataController();