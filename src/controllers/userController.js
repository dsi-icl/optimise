const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

const hashKey = require('../config/hashKeyConfig');



const crypto = require('crypto');
const hmac = () => {return crypto.createHmac('sha256', hashKey)};

class UserController {
    static createUser(req, res){
        console.log('placeholder');
    }

    static userLogin(req, res){              //add wehere deleted = 0     //delete sessions every day
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
                                expired: 0})
                            .then(result => {
                                res.status(200);
                                res.send(token)})
                            .catch(err => {
                                res.status(500);
                                res.send('Database error.');
                            })
                    } else {
                        res.status(401);
                        res.send('Cannot login. Please check username / password.')
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500);
                    res.send('Server error.');
                })
        } else {
            res.status(400);
            res.send('Please provide "username" and "pw".');
        }
    }


    static setUserAsDeleted(req, res){
        if (req.priv.priv === 1 || req.priv.username === req.body.username) {    //accounts can be deleted by admin or oneself
            knex('users')
                .where({'username': req.body.username, 'deleted': 0})
                .update({'deleted': req.priv.userid + '@' + JSON.stringify(new Date())})
                .then(result => {
                    switch (result){
                        case 0:
                            res.status(404);
                            res.json('ID does not exist');
                            break
                        case 1:
                            res.status(200);
                            res.send(req.body.username + ' has been deleted successfully.');
                            break
                        default:
                            res.status(500);
                            res.send('something weird happened');
                            break
                }})
                .catch(err => {
                    console.log(err);
                    res.status(500);
                    res.send('Server error.');
                })
        } else {
            res.status(401);
            res.send('You do not have permission to delete this user.');
        }
    }
    //static changePassword(req, res) {
    //   if(req.priv.username === req.body.username) {
    //        knex('users')
    //            .select('')
    //    }
    //}
}


module.exports = UserController;