const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { DemographicCore, MedicalHistoryCore, ImmunisationCore } = require('../core/demographic');

function DemographicDataController() {
    this.demographic = new DemographicCore();
    this.immunisation = new ImmunisationCore();
    this.medicalhistory = new MedicalHistoryCore();

    this.getDemogData = DemographicDataController.prototype.getDemogData.bind(this);
    this.createDemographic = DemographicDataController.prototype.createDemographic.bind(this);
    this.createImmunisation = DemographicDataController.prototype.createImmunisation.bind(this);
    this.createMedicalCondition = DemographicDataController.prototype.createMedicalCondition.bind(this);
    this.editDemographic = DemographicDataController.prototype.editDemographic.bind(this);
    this.editImmunisation = DemographicDataController.prototype.editImmunisation.bind(this);
    this.editMedicalCondition = DemographicDataController.prototype.editMedicalCondition.bind(this);
    this.deleteDemographic = DemographicDataController.prototype.deleteDemographic.bind(this);
    this.deleteImmunisation = DemographicDataController.prototype.deleteImmunisation.bind(this);
    this.deleteMedicalCondition = DemographicDataController.prototype.deleteMedicalCondition.bind(this);
}

DemographicDataController.prototype.createDemographic = function (req, res) {
    if ((!req.body.hasOwnProperty('patient') || !req.body.hasOwnProperty('DOB') || !req.body.hasOwnProperty('gender') || !req.body.hasOwnProperty('dominant_hand')
        || !req.body.hasOwnProperty('ethnicity') || !req.body.hasOwnProperty('country_of_origin') || !req.body.hasOwnProperty('alcohol_usage') || !req.body.hasOwnProperty('smoking_history'))
        || (typeof req.body.patient !== 'number' || typeof req.body.DOB !== 'string' || typeof req.body.gender !== 'number' || typeof req.body.dominant_hand !== 'number'
            || typeof req.body.ethnicity !== 'number' || typeof req.body.country_of_origin !== 'number' || typeof req.body.alcohol_usage !== 'number' || typeof req.body.smoking_history !== 'number')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    let entryObj = {
        'patient': req.body.patient,
        'DOB': Date.parse(req.body.DOB),
        'gender': req.body.gender,
        'dominantHand': req.body.dominant_hand,
        'ethnicity': req.body.ethnicity,
        'countryOfOrigin': req.body.country_of_origin,
        'alcoholUsage': req.body.alcohol_usage,
        'smokingHistory': req.body.smoking_history,
        'createdByUser': req.requester.userid
    };
    this.demographic.createDemographic(entryObj).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

DemographicDataController.prototype.createMedicalCondition = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('immunisationDate') && req.body.hasOwnProperty('vaccineName')) {
        const entryObj = {
            'patient': req.body.patient,
            'startDate': Date.parse(req.body.startDate),
            'relation': req.body.relation,
            'outcome': req.body.outcome,
            'conditionName': req.body.conditionName
        };
        if (req.body.resolvedYear) {
            entryObj.resolvedYear = req.body.resolvedYear;
        }
<<<<<<< HEAD
        knex('PATIENTS')
            .select('deleted')
            .where({ 'id': req.body.patient, 'deleted': '-' })
            .then(result => {
                if (result.length !== 1) {
                    res.status(404).send('User not found');
                    return ;
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
=======
        this.medicalhistory.createMedicalHistory(entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
>>>>>>> origin/develop-FixingPromise
    }
};

DemographicDataController.prototype.createImmunisation = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('immunisationDate') && req.body.hasOwnProperty('vaccineName')) {
        const entryObj = {
            'patient': req.body.patient,
            'immunisationDate': Date.parse(req.body.immunisationDate),
            'vaccineName': req.body.vaccineName
        };
        this.immunisation.createImmunisation(entryObj).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

DemographicDataController.prototype.deleteDemographic = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.demographic.deleteDemographic(req.requester, { id: req.body.id }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteImmunisation = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.immunisation.deleteImmunisation(req.requester, { id: req.body.id }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteMedicalCondition = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.medicalhistory.deleteMedicalHistory(req.requester, { id: req.body.id }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editDemographic = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.demographic.editDemographic(req.requester, req.body).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editImmunisation = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.immunisation.editImmunisation(req.requester, req.body).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editMedicalCondition = function (req, res) {
    if (req.requester.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.medicalhistory.editMedicalHistory(req.requester, req.body).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.getDemogData = function (req, res) {
    if (req.params.hasOwnProperty('dataType') && req.body.hasOwnProperty('patient')) {
        let action = {
            'Demographic': this.demographic.getDemographic,
            'Immunisation': this.immunisation.getImmunisation,
            'MedicalCondition': this.medicalhistory.getMedicalHistory
        };
        action[req.params.dataType](req.body.patient).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

<<<<<<< HEAD
    PUTMedicalCondition(req, res) {
        if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
            let newObj = Object.assign({}, req.body);
            delete newObj.id;
            if (req.body.startDate && validateAndFormatDate(req.body.startDate))
                newObj.startDate = validateAndFormatDate(req.body.startDate);

            const whereObj = { 'id': req.body.id, 'deleted': '-' };
            updateEntry(req, res, 'MEDICAL_HISTORY', whereObj, newObj, 'Row for Medical Condition', 1);
        } else if (req.requester.priv !== 1) {
            res.status(401).send('Error. You do not have permission; or the request is malformed');
        } else {
            res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
        }
    }
}
=======
module.exports = DemographicDataController;

// class DemographicDataController {
//     constructor() {
//         this._Router = this._Router.bind(this);
//         this.GETImmunisation = this.GETDemographic.bind(this);
//         this.GETMedicalCondition = this.GETDemographic.bind(this);
//     }


//     _Router(req, res) {
//         try {
//             this[`${req.method}${req.params.dataType}`](req, res);
//         } catch (e) {
//             if (e instanceof TypeError) {
//                 res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!${e}`);
//             } else {
//                 res.status(500).send(`Server Error!${e}`);
//             }
//         }
//     }

//     POSTDemographic(req, res) { //create demographic data
//         if ((!req.body.patient || !req.body.DOB || !req.body.gender || !req.body.dominant_hand
//             || !req.body.ethnicity || !req.body.country_of_origin || !req.body.alcohol_usage || !req.body.smoking_history)
//             || (typeof req.body.patient !== 'number' || typeof req.body.DOB !== 'object' || !validateAndFormatDate(req.body.DOB) || typeof req.body.gender !== 'number' || typeof req.body.dominant_hand !== 'number'
//                 || typeof req.body.ethnicity !== 'number' || typeof req.body.country_of_origin !== 'number' || typeof req.body.alcohol_usage !== 'number' || typeof req.body.smoking_history !== 'number')) {
//             res.status(400).send('Missing information in form.');
//             return;
//         }
//         knex('PATIENTS')
//             .select('deleted')
//             .where({ 'id': req.body.patient, 'deleted': '-' })
//             .then(result => {
//                 if (result.length !== 1) {
//                     res.status(404).send('User not found');
//                     return;
//                 }
//                 knex('PATIENT_DEMOGRAPHIC')
//                     .select('*')
//                     .where({ 'patient': req.body.patient, 'deleted': '-' })
//                     .then(resu => {
//                         if (resu.length === 0 && result.length === 1) {
//                             let entryObj = {
//                                 'patient': req.body.patient,
//                                 'DOB': validateAndFormatDate(req.body.DOB),
//                                 'gender': req.body.gender,
//                                 'dominantHand': req.body.dominant_hand,
//                                 'ethnicity': req.body.ethnicity,
//                                 'countryOfOrigin': req.body.country_of_origin,
//                                 'alcoholUsage': req.body.alcohol_usage,
//                                 'smokingHistory': req.body.smoking_history
//                             };
//                             let databaseErrMsg = 'Cannot create entry. Please check your parameters, and that the values be one of the permitted values. Or the entry might already exist.';
//                             createEntry(req, res, 'PATIENT_DEMOGRAPHIC', entryObj, databaseErrMsg);
//                         } else if (result.length !== 1) {
//                             res.status(404).send('Cannot seem to find your patient!');
//                             return;
//                         } else if (resu.length !== 0) {
//                             res.status(400).send('Patient already have demographic data.');
//                             return;
//                         }
//                     }).catch(err => {
//                         console.log(err);
//                         res.status(500).send(`Problem catched: error message : ${err}`);
//                         return;
//                     });
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.status(500).send('Server error.');
//                 return;
//             });
//     }

//     POSTImmunisation(req, res) {
//         if (req.body.patient && req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate) && req.body.vaccineName) {
//             knex('PATIENTS')
//                 .select('id')
//                 .where({ 'id': req.body.patient, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 0) {
//                         res.status(404).send('Can\'t seem to find your patient!');
//                     } else if (result.length === 1) {
//                         const entryObj = {
//                             'patient': req.body.patient,
//                             'immunisationDate': validateAndFormatDate(req.body.immunisationDate),
//                             'vaccineName': req.body.vaccineName
//                         };
//                         createEntry(req, res, 'PATIENT_IMMUNISATION', entryObj, 'Eror. Entry might already exists.');
//                     } else {
//                         res.status(500).send('Database error');
//                         return;
//                     }
//                 }).catch(err => {
//                     console.log(err);
//                     res.status(500).send(`Problem catched: error message : ${err}`);
//                 });
//         } else {
//             res.status(400).send('Error. Please provide the suitable parameters.');
//         }
//     }

//     POSTMedicalCondition(req, res) {    //check resolved year >= year
//         if (req.body.patient && (req.body.startDate && validateAndFormatDate(req.body.startDate)) && req.body.outcome && req.body.conditionName && req.body.relation) {
//             knex('PATIENTS')
//                 .select('id')
//                 .where({ 'id': req.body.patient, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 0) {
//                         res.status(404).send('Can\'t seem to find your patient!');
//                     } else if (result.length === 1) {
//                         const entryObj = {
//                             'patient': req.body.patient,
//                             'startDate': validateAndFormatDate(req.body.startDate),
//                             'relation': req.body.relation,
//                             'outcome': req.body.outcome,
//                             'conditionName': req.body.conditionName
//                         };
//                         if (req.body.resolvedYear) {
//                             entryObj.resolvedYear = req.body.resolvedYear;
//                         }
//                         createEntry(req, res, 'MEDICAL_HISTORY', entryObj, 'Error. Entry might already exists. Or body might be malformed');
//                         return;
//                     } else {
//                         res.status(500).send('Database error');
//                         return;
//                     }
//                 })
//                 .catch(err => { console.log(err); res.status(400).send('bad request'); });
//         } else {
//             res.status(400).send('Error. Please provide the suitable parameters.');
//         }
//     }

//     GETDemographic(req, res) {        //reference shared by GETImmunisation and GETMedicalCondition; bound in constructor
//         const querytable = {
//             'Demographic': 'PATIENT_DEMOGRAPHIC',
//             'Immunisation': 'PATIENT_IMMUNISATION',
//             'MedicalCondition': 'MEDICAL_HISTORY'
//         };
//         if (req.query.patientId) {
//             knex('PATIENTS')
//                 .select('id')
//                 .where({ 'id': req.query.patientId, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 0) {
//                         res.status(404).send('Can\'t seem to find your patient!');
//                     } else if (result.length === 1) {
//                         if (!querytable.hasOwnProperty(req.params.dataType)) {
//                             res.status(400).send('DataType unrecognized');
//                             return;
//                         }
//                         knex(querytable[req.params.dataType])
//                             .select('*')
//                             .where({ 'patient': req.body.patientId, 'deleted': '-' })
//                             .then(result => {
//                                 for (let i = 0; i < result.length; i++) {
//                                     result[i]['patient'] = req.query.patientId;
//                                     delete result[i]['id'];
//                                     delete result[i]['deleted'];
//                                     delete result[i]['createdTime'];
//                                     delete result[i]['createdByUser'];
//                                 }
//                                 res.status(200).json(result);
//                                 return;
//                             }).catch(err => {
//                                 console.log(err);
//                                 res.status(500).send(`Problem catched: error message : ${err}`);
//                             });
//                     } else {
//                         res.status(500).send('Database error');
//                         return;
//                     }
//                 }).catch(err => {
//                     console.log(err);
//                     res.status(500).send(`Problem catched: error message : ${err}`);
//                     return;
//                 });
//         } else {
//             res.status(400).send('Please provide patient ID in the form of "?patientId="');
//             return;
//         }
//     }

//     DELETEDemographic(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             deleteEntry(req, res, 'PATIENT_DEMOGRAPHIC', { 'id': req.body.id, 'deleted': '-' }, `Demographic information with id ${req.body.id}`, 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }

//     DELETEImmunisation(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             const whereObj = { 'id': req.body.id, 'deleted': '-' };
//             deleteEntry(req, res, 'PATIENT_IMMUNISATION', whereObj, `Immunisation of id ${req.body.id}`, 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }

//     DELETEMedicalCondition(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             const whereObj = { 'id': req.body.id, 'deleted': '-' };
//             deleteEntry(req, res, 'MEDICAL_HISTORY', whereObj, 'Entry', 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }

//     PUTDemographic(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             let newObj = Object.assign({}, req.body);
//             delete newObj.id;
//             const whereObj = { 'id': req.body.id, 'deleted': '-' };
//             if (req.body.DOB && validateAndFormatDate(req.body.DOB)) {
//                 newObj.DOB = validateAndFormatDate(req.body.DOB);
//             }
//             updateEntry(req, res, 'PATIENT_DEMOGRAPHIC', whereObj, newObj, 'Row for Demographic information', 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }

//     PUTImmunisation(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             let newObj = Object.assign({}, req.body);
//             delete newObj.id;
//             const whereObj = { 'id': req.body.id, 'deleted': '-' };
//             if (req.body.immunisationDate && validateAndFormatDate(req.body.immunisationDate)) {
//                 newObj.immunisationDate = validateAndFormatDate(req.body.immunisationDate);
//             }
//             updateEntry(req, res, 'PATIENT_IMMUNISATION', whereObj, newObj, 'Row for Immunisation', 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }

//     PUTMedicalCondition(req, res) {
//         if (req.requester.priv === 1 && req.body.id && typeof req.body.id === 'number') {
//             let newObj = Object.assign({}, req.body);
//             delete newObj.id;
//             if (req.body.startDate) {
//                 let tmp = validateAndFormatDate(req.body.startDate);
//                 newObj.startDate = tmp !== false ? tmp : null;
//             }
//             const whereObj = { 'id': req.body.id, 'deleted': '-' };
//             updateEntry(req, res, 'MEDICAL_HISTORY', whereObj, newObj, 'Row for Medical Condition', 1);
//             return;
//         } else if (req.requester.priv !== 1) {
//             res.status(401).send('Error. You do not have permission; or the request is malformed');
//             return;
//         } else {
//             res.status(400).send('Wrong parameters send. Check if ID is well formatted.');
//             return;
//         }
//     }
// }
>>>>>>> origin/develop-FixingPromise

// module.exports = new DemographicDataController();