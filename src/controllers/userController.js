const ErrorHelper = require('../utils/error_helper');
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
    if (req.query.length === 0) {
        queryUsername = '';
    } else if (Object.keys(req.query).length === 1 && typeof (req.query.username) === 'string') {
        queryUsername = req.query.username;
    } else {
        res.status(400).send('The query string can only conatins one username');
        return;
    }
    queryUsername = `%${queryUsername}%`
    this.user.getUser(queryUsername).then(function (result) {
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