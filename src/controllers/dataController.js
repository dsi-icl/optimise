const moment = require('moment');
const DataCore = require('../core/data');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const { getEntry, createEntry, updateEntry } = require('../utils/controller-utils');

const optionsContainer = {
    'visit': {
        entryIdString: 'visitId',
        fieldTable: 'AVAILABLE_FIELDS_VISITS',
        entryTable: 'VISITS',
        errMsgForUnfoundEntry: message.dataMessage.VISIT,
        dataTable: 'VISIT_DATA',
        dataTableForeignKey: 'visit'
    },
    'clinicalEvent': {
        entryIdString: 'clinicalEventId',
        fieldTable: 'AVAILABLE_FIELDS_CE',
        entryTable: 'clinical_events',
        errMsgForUnfoundEntry: message.dataMessage.CLINICALEVENT,
        dataTable: 'CLINICAL_EVENTS_DATA',
        dataTableForeignKey: 'clinicalEvent'
    },
    'test': {
        entryIdString: 'testId',
        fieldTable: 'AVAILABLE_FIELDS_TESTS',
        entryTable: 'ORDERED_TESTS',
        errMsgForUnfoundEntry: message.dataMessage.TEST,
        dataTable: 'TEST_DATA',
        dataTableForeignKey: 'test'
    }
};

class DataController {
    constructor() {
        this.dataCore = new DataCore;
        this._RouterAddOrUpdate = this._RouterAddOrUpdate.bind(this);
        this._RouterDeleteData = this._RouterDeleteData.bind(this);
    }

    _RouterDeleteData(req, res) {
        let options = optionsContainer[`${req.params.dataType}`];
        if (options === undefined) {
            res.status(400).json(ErrorHelper(`data type ${req.params.dataType} not supported.`));
            return;
        }
        if (!req.body.hasOwnProperty(`${req.params.dataType}Id`) || !req.body.hasOwnProperty('delete')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        this.dataCore.deleteData(req.user, options, req.body[`${req.params.dataType}Id`], req.body.delete)
            .then(function (result) {
                res.status(200).json(formatToJSON(result));
                return;
            }, function (error) {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return;
            });
    }

    _getField(table, id) {
        return getEntry(table, { id: id }, { id: 'id', type: 'type', permittedValues: 'permittedValues', referenceType: 'referenceType' });
    }

    _checkField(options, entries) {
        let promiseArr = [];
        for (let i = 0; entries.hasOwnProperty('updates') && i < entries.updates.length; i++) {
            promiseArr.push(this._getField(options.fieldTable, entries.updates[i].field));
        }
        for (let i = 0; entries.hasOwnProperty('adds') && i < entries.adds.length; i++) {
            promiseArr.push(this._getField(options.fieldTable, entries.adds[i].field));
        }
        return Promise.all(promiseArr);
    }

    _formatEntries(options, req) {
        let returned = {};
        const numOfUpdates = (req.body.hasOwnProperty('update')) ? Object.keys(req.body.update).length : 0;
        const numOfAdds = (req.body.hasOwnProperty('add')) ? Object.keys(req.body.add).length : 0;
        const updates = [];
        const adds = [];
        for (let i = 0; i < numOfUpdates; i++) {
            const entry = {
                'field': Object.keys(req.body.update)[i],
                'value': req.body.update[Object.keys(req.body.update)[i]],
                'createdByUser': req.user.id,
                'deleted': '-'
            };
            entry[options.dataTableForeignKey] = req.body[options.entryIdString];
            updates.push(entry);
        }
        for (let i = 0; i < numOfAdds; i++) {
            const entry = {
                'field': Object.keys(req.body.add)[i],
                'value': req.body.add[Object.keys(req.body.add)[i]],
                'createdByUser': req.user.id,
                'deleted': '-'
            };
            entry[options.dataTableForeignKey] = req.body[options.entryIdString];
            adds.push(entry);
        }
        if (numOfAdds > 0)
            returned.adds = adds;
        if (numOfUpdates > 0)
            returned.updates = updates;
        return returned;
    }

    _createAndUpdate(req, options, inputData) {
        let promiseArr = [];

        for (let i = 0; inputData.hasOwnProperty('updates') && i < inputData.updates.length; i++) {
            let whereObj = {};
            whereObj[options.dataTableForeignKey] = inputData.entryId;
            whereObj.field = inputData.updates[i].field;
            promiseArr.push(updateEntry(options.dataTable, req.user, '*', whereObj, inputData.updates[i]));
        }
        for (let i = 0; inputData.hasOwnProperty('adds') && i < inputData.adds.length; i++) {
            promiseArr.push(createEntry(options.dataTable, inputData.adds[i]));
        }
        return Promise.all(promiseArr);
    }

    _RouterAddOrUpdate(req, res) {
        let that = this;
        if (optionsContainer.hasOwnProperty(`${req.params.dataType}`)) {
            let options = optionsContainer[req.params.dataType];
            if (!(req.body.hasOwnProperty(`${options.entryIdString}`) &&
                (req.body.hasOwnProperty('add') || req.body.hasOwnProperty('update')))) {
                res.status(400).json(ErrorHelper(message.dataMessage.MISSINGVALUE + options.entryIdString));
                return;
            } else {
                let entries = this._formatEntries(options, req);
                entries.entryId = req.body[options.entryIdString];
                if (!req.body.hasOwnProperty('update')) { req.body.update = {}; }  //adding an empty obj so that the code later doesn't throw error for undefined
                if (!req.body.hasOwnProperty('add')) { req.body.add = {}; }   //same
                // Verify that the entryTable ID exists in database (i.e. visitId:1 in body must have the row with id 1 in VISIT Table)
                getEntry(options.entryTable, { id: req.body[options.entryIdString], deleted: '-' }, '*').then(function (entryResult) {
                    if (entryResult.length !== 1) {
                        res.status(404).json(ErrorHelper(options.errMsgForUnfoundEntry));
                        return;
                    }
                    let entryType = entryResult[0].type;
                    that._checkField(options, entries).then(function (result) {
                        if (result.length <= 0) {
                            res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND));
                            return;
                        }
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].length !== 1) {
                                res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND));
                                return;
                            }
                            if (result[i][0].referenceType !== entryType) {
                                res.status(400).json(ErrorHelper(message.dataMessage.INVALIDFIELD));
                                return;
                            }
                            if (result[i].length === 1) {
                                let addOrUpdate = (entries.hasOwnProperty('updates') && i < entries.updates.length) ? 'update' : 'add';
                                let fieldId = result[i][0].id;
                                let fieldType = result[i][0].type;
                                let inputValue = req.body[addOrUpdate][fieldId];
                                let time;
                                switch (fieldType) {
                                    case 5: //'B':
                                        if (inputValue !== '' && !(inputValue === true || inputValue === false || inputValue === 1 || inputValue === 0 || inputValue === '1' || inputValue === '0' || inputValue.toUpperCase() === 'YES' || inputValue.toUpperCase() === 'NO')) {
                                            res.status(400).json(ErrorHelper(`${message.dataMessage.BOOLEANFIELD}${fieldId}`));
                                            return;
                                        }
                                        break;
                                    case 3: //'C':
                                        if (inputValue !== '' && inputValue !== 'unselected' && result[i][0]['permittedValues'] !== null && !(result[i][0]['permittedValues'].split(',').indexOf(inputValue) !== -1)) {  //see if the value is in the permitted values
                                            res.status(400).json(ErrorHelper(`${fieldId}${message.dataMessage.CHARFIELD}${result[i][0]['permittedValues']}`));
                                            return;
                                        }
                                        break;
                                    case 1: //'I':
                                        if (inputValue !== '' && !(parseInt(inputValue) === parseFloat(inputValue))) {
                                            res.status(400).json(ErrorHelper(`${message.dataMessage.INTEGERFIELD}${fieldId}`));
                                            return;
                                        }
                                        break;
                                    case 2: //'F':
                                        if (inputValue !== '' && !(parseFloat(inputValue).toString() === inputValue.toString())) {
                                            res.status(400).json(ErrorHelper(`${message.dataMessage.NUMBERFIELD}${fieldId}`));
                                            return;
                                        }
                                        break;
                                    case 6: //'D':
                                        time = moment(inputValue, moment.ISO_8601);
                                        if (inputValue !== '' && !time.isValid()) {
                                            let msg = (time.invalidAt() === undefined || time.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[time.invalidAt()];
                                            res.status(400).json(ErrorHelper(`${msg} at field ${fieldId}`));
                                            return;
                                        }
                                        break;
                                }
                            }
                        }
                        that._createAndUpdate(req, options, entries).then(function (__unused__result) {
                            res.status(200).json(formatToJSON(`${message.dataMessage.SUCCESS}`));
                            return;
                        }, function (error) {
                            res.status(400).json(ErrorHelper(message.dataMessage.ERROR, error));
                            return;
                        });
                    }, function (error) {
                        res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND, error));
                        return;
                    });
                }, function (error) {
                    res.status(404).json(ErrorHelper(options.errMsgForUnfoundEntry, error));
                    return;
                });
            }
        } else {
            res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        }
    }

}

module.exports = DataController;