const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DataController {
    constructor(){
        this._RouterAddOrUpdate = this._RouterAddOrUpdate.bind(this);
        this.addOrUpdateVisitData = this.addOrUpdateVisitData.bind(this);
        this.addVisitData = this.addVisitData.bind(this);
    }

    _RouterAddOrUpdate(req, res){
        const dataType = req.params.dataType.substring(0,1).toUpperCase() + req.params.dataType.substring(1, req.params.dataType.length);
        try {
            this[`addOrUpdate${dataType}Data`](req, res);
        } catch (e) {
            res.status(400).send('well you cannot POST to this endpoint!');
        }
    }

    addOrUpdateVisitData(req, res){
        if (req.requester.priv === 1){
            let options = {
                entryIdString: 'visitId', 
                fieldTable: 'available_fields_visits', 
                entryTable: 'visits',
                errMsgForUnfoundEntry: 'cannot seem to find your visit!',
                dataTable: 'visit_collected_data',
                dataTableForeignKey: 'visit'};
            this._addOrUpdateDataBackbone(req, res, options, this._transactionForAddAndUpdate(req, options));
        } else {
            res.status(401).send('You do not have permission to edit existing data');
        }
    }

    addOrUpdateTestData(req, res){    //have to match test type too, write later
        if (req.requester.priv === 1){
            let options = {
                entryIdString: 'testId', 
                fieldTable: 'available_fields_tests', 
                entryTable: 'ordered_tests',
                errMsgForUnfoundEntry: 'cannot seem to find your test!',
                dataTable: 'test_data',
                dataTableForeignKey: 'test'};
            this._addOrUpdateDataBackbone(req, res, options, this._transactionForAddAndUpdate(req, options));
        } else {
            res.status(401).send('You do not have permission to edit existing data');
        }
    }

    addOrUpdateClinicalEventData(req, res){     //undone. need to add OR
        if (req.requester.priv === 1){
            let options = {
                entryIdString: 'clinicalEventId', 
                fieldTable: 'available_fields_ce', 
                entryTable: 'clinical_events',
                errMsgForUnfoundEntry: 'cannot seem to find your clinical event!',
                dataTable: 'clinical_events_data',
                dataTableForeignKey: 'clinical_event'};
            this._addOrUpdateDataBackbone(req, res, options, this._transactionForAddAndUpdate(req, options));
        } else {
            res.status(401).send('You do not have permission to edit existing data');
        }
    }

    addVisitData(req, res){
        if (!req.body.update){
            this._addOrUpdateVisitDataBackbone(req, res, inputData => 
                knex.batchInsert('visit_collected_data', inputData.adds, 1000)) //adding all the 'adds' entries
        } else {
            res.status(401).send('You do not have permission to edit existing data');
        }
    }

    _transactionForAddAndUpdate(req, options){
        return function(inputData){ 
            return knex.transaction(trx => {
                knex(options.dataTable)    //updating all the 'updates' entries to 'deleted'
                    .where('field', 'in', Object.keys(req.body.update))
                    .andWhere('deleted', 0)
                    .andWhere(options.dataTableForeignKey, req.body[options.entryIdString])
                    .update({'deleted': `${req.requester.userid}@${JSON.stringify(new Date())}`})
                    .transacting(trx)
                    .then(result => {
                        return knex.batchInsert(options.dataTable, inputData.updates, 1000).transacting(trx);    //adding all the 'updates' entries
                    })
                    .then(result => {
                        return knex.batchInsert(options.dataTable, inputData.adds, 1000).transacting(trx); //adding all the 'updates' entries
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
        }
    }

    _addOrUpdateDataBackbone (req, res, options, transactionFunction) {  //req.body = {visitId = 1, update : {1: 43, 54: LEFT}, add : {4324:432, 54:4} }
        if (req.body[options.entryIdString] && (req.body.update || req.body.add)) {
            if (!req.body.update) { req.body.update = {}; }  //adding an empty obj so that the code later doesn't throw error for undefined
            if (!req.body.add) { req.body.add = {}; }   //same
            const numOfUpdates = Object.keys(req.body.update).length;
            const numOfAdds = Object.keys(req.body.add).length;
            const findField = fieldId => knex(options.fieldTable).select('id', 'type', 'permitted_values').where('id', fieldId);
            knex(options.entryTable)
                .select('id')
                .where({id: req.body[options.entryIdString], deleted: 0})  //making sure the visit is found
                .then(result => {    
                    if (result.length === 1) {
                        return result;
                    } else {
                        res.status(404).send(options.errMsgForUnfoundEntry);
                    }
                })
                .then(result => { //get all the fields types and check theres no overlap for update and add
                    const promiseArr = [];
                    const allFieldIds = [];
                    for (let i = 0; i < numOfUpdates; i++) {
                        promiseArr.push(findField(Object.keys(req.body.update)[i]));
                        allFieldIds.push(Object.keys(req.body.update)[i]);
                    }
                    for (let i = 0; i < numOfAdds; i++) {
                        promiseArr.push(findField(Object.keys(req.body.add)[i]));
                        allFieldIds.push(Object.keys(req.body.add)[i]);
                    }
                    if (Array.from(new Set(allFieldIds)).length !== allFieldIds.length){
                        res.status(400).send('fields in add and update cannot have overlaps!');
                        throw 'stopping the chain';
                    }
                    return Promise.all(promiseArr);
                })
                .then(result => {    //comparing if all the input values matching the type of the field
                    const totalLength = numOfUpdates + numOfAdds;
                    for (let i = 0; i < totalLength; i++) {
                        if (result[i].length === 1){
                            let addOrUpdate = i < numOfUpdates ? 'update' : 'add';
                            let fieldId = result[i][0].id;
                            let fieldType = result[i][0].type;
                            let inputValue = req.body[addOrUpdate][fieldId];
                            switch (fieldType) {
                                case 'B':
                                    if (!(inputValue === 1 || inputValue === 0)) {
                                        res.status(400).send(`Field ${fieldId} only accepts value 1 and 0.`);
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'C':
                                    if (!(result[i][0]['permitted_values'].split(', ').indexOf(inputValue) !== -1)) {  //see if the value is in the permitted values
                                        res.status(400).send(`Field ${fieldId} only accepts values ${result[i][0]['permitted_values']}`);
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'I':
                                    if (!(parseInt(inputValue) === parseFloat(inputValue))) {
                                        res.status(400).send(`Field ${fieldId} only accept integer`);
                                        throw 'stopping the chain';
                                    }
                                    break;
                                case 'N':
                                    if (!(parseFloat(inputValue).toString() === inputValue.toString())) {
                                        res.status(400).send(`Field ${fieldId} only accept number`);
                                        throw 'stopping the chain';
                                    }
                                    break;
                            }
                        } else {
                            res.status(404).send('cannot seem to find one of your fields');
                            throw 'stopping the chain';
                        }
                    }
                    return result;
                })
                .then(result => {  //check all the updates are all there and all the adds are NOT there
                    return knex(options.dataTable)
                        .select('id')
                        .where('field', 'in' , Object.keys(req.body.update))
                        .andWhere('deleted', 0)
                        .andWhere(options.dataTableForeignKey, req.body[options.entryIdString])
                        .then(entries => {
                            if (entries.length !== numOfUpdates){
                                res.status(400).send('you can only update when the data is already there!');
                                throw 'stopping the chain';
                            }
                            return knex(options.dataTable)
                                .select('id')
                                .where('field', 'in' , Object.keys(req.body.add))
                                .andWhere('deleted', 0)
                                .andWhere(options.dataTableForeignKey, req.body[options.entryIdString]);
                        })
                        .then(entries => {
                            if (entries.length !== 0){
                                res.status(400).send('you can only add when the data is not already there!');
                                throw 'stopping the chain';
                            }
                            return 0;
                        })
                })
                .then(nothing => {   //transforming the req.body
                    const updates = [];
                    const adds = [];
                    for (let i = 0; i < numOfUpdates; i++) {
                        const entry = {
                            "field": Object.keys(req.body.update)[i],
                            "value": req.body.update[Object.keys(req.body.update)[i]],
                            "created_by_user": req.requester.userid,
                            "deleted": 0
                        };
                        entry[options.dataTableForeignKey] = req.body[options.entryIdString];
                        updates.push(entry);
                    }
                    for (let i = 0; i < numOfAdds; i++) {
                        const entry = {
                            "field": Object.keys(req.body.add)[i],
                            "value": req.body.add[Object.keys(req.body.add)[i]],
                            "created_by_user": req.requester.userid,
                            "deleted": 0
                        };
                        entry[options.dataTableForeignKey] = req.body[options.entryIdString];
                        adds.push(entry);
                    }
                    return {"updates": updates, "adds": adds};
                })
                .then(transactionFunction)
                .then(result => res.send(`success with ${result.length} new entries added`))
                .catch(err => {console.log(err); res.status(400).send('Error. Please try again')})
                .catch(err => {});
        } else {
            res.status(400).send(`please provide ${options.entryIdString} and update and/or add.`);
        }
    }
}

const _singleton = new DataController();
module.exports = _singleton;