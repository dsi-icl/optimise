const ErrorHelper = require('../utils/error_helper');
const userCore = require('../core/user');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

function UserController() {
    this.user = new userCore();

    this.serializeUser = UserController.prototype.serializeUser.bind(this);
    this.deserializeUser = UserController.prototype.deserializeUser.bind(this);
    this.getUser = UserController.prototype.getUser.bind(this);
    this.createUser = UserController.prototype.createUser.bind(this);
    this.deleteUser = UserController.prototype.deleteUser.bind(this);
    this.updateUser = UserController.prototype.updateUser.bind(this);
    this.eraseUser = UserController.prototype.eraseUser.bind(this);
    this.loginUser = UserController.prototype.loginUser.bind(this);
    this.logoutUser = UserController.prototype.logoutUser.bind(this);
    this.whoAmI = UserController.prototype.whoAmI.bind(this);
    this.changeRights = UserController.prototype.changeRights.bind(this);
}

/**
 * @fn serializeUser
 * @desc Called by session middleware to simplify user model
 * @param deserializedUser User as a plain JS object with all its properties
 * @param done
 */
UserController.prototype.serializeUser = function (deserializedUser, done) {
    if (deserializedUser.hasOwnProperty('id') === false)
        done('User has no ID', null);
    else {
        done(null, {
            id: deserializedUser.id,
            username: deserializedUser.username,
            priv: deserializedUser.priv
        });
    }
};

/**
 * @fn deserializeUser
 * @desc Called by session middleware to roll back on the user model
 * @param serializedUser As returned by deserializeUser
 * @param done Callback to pass the deserialized user result to
 */
UserController.prototype.deserializeUser = function (serializedUser, done) {
    this.user.getUserByID(serializedUser.id).then(function (user) {
        if (user.length > 0)
            done(null, user[0]);
        else
            done(`Failed to retreive the user for ID ${serializedUser.id}`, null);
    }, function (error) {
        done(`Session broke: ${error}`, null);
    });
};

UserController.prototype.getUser = function (req, res) {
    let queryUsername;
    if (!req.query.hasOwnProperty('username')) {
        queryUsername = '';
    } else {
        queryUsername = req.query.username;
    }
    queryUsername = `%${queryUsername}%`;
    this.user.getUserByUsername(queryUsername).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

UserController.prototype.createUser = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('isAdmin') || !req.body.hasOwnProperty('realname')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.pw !== 'string' || typeof req.body.username !== 'string' || typeof req.body.isAdmin !== 'number' || typeof req.body.realname !== 'string') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    this.user.createUser(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
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

    if (req.user.username !== req.body.username) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }

    this.user.updateUser(req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return;
    });
};

UserController.prototype.changeRights = function (req, res) {
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('adminPriv')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.id !== 'number' || typeof req.body.adminPriv !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    this.user.changeRights(req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
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
    if ((req.user.username !== req.body.username && req.user.priv === 1) ||
        req.user.username === req.body.username) {
        this.user.deleteUser(req.user, { username: req.body.username }).then(function (result) {
            res.status(200).json(formatToJSON(result));
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

UserController.prototype.eraseUser = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.user.eraseUser(req.body.id).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.ERASEFAILED, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

UserController.prototype.loginUser = function (req, res) {
    if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.user.loginUser(req.body).then(function (result) {
        req.login(result, function (err) {
            if (err) {
                res.status(400).send(ErrorHelper('Failed to login', err));
                return;
            }
            res.status(200).json({ status: 'OK', message: 'Successfully logged in' });
            // res.status(200).json({ token: result.sessionToken });
        });
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(error));
        return;
    });
};

UserController.prototype.logoutUser = function (req, res) {
    // this.user.logoutUser(req.user).then(function () {
    req.session.destroy(function (err) {
        if (req.user === undefined || req.user === null) {
            res.status(401);
            res.json(ErrorHelper('Not logged in'));
            return;
        }
        req.logout();
        if (err) {
            res.status(500);
            res.json(ErrorHelper('Cannot destroy session', err));
        }
        else {
            res.status(200);
            res.json({ message: 'Successfully logged out' });
        }
    });
};

/**
 * @fn whoAmI
 * @desc Based on the current session,
 * returns which user if logged in if any
 * @param req Express.js request object
 * @param res Express.js response object
 */
UserController.prototype.whoAmI = function (req, res) {
    let Iam = req.user;
    if (Iam === undefined || Iam === null) {
        res.status(404);
        res.json(ErrorHelper('An unknown unicorn'));
    }
    else {
        res.status(200);
        res.json(Iam);
    }
};

module.exports = UserController;