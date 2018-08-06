const knex = require('../utils/db-connection');
const message = require('../utils/message-utils');

function createEntry(tablename, entryObj) {
    return new Promise(function (resolve, reject) {
        knex(tablename).insert(entryObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(error);
        });
    });
}

function deleteEntry(tablename, user, whereObj) {
    whereObj.deleted = '-';
    return new Promise(function (resolve, reject) {
        knex(tablename).where(whereObj).update({ deleted: `${user.id}@${JSON.stringify(new Date())}` }).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(error);
        });
    });
}

function getEntry(tablename, whereObj, selectedObj) {
    return new Promise(function (resolve, reject) {
        knex(tablename).select(selectedObj).where(whereObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(error);
        });
    });
}

function updateEntry(tablename, user, originObj, whereObj, newObj) {
    whereObj.deleted = '-';
    return new Promise(function (resolve, reject) {
        return getEntry(tablename, whereObj, originObj).then(function (getResult) {
            if (getResult.length !== 1) {
                return reject(message.errorMessages.NOTFOUND);
            }
            let oldEntry = getResult[0];
            delete oldEntry.id;
            if (oldEntry.hasOwnProperty('deleted'))
                oldEntry.deleted = `${user.id}@${new Date().getTime()}`;
            if (oldEntry.hasOwnProperty('createdTime'))
                newObj.createdTime = knex.fn.now();
            return createEntry(tablename, oldEntry).then(function (__unused__createResult) {
                return knex(tablename).update(newObj).where(whereObj).then(function (updateRes) {
                    return resolve(updateRes);
                }, function (updateErr) {
                    return reject(updateErr);
                });
            }, function (createErr) {
                return reject(createErr);
            });
        }, function (getErr) {
            return reject(getErr);
        });
    });
}

function eraseEntry(tablename, whereObj) {
    return knex(tablename)
        .del()
        .where(whereObj);
}

module.exports = { getEntry: getEntry, createEntry: createEntry, updateEntry: updateEntry, deleteEntry: deleteEntry, eraseEntry: eraseEntry };