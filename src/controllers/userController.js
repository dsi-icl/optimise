const ErrorHelper = require('../utils/error_helper');
const { isEmptyObject } = require('../utils/basic-utils');
const userCore = require('../core/user');
const message = require('../utils/message-utils');

function UserController() {
    this.user = new userCore();

    this.getUser = UserController.prototype.getUser.bind(this);
    this.createUser = UserController.prototype.createUser.bind(this);
    this.deleteUser = UserController.prototype.deleteUser.bind(this);
    this.updateUser = UserController.prototype.updateUser.bind(this);
    this.loginUser = UserController.prototype.loginUser.bind(this);
    this.logoutUser = UserController.prototype.logoutUser.bind(this);
}

UserController.prototype.getUser = function (req, res) {
    let queryUsername;
    if (isEmptyObject(req.query)) {
        queryUsername = '';
    } else if (Object.keys(req.query).length === 1 && typeof (req.query.username) === 'string') {
        queryUsername = req.query.username;
    } else {
        res.status(400).send('The query string can only conatins one username');
        return;
    }

    this.user.getUser({ 'username': queryUsername }).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

UserController.prototype.createUser = function (req, res) {
    if (req.requester.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('isAdmin')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.user.createUser(req.requester, req.body).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return;
    });
};

UserController.prototype.updateUser = function (req, res) {
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }

    if (req.requester.username !== req.body.username) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }

    this.user.updateUser(req.requester, req.body).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return;
    });
};

UserController.prototype.deleteUser = function (req, res) {
    if (!req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if ((req.requester.username !== req.body.username && req.requester.priv === 1) ||
        req.requester.username === req.body.username) {
        this.user.deleteUser(req.requester, { username: req.body.username }).then(function (result) {
            res.status(200).json(result);
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return;
        });
    } else {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
};

UserController.prototype.loginUser = function (req, res) {
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.user.loginUser(req.body).then(function (result) {
        res.status(200).json({ token: result });
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(error));
        return;
    });
};

UserController.prototype.logoutUser = function (req, res) {
    if (!req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (req.body.username !== req.requester.username) {
        res.status(401).json(ErrorHelper(message.userError.BADCREDENTIALS));
        return;
    }

    this.user.logoutUser(req.requester).then(function (result) {
        res.status(200).json(result);
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(error));
        return;
    });
};

module.exports = UserController;

// class UserController {
//     constructor() {
//         this._Router = this._Router.bind(this);
//     }

//     _Router(req, res) {
//         try {
//             this[`${req.method}`](req, res);
//         } catch (e) {
//             if (e instanceof TypeError) {
//                 res.status(400).send(`Bad request. Cannot ${req.method} this API endpoint!`);
//             } else {
//                 res.status(500).send('Server Error!');
//             }
//         }
//     }

//     /**
//      *
//      * @description Send the information relative to the UserController.
//      *
//      * @param {*} req the request send by the UserController. May conatins a username specification
//      * @param {*} res the response expected by the client.
//      */
//     GET(req, res) {
//         let queryUsername;
//         if (isEmptyObject(req.query)) {
//             queryUsername = '';
//         } else if (Object.keys(req.query).length === 1 && typeof (req.query.username) === 'string') {
//             queryUsername = req.query.username;
//         } else {
//             res.status(400).send('The query string can only conatins one username');
//             return;
//         }
//         queryUsername = `%${queryUsername}%`;

//         knex('USERS')
//             .select({ username: 'USERS.username' }, 'USERS.realName', 'adminPriv')
//             .where('USERS.username', 'like', queryUsername)
//             .andWhere('USERS.deleted', '-')
//             .then(result => {
//                 res.status(200).json(result);
//             });
//     }

//     POST(req, res) {   //createUser
//         if (req.requester.priv === 1 && req.body.pw) {
//             bcrypt.hash(req.body.pw, saltRound)
//                 .then(hashedPw => {
//                     let entryObj = {
//                         'username': req.body.username,
//                         'pw': hashedPw,
//                         'adminPriv': req.body.isAdmin,
//                         'realName': req.body.realName ? req.body.realName : null
//                     };
//                     let databaseErrMsg = 'Cannot create UserController. ID might already exist. Also, make sure you provide the needed parameters';
//                     createEntry(req, res, 'USERS', entryObj, databaseErrMsg);
//                     return ;
//                 })
//                 .catch(err => {
//                     if (process.env.NODE_ENV !== 'prod')
//                         console.log(`Error catched : ${err}`);
//                     res.status(500).send('error');
//                     return ;
//                 });
//         } else {
//             res.status(401).send('You do not have permission to create users, or you did not provide the new user\'s password');
//             return ;
//         }
//     }

//     DELETE(req, res) {  //setUserAsDeleted
//         if (req.requester.priv === 1 || req.requester.username === req.body.username) {  //accounts can be deleted by admin or oneself
//             deleteEntry(req, res, 'USERS', { 'username': req.body.username }, req.body.username, 1);
//             return ;
//         } else {
//             res.status(401).send('You do not have permission to delete this UserController.');
//             return ;
//         }
//     }

//     PUT(req, res) {   //changePassword   //automatically logged out after changing password
//         if (req.requester.username === req.body.username && req.body.pw) {
//             bcrypt.hash(req.body.pw, saltRound).then(hashedPw => {
//                 let whereObj = { 'username': req.body.username };
//                 let newObj = { 'pw': hashedPw };
//                 updateEntry(req, res, 'USERS', whereObj, newObj, `${req.body.username}'s password`, 1);
//                 return ;
//             });
//         } else {
//             res.status(401).send('You do not have permission to delete this UserController. Or you did not provide the needed parameters');
//             return ;
//         }
//     }

//     userLogin(req, res) {           //delete sessions every day (not yet implemented)
//         if (req.body.username && req.body.pw) {
//             knex('USERS')
//                 .select('pw', 'id')
//                 .where({ 'username': req.body.username, 'deleted': '-' })
//                 .then(result => {
//                     if (result.length === 1) {
//                         bcrypt.compare(req.body.pw, result[0]['pw'])
//                             .then(matched => {
//                                 if (matched) {
//                                     let token = crypto.randomBytes(20).toString('hex');
//                                     knex('USER_SESSION')
//                                         .insert({
//                                             user: result[0]['id'],
//                                             sessionToken: token,
//                                             deleted: '-'
//                                         })
//                                         .then(() => {
//                                             res.status(200).json({ 'token': token });
//                                             return ;
//                                         })
//                                         .catch(err => {
//                                             res.status(500).send(`Database error.${err}`);
//                                             return ;
//                                         });
//                                 } else {
//                                     res.status(401).send('Cannot login. wrong password.');
//                                     return ;
//                                 }
//                             });
//                     } else {
//                         res.status(401).send('Cannot find this user');
//                         return ;
//                     }
//                 })
//                 .catch(() => {
//                     res.status(500).send('Server error.');
//                     return ;
//                 });
//         } else {
//             res.status(400).send('Please provide "username" and "pw".');
//             return ;
//         }
//     }

//     userLogout(req, res) {
//         if (req.body.username && req.requester.username === req.body.username) {
//             deleteEntry(req, res, 'USER_SESSION', { 'sessionToken': req.requester.token }, `${req.body.username}'s session`, 1);
//             return ;
//         } else {
//             res.status(401).send('You do not have permission to log out this UserController.');
//             return ;
//         }
//     }
// }

// const _singleton = new UserController();
// module.exports = _singleton;