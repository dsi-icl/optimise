const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const { DemographicCore, MedicalHistoryCore, ImmunisationCore, PregnancyCore } = require('../core/demographic');

const PregnancyModel = {
    'patient': 0,
    'startDate': null,
    'outcome': 0,
    'outcomeDate': null,
    'meddra': null
};

function DemographicDataController() {
    this.demographic = new DemographicCore();
    this.immunisation = new ImmunisationCore();
    this.medicalhistory = new MedicalHistoryCore();
    this.pregnancy = new PregnancyCore();

    this.getDemogData = DemographicDataController.prototype.getDemogData.bind(this);
    this.editDemographic = DemographicDataController.prototype.editDemographic.bind(this);
    this.createDemographic = DemographicDataController.prototype.createDemographic.bind(this);
    this.deleteDemographic = DemographicDataController.prototype.deleteDemographic.bind(this);

    this.createImmunisation = DemographicDataController.prototype.createImmunisation.bind(this);
    this.editImmunisation = DemographicDataController.prototype.editImmunisation.bind(this);
    this.deleteImmunisation = DemographicDataController.prototype.deleteImmunisation.bind(this);

    this.createMedicalCondition = DemographicDataController.prototype.createMedicalCondition.bind(this);
    this.editMedicalCondition = DemographicDataController.prototype.editMedicalCondition.bind(this);
    this.deleteMedicalCondition = DemographicDataController.prototype.deleteMedicalCondition.bind(this);

    this.createPregnancy = DemographicDataController.prototype.createPregnancy.bind(this);
    this.getPregnancy = DemographicDataController.prototype.getPregnancy.bind(this);
    this.editPregnancy = DemographicDataController.prototype.editPregnancy.bind(this);
    this.deletePregnancy = DemographicDataController.prototype.deletePregnancy.bind(this);

    this.getFields = DemographicDataController.prototype.getFields.bind(this);
    this.getDemographicFields = DemographicDataController.prototype.getDemographicFields.bind(this);
    this.getMedicalConditionFields = DemographicDataController.prototype.getMedicalConditionFields.bind(this);
    this.getPregnancyFields = DemographicDataController.prototype.getPregnancyFields.bind(this);
}

