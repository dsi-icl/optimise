const { getEntry, createEntry, deleteEntry, eraseEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const crypto = require('crypto');
//crypto.DEFAULT_ENCODING = 'hex';
const { saltRound, iteration } = require('../config/hashKeyConfig');
const message = require('../utils/message-utils');
const knex = require('../utils/db-connection');

function User() {
    this.createUser = User.prototype.createUser.bind(this);
    this.updateUser = User.prototype.updateUser.bind(this);
    this.getUserByID = User.prototype.getUserByID.bind(this);
    this.getUserByUsername = User.prototype.getUserByUsername.bind(this);
    this.deleteUser = User.prototype.deleteUser.bind(this);
    this.eraseUser = User.prototype.eraseUser.bind(this);
    this.loginUser = User.prototype.loginUser.bind(this);
    this.logoutUser = User.prototype.logoutUser.bind(this);
}

User.prototype.getUserByUsername = function (user) {
    return new Promise(function (resolve, reject) {
        knex('USERS').select({ id: 'id', username: 'username', realname: 'realname' }).where('username', 'like', user).andWhere({ deleted: '-' }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.getUserByID = function (uid) {
    return new Promise(function (resolve, reject) {
        knex('USERS').select({ id: 'id', username: 'username', realname: 'realname', priv: 'adminPriv' }).where('id', uid).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.createUser = function (userReq, user) {
    return new Promise(function (resolve, reject) {
        let entryObj = {};
        let hashed = crypto.pbkdf2Sync(user.pw, saltRound, iteration, 64, 'sha512');
        entryObj.username = user.username;
        entryObj.realname = user.realname;
        entryObj.pw = hashed.toString('base64');
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
        try {
            let hashed = crypto.pbkdf2Sync(user.pw, saltRound, iteration, 64, 'sha512');
            knex('USERS').update({ 'pw': hashed.toString('base64') }).where({ username: user.username, deleted: '-' }).then(function (result) {
                resolve(result);
            }, function (error) {
                reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            });
        } catch (err) {
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, err));
            return;
        }
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

User.prototype.eraseUser = function (id) {
    return new Promise(function (resolve, reject) {
        eraseEntry('USERS', { 'id': id }).then(function (result) {
            resolve(result);
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.ERASEFAILED, error));
        });
    });
};

User.prototype.loginUser = function (user) {
    return new Promise(function (resolve, reject) {
        getEntry('USERS', { username: user.username }, { pw: 'pw', id: 'id', username: 'username', priv: 'adminPriv' }).then(function (result) {
            if (result.length <= 0)
                reject(ErrorHelper(message.errorMessages.GETFAIL));
            try {
                let crypted = crypto.pbkdf2Sync(user.pw, saltRound, iteration, 64, 'sha512');
                if (crypted.toString('base64') !== result[0].pw)
                    reject(ErrorHelper(message.userError.BADPASSWORD, new Error(message.userError.WRONGARGUMENTS)));
                else
                    resolve(result[0]);
            } catch (err) {
                reject(err);
                return;
            }
        }, function (error) {
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.logoutUser = function (__unused__user) {
    return Promise.resolve(true);
};

module.exports = User;