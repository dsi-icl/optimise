const knex = require('../utils/db-connection');
const message = require('../utils/message-utils');

function createEntry(tablename, entryObj) {
    return new Promise(function (resolve, reject) {
        knex(tablename).insert(entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(error);
        });
    });
}


function deleteEntry(tablename, user, whereObj) {
    whereObj.deleted = '-';
    return new Promise(function (resolve, reject) {
        knex(tablename).where(whereObj).update({ deleted: `${user.id}@${JSON.stringify(new Date())}` }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(error);
        });
    });
}

function getEntry(tablename, whereObj, selectedObj) {
    return new Promise(function (resolve, reject) {
        knex(tablename).select(selectedObj).where(whereObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(error);
        });
    });
}

function updateEntry(tablename, user, originObj, whereObj, newObj) {
    whereObj.deleted = '-';
    return new Promise(function (resolve, reject) {
        getEntry(tablename, whereObj, originObj).then(function (getResult) {
            if (getResult.length !== 1) {
                reject(message.errorMessages.NOTFOUND);
                return;
            }
            deleteEntry(tablename, user, whereObj).then(function (__unused__deleteResult) {
                let newEntry = Object.assign(getResult[0], newObj);
                delete newEntry.id;
                delete newEntry.createdTime;
                delete newEntry.deleted;
                createEntry(tablename, newEntry).then(function (createResult) {
                    resolve(createResult);
                }, function (createError) {
                    reject(createError);
                });
            }, function (deleteError) {
                reject(deleteError);
            });
        }, function (error) {
            reject(error);
        });
    });
    // knex(tablename)
    //     .select('*')
    //     .where(whereObj)
    //     .then(result => {
    //         let originalResult;
    //         let newDeletedCol;
    //         switch (result.length) {
    //             case 0:
    //                 res.status(404).json('Entry does not exist');
    //                 break;
    //             case expectedNumAffected:
    //                 originalResult = result;
    //                 newDeletedCol = `${req.user.id}@${JSON.stringify(new Date())}`;   //saved this so that on fail, update entry back to undeleted
    //                 knex(tablename)
    //                     .where(whereObj)
    //                     .update({ deleted: newDeletedCol })
    //                     .then(() => {
    //                         let newEntry = Object.assign(originalResult[0], newObj);
    //                         delete newEntry.id;
    //                         delete newEntry['createdTime'];
    //                         newEntry.deleted = '-';
    //                         newEntry['createdByUser'] = req.user.id;
    //                         knex(tablename)
    //                             .insert(newEntry)
    //                             .then(() => res.status(200).send(`${whatIsUpdated} has been succesfully updated.`))
    //                             .catch(err => {        //if the original entry is deleted and the new one can't be written. need to reverse it
    //                                 console.log(err);
    //                                 whereObj.deleted = newDeletedCol;
    //                                 knex(tablename)
    //                                     .where(whereObj)
    //                                     .update({ deleted: '-' })
    //                                     .then(() => res.status(400).send('update failed. Please check you parameters'))
    //                                     .catch(err => { console.log(err); res.status(500).send('Database error'); });
    //                             });
    //                     })
    //                     .catch(err => {
    //                         console.log(err);
    //                         res.status(400).send('Database error');
    //                     });
    //                 break;
    //             default:
    //                 res.status(599).send('something weird happened');
    //                 break;
    //         }
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(400).send('Database error');
    //     });
}

function eraseEntry(res, tablename, whereObj, __unused__whatIsDeleted, databaseErrMsg, answering) {
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
}

module.exports = { getEntry: getEntry, createEntry: createEntry, updateEntry: updateEntry, deleteEntry: deleteEntry, eraseEntry: eraseEntry };