DemographicDataController.prototype.createDemographic = function (req, res) {
    if ((!req.body.hasOwnProperty('patient') || !req.body.hasOwnProperty('DOB') || !req.body.hasOwnProperty('gender') || !req.body.hasOwnProperty('dominant_hand')
        || !req.body.hasOwnProperty('ethnicity') || !req.body.hasOwnProperty('country_of_origin') || !req.body.hasOwnProperty('alcohol_usage') || !req.body.hasOwnProperty('smoking_history'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.patient !== 'number' || typeof req.body.DOB !== 'string' || typeof req.body.gender !== 'number' || typeof req.body.dominant_hand !== 'number'
        || typeof req.body.ethnicity !== 'number' || typeof req.body.country_of_origin !== 'number' || typeof req.body.alcohol_usage !== 'number' || typeof req.body.smoking_history !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
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
        'createdByUser': req.user.id
    };
    this.demographic.createDemographic(entryObj).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

DemographicDataController.prototype.createImmunisation = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('immunisationDate') && req.body.hasOwnProperty('vaccineName') &&
        typeof req.body.patient === 'number' && typeof req.body.immunisationDate === 'string' && typeof req.body.vaccineName === 'string') {
        const entryObj = {
            'patient': req.body.patient,
            'immunisationDate': Date.parse(req.body.immunisationDate),
            'vaccineName': req.body.vaccineName,
            'createdByUser': req.user.id
        };
        this.immunisation.createImmunisation(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!(req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('immunisationDate') && req.body.hasOwnProperty('vaccineName'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.createMedicalCondition = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('outcome') && req.body.hasOwnProperty('relation') && req.body.hasOwnProperty('conditionName') &&
        ((req.body.hasOwnProperty('resolvedYear') && typeof req.body.resolvedYear === 'number') || !req.body.hasOwnProperty('resolvedYear')) &&
        typeof req.body.patient === 'number' && typeof req.body.startDate === 'string' && typeof req.body.outcome === 'string' && typeof req.body.relation === 'number' && typeof req.body.conditionName === 'number') {
        const entryObj = {
            'patient': req.body.patient,
            'startDate': Date.parse(req.body.startDate),
            'relation': req.body.relation,
            'outcome': req.body.outcome,
            'conditionName': req.body.conditionName,
            'createdByUser': req.user.id
        };
        if (req.body.resolvedYear) {
            entryObj.resolvedYear = req.body.resolvedYear;
        }
        this.medicalhistory.createMedicalHistory(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!(req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('startDate') && req.body.hasOwnProperty('outcome') && req.body.hasOwnProperty('relation') && req.body.hasOwnProperty('conditionName'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteDemographic = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.demographic.deleteDemographic(req.user, { id: req.body.id }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteImmunisation = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.immunisation.deleteImmunisation(req.user, { id: req.body.id }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteMedicalCondition = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.medicalhistory.deleteMedicalHistory(req.user, { id: req.body.id }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editDemographic = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.demographic.editDemographic(req.user, req.body).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editImmunisation = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number' &&
        ((req.body.hasOwnProperty('immunisationDate') && typeof req.body.immunisationDate === 'string') || !req.body.hasOwnProperty('immunisationDate'))) {
        this.immunisation.editImmunisation(req.user, req.body).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editMedicalCondition = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number' &&
        ((req.body.hasOwnProperty('outcome') && typeof req.body.outcome === 'string') || !req.body.hasOwnProperty('outcome')) &&
        ((req.body.hasOwnProperty('resolvedYear') && typeof req.body.resolvedYear === 'number') || !req.body.hasOwnProperty('resolvedYear'))) {
        this.medicalhistory.editMedicalHistory(req.user, req.body).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.getDemogData = function (req, res) {
    if (req.params.hasOwnProperty('dataType')) {
        let whereObj = { 'deleted': '-' };
        if (req.query.hasOwnProperty('patient'))
            whereObj.patient = req.query.patient;
        let action = {
            'Demographic': this.demographic.getDemographic,
            'Immunisation': this.immunisation.getImmunisation,
            'MedicalCondition': this.medicalhistory.getMedicalHistory,
            'Pregnancy': this.pregnancy.getPregnancy
        };
        action[req.params.dataType](whereObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
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

DemographicDataController.prototype.getFields = function (req, res) {
    if (req.params.hasOwnProperty('dataType')) {
        let action = {
            'Demographic': this.getDemographicFields,
            'MedicalCondition': this.getMedicalConditionFields,
            'Pregnancy': this.getPregnancyFields
        };
        if (!action.hasOwnProperty(req.params.dataType)) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        } else {
            action[req.params.dataType](req, res);
            return;
        }
    } else {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
};

DemographicDataController.prototype.getDemographicFields = function (req, res) {
    let action = {
        'gender': this.demographic.getGenderFields,
        'dominant_hand': this.demographic.getDominantHandsFields,
        'ethnicity': this.demographic.getEthnicityFields,
        'country': this.demographic.getCountryFields,
        'alcohol_usage': this.demographic.getAlcoholUsageFields,
        'smoking_history': this.demographic.getSmokingFields
    };

    if (Object.keys(req.query).length !== 0 && req.query.hasOwnProperty('fieldName')) {
        if (action.hasOwnProperty(req.query.fieldName)) {
            action[req.query.fieldName]().then(function (result) {
                res.status(200).json(formatToJSON(result));
                return;
            }, function (error) {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return;
            });
        } else {
            res.status(404).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    } else {
        const promiseArray = [];
        for (let key = 0; key < Object.keys(action).length; key++) {
            promiseArray.push(action[Object.keys(action)[key]]());
        }
        let promiseHandler = Promise.all(promiseArray);
        promiseHandler.then(function (result) {
            const responseObj = {};
            for (let i = 0; i < result.length; i++) {
                responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
            }
            res.status(200).json(responseObj);
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    }
};

DemographicDataController.prototype.getMedicalConditionFields = function (req, res) {
    let action = {
        'relations': this.medicalhistory.getRelations,
        'conditions': this.medicalhistory.getConditions
    };

    if (Object.keys(req.query).length !== 0 && req.query.hasOwnProperty('fieldName')) {
        if (action.hasOwnProperty(req.query.fieldName)) {
            action[req.query.fieldName]().then(function (result) {
                res.status(200).json(formatToJSON(result));
                return;
            }, function (error) {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return;
            });
        } else {
            res.status(404).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    } else {
        const promiseArray = [];
        for (let key = 0; key < Object.keys(action).length; key++) {
            promiseArray.push(action[Object.keys(action)[key]]());
        }
        let promiseHandler = Promise.all(promiseArray);
        promiseHandler.then(function (result) {
            const responseObj = {};
            for (let i = 0; i < result.length; i++) {
                responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
            }
            res.status(200).json(responseObj);
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    }
};

DemographicDataController.prototype.getPregnancy = function (req, res) {
    let whereObj = {};
    if (req.query.hasOwnProperty('patient'))
        whereObj.patient = req.query.patient;
    this.pregnancy.getPregnancy(whereObj).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

DemographicDataController.prototype.createPregnancy = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('outcome') &&
        typeof req.body.patient === 'number' && typeof req.body.outcome === 'number') {

        if ((req.body.hasOwnProperty('meddra') && typeof req.body.meddra !== 'number') ||
            (req.body.hasOwnProperty('startDate') && isNaN(Date.parse(req.body.startDate)))) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

        let entryObj = Object.assign({}, PregnancyModel, req.body);
        if (req.body.hasOwnProperty('startDate'))
            entryObj.startDate = Date.parse(req.body.startDate);
        if (req.body.hasOwnProperty('outcomeDate'))
            entryObj.outcomeDate = Date.parse(req.body.outcomeDate);
        entryObj.createdByUser = req.user.id;

        this.pregnancy.createPregnancy(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return;
        });
    } else if (!(req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('outcome'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editPregnancy = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.pregnancy.editPregnancy(req.user, req.body).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deletePregnancy = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.pregnancy.deletePregnancy(req.user, { 'id': req.body.id }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.getPregnancyFields = function (__unused__req, res) {
    this.pregnancy.getPregnancyOutcomes().then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

module.exports = DemographicDataController;