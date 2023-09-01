import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import moment from 'moment';
import { DemographicCore, MedicalHistoryCore, ImmunisationCore, PregnancyCore } from '../core/demographic';

const PregnancyModel = {
    patient: 0,
    startDate: null,
    outcome: undefined,
    outcomeDate: undefined,
    meddra: undefined
};


let baseDataEntryModel = {
    visitId: null,
    pregnancyId: null,
    date: null,
    dataType: null
};

let PregnancyBaselineModel = {
    LMP: null,
    maternalAgeAtLMP: undefined,
    EDD: null,
    ART: null,
    numOfFoetuses: undefined,
    folicAcidSuppUsed: undefined,
    folicAcidSuppUsedStartDate: undefined,
    illicitDrugUse: undefined,
};

let PregnancyFollowupModel = {
    EDD: null,
    numOfFoetuses: undefined,
    folicAcidSuppUsed: undefined,
    folicAcidSuppUsedStartDate: undefined,
    illicitDrugUse: undefined,
};

let PregnancyTermModel = {
    inductionOfDelivery: null,
    lengthOfPregnancy: null,
    pregnancyOutcome: null,
    congenitalAbnormality: null,
    modeOfDelivery: null,
    useOfEpidural: null,
    birthWeight: null,
    sexOfBaby: null,
    APGAR0: null,
    APGAR5: null,
    everBreastFed: null,
    breastfeedStart: null,
    exclusiveBreastfeedEnd: null,
    mixedBreastfeedEnd: null,
    admission12: null,
    admission36: null,
    admission60: null,
    developmentalOutcome: null
};


class DemographicDataController {

