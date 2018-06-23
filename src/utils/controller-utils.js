/*eslint no-unused-vars: "off"*/
const knex = require('../utils/db-connection');

exports.createEntry = (req, res, tablename, entryObj, databaseErrMsg) => {
    entryObj.deleted = '-';
    entryObj['createdByUser'] = req.requester.userid;
    knex(tablename)
        .insert(entryObj)
        .then(result => res.status(200).json(result))
        .catch(err => {
            console.log(err);
            res.status(400).send(databaseErrMsg);
        });
};


exports.deleteEntry = (req, res, tablename, whereObj, whatIsDeleted, expectedNumAffected /* LT 0 */) => {
    whereObj.deleted = '-';
    knex(tablename)
        .where(whereObj)
        .update({ deleted: `${req.requester.userid  }@${  JSON.stringify(new Date())}` })
        .then(result => {
            switch (result){
                            case 0:
                                res.status(404).send('Couldn\'t find entry');
                                break;
                            case expectedNumAffected:
                                res.status(200).send(`${whatIsDeleted  } has been deleted successfully.`);
                                break;
                            default:
                                res.status(500).send('something weird happened');
                                break;
            } })
        .catch(err => {
            console.log(err);
            res.status(400).send('Database error');
        });
};

exports.updateEntry = (req, res, tablename, whereObj, newObj, whatIsUpdated, expectedNumAffected /* LT 0 */) => {
    whereObj.deleted = '-';
    knex(tablename)
        .select('*')
        .where(whereObj)
        .then(result => {
            switch (result.length){
                            case 0:
                                res.status(404).json('Entry does not exist');
                                break;
                            case expectedNumAffected:
                                let originalResult = result;
                                let newDeletedCol = `${req.requester.userid  }@${  JSON.stringify(new Date())}`;   //saved this so that on fail, update entry back to undeleted
                                knex(tablename)
                                    .where(whereObj)
                                    .update({ deleted: newDeletedCol })
                                    .then(result => {
                                        let newEntry = Object.assign(originalResult[0], newObj);
                                        delete newEntry.id;
                                        delete newEntry['createdTime'];
                                        newEntry.deleted = '-';
                                        newEntry['createdByUser'] = req.requester.userid;
                                        knex(tablename)
                                            .insert(newEntry)
                                            .then(() => res.status(200).send(`${whatIsUpdated  } has been succesfully updated.`))
                                            .catch(err => {        //if the original entry is deleted and the new one can't be written. need to reverse it
                                                console.log(err);
                                                whereObj.deleted = newDeletedCol;
                                                knex(tablename)
                                                    .where(whereObj)
                                                    .update({ deleted: '-' })
                                                    .then(() => res.status(400).send('update failed. Please check you parameters'))
                                                    .catch(err => { console.log(err); res.status(500).send('Database error'); });
                                            });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(400).send('Database error');
                                    });
                                break;
                            default:
                                res.status(599).send('something weird happened');
                                break;
            } })
        .catch(err => {
            console.log(err);
            res.status(400).send('Database error');
        });
};

exports.eraseEntry = (req, res, tablename, whereObj, whatIsDeleted, databaseErrMsg, answering) => {
    try {
        knex(tablename)
            .del()
            .where(whereObj)
            .then(() => {
                if (answering)
                    res.status(200).json('success');
            })
            .catch(err => {
                if (answering)
                    res.status(400).send(databaseErrMsg + err);
                return (false);
            });
    } catch (error) {
        return (false);
    }
    return (true);
};
