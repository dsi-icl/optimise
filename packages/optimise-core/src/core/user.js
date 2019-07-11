import { getEntry, createEntry, deleteEntry, eraseEntry } from '../utils/controller-utils';
import ErrorHelper from '../utils/error_helper';
import { hash, generateAndHash } from '../utils/generate-crypto';
import message from '../utils/message-utils';
import dbcon from '../utils/db-connection';

class User {
    static getUserByUsername(user) {
        return new Promise((resolve, reject) => dbcon()('USERS').select({ id: 'id', username: 'username', realname: 'realname', priv: 'adminPriv', email: 'email' }).where('username', 'like', user).andWhere({ deleted: '-' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static getUserByID(uid) {
        return new Promise((resolve, reject) => dbcon()('USERS').select({ id: 'id', username: 'username', realname: 'realname', priv: 'adminPriv', email: 'email' }).where('id', uid).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static createUser({ id }, { pw, username, realname, isAdmin }) {
        return new Promise((resolve, reject) => {
            let entryObj = {};
            let hashContainer = generateAndHash(pw);
            entryObj.username = username;
            entryObj.realname = realname;
            entryObj.pw = hashContainer.hashed;
            entryObj.salt = hashContainer.salt;
            entryObj.iterations = hashContainer.iteration;
            entryObj.adminPriv = isAdmin;
            entryObj.createdByUser = id;
            return createEntry('USERS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error)));
        });
    }

    static updateUser({ pw, email, username }) {
        return new Promise((resolve, reject) => {
            let obj = {};
            try {
                if (pw !== undefined) {
                    let hashContainer = generateAndHash(pw);
                    obj.pw = hashContainer.hashed;
                    obj.salt = hashContainer.salt;
                    obj.iterations = hashContainer.iteration;
                }
                if (email !== undefined)
                    obj.email = email;
                return dbcon()('USERS').update(obj).where({ username: username, deleted: '-' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error)));
            } catch (err) {
                return reject(ErrorHelper(message.errorMessages.UPDATEFAIL, err));
            }
        });
    }

    static changeRights({ adminPriv, id }) {
        return new Promise((resolve, reject) => dbcon()('USERS').update({ 'adminPriv': adminPriv }).where({ id: id, deleted: '-' }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.UPDATEFAIL, error))));
    }

    static deleteUser(user, userReq) {
        return new Promise((resolve, reject) => deleteEntry('USERS', user, userReq).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
    }

    static eraseUser(id) {
        return new Promise((resolve, reject) => eraseEntry('USERS', { 'id': id }).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.ERASEFAILED, error))));
    }

    static loginUser({ username, pw }) {
        return new Promise((resolve, reject) => getEntry('USERS', { username: username }, { pw: 'pw', id: 'id', username: 'username', priv: 'adminPriv', salt: 'salt', iteration: 'iterations' }).then((result) => {
            if (result.length <= 0)
                return reject(ErrorHelper(message.errorMessages.GETFAIL));
            try {
                let crypted = hash(pw, result[0].salt, result[0].iteration);
                if (crypted !== result[0].pw)
                    return reject(ErrorHelper(message.userError.BADPASSWORD));
                else
                    return resolve(result[0]);
            } catch (err) {
                return reject(err);
            }
        }).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
    }

    static logoutUser(__unused__user) {
        return Promise.resolve(true);
    }
}

export default User;