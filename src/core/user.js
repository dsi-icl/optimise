const { getEntry, createEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRound = require('../config/hashKeyConfig');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function User() {
    this.createUser = User.prototype.createUser.bind(this);
    this.updateUser = User.prototype.updateUser.bind(this);
}

User.prototype.getUserByUsername = function (user) {
    return new Promise(function (resolve, reject) {
        knex('USERS').select({ id: 'id', username: 'username', realname: 'realname' }).where('username', 'like', user).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.getUserByID = function (uid) {
    return new Promise(function (resolve, reject) {
        knex('USERS').select({ id: 'id', username: 'username', realname: 'realname', priv:'adminPriv' }).where('id', uid).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.createUser = function (userReq, user) {
    return new Promise(function (resolve, reject) {
        let entryObj = {};
        entryObj.username = user.username;
        if (user.hasOwnProperty('realName'))
            entryObj.realname = user.realName;
        entryObj.pw = bcrypt.hashSync(user.pw, saltRound);
        entryObj.adminPriv = user.isAdmin;
        entryObj.createdByUser = userReq.id;
        createEntry('USERS', entryObj).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

User.prototype.updateUser = function (user) {
    return new Promise(function (resolve, reject) {
        const hashed = bcrypt.hashSync(user.pw, saltRound);
        knex('USERS').update({ 'pw': hashed }).where({ username: user.username, deleted: '-' }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

User.prototype.deleteUser = function (user, userReq) {
    return new Promise(function (resolve, reject) {
        deleteEntry('USERS', user, userReq).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

User.prototype.loginUser = function (user) {
    return new Promise(function (resolve, reject) {
        getEntry('USERS', { username: user.username }, { pw: 'pw', id: 'id', username: 'username', priv: 'adminPriv' }).then(function (result) {
            if (result.length <= 0)
                reject(ErrorHelper(message.errorMessages.GETFAIL));
            try {
                if (!bcrypt.compareSync(user.pw, result[0].pw)) {
                    reject(ErrorHelper(message.userError.BADPASSWORD, new Error(message.userError.WRONGARGUMENTS)));
                }
            } catch (tryError) {
                reject(ErrorHelper(message.userError.BADPASSWORD, tryError));
            }
            resolve(result[0]);
            // let entryObj = {};
            // entryObj.user = result[0];
            // entryObj.sessionToken = crypto.randomBytes(20).toString('hex');
            // createEntry('USER_SESSION', { user: entryObj.user.id }).then(function (__unused__result) {
            // resolve(entryObj);
            // }, function (error) {
            //     reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            // });
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.logoutUser = function (__unused__user) {
    // return new Promise(function (resolve, reject) {
    //     deleteEntry('USER_SESSION', requester, { sessionToken: requester.token }).then(function (result) {
    //         resolve(result);
    //     }, function (error) {
    //         reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
    //     });
    // });
    return Promise.resolve(true);
};

module.exports = User;