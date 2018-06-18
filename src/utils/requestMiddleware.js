const {isEmptyObject} = require('../utils/basic-utils');

const knex = require('../utils/db-connection');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        if (req.headers.token) {
            knex('USER_SESSION')
                .select({token: 'USER_SESSION.sessionToken', username: 'USERS.username', priv: 'USERS.adminPriv', userid: 'USER_SESSION.user'})
                .innerJoin('USERS', 'USERS.id', 'USER_SESSION.user')
                .where({'USER_SESSION.sessionToken': req.headers.token, 'USER_SESSION.deleted': null, 'USERS.deleted': null})
                .then(result => {
                    if (result.length !== 0){
                        req.requester = result[0];
                        next();
                    } else {
                        res.status(400).send('You are not logged in. Please provide a valid token.');
                    }})
                .catch(err => {
                    console.log(err);
                    res.status(500).send('Database error');
                })
        } else {
            res.status(400).send('Please provide a token in the header')
        }
    }

    /*
    ** Method:  addActionToCollection
    ** Purpose: Monitor behavior of the user and save in the database each action taken by the user.
    */
    static addActionToCollection(req, res, next) {
        if (req.headers.token != undefined) {
            knex('USER_SESSION')
            .select('user')
            .where({'sessionToken': req.headers.token})
            .then(res => {
                knex('LOG_ACTIONS')
                    .insert({'router':req.originalUrl, 'method':req.method, 'body':JSON.stringify(req.body), 'user':res[0]['user'] })
                    .then(result => {
                        console.log(req.method + ' - ' + req.originalUrl + ' : ' + res[0]["user"]);
                        next();
                    })
                    .catch(err => {
                        console.log('Error catched :' + err);
                        next();
                    })
            })
        } else if (req.body && req.body.username) {
            knex('LOG_ACTIONS')
                .insert({'router':req.originalUrl, 'method':req.method, 'body':JSON.stringify(req.body), 'user':req.body.username })
                .then(res => {
                    console.log(req.method + ' - ' + req.originalUrl + ' : ' + req.body.username);
                    next();
                })
                .catch(err => {
                    console.log('Error catched :' + err);
                    next();
                });
        }
    }
}


module.exports = RequestMiddleware;