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
            let oldEntry = getResult[0];
            delete oldEntry.id;
            oldEntry.deleted = `${user.id}@${new Date().getTime()}`;
            newObj.createdTime = knex.fn.now();
            createEntry(tablename, oldEntry).then(function (__unused__createResult) {
                knex(tablename).update(newObj).where(whereObj).then(function (updateRes) {
                    resolve(updateRes);
                }, function (updateErr) {
                    reject(updateErr);
                });
            }, function (createErr) {
                reject(createErr);
            });
        }, function (getErr) {
            reject(getErr);
        });
    });
}

function eraseEntry(tablename, whereObj) {
    return knex(tablename)
        .del()
        .where(whereObj);
}

module.exports = { getEntry: getEntry, createEntry: createEntry, updateEntry: updateEntry, deleteEntry: deleteEntry, eraseEntry: eraseEntry };