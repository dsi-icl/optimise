import moment from 'moment';
import DataCore from '../core/data';
import ErrorHelper from '../utils/error_helper';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import { getEntry, createEntry, updateEntry } from '../utils/controller-utils';

const optionsContainer = {
    visit: {
        entryIdString: 'visitId',
        fieldTable: 'AVAILABLE_FIELDS_VISITS',
        entryTable: 'VISITS',
        errMsgForUnfoundEntry: message.dataMessage.VISIT,
        dataTable: 'VISIT_DATA',
        dataTableForeignKey: 'visit'
    },
    clinicalEvent: {
        entryIdString: 'clinicalEventId',
        fieldTable: 'AVAILABLE_FIELDS_CE',
        entryTable: 'clinical_events',
        errMsgForUnfoundEntry: message.dataMessage.CLINICALEVENT,
        dataTable: 'CLINICAL_EVENTS_DATA',
        dataTableForeignKey: 'clinicalEvent'
    },
    test: {
        entryIdString: 'testId',
        fieldTable: 'AVAILABLE_FIELDS_TESTS',
        entryTable: 'ORDERED_TESTS',
        errMsgForUnfoundEntry: message.dataMessage.TEST,
        dataTable: 'TEST_DATA',
        dataTableForeignKey: 'test'
    }
};

class DataController {

    static _RouterDeleteData({ params, body, user }, res) {
        let options = optionsContainer[`${params.dataType}`];
        if (options === undefined) {
            res.status(400).json(ErrorHelper(`data type ${params.dataType} not supported.`));
            return;
        }
        if (!body.hasOwnProperty(`${params.dataType}Id`) || !body.hasOwnProperty('delete')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        DataCore.deleteData(user, options, body[`${params.dataType}Id`], body.delete)
            .then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
    }

    static _getField(table, id) {
        return getEntry(table, { id }, { id: 'id', definition: 'definition', type: 'type', permittedValues: 'permittedValues', referenceType: 'referenceType' });
    }

    static _checkField({ fieldTable }, entries) {
        let promiseArr = [];
        for (let i = 0; entries.hasOwnProperty('updates') && i < entries.updates.length; i++) {
            promiseArr.push(DataController._getField(fieldTable, entries.updates[i].field));
        }
        for (let i = 0; entries.hasOwnProperty('adds') && i < entries.adds.length; i++) {
            promiseArr.push(DataController._getField(fieldTable, entries.adds[i].field));
        }
        return Promise.all(promiseArr);
    }

    static _formatEntries({ dataTableForeignKey, entryIdString }, { body, user }) {
        let returned = {};
        const numOfUpdates = (body.hasOwnProperty('update')) ? Object.keys(body.update).length : 0;
        const numOfAdds = (body.hasOwnProperty('add')) ? Object.keys(body.add).length : 0;
        const updates = [];
        const adds = [];
        for (let i = 0; i < numOfUpdates; i++) {
            const entry = {
                field: Object.keys(body.update)[i],
                value: body.update[Object.keys(body.update)[i]],
                createdByUser: user.id,
                deleted: '-'
            };
            entry[dataTableForeignKey] = body[entryIdString];
            updates.push(entry);
        }
        for (let i = 0; i < numOfAdds; i++) {
            const entry = {
                field: Object.keys(body.add)[i],
                value: body.add[Object.keys(body.add)[i]],
                createdByUser: user.id,
                deleted: '-'
            };
            entry[dataTableForeignKey] = body[entryIdString];
            adds.push(entry);
        }
        if (numOfAdds > 0)
            returned.adds = adds;
        if (numOfUpdates > 0)
            returned.updates = updates;
        return returned;
    }

    static _createAndUpdate({ user }, { dataTableForeignKey, dataTable }, inputData) {
        let promiseArr = [];

        for (let i = 0; inputData.hasOwnProperty('updates') && i < inputData.updates.length; i++) {
            let whereObj = {};
            whereObj[dataTableForeignKey] = inputData.entryId;
            whereObj.field = inputData.updates[i].field;
            promiseArr.push(updateEntry(dataTable, user, '*', whereObj, inputData.updates[i]));
        }
        for (let i = 0; inputData.hasOwnProperty('adds') && i < inputData.adds.length; i++) {
            promiseArr.push(createEntry(dataTable, inputData.adds[i]));
        }
        return Promise.all(promiseArr);
    }

    static _RouterAddOrUpdate(req, res) {
        if (optionsContainer.hasOwnProperty(`${req.params.dataType}`)) {
            let options = optionsContainer[req.params.dataType];
            if (!(req.body.hasOwnProperty(`${options.entryIdString}`) &&
                (req.body.hasOwnProperty('add') || req.body.hasOwnProperty('update')))) {
                res.status(400).json(ErrorHelper(message.dataMessage.MISSINGVALUE + options.entryIdString));
                return;
            } else {
                let entries = DataController._formatEntries(options, req);
                entries.entryId = req.body[options.entryIdString];
                if (!req.body.hasOwnProperty('update')) { req.body.update = {}; }  //adding an empty obj so that the code later doesn't throw error for undefined
                if (!req.body.hasOwnProperty('add')) { req.body.add = {}; }   //same
                // Verify that the entryTable ID exists in database (i.e. visitId:1 in body must have the row with id 1 in VISIT Table)
                return getEntry(options.entryTable, { id: req.body[options.entryIdString], deleted: '-' }, '*')
                    .then((entryResult) => {
                        if (entryResult.length !== 1) {
                            res.status(404).json(ErrorHelper(options.errMsgForUnfoundEntry));
                            return;
                        }
                        let entryType = entryResult[0].type;
                        return DataController._checkField(options, entries).then((result) => {
                            if (result.length <= 0) {
                                res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND));
                                return false;
                            }
                            for (let i = 0; i < result.length; i++) {
                                if (result[i].length !== 1) {
                                    res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND));
                                    return false;
                                }
                                if (result[i][0].referenceType !== entryType) {
                                    res.status(400).json(ErrorHelper(message.dataMessage.INVALIDFIELD));
                                    return false;
                                }
                                if (result[i].length === 1) {
                                    let addOrUpdate = (entries.hasOwnProperty('updates') && i < entries.updates.length) ? 'update' : 'add';
                                    let fieldId = result[i][0].id;
                                    let fieldDefinition = result[i][0].definition;
                                    let fieldType = result[i][0].type;
                                    let inputValue = req.body[addOrUpdate][fieldId];
                                    let time;
                                    switch (fieldType) {
                                        case 5: //'B':
                                            if (inputValue !== '' && !(inputValue === true || inputValue === false || inputValue === 1 || inputValue === 0 || inputValue === '1' || inputValue === '0' || inputValue.toUpperCase() === 'YES' || inputValue.toUpperCase() === 'NO')) {
                                                res.status(400).json(ErrorHelper(`${message.dataMessage.BOOLEANFIELD}${fieldDefinition}`));
                                                return false;
                                            }
                                            break;
                                        case 3: //'C':
                                            if (inputValue !== '' && inputValue !== 'unselected' && result[i][0]['permittedValues'] !== null && !(result[i][0]['permittedValues'].split(',').includes(inputValue))) {  //see if the value is in the permitted values
                                                res.status(400).json(ErrorHelper(`${fieldDefinition}${message.dataMessage.CHARFIELD}${result[i][0]['permittedValues']}`));
                                                return false;
                                            }
                                            break;
                                        case 1: //'I':
                                            if (inputValue !== '' && !(parseInt(inputValue) === parseFloat(inputValue))) {
                                                res.status(400).json(ErrorHelper(`${message.dataMessage.INTEGERFIELD}${fieldDefinition}`));
                                                return false;
                                            }
                                            break;
                                        case 2: //'F':
                                            if (inputValue !== '' && !(parseFloat(inputValue).toString() === inputValue.toString())) {
                                                res.status(400).json(ErrorHelper(`${message.dataMessage.NUMBERFIELD}${fieldDefinition}`));
                                                return false;
                                            }
                                            break;
                                        case 6: //'D':
                                            time = moment(inputValue, moment.ISO_8601);
                                            if (inputValue !== '' && !time.isValid()) {
                                                let msg = (time.invalidAt() === undefined || time.invalidAt() < 0) ? message.userError.INVALIDDATE : message.dateError[time.invalidAt()];
                                                res.status(400).json(ErrorHelper(`${msg} at field ${fieldDefinition}`));
                                                return false;
                                            }
                                            break;
                                    }
                                }
                            }
                            return DataController._createAndUpdate(req, options, entries).then((__unused__result) => {
                                res.status(200).json(formatToJSON(`${message.dataMessage.SUCCESS}`));
                                return true;
                            }).catch((error) => {
                                res.status(400).json(ErrorHelper(message.dataMessage.ERROR, error));
                                return false;
                            });
                        }).catch((error) => {
                            res.status(400).json(ErrorHelper(message.dataMessage.FIELDNOTFOUND, error));
                            return false;
                        });
                    }).catch((error) => {
                        res.status(404).json(ErrorHelper(options.errMsgForUnfoundEntry, error));
                        return false;
                    });
            }
        } else {
            res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        }
    }
}

export default DataController;