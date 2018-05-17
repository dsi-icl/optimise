const knex = require('../utils/db-connection');

exports.createEntry = (req, res, tablename, entryObj, databaseErrMsg) => {
    entryObj.deleted = 0;
    entryObj['created_by_user'] = req.requester.userid;
    knex(tablename)
        .insert(entryObj)
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(400).send(databaseErrMsg);
        })
};


exports.deleteEntry = (req, res, tablename, whereObj, whatIsDeleted, expectedNumAffected /* LT 0 */) => {
    whereObj.deleted = 0;
    knex(tablename)
        .where(whereObj)
        .update({deleted: req.requester.userid + '@' + JSON.stringify(new Date())})
        .then(result => {
            switch (result){
                case 0:
                    res.status(404).send('ID does not exist');
                    break
                case expectedNumAffected:
                    res.status(200).send(whatIsDeleted + ' has been deleted successfully.');
                    break
                default:
                    res.status(500).send('something weird happened');
                    break
            }})
        .catch(err => {
            console.log(err);
            res.status(400).send('Database error');
        })
}


exports.updateEntry = (req, res, tablename, whereObj, newObj, whatIsUpdated, expectedNumAffected /* LT 0 */) => {
    whereObj.deleted = 0;
    knex(tablename)
        .select('*')
        .where(whereObj)
        .then(result => {
            switch (result.length){
                case 0:
                    res.status(404).json('Entry does not exist');
                    break
                case expectedNumAffected:
                    let originalResult = result;
                    let newDeletedCol = req.requester.userid + '@' + JSON.stringify(new Date());   //saved this so that on fail, update entry back to undeleted
                    knex(tablename)
                        .where(whereObj)
                        .update({deleted: newDeletedCol})
                        .then(result => {
                            let newEntry = Object.assign(originalResult[0], newObj);
                            delete newEntry.id;
                            delete newEntry['created_time'];
                            newEntry.deleted = 0;
                            newEntry['created_by_user'] = req.requester.userid;
                            knex(tablename)
                                .insert(newEntry)
                                .then(result => res.status(200).send(whatIsUpdated + ' has been succesfully updated.'))
                                .catch(err => {        //if the original entry is deleted and the new one can't be written. need to reverse it
                                    console.log(err);
                                    whereObj.deleted = newDeletedCol;
                                    knex(tablename)
                                        .where(whereObj)
                                        .update({deleted: 0})
                                        .then(result => res.status(400).send('update failed. Please check you parameters'))
                                        .catch(err => {console.log(err); res.status(500).send('Database error')})  
                                })
                            })
                        .catch(err => {
                            console.log(err);
                            res.status(400).send('Database error');
                        });
                    break
                default:
                    res.status(599).send('something weird happened');
                    break
            }})
        .catch(err => {
            console.log(err);
            res.status(400).send('Database error');
        })
}

exports.addFieldData = (req, res, fieldTable, dataTable) => {
    const _this = this;             //see if I should make an api that accepts updating multiple fields instead
    knex('visits')
        .select('id')
        .where({id: req.body.visit, deleted: 0})
        .then(result => {
            if (result.length === 1)  {
                knex(fieldTable)
                    .select('type', 'permitted_values')
                    .where('id', req.body.field)
                    .then(result => {
                        if (result.length === 1){
                            switch (result[0].type) {
                                case 'B':
                                    if (req.body.value === 1 || req.body.value === 0) {
                                        _this.createEntry(req, res, dataTable, req.body, 'Error. Malformed request.');
                                    } else {res.status(400).send('This field only accept value 1 and 0.')}
                                    break
                                case 'C':
                                    if (result[0]['permitted_values'].split(', ').indexOf(req.body.value) !== -1) {  //see if the value is in the permitted values
                                        _this.createEntry(req, res, dataTable, req.body, 'Error. Malformed request.');
                                    } else {
                                        res.status(400).send(`This field only accept values ${result[0]['permitted_values']}`)}
                                    break
                                case 'I':
                                    if (parseInt(req.body.value)) {
                                        _this.createEntry(req, res, dataTable, req.body, 'Error. Malformed request.');
                                    } else {res.status(400).send(`This field only accept integer`)}
                                    break
                                case 'N':
                                    if (parseFloat(req.body.value)) {
                                        _this.createEntry(req, res, dataTable, req.body, 'Error. Malformed request.');
                                    } else {res.status(400).send(`This field only accept number`)}
                                    break
                            }
                        } else {
                            res.status(404).send('cannot seem to find your field');
                        }
                    })
            } else {
                res.status(404).send('seems like the visit does not exist!');
            }
        })
}