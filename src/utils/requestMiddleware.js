const knex = require('../utils/db-connection');

class RequestMiddleware {
    static verifySessionAndPrivilege(req, res, next) {
        if (req.headers.token) {
            knex('USER_SESSION')
                .select({ token: 'USER_SESSION.sessionToken', username: 'USERS.username', priv: 'USERS.adminPriv', userid: 'USER_SESSION.user' })
                .innerJoin('USERS', 'USERS.id', 'USER_SESSION.user')
                .where({ 'USER_SESSION.sessionToken': req.headers.token, 'USER_SESSION.deleted': '-', 'USERS.deleted': '-' })
                .then(result => {
                    if (result.length !== 0) {
                        req.requester = result[0];
                        next();
                    } else {
                        res.status(400).send('You are not logged in. Please provide a valid token.');
                    }
                })
                .catch(err => {
                    res.status(500).send(`Database error ${JSON.stringify(err)}`);
                });
        } else if (req.originalUrl === '/internalapi/userlogin') {
            next();
        } else {
            res.status(400).send('Please provide a token in the header');
        }
    }

    /*
    ** Method:  addActionToCollection
    ** Purpose: Monitor behavior of the user and save in the database each action taken by the user.
    */
    // static addActionToCollection(req, res, next) {
    //     if (!req.headers.token) {
    //         knex('USER_SESSION')
    //             .select('user')
    //             .where({ 'sessionToken': req.headers.token })
    //             .then(result => {
    //                 let user = 'unknown';
    //                 if (result.length === 1)
    //                     user = result[0]['user'];
    //                 knex('LOG_ACTIONS')
    //                     .insert({ 'router':req.originalUrl, 'method':req.method, 'body':JSON.stringify(req.body), 'user':user })
    //                     .then(resultInsert => {
    //                         console.log(`${req.method  } - ${  req.originalUrl  } : ${  user}`);
    //                         next();
    //                     })
    //                     .catch(err => {
    //                         console.log(`Error caught :${  err}`);
    //                         next();
    //                     });
    //             });
    //     } else if (req.body && req.body.username) {
    //         knex('LOG_ACTIONS')
    //             .insert({ 'router':req.originalUrl, 'method':req.method, 'body':JSON.stringify(req.body), 'user':req.body.username })
    //             .then(res => {
    //                 console.log(`${req.method  } - ${  req.originalUrl  } : ${  req.body.username}`);
    //                 next();
    //             })
    //             .catch(err => {
    //                 console.log(`Error caught :${err}`);
    //                 next();
    //             });
    //     }
    // }
}


module.exports = RequestMiddleware;