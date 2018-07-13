/*eslint no-console: "off"*/
const knex = require('../utils/db-connection');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        // if (req.headers.token) {
        //     knex('USER_SESSION')
        //         .select({ token: 'USER_SESSION.sessionToken', username: 'USERS.username', priv: 'USERS.adminPriv', userid: 'USER_SESSION.user' })
        //         .innerJoin('USERS', 'USERS.id', 'USER_SESSION.user')
        //         .where({ 'USER_SESSION.sessionToken': req.headers.token, 'USER_SESSION.deleted': '-', 'USERS.deleted': '-' })
        //         .then(result => {
        //             if (result.length !== 0) {
        //                 req.user = result[0];
        //                 next();
        //             } else {
        //                 res.status(400).send('You are not logged in. Please provide a valid token.');
        //             }
        //         })
        //         .catch(err => {
        //             res.status(500).send(`Database error ${JSON.stringify(err)}`);
        //         });
        let user = req.user ? req.user.id : null;
        if (user !== null) {
            req.user = req.user[0];
            next();
        } else if (req.url === '/users/login') {
            next();
        } else {
            res.status(400).send({ status: 'error', message: 'Please login first' });
            // res.status(400).send('Please provide a token in the header');
        }
    }

    /*
    ** Method:  addActionToCollection
    ** Purpose: Monitor behavior of the user and save in the database each action taken by the user.
    */
    static addActionToCollection(req, __unused__res, next) {
        // if (req.headers.hasOwnProperty('token')) {
        //     knex('USER_SESSION')
        //         .select('user')
        //         .where({ 'sessionToken': req.headers.token })
        //         .then(result => {
        //             let user = 'unknown';
        //             if (result.length === 1)
        //                 user = result[0]['user'];
        //             knex('LOG_ACTIONS')
        //                 .insert({ 'router': req.originalUrl, 'method': req.method, 'body': JSON.stringify(req.body), 'user': user })
        //                 .then(__unused__resultInsert => {
        //                     if (process.env.NODE_ENV === 'developpment')
        //                         console.log(`${req.method} - ${req.originalUrl} : ${user}`);
        //                     next();
        //                 })
        //                 .catch(err => {
        //                     if (process.env.NODE_ENV === 'developpment')
        //                         console.log(`Error caught :${err}`);
        //                     next();
        //                 });
        //         });
        // } else if (req.body.hasOwnProperty('username')) {
        let username = req.user ? req.user.username : req.body ? req.body.username : '';
        knex('LOG_ACTIONS')
            .insert({ 'router': req.originalUrl, 'method': req.method, 'body': JSON.stringify(req.body), 'user': username ? username : '' })
            .then(__unused__res => {
                if (process.env.NODE_ENV === 'developpment')
                    console.log(`${req.method} - ${req.originalUrl} : ${username ? username : ''}`);
                next();
            })
            .catch(err => {
                if (process.env.NODE_ENV === 'developpment')
                    console.log(`Error caught :${err}`);
                next();
            });
        // }
    }
}


module.exports = RequestMiddleware;