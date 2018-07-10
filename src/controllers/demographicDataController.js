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
    this.getFields = DemographicDataController.prototype.getFields.bind(this);
    this.getDemographicFields = DemographicDataController.prototype.getDemographicFields.bind(this);
    this.getMedicalConditionFields = DemographicDataController.prototype.getMedicalConditionFields.bind(this);
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

DemographicDataController.prototype.getFields = function (req, res) {
    if (req.params.hasOwnProperty('dataType')) {
        let action = {
            'Demographic': this.getDemographicFields,
            'MedicalCondition': this.getMedicalConditionFields
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
                res.status(200).json(result);
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
                res.status(200).json(result);
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

module.exports = DemographicDataController;