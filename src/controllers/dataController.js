const knex = require('../utils/db-connection');
const DataCore = require('../core/data');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

const deleteOptionsContainer = {
    'visit': {
        dataTable: 'VISIT_DATA',
        dataTableForeignKey: 'visit'
    },
    'clinicalEvent': {
        dataTable: 'CLINICAL_EVENTS_DATA',
        dataTableForeignKey: 'clinical_event'
    },
    'test': {
        dataTable: 'TEST_DATA',
        dataTableForeignKey: 'test'
    }
};

const createOptionsContainer = {
    'visit': {
        entryIdString: 'visitId',
        fieldTable: 'AVAILABLE_FIELDS_VISITS',
        entryTable: 'VISITS',
        errMsgForUnfoundEntry: 'cannot seem to find your visit!',
        dataTable: 'VISIT_DATA',
        dataTableForeignKey: 'visit'
    },
    'clinicalEvent': {
        entryIdString: 'clinicalEventId',
        fieldTable: 'AVAILABLE_FIELDS_CE',
        entryTable: 'clinical_events',
        errMsgForUnfoundEntry: 'cannot seem to find your clinical event!',
        dataTable: 'CLINICAL_EVENTS_DATA',
        dataTableForeignKey: 'clinicalEvent'
    },
    'test': {
        entryIdString: 'testId',
        fieldTable: 'AVAILABLE_FIELDS_TESTS',
        entryTable: 'ORDERED_TESTS',
        errMsgForUnfoundEntry: 'cannot seem to find your test!',
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

    _RouterAddOrUpdate(req, res) {
        if (createOptionsContainer.hasOwnProperty(`${req.params.dataType}`)) {
            let options = createOptionsContainer[req.params.dataType];
            this._addOrUpdateDataBackbone(req, res, options, this._transactionForAddAndUpdate(req, options));
            return;
        } else {
            res.status(404).json(ErrorHelper(message.userError.WRONGPATH));
        }
    }

    _RouterDeleteData(req, res) {    //req.body = {visitId = 1, delete:[1, 43, 54 (fieldIds)] }
        if (req.requester.priv === 1) {
            let options = deleteOptionsContainer[`${req.params.dataType}`];
            if (options === undefined) {
                res.status(400).json(ErrorHelper(`data type ${req.params.dataType} not supported.`));
                return;
            }
            if (!req.body.hasOwnProperty(`${req.params.dataType}Id`) || !req.body.hasOwnProperty('delete')) {
                res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
                return;
            }
            this.dataCore.deleteData(req.requester, options, req.body[`${req.params.dataType}Id`], req.body.delete)
                .then(function (result) {
                    res.status(200).json(result);
                    return;
                }, function (error) {
                    res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                    return;
                });
        } else {
            res.status(401).send('You do not have permission to delete data');
            return;
        }
    }

    _transactionForAddAndUpdate(req, options) {
        return function (inputData) {
            return knex.transaction(trx => {
                knex(options.dataTable)    //updating all the 'updates' entries to 'deleted'
                    .where('field', 'in', Object.keys(req.body.update))
                    .andWhere('deleted', '-')
                    .andWhere(options.dataTableForeignKey, req.body[options.entryIdString])
                    .update({ 'deleted': `${req.requester.userid}@${JSON.stringify(new Date())}` })
                    .transacting(trx)
                    .then(() =>
                        knex.batchInsert(options.dataTable, inputData.updates, 1000).transacting(trx)    //adding all the 'updates' entries
                    )
                    .then(() =>
                        knex.batchInsert(options.dataTable, inputData.adds, 1000).transacting(trx) //adding all the 'updates' entries
                    )
                    .then(trx.commit)
                    .catch(trx.rollback);
            });
        };
    }

    _addOrUpdateDataBackbone(req, res, options, transactionFunction) {  //req.body = {visitId = 1, update : {1: 43, 54: LEFT}, add : {4324:432, 54:4} }
        if (req.body[options.entryIdString] && (req.body.update || req.body.add)) {
            if (req.body.update && req.requester.priv !== 1) {
                res.status(401).send('Only admin can update data');
                return;
            }
            if (!req.body.update) { req.body.update = {}; }  //adding an empty obj so that the code later doesn't throw error for undefined
            if (!req.body.add) { req.body.add = {}; }   //same
            const numOfUpdates = Object.keys(req.body.update).length;
            const numOfAdds = Object.keys(req.body.add).length;
            const findField = (fieldId, referenceType) => knex(options.fieldTable).select('id', 'type', 'permittedValues', 'referenceType').where({ 'id': fieldId, 'referenceType': referenceType });
            knex(options.entryTable)
                .select('id', 'type')
                .where({ id: req.body[options.entryIdString], deleted: '-' })  //making sure the visit is found
                .then(result => {
                    if (result.length === 1) {
                        return result;
                    } else {
                        res.status(404).json(ErrorHelper(options.errMsgForUnfoundEntry));
                    }
                })
                .then(result => { //get all the fields types and check theres no overlap for update and add
                    const referenceType = result[0].type;
                    const promiseArr = [];
                    const allFieldIds = [];
                    for (let i = 0; i < numOfUpdates; i++) {
                        promiseArr.push(findField(Object.keys(req.body.update)[i], referenceType));
                        allFieldIds.push(Object.keys(req.body.update)[i]);
                    }
                    for (let i = 0; i < numOfAdds; i++) {
                        promiseArr.push(findField(Object.keys(req.body.add)[i], referenceType));
                        allFieldIds.push(Object.keys(req.body.add)[i]);
                    }
                    if (Array.from(new Set(allFieldIds)).length !== allFieldIds.length) {
                        res.status(400).json(ErrorHelper('fields in add and update cannot have overlaps!'));
                        throw 'stopping the chain';
                    }
                    return Promise.all(promiseArr);
                })
                .then(result => {    //comparing if all the input values matching the type of the field
                    const totalLength = numOfUpdates + numOfAdds;
                    for (let i = 0; i < totalLength; i++) {
                        if (result[i].length === 1) {
                            let addOrUpdate = i < numOfUpdates ? 'update' : 'add';
                            let fieldId = result[i][0].id;
                            let fieldType = result[i][0].type;
                            let inputValue = req.body[addOrUpdate][fieldId];
                            switch (fieldType) {
                                case 'B':
                                    if (!(inputValue === 1 || inputValue === 0)) {
                                        res.status(400).json(ErrorHelper(`Field ${fieldId} only accepts value 1 and 0.`));
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'C':
                                    if (!(result[i][0]['permittedValues'].split(', ').indexOf(inputValue) !== -1)) {  //see if the value is in the permitted values
                                        res.status(400).json(ErrorHelper(`Field ${fieldId} only accepts values ${result[i][0]['permittedValues']}`));
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'I':
                                    if (!(parseInt(inputValue) === parseFloat(inputValue))) {
                                        res.status(400).json(ErrorHelper(`Field ${fieldId} only accept integer`));
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'N':
                                    if (!(parseFloat(inputValue).toString() === inputValue.toString())) {
                                        res.status(400).json(ErrorHelper(`Field ${fieldId} only accept number`));
                                        throw 'stopping the chain';
                                    }
                                    break;
                            }
                        } else {
                            res.status(404).json(ErrorHelper('cannot seem to find one of your fields'));
                            throw 'stopping the chain';
                        }
                    }
                    return result;
                })
                .then(() =>   //check all the updates are all there and all the adds are NOT there
                    knex(options.dataTable)
                        .select('id')
                        .where('field', 'in', Object.keys(req.body.update))
                        .andWhere('deleted', '-')
                        .andWhere(options.dataTableForeignKey, req.body[options.entryIdString])
                        .then(entries => {
                            if (entries.length !== numOfUpdates) {
                                res.status(400).json(ErrorHelper('you can only update when the data is already there!'));
                                throw 'stopping the chain';
                            }
                            return knex(options.dataTable)
                                .select('id')
                                .where('field', 'in', Object.keys(req.body.add))
                                .andWhere('deleted', '-')
                                .andWhere(options.dataTableForeignKey, req.body[options.entryIdString]);
                        })
                        .then(entries => {
                            if (entries.length !== 0) {
                                res.status(400).json(ErrorHelper('you can only add when the data is not already there!'));
                                throw 'stopping the chain';
                            }
                            return 0;
                        })
                )
                .then(() => {   //transforming the req.body
                    const updates = [];
                    const adds = [];
                    for (let i = 0; i < numOfUpdates; i++) {
                        const entry = {
                            'field': Object.keys(req.body.update)[i],
                            'value': req.body.update[Object.keys(req.body.update)[i]],
                            'createdByUser': req.requester.userid,
                            'deleted': '-'
                        };
                        entry[options.dataTableForeignKey] = req.body[options.entryIdString];
                        updates.push(entry);
                    }
                    for (let i = 0; i < numOfAdds; i++) {
                        const entry = {
                            'field': Object.keys(req.body.add)[i],
                            'value': req.body.add[Object.keys(req.body.add)[i]],
                            'createdByUser': req.requester.userid,
                            'deleted': '-'
                        };
                        entry[options.dataTableForeignKey] = req.body[options.entryIdString];
                        adds.push(entry);
                    }
                    return { 'updates': updates, 'adds': adds };
                })
                .then(transactionFunction)
                .then(result => res.json({ msg: `success with ${result.length} new entries added` }))
                // .catch(err => { console.log(err); res.status(400).send('Error. Please try again'); })
                .catch(() => { });
        } else {
            res.status(400).json(ErrorHelper(`please provide ${options.entryIdString} and update and/or add.`));
        }
    }
}

const _singleton = new DataController();
module.exports = _singleton;