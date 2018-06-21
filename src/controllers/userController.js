const {isEmptyObject} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRound  = require('../config/hashKeyConfig');

class UserController {
    constructor(){
        this._Router = this._Router.bind(this);
    }

    _Router(req, res){
        try {
            this[`${req.method}`](req, res);
        } catch(e) {
            if (e instanceof TypeError){
                res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
            } else {
                res.status(500).send('Server Error!');
            }
        }
    }

    /**
     *
     * @description Send the information relative to the user.
     *
     * @param {*} req the request send by the user. May conatins a username specification
     * @param {*} res the response expected by the client.
     */
    GET(req, res){
        let queryUsername;
        if (isEmptyObject(req.query)) {
            queryUsername = '';
        } else if (Object.keys(req.query).length === 1 && typeof (req.query.username) === 'string') {
            queryUsername = req.query.username;
        } else {
            res.status(400).send('The query string can only conatins one username');
            return;
        }
        queryUsername = '%' + queryUsername + '%';

        knex('USERS')
            .select({username:'USERS.username'}, 'USERS.realName', 'adminPriv')
            .where('USERS.username', 'like', queryUsername)
            .andWhere('USERS.deleted', null)
            .then(result => {
                res.status(200).json(result);
            });
    }

    POST(req, res){   //createUser
        if (req.requester.priv === 1 && req.body.pw){
            bcrypt.hash(req.body.pw, saltRound)
                .then(hashedPw => {
                    let entryObj = {
                        'username': req.body.username,
                        'pw': hashedPw,
                        'adminPriv': req.body.isAdmin,
                        'realName': req.body.realName ? req.body.realName : null};
                    let databaseErrMsg = 'Cannot create user. ID might already exist. Also, make sure you provide the needed parameters';
                    createEntry(req, res, 'USERS', entryObj, databaseErrMsg);
                });
        } else {
            res.status(401).send('You do not have permission to create users, or you did not provide the new user\'s password');
        }
    }

    DELETE(req, res){  //setUserAsDeleted
        if (req.requester.priv === 1 || req.requester.username === req.body.username) {  //accounts can be deleted by admin or oneself
            deleteEntry(req, res, 'USERS', {'username': req.body.username}, req.body.username, 1);
        } else {
            res.status(401).send('You do not have permission to delete this user.');
        }
    }

    PUT(req, res){   //changePassword   //automatically logged out after changing password
        if(req.requester.username === req.body.username && req.body.pw) {
            bcrypt.hash(req.body.pw, saltRound).then(hashedPw => {
                let whereObj = {'username': req.body.username};
                let newObj = {'pw': hashedPw};
                updateEntry(req, res, 'USERS', whereObj, newObj, req.body.username + '\'s password', 1);
            });
        } else {
            res.status(401).send('You do not have permission to delete this user. Or you did not provide the needed parameters');
        }
    }

    userLogin(req, res){           //delete sessions every day (not yet implemented)
        if (req.body.username && req.body.pw) {
            knex('USERS')
                .select('pw','id')
                .where({'username': req.body.username, 'deleted': null})
                .then(result => {
                    if (result.length === 1) {
                        bcrypt.compare(req.body.pw, result[0]['pw'])
                            .then(matched => {
                                if (matched) {
                                    let token = crypto.randomBytes(20).toString('hex');
                                    knex('USER_SESSION')
                                        .insert({
                                            user: result[0]['id'],
                                            sessionToken: token,
                                            deleted: null})
                                        .then(result => res.status(200).json({'token': token}))
                                        .catch(err => res.status(500).send('Database error.' + err));
                                } else {
                                    res.status(401).send('Cannot login. wrong password.');
                                }
                            });
                    } else {
                        res.status(401).send('Cannot find this user');
                    }
                })
                .catch(err => {
                    res.status(500).send('Server error.');
                });
        } else {
            res.status(400).send('Please provide "username" and "pw".');
        }
    }

    userLogout(req,res){
        if (req.body.username && req.requester.username == req.body.username){
            deleteEntry(req, res, 'USER_SESSION', {'sessionToken': req.requester.token}, req.body.username + '\'s session', 1);
        } else {
            res.status(401).send('You do not have permission to log out this user.');
        }
    }
}

const _singleton = new UserController();
module.exports = _singleton;