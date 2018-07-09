const { getEntry, createEntry, deleteEntry, updateEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRound = require('../config/hashKeyConfig');
const message = require('../utils/message-utils');

function User() {
    this.createUser = User.prototype.createUser.bind(this);
    this.updateUser = User.prototype.updateUser.bind(this);
}

User.prototype.getUser = function(user) {
    return new Promise(function(resolve, reject) {
        getEntry('USERS', user, { id: 'id', username: 'username', realname: 'realname' }).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.createUser = function(requester, user) {
    return new Promise(function(resolve, reject){
        let entryObj = {};
        entryObj.username = user.username;
        if (user.hasOwnProperty('realName'))
            entryObj.realname = user.realName;
        entryObj.pw = bcrypt.hashSync(user.pw, saltRound);
        entryObj.adminPriv = user.isAdmin;
        entryObj.createdByUser = requester.userid;
        createEntry('USERS', entryObj).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        });
    });
};

User.prototype.updateUser = function(requester, user) {
    return new Promise(function(resolve, reject){
        let hashed = bcrypt.hashSync(user.pw, saltRound);
        updateEntry('USERS', requester, '*', { 'username': user.username }, { pw: hashed }).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        });
    });
};

User.prototype.deleteUser = function(requester, userId) {
    return new Promise(function(resolve, reject){
        deleteEntry('USERS', requester, userId).then(function(result){
            resolve(result);
        }, function(error){
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

User.prototype.loginUser = function(user) {
    return new Promise(function(resolve, reject){
        getEntry('USERS', { username: user.username }, { pw: 'pw', id: 'id' }).then(function(result){
            try {
                if (!bcrypt.compareSync(user.pw, result[0].pw)) {
                    reject(ErrorHelper(message.userError.BADPASSWORD, new Error(message.userError.WRONGARGUMENTS)));
                }
            } catch (tryError) {
                reject(ErrorHelper(message.userError.BADPASSWORD, tryError));
            }
            let token = crypto.randomBytes(20).toString('hex');
            let entryObj = {};
            entryObj.user = result[0].id;
            entryObj.sessionToken = token;
            createEntry('USER_SESSION', entryObj).then(function(__unused__result){
                resolve(token);
            }, function(error){
                reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            });
        }, function(error){
            reject(ErrorHelper(message.errorMessages.GETFAIL, error));
        });
    });
};

User.prototype.logoutUser = function(requester) {
    return new Promise(function(resolve, reject) {
        deleteEntry('USER_SESSION', requester, { sessionToken: requester.token }).then(function(result){
            resolve(result);
        },function(error){
            reject(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        });
    });
};

module.exports = User;