const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');
const { DemographicCore, MedicalHistoryCore, ImmunisationCore, PregnancyCore } = require('../core/demographic');

const PregnancyModel = {
    'patient': 0,
    'startDate': null,
    'outcome': undefined,
    'outcomeDate': undefined,
    'meddra': undefined
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
    let momentDOB = moment(req.body.DOB, moment.ISO_8601);
    if (!momentDOB.isValid()) {
        let msg = message.dateError[momentDOB.invalidAt()] !== undefined ? message.dateError[momentDOB.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let entryObj = {
        'patient': req.body.patient,
        'gender': req.body.gender,
        'dominantHand': req.body.dominant_hand,
        'ethnicity': req.body.ethnicity,
        'countryOfOrigin': req.body.country_of_origin,
        'alcoholUsage': req.body.alcohol_usage,
        'smokingHistory': req.body.smoking_history,
        'createdByUser': req.user.id
    };
    if (req.body.hasOwnProperty('DOB') && req.body.DOB !== null)
        entryObj.DOB = momentDOB.valueOf();
    this.demographic.createDemographic(entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return false;
    });
};

DemographicDataController.prototype.createImmunisation = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('immunisationDate') && req.body.hasOwnProperty('vaccineName') &&
        typeof req.body.patient === 'number' && typeof req.body.immunisationDate === 'string' && typeof req.body.vaccineName === 'string') {
        let momentImmun = moment(req.body.immunisationDate, moment.ISO_8601);
        if (!momentImmun.isValid() && req.body.immunisationDate !== null) {
            let msg = message.dateError[momentImmun.invalidAt()] !== undefined ? message.dateError[momentImmun.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const entryObj = {
            'patient': req.body.patient,
            'vaccineName': req.body.vaccineName,
            'createdByUser': req.user.id
        };
        if (req.body.hasOwnProperty('immunisationDate') && req.body.immunisationDate !== null)
            entryObj.immunisationDate = momentImmun.valueOf();
        this.immunisation.createImmunisation(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
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
        let momentStart = moment(req.body.startDate, moment.ISO_8601);
        if (!momentStart.isValid() && req.body.startDate !== null) {
            let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const entryObj = {
            'patient': req.body.patient,
            'relation': req.body.relation,
            'outcome': req.body.outcome,
            'conditionName': req.body.conditionName,
            'createdByUser': req.user.id
        };
        if (req.body.hasOwnProperty('immunisationDate') && req.body.immunisationDate !== null)
            entryObj.startDate = momentStart.valueOf();
        if (req.body.resolvedYear) {
            entryObj.resolvedYear = req.body.resolvedYear;
        }
        this.medicalhistory.createMedicalHistory(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
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
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.demographic.deleteDemographic(req.user, { id: req.body.id }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteImmunisation = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.immunisation.deleteImmunisation(req.user, { id: req.body.id }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deleteMedicalCondition = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.medicalhistory.deleteMedicalHistory(req.user, { id: req.body.id }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editDemographic = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        if (req.body.DOB) {
            let momentDOB = moment(req.body.DOB, moment.ISO_8601);
            if (!momentDOB.isValid()) {
                let msg = message.dateError[momentDOB.invalidAt()] !== undefined ? message.dateError[momentDOB.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            req.body.DOB = momentDOB.valueOf();
        }
        this.demographic.editDemographic(req.user, req.body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editImmunisation = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number' &&
        ((req.body.hasOwnProperty('immunisationDate') && typeof req.body.immunisationDate === 'string') || !req.body.hasOwnProperty('immunisationDate'))) {
        let momentImmun = moment(req.body.immunisationDate, moment.ISO_8601);
        if (req.body.hasOwnProperty('immunisationDate') && req.body.immunisationDate !== null && !momentImmun.isValid()) {
            let msg = message.dateError[momentImmun.invalidAt()] !== undefined ? message.dateError[momentImmun.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        let updateObj = Object.assign(req.body);
        if (updateObj.hasOwnProperty('immunisationDate') && req.body.immunisationDate !== null)
            updateObj.immunisationDate = momentImmun.valueOf();
        this.immunisation.editImmunisation(req.user, updateObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.editMedicalCondition = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number' &&
        ((req.body.hasOwnProperty('outcome') && typeof req.body.outcome === 'string') || !req.body.hasOwnProperty('outcome')) &&
        ((req.body.hasOwnProperty('resolvedYear') && typeof req.body.resolvedYear === 'number') || !req.body.hasOwnProperty('resolvedYear'))) {
        this.medicalhistory.editMedicalHistory(req.user, req.body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
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
        action[req.params.dataType](whereObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.getFields = function (req, res, next) {
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
            action[req.params.dataType](req, res, next);
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
            action[req.query.fieldName]().then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
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
        promiseHandler.then((result) => {
            const responseObj = {};
            for (let i = 0; i < result.length; i++) {
                responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
            }
            res.status(200).json(responseObj);
            return true;
        }).catch((error) => {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return false;
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
            action[req.query.fieldName]().then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
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
        promiseHandler.then((result) => {
            const responseObj = {};
            for (let i = 0; i < result.length; i++) {
                responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
            }
            res.status(200).json(responseObj);
            return true;
        }).catch((error) => {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return false;
        });
    }
};

DemographicDataController.prototype.getPregnancy = function (req, res) {
    let whereObj = {};
    if (req.query.hasOwnProperty('patient'))
        whereObj.patient = req.query.patient;
    this.pregnancy.getPregnancy(whereObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
    });
};

DemographicDataController.prototype.createPregnancy = function (req, res) {
    if (req.body.hasOwnProperty('patient') && typeof req.body.patient === 'number') {

        if (req.body.hasOwnProperty('meddra') && req.body.meddra !== null && isNaN(parseInt(req.body.meddra))) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if ((req.body.hasOwnProperty('outcome') && typeof req.body.outcome !== 'number')) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

        let momentStart = moment(req.body.startDate, moment.ISO_8601);
        let momentOutcome = moment(req.body.outcomeDate, moment.ISO_8601);
        if (req.body.hasOwnProperty('startDate') && req.body.startDate !== null && !momentStart.isValid()) {
            let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        if (req.body.hasOwnProperty('outcomeDate') && req.body.outcomeDate !== null && !momentOutcome.isValid()) {
            let msg = message.dateError[momentOutcome.invalidAt()] !== undefined ? message.dateError[momentOutcome.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }

        if (req.body.hasOwnProperty('outcomeDate') && !req.body.hasOwnProperty('outcome')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }

        let entryObj = Object.assign({}, PregnancyModel, req.body);
        if (req.body.hasOwnProperty('startDate') && req.body.startDate !== null)
            entryObj.startDate = momentStart.valueOf();
        if (req.body.hasOwnProperty('outcomeDate') && req.body.outcomeDate !== null)
            entryObj.outcomeDate = momentOutcome.valueOf();
        entryObj.createdByUser = req.user.id;

        this.pregnancy.createPregnancy(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
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
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {

        let entryObj = Object.assign({}, req.body);
        let momentStart = moment(req.body.startDate, moment.ISO_8601);
        let momentOutcome = moment(req.body.outcomeDate, moment.ISO_8601);
        if (req.body.hasOwnProperty('startDate') && req.body.startDate !== null && !momentStart.isValid()) {
            let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (req.body.hasOwnProperty('startDate') && req.body.startDate !== null) {
            entryObj.startDate = momentStart.valueOf();
        }
        if (req.body.hasOwnProperty('outcomeDate') && req.body.outcomeDate !== null && !momentOutcome.isValid()) {
            let msg = message.dateError[momentOutcome.invalidAt()] !== undefined ? message.dateError[momentOutcome.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        } else if (req.body.hasOwnProperty('outcomeDate') && req.body.outcomeDate !== null) {
            entryObj.outcomeDate = momentOutcome.valueOf();
        }

        this.pregnancy.editPregnancy(req.user, entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.deletePregnancy = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.pregnancy.deletePregnancy(req.user, { 'id': req.body.id }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

DemographicDataController.prototype.getPregnancyFields = function (__unused__req, res) {
    this.pregnancy.getPregnancyOutcomes().then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return false;
    });
};

module.exports = DemographicDataController;