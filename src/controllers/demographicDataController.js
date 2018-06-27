const { validateAndFormatDate } = require('../utils/basic-utils');
const { createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DemographicDataController {
    constructor() {
        this._Router = this._Router.bind(this);
        this.GETImmunisation = this.GETDemographic.bind(this);
        this.GETMedicalCondition = this.GETDemographic.bind(this);
    }


    _Router(req, res) {
        try {
            this[`${req.method}${req.params.dataType}`](req, res);
        } catch (e) {
            if (e instanceof TypeError) {
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!${e}`);
            } else {
                res.status(500).send(`Server Error!${e}`);
            }
        }
    }

    POSTDemographic(req, res) { //create demographic data
        if ((!req.body.patient || !req.body.DOB || !req.body.gender || !req.body.dominant_hand
            || !req.body.ethnicity || !req.body.country_of_origin || !req.body.alcohol_usage || !req.body.smoking_history)
            || (typeof req.body.patient !== 'number' || typeof req.body.DOB !== 'object' || !validateAndFormatDate(req.body.DOB) || typeof req.body.gender !== 'number' || typeof req.body.dominant_hand !== 'number'
                || typeof req.body.ethnicity !== 'number' || typeof req.body.country_of_origin !== 'number' || typeof req.body.alcohol_usage !== 'number' || typeof req.body.smoking_history !== 'number')) {
            res.status(400).send('Missing information in form.');
            return;
        }
        knex('PATIENTS')
            .select('deleted')
            .where({ 'id': req.body.patient, 'deleted': '-' })
            .then(result => {
                if (result.length !== 1) {
                    res.status(404).send('User not found');
<<<<<<< HEAD
                    return;
=======
                    return ;
>>>>>>> origin/develop-FixingPromise
                }
                knex('PATIENT_DEMOGRAPHIC')
                    .select('*')
                    .where({ 'patient': req.body.patient, 'deleted': '-' })
                    .then(resu => {
                        if (resu.length === 0 && result.length === 1) {
                            let entryObj = {
                                'patient': req.body.patient,
                                'DOB': validateAndFormatDate(req.body.DOB),
                                'gender': req.body.gender,
                                'dominantHand': req.body.dominant_hand,
                                'ethnicity': req.body.ethnicity,
                                'countryOfOrigin': req.body.country_of_origin,
                                'alcoholUsage': req.body.alcohol_usage,
                                'smokingHistory': req.body.smoking_history
                            };
                            let databaseErrMsg = 'Cannot create entry. Please check your parameters, and that the values be one of the permitted values. Or the entry might already exist.';
                            createEntry(req, res, 'PATIENT_DEMOGRAPHIC', entryObj, databaseErrMsg);
                        } else if (result.length !== 1) {
                            res.status(404).send('Cannot seem to find your patient!');
                        } else if (resu.length !== 0) {
                            res.status(400).send('Patient already have demographic data.');
                        }
                    }).catch(err => {
                        console.log(err);
                        res.status(500).send(`Problem catched: error message : ${err}`);
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('Server error.');
            });
    }

    POSTImmunisation(req, res) {
        if (req.body.patient && req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate) && req.body.vaccineName) {
            knex('PATIENTS')
                .select('id')
                .where({ 'id': req.body.patient, 'deleted': '-' })
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send('Can\'t seem to find your patient!');
                    } else if (result.length === 1) {
                        const entryObj = {
                            'patient': req.body.patient,
                            'immunisationDate': validateAndFormatDate(req.body.immunisationDate),
                            'vaccineName': req.body.vaccineName
                        };
                        createEntry(req, res, 'PATIENT_IMMUNISATION', entryObj, 'Eror. Entry might already exists.');
                    } else {
                        res.status(500).send('Database error');
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).send(`Problem catched: error message : ${err}`);
                });
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    POSTMedicalCondition(req, res) {    //check resolved year >= year
        if (req.body.patient && (req.body.startDate && validateAndFormatDate(req.body.startDate)) && req.body.outcome && req.body.conditionName && req.body.relation) {
            knex('PATIENTS')
                .select('id')
                .where({ 'id': req.body.patient, 'deleted': '-' })
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send('Can\'t seem to find your patient!');
                    } else if (result.length === 1) {
                        const entryObj = {
                            'patient': req.body.patient,
                            'startDate': validateAndFormatDate(req.body.startDate),
                            'relation': req.body.relation,
                            'outcome': req.body.outcome,
                            'conditionName': req.body.conditionName
                        };
                        if (req.body.resolvedYear) {
                            entryObj.resolvedYear = req.body.resolvedYear;
                        }
                        createEntry(req, res, 'MEDICAL_HISTORY', entryObj, 'Error. Entry might already exists. Or body might be malformed');
                    } else {
                        res.status(500).send('Database error');
                    }
                })
                .catch(err => { console.log(err); res.status(400).send('bad request'); });
        } else {
            res.status(400).send('Error. Please provide the suitable parameters.');
        }
    }

    GETDemographic(req, res) {        //reference shared by GETImmunisation and GETMedicalCondition; bound in constructor
        const querytable = {
            'Demographic': 'PATIENT_DEMOGRAPHIC',
            'Immunisation': 'PATIENT_IMMUNISATION',
            'MedicalCondition': 'MEDICAL_HISTORY'
        };
        if (req.query.patientId) {
            knex('PATIENTS')
                .select('id')
                .where({ 'id': req.query.patientId, 'deleted': '-' })
                .then(result => {
                    if (result.length === 0) {
                        res.status(404).send('Can\'t seem to find your patient!');
                    } else if (result.length === 1) {
                        if (!querytable.hasOwnProperty(req.params.dataType)) {
                            res.status(400).send('DataType unrecognized');
                            return;
                        }
                        knex(querytable[req.params.dataType])
                            .select('*')
                            .where({ 'patient': req.body.patientId, 'deleted': '-' })
                            .then(result => {
                                for (let i = 0; i < result.length; i++) {
                                    result[i]['patient'] = req.query.patientId;
                                    delete result[i]['id'];
                                    delete result[i]['deleted'];
                                    delete result[i]['createdTime'];
                                    delete result[i]['createdByUser'];
                                }
                                res.status(200).json(result);
                            }).catch(err => {
                                console.log(err);
                                res.status(500).send(`Problem catched: error message : ${err}`);
                            });
                    } else {
                        res.status(500).send('Database error');
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(500).send(`Problem catched: error message : ${err}`);
                });
        } else {
            res.status(400).send('Please provide patient ID in the form of "?patientId="');
        }
    }

    DELETEDemographic(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            deleteEntry(req, res, 'PATIENT_DEMOGRAPHIC', { 'id': req.body.id, 'deleted': '-' }, `Demographic information with id ${req.body.id}`, 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }

    DELETEImmunisation(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            deleteEntry(req, res, 'PATIENT_IMMUNISATION', whereObj, `Immunisation of id ${req.body.id}`, 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }

    DELETEMedicalCondition(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            deleteEntry(req, res, 'MEDICAL_HISTORY', whereObj, 'Entry', 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }

    PUTDemographic(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            let newObj = Object.assign({}, req.body);
            delete newObj.id;
            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            if (req.body.DOB && validateAndFormatDate(req.body.DOB)) {
                newObj.DOB = validateAndFormatDate(req.body.DOB);
            }
            updateEntry(req, res, 'PATIENT_DEMOGRAPHIC', whereObj, newObj, 'Row for Demographic information', 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }

    PUTImmunisation(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            let newObj = Object.assign({}, req.body);
            delete newObj.id;
            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            if (req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate)) {
                newObj.immunisationDate = validateAndFormatDate(req.body.immunisationDate);
            }
            updateEntry(req, res, 'PATIENT_IMMUNISATION', whereObj, newObj, 'Row for Immunisation', 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }

    PUTMedicalCondition(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            let newObj = Object.assign({}, req.body);
            delete newObj.id;
<<<<<<< HEAD
            if (req.body.startDate) {
                let tmp = validateAndFormatDate(req.body.startDate);
                newObj.startDate = tmp !== false ? tmp : null;
            }
=======
            let tmp;
            if (req.body.startDate && validateAndFormatDate(req.body.startDate))
                newObj.startDate = validateAndFormatDate(req.body.startDate);
>>>>>>> origin/develop-FixingPromise
            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            updateEntry(req, res, 'MEDICAL_HISTORY', whereObj, newObj, 'Row for Medical Condition', 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }
}

module.exports = new DemographicDataController();