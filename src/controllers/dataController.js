const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class DataController {
    constructor(){
        this.addOrUpdateVisitData = this.addOrUpdateVisitData.bind(this);
        this.addVisitData = this.addVisitData.bind(this);
    }

    addOrUpdateVisitData(req, res){
        if (req.requester.priv === 1){
            this._addOrUpdateVisitDataBackbone(req, res, inputData => 
                knex.transaction(trx => {
                    knex('visit_collected_data')    //updating all the 'updates' entries to 'deleted'
                        .where('field', 'in', Object.keys(req.body.update))
                        .andWhere({'visit': req.body.visitId, 'deleted': 0})
                        .update({'deleted': `${req.requester.userid}@${JSON.stringify(new Date())}`})
                        .transacting(trx)
                        .then(result => {
                            return knex.batchInsert('visit_collected_data', inputData.updates, 1000).transacting(trx);    //adding all the 'updates' entries
                        })
                        .then(result => {
                            return knex.batchInsert('visit_collected_data', inputData.adds, 1000).transacting(trx); //adding all the 'updates' entries
                        })
                        .then(trx.commit)
                        .catch(trx.rollback);
                })
            )
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

    _addOrUpdateVisitDataBackbone (req, res, transactionFunction) {  //req.body = {visitId = 1, update : {1: 43, 54: LEFT}, add : {4324:432, 54:4} }
        if (req.body.visitId && (req.body.update || req.body.add)) {
            if (!req.body.update) { req.body.update = {}; }  //adding an empty obj so that the code later doesn't throw error for undefined
            if (!req.body.add) { req.body.add = {}; }   //same
            const numOfUpdates = Object.keys(req.body.update).length;
            const numOfAdds = Object.keys(req.body.add).length;
            const findField = fieldId => knex('available_fields_visits').select('id', 'type', 'permitted_values').where('id', fieldId);
            knex('visits')
                .select('id')
                .where({id: req.body.visitId, deleted: 0})
                .then(result => {    //making sure the visit is found
                    if (result.length === 1) {
                        return result;
                    } else {
                        res.status(404).send('cannot seem to find your visit!');
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
                    return knex('visit_collected_data')
                        .select('id')
                        .where('field', 'in' , Object.keys(req.body.update))
                        .andWhere({'deleted': 0, 'visit': req.body.visitId})
                        .then(entries => {
                            if (entries.length !== numOfUpdates){
                                res.status(400).send('you can only update when the data is already there!');
                                throw 'stopping the chain';
                            }
                            return knex('visit_collected_data')
                                .select('id')
                                .where('field', 'in' , Object.keys(req.body.add))
                                .andWhere({'deleted': 0, 'visit': req.body.visitId});
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
                            "visit": req.body.visitId,
                            "field": Object.keys(req.body.update)[i],
                            "value": req.body.update[Object.keys(req.body.update)[i]],
                            "created_by_user": req.requester.userid,
                            "deleted": 0
                        };
                        updates.push(entry);
                    }
                    for (let i = 0; i < numOfAdds; i++) {
                        const entry = {
                            "visit": req.body.visitId,
                            "field": Object.keys(req.body.add)[i],
                            "value": req.body.add[Object.keys(req.body.add)[i]],
                            "created_by_user": req.requester.userid,
                            "deleted": 0
                        };
                        adds.push(entry);
                    }
                    console.log(adds);
                    console.log(updates);
                    return {"updates": updates, "adds": adds};
                })
                .then(transactionFunction)
                .then(result => res.send(`success with ${result.length}'`))
                .catch(err => {console.log(err); res.status(400).send('Error. Please try again')})
                .catch(err => {});
        } else {
            res.status(400).send('please provide visitId and update and/or add.');
        }
    }
}

//treatment
//treatment data
//relapse
//relapse data
//test
//test data

const _singleton = new DataController();
module.exports = _singleton;