    static createDemographic({ body, user }, res) {
        if ((!body.hasOwnProperty('patient') || !body.hasOwnProperty('DOB') || !body.hasOwnProperty('gender') || !body.hasOwnProperty('dominant_hand')
            || !body.hasOwnProperty('ethnicity') || !body.hasOwnProperty('country_of_origin'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.patient !== 'number' || typeof body.DOB !== 'string' || typeof body.gender !== 'number' || typeof body.dominant_hand !== 'number'
            || typeof body.ethnicity !== 'number' || typeof body.country_of_origin !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        const momentDOB = moment(body.DOB, moment.ISO_8601);
        if (!momentDOB.isValid()) {
            const msg = message.dateError[momentDOB.invalidAt()] !== undefined ? message.dateError[momentDOB.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        const entryObj = {
            patient: body.patient,
            gender: body.gender,
            dominantHand: body.dominant_hand,
            ethnicity: body.ethnicity,
            countryOfOrigin: body.country_of_origin,
            createdByUser: user.id
        };
        if (body.hasOwnProperty('DOB') && body.DOB !== null)
            entryObj.DOB = momentDOB.valueOf();
        DemographicCore.createDemographic(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static createImmunisation({ body, user }, res) {
        if (body.hasOwnProperty('patient') && body.hasOwnProperty('immunisationDate') && body.hasOwnProperty('vaccineName') &&
            typeof body.patient === 'number' && typeof body.immunisationDate === 'string' && typeof body.vaccineName === 'string') {
            const momentImmun = moment(body.immunisationDate, moment.ISO_8601);
            if (!momentImmun.isValid() && body.immunisationDate !== null) {
                const msg = message.dateError[momentImmun.invalidAt()] !== undefined ? message.dateError[momentImmun.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            const entryObj = {
                patient: body.patient,
                vaccineName: body.vaccineName,
                createdByUser: user.id
            };
            if (body.hasOwnProperty('immunisationDate') && body.immunisationDate !== null)
                entryObj.immunisationDate = momentImmun.valueOf();
            ImmunisationCore.createImmunisation(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('patient') && body.hasOwnProperty('immunisationDate') && body.hasOwnProperty('vaccineName'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static createMedicalCondition({ body, user }, res) {
        if (body.hasOwnProperty('patient') && body.hasOwnProperty('startDate') && body.hasOwnProperty('outcome') && body.hasOwnProperty('relation') && body.hasOwnProperty('conditionName') &&
            ((body.hasOwnProperty('resolvedYear') && typeof body.resolvedYear === 'number') || !body.hasOwnProperty('resolvedYear')) &&
            typeof body.patient === 'number' && typeof body.startDate === 'string' && typeof body.outcome === 'string' && typeof body.relation === 'number' && typeof body.conditionName === 'number') {
            const momentStart = moment(body.startDate, moment.ISO_8601);
            if (!momentStart.isValid() && body.startDate !== null) {
                const msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            const entryObj = {
                patient: body.patient,
                relation: body.relation,
                outcome: body.outcome,
                conditionName: body.conditionName,
                createdByUser: user.id
            };
            if (body.hasOwnProperty('immunisationDate') && body.immunisationDate !== null)
                entryObj.startDate = momentStart.valueOf();
            if (body.resolvedYear) {
                entryObj.resolvedYear = body.resolvedYear;
            }
            MedicalHistoryCore.createMedicalHistory(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('patient') && body.hasOwnProperty('startDate') && body.hasOwnProperty('outcome') && body.hasOwnProperty('relation') && body.hasOwnProperty('conditionName'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteDemographic({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            DemographicCore.deleteDemographic(user, { id: body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteImmunisation({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            ImmunisationCore.deleteImmunisation(user, { id: body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deleteMedicalCondition({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            MedicalHistoryCore.deleteMedicalHistory(user, { id: body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editDemographic({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            if (body.DOB) {
                const momentDOB = moment(body.DOB, moment.ISO_8601);
                if (!momentDOB.isValid()) {
                    const msg = message.dateError[momentDOB.invalidAt()] !== undefined ? message.dateError[momentDOB.invalidAt()] : message.userError.INVALIDDATE;
                    res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                    return;
                }
                body.DOB = momentDOB.valueOf();
            }
            DemographicCore.editDemographic(user, body).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editImmunisation({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number' &&
            ((body.hasOwnProperty('immunisationDate') && typeof body.immunisationDate === 'string') || !body.hasOwnProperty('immunisationDate'))) {
            const momentImmun = moment(body.immunisationDate, moment.ISO_8601);
            if (body.hasOwnProperty('immunisationDate') && body.immunisationDate !== null && !momentImmun.isValid()) {
                const msg = message.dateError[momentImmun.invalidAt()] !== undefined ? message.dateError[momentImmun.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            const updateObj = Object.assign(body);
            if (updateObj.hasOwnProperty('immunisationDate') && body.immunisationDate !== null)
                updateObj.immunisationDate = momentImmun.valueOf();
            ImmunisationCore.editImmunisation(user, updateObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editMedicalCondition({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number' &&
            ((body.hasOwnProperty('outcome') && typeof body.outcome === 'string') || !body.hasOwnProperty('outcome')) &&
            ((body.hasOwnProperty('resolvedYear') && typeof body.resolvedYear === 'number') || !body.hasOwnProperty('resolvedYear'))) {
            MedicalHistoryCore.editMedicalHistory(user, body).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static getDemogData({ params, query }, res) {
        if (params.hasOwnProperty('dataType')) {
            const whereObj = { deleted: '-' };
            if (query.hasOwnProperty('patient'))
                whereObj.patient = query.patient;
            const action = {
                Demographic: DemographicCore.getDemographic,
                Immunisation: ImmunisationCore.getImmunisation,
                MedicalCondition: MedicalHistoryCore.getMedicalHistory,
                Pregnancy: PregnancyCore.getPregnancy
            };
            action[params.dataType](whereObj).then((result) => {
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
    }

    static getFields(req, res, next) {
        if (req.params.hasOwnProperty('dataType')) {
            const action = {
                Demographic: DemographicDataController.getDemographicFields,
                MedicalCondition: DemographicDataController.getMedicalConditionFields,
                Pregnancy: DemographicDataController.getPregnancyFields
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
    }

    static getDemographicFields({ query }, res) {
        const action = {
            gender: DemographicCore.getGenderFields,
            dominant_hand: DemographicCore.getDominantHandsFields,
            ethnicity: DemographicCore.getEthnicityFields,
            country: DemographicCore.getCountryFields
        };

        if (Object.keys(query).length !== 0 && query.hasOwnProperty('fieldName')) {
            if (action.hasOwnProperty(query.fieldName)) {
                action[query.fieldName]().then((result) => {
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
            const promiseHandler = Promise.all(promiseArray);
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
    }

    static getMedicalConditionFields({ query }, res) {
        const action = {
            relations: MedicalHistoryCore.getRelations,
            conditions: MedicalHistoryCore.getConditions
        };

        if (Object.keys(query).length !== 0 && query.hasOwnProperty('fieldName')) {
            if (action.hasOwnProperty(query.fieldName)) {
                action[query.fieldName]().then((result) => {
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
            const promiseHandler = Promise.all(promiseArray);
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
    }

    static getPregnancy({ query }, res) {
        const whereObj = {};
        if (query.hasOwnProperty('patient'))
            whereObj.patient = query.patient;
        PregnancyCore.getPregnancy(whereObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    static createPregnancy({ body, user }, res) {

        if (body.hasOwnProperty('patient') && typeof body.patient === 'number') {

            if (body.hasOwnProperty('meddra') && body.meddra !== null && isNaN(parseInt(body.meddra))) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }
            if ((body.hasOwnProperty('outcome') && typeof body.outcome !== 'number')) {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }

            const momentStart = moment(body.startDate, moment.ISO_8601);
            const momentOutcome = moment(body.outcomeDate, moment.ISO_8601);
            if (body.hasOwnProperty('startDate') && body.startDate !== null && !momentStart.isValid()) {
                const msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (body.hasOwnProperty('outcomeDate') && body.outcomeDate !== null && !momentOutcome.isValid()) {
                const msg = message.dateError[momentOutcome.invalidAt()] !== undefined ? message.dateError[momentOutcome.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }

            if (body.hasOwnProperty('outcomeDate') && !body.hasOwnProperty('outcome')) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }

            const entryObj = Object.assign({}, PregnancyModel, body);
            if (body.hasOwnProperty('startDate') && body.startDate !== null)
                entryObj.startDate = momentStart.valueOf();
            if (body.hasOwnProperty('outcomeDate') && body.outcomeDate !== null)
                entryObj.outcomeDate = momentOutcome.valueOf();
            entryObj.createdByUser = user.id;

            PregnancyCore.createPregnancy(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else if (!(body.hasOwnProperty('patient') && body.hasOwnProperty('outcome'))) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editPregnancy({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {

            const entryObj = Object.assign({}, body);
            const momentStart = moment(body.startDate, moment.ISO_8601);
            const momentOutcome = moment(body.outcomeDate, moment.ISO_8601);
            if (body.hasOwnProperty('startDate') && body.startDate !== null && !momentStart.isValid()) {
                const msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            } else if (body.hasOwnProperty('startDate') && body.startDate !== null) {
                entryObj.startDate = momentStart.valueOf();
            }
            if (body.hasOwnProperty('outcomeDate') && body.outcomeDate !== null && !momentOutcome.isValid()) {
                const msg = message.dateError[momentOutcome.invalidAt()] !== undefined ? message.dateError[momentOutcome.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            } else if (body.hasOwnProperty('outcomeDate') && body.outcomeDate !== null) {
                entryObj.outcomeDate = momentOutcome.valueOf();
            }

            PregnancyCore.editPregnancy(user, entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deletePregnancy({ body, user }, res) {
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PregnancyCore.deletePregnancy(user, { id: body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    //PregnancyOutcome
    static createPregnancyOutcome({ body, user }, res) {
        //
        if (body.hasOwnProperty('value') && typeof body.value === 'string') {
            const entryObj = {
                value: body.value,
            };

            PregnancyCore.createPregnancyOutcome(entryObj)
                .then((result) => {
                    res.status(200).json(formatToJSON(result));
                    return true;
                })
                .catch((error) => {
                    res
                        .status(400)
                        .json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                    return false;
                });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static editPregnancyOutcome({ body, user }, res) {
        //
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            const entryObj = Object.assign({}, body);
            delete entryObj.id;

            PregnancyCore.editPregnancyOutcome(body.id, entryObj)
                .then((result) => {
                    res.status(200).json(formatToJSON(result));
                    return true;
                })
                .catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                    return false;
                });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static deletePregnancyOutcome({ body, user }, res) {
        //

        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PregnancyCore.deletePregnancyOutcome(user, { 'id': body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    //PregnancyData


    static createPregnancyData({ body, user }, res) {
        //

        let momentDataDate = moment(body.date, moment.ISO_8601);
        if (body.hasOwnProperty('date') && body.date !== null && !momentDataDate.isValid()) {
            let msg = message.dateError[momentDataDate.invalidAt()] !== undefined ? message.dateError[momentDataDate.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }

        if (body.hasOwnProperty('visitId') && typeof body.visitId === 'number' &&
            body.hasOwnProperty('dataType') && typeof body.dataType === 'string' &&
            body.hasOwnProperty('pregnancyId') && typeof body.pregnancyId === 'number') {

            let entryObj;

            if (body.dataType === 'baseline' || body.dataType === 'followup' || body.dataType === 'term') {
                const {
                    LMP,
                    maternalAgeAtLMP,
                    EDD,
                    ART,
                    numOfFoetuses,
                    folicAcidSuppUsed,
                    folicAcidSuppUsedStartDate,
                    illicitDrugUse,
                } = body;

                if (body.hasOwnProperty('maternalAgeAtLMP') && body.maternalAgeAtLMP !== null && isNaN(parseInt(body.maternalAgeAtLMP))) {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }
                if (body.hasOwnProperty('numOfFoetuses') && body.numOfFoetuses !== null && isNaN(parseInt(body.numOfFoetuses))) {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }
                if (body.hasOwnProperty('maternalBMI') && body.maternalBMI !== null && isNaN(parseInt(body.maternalBMI))) {
                    res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                    return;
                }

                const momentLMP = moment(body.LMP, moment.ISO_8601);
                const momentEDD = moment(body.EDD, moment.ISO_8601);
                const momentFolicSupp = moment(body.folicAcidSuppUsedStartDate, moment.ISO_8601);
                if (body.hasOwnProperty('LMP') && body.LMP !== null && !momentLMP.isValid()) {
                    const msg = message.dateError[momentLMP.invalidAt()] !== undefined ? message.dateError[momentLMP.invalidAt()] : message.userError.INVALIDDATE;
                    res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                    return;
                }
                if (body.hasOwnProperty('EDD') && body.EDD !== null && !momentEDD.isValid()) {
                    const msg = message.dateError[momentEDD.invalidAt()] !== undefined ? message.dateError[momentEDD.invalidAt()] : message.userError.INVALIDDATE;
                    res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                    return;
                }
                if (body.hasOwnProperty('folicAcidSuppUsedStartDate') && body.folicAcidSuppUsedStartDate !== null && !momentFolicSupp.isValid()) {
                    const msg = message.dateError[momentFolicSupp.invalidAt()] !== undefined ? message.dateError[momentFolicSupp.invalidAt()] : message.userError.INVALIDDATE;
                    res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                    return;
                }


                entryObj = Object.assign({}, PregnancyBaselineModel, body);

                if (body.hasOwnProperty('LMP') && body.LMP !== null) {
                    entryObj.LMP = momentLMP.valueOf();
                }
                if (body.hasOwnProperty('EDD') && body.LMP !== null) {
                    entryObj.EDD = momentEDD.valueOf();
                }
                if (body.hasOwnProperty('folicAcidSuppUsedStartDate') && body.LMP !== null) {
                    entryObj.folicAcidSuppUsedStartDate = momentFolicSupp.valueOf();
                }


            }
            else {
                res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
                return;
            }


            // if (body.dataType === 'followup') {
            //     const {
            //         EDD,
            //         numOfFoetuses,
            //         folicAcidSuppUsed,
            //         folicAcidSuppUsedStartDate,
            //         illicitDrugUse,
            //     } = body;

            //     // if (!EDD || !numOfFoetuses || !folicAcidSuppUsed || !folicAcidSuppUsedStartDate || !illicitDrugUse) {
            //     //     res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            //     //     return;
            //     // }

            //     entryObj = Object.assign({}, PregnancyFollowupModel, body);
            // }

            // if (body.dataType === 'term') {
            //     const {
            //         inductionOfDelivery,
            //         lengthOfPregnancy,
            //         pregnancyOutcome,
            //         congenitalAbnormality,
            //         modeOfDelivery,
            //         useOfEpidural,
            //         birthWeight,
            //         sexOfBaby,
            //         APGAR0,
            //         APGAR5,
            //         everBreastFed,
            //         breastfeedStart,
            //         exclusiveBreastfeedEnd,
            //         mixedBreastfeedEnd,
            //         admission12,
            //         admission36,
            //         admission60,
            //         developmentalOutcome
            //     } = body;

            //     // if (!inductionOfDelivery ||
            //     //     !lengthOfPregnancy ||
            //     //     !pregnancyOutcome ||
            //     //     !congenitalAbnormality ||
            //     //     !modeOfDelivery ||
            //     //     !useOfEpidural ||
            //     //     !birthWeight ||
            //     //     !sexOfBaby ||
            //     //     !APGAR0 ||
            //     //     !APGAR5 ||
            //     //     !everBreastFed ||
            //     //     !breastfeedStart ||
            //     //     !exclusiveBreastfeedEnd ||
            //     //     !mixedBreastfeedEnd ||
            //     //     !admission12 ||
            //     //     !admission36 ||
            //     //     !admission60 ||
            //     //     !developmentalOutcome) {
            //     //     res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            //     //     return;
            //     // }

            //     entryObj = Object.assign({}, PregnancyTermModel, body);
            // }

            let baseObj = Object.assign({}, baseDataEntryModel, body);

            entryObj = { ...entryObj, ...baseObj }

            entryObj.createdByUser = user.id;

            if (body.hasOwnProperty('date') && body.date !== null)
                entryObj.date = momentDataDate.valueOf();

            PregnancyCore.createPregnancyData(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });


        }

        else {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }


    }

    static editPregnancyData({ body, user }, res) {
        //

        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            const entryObj = Object.assign({}, body);
            //delete entryObj.id;

            PregnancyCore.editPregnancyData(body.id, entryObj)
                .then((result) => {
                    res.status(200).json(formatToJSON(result));
                    return true;
                })
                .catch((error) => {
                    res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                    return false;
                });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

    }

    static deletePregnancyData({ body, user }, res) {
        //

        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PregnancyCore.deletePregnancyData(user, { 'id': body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    //PregnancyImage
    static createPregnancyImage({ body, user }, res) {
        //

        if (body.hasOwnProperty('visitId') && typeof body.visitId === 'number') {
            let momentDate = moment(body.date, moment.ISO_8601);
            if (body.hasOwnProperty('date') && body.date !== null && !momentDate.isValid()) {
                let msg = message.dateError[momentDate.invalidAt()] !== undefined ? message.dateError[momentDate.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            }
            if (!body.hasOwnProperty('mode') || !body.hasOwnProperty('result')) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }

            let entryObj = {
                visitId: body.visitId,
                date: momentDate.valueOf(),
                mode: body.mode,
                result: body.result,
                createdByUser: user.id
            };

            PregnancyCore.createPregnancyImage(entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
                return false;
            });
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

    }

    static editPregnancyImage({ body, user }, res) {
        //
        if (body.hasOwnProperty('id') && typeof body.id === 'number') {

            const entryObj = Object.assign({}, body);
            const momentDate = moment(body.date, moment.ISO_8601);

            if (body.hasOwnProperty('date') && body.date !== null && !momentDate.isValid()) {
                const msg = message.dateError[momentDate.invalidAt()] !== undefined ? message.dateError[momentDate.invalidAt()] : message.userError.INVALIDDATE;
                res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
                return;
            } else if (body.hasOwnProperty('date') && body.date !== null) {
                entryObj.date = momentDate.valueOf();
            }

            if (body.hasOwnProperty('mode') && body.mode !== undefined) {
                entryObj.mode = body.mode;
            }

            if (body.hasOwnProperty('result') && body.result !== undefined) {
                entryObj.result = body.result;
            }


            PregnancyCore.editPregnancyImage(user, entryObj).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }


    }

    static deletePregnancyImage({ body, user }, res) {
        //

        if (body.hasOwnProperty('id') && typeof body.id === 'number') {
            PregnancyCore.deletePregnancyImage(user, { 'id': body.id }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).send(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).send(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static createPregnancyEntry({ body, user }, res) {
        if (!body.hasOwnProperty('visitId') || !body.hasOwnProperty('type') || !body.hasOwnProperty('pregnancyId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.visitId !== 'number' || typeof body.type !== 'number' || typeof body.pregnancyId !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }

        const entryObj = {
            recordedDuringVisit: body.visitId,
            type: body.type,
            pregnancyId: body.pregnancyId,
            createdByUser: user.id
        };

        PregnancyCore.createPregnancyEntry(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static editPregnancyEntry({ body, user }, res) {
        if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        const entryObj = Object.assign({}, body);

        if (body.hasOwnProperty('pregnancyId') && body.pregnancyId !== undefined && typeof body.type !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));

        } else if (body.hasOwnProperty('pregnancyId') && body.pregnancyId !== undefined) {
            entryObj.pregnancyId = body.result;
        }
        PregnancyCore.editPregnancyEntry(user, entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deletePregnancyEntry({ body, user }, res) {
        if (body.hasOwnProperty('pregnancyEntryId') && typeof body.pregnancyEntryId === 'number') {
            PregnancyCore.deletePregnancyEntry(user, { id: body.pregnancyEntryId }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        }
        else if (!body.hasOwnProperty('pregnancyEntryId')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }



    // static getPregnancyFields(__unused__req, res) {
    //     PregnancyCore.getPregnancyOutcomes().then((result) => {
    //         res.status(200).json(formatToJSON(result));
    //         return true;
    //     }).catch((error) => {
    //         res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
    //         return false;
    //     });
    // }

    static getPregnancyFields(req, res) {
        const dataType = req.params.dataType;

        if (dataType === 'Pregnancy') {
            PregnancyCore.getPregnancyOutcomes().then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        } else if (dataType === 'pregnancyImaging') {
            PregnancyCore.getPregnancyImagingModes().then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
                return false;
            });
        } else {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        }

    }

    static getPregnancyAllFields(__unused__req, res) {
        PregnancyCore.getPregnancyAllFields().then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }
}

export default DemographicDataController;