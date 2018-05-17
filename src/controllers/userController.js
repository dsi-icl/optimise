const {isEmptyObject} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

const hashKey = require('../config/hashKeyConfig');

const crypto = require('crypto');
const hmac = () => {return crypto.createHmac('sha256', hashKey)};

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
    
    POST(req, res){   //createUser
        if (req.requester.priv === 1 && req.body.pw){
            let hashedPw = hmac().update(req.body.pw).digest('hex');  
            let entryObj = {
                "username": req.body.username,
                "pw": hashedPw,
                "admin_priv": req.body.isAdmin,
                "real_name": req.body.realName ? req.body.realName : null};
            let databaseErrMsg = 'Cannot create user. ID might already exist. Also, make sure you provide the needed parameters';
            createEntry(req, res, 'users', entryObj, databaseErrMsg);
        } else {
            res.status(401).send('You do not have permission to create users, or you did not provide the new user\'s password');
        }
    }

    DELETE(req, res){  //setUserAsDeleted
        if (req.requester.priv === 1 || req.requester.username === req.body.username) {  //accounts can be deleted by admin or oneself
            deleteEntry(req, res, 'users', {'username': req.body.username}, req.body.username, 1);
        } else {
            res.status(401).send('You do not have permission to delete this user.');
        }
    }

    PUT(req, res){   //changePassword   //automatically logged out after changing password
        if(req.requester.username === req.body.username && req.body.pw) {
            let hashedPw = hmac().update(req.body.pw).digest('hex');
            let whereObj = {'username': req.body.username};
            let newObj = {'pw': hashedPw};
            updateEntry(req, res, 'users', whereObj, newObj, req.body.username + "'s password", 1);
        } else {
            res.status(401).send('You do not have permission to delete this user. Or you did not provide the needed parameters');
        }
    }

    userLogin(req, res){           //delete sessions every day
        if (req.body.username && req.body.pw) {
            let hashedPw = hmac().update(req.body.pw).digest('hex');
            knex('users')
                .select('pw','id')
                .where({'username': req.body.username, 'deleted': 0})
                .then(result => {
                    if (result.length === 1 && result[0]['pw'] === hashedPw) {
                        let token = crypto.randomBytes(20).toString('hex');
                        knex('user_sessions')
                            .insert({
                                user: result[0]['id'],
                                session_token: token,
                                deleted: 0})
                            .then(result => res.status(200).json({'token': token}))
                            .catch(err => res.status(500).send('Database error.'))
                    } else {
                        res.status(401).send('Cannot login. Please check username / password.')
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Server error.');
                })
        } else {
            res.status(400).send('Please provide "username" and "pw".');
        }
    }

    userLogout(req,res){
        if (req.requester.username === req.body.username){
            deleteEntry(req, res, 'user_sessions', {'session_token': req.requester.token}, req.body.username + "'s session", 1);
        } else {
            res.status(401).send('You do not have permission to log out this user.');
        }
    }
}

const _singleton = new UserController();
module.exports = _singleton;