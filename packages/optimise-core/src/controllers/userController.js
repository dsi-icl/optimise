import nodeify from 'nodeify';
import ErrorHelper from '../utils/error_helper';
import userCore from '../core/user';
import message from '../utils/message-utils';
import formatToJSON from '../utils/format-response';
import WebSocket from 'ws';
import config from '../../config/optimise.config';

const email_reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class UserController {

    /**
     * @fn serializeUser
     * @desc Called by session middleware to simplify user model
     * @param deserializedUser User as a plain JS object with all its properties
     * @param done
     */
    static serializeUser(deserializedUser, done) {
        if (deserializedUser.hasOwnProperty('id') === false)
            done('User has no ID', null);
        else {
            done(null, {
                id: deserializedUser.id,
                username: deserializedUser.username,
                priv: deserializedUser.priv
            });
        }
    }

    /**
     * @fn deserializeUser
     * @desc Called by session middleware to roll back on the user model
     * @param serializedUser As returned by deserializeUser
     * @param done Callback to pass the deserialized user result to
     */
    static deserializeUser({ id }, done) {
        nodeify(userCore.getUserByID(id).then((user) => {
            if (user.length > 0)
                return [null, user[0]];
            return [`Failed to retreive the user for ID ${id}`, null];
        }).catch((error) => [`Session broke: ${error}`, null]), (__unused__error, [message, user]) => {
            done(message, user);
        });
    }

    static getUser({ user, query }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        let queryUsername;
        if (!query.hasOwnProperty('username')) {
            queryUsername = '';
        } else {
            queryUsername = query.username;
        }
        queryUsername = `%${queryUsername}%`;
        userCore.getUserByUsername(queryUsername).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
    }

    static createUser({ user, body }, res) {
        if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        if (!body.hasOwnProperty('pw') || !body.hasOwnProperty('username') || !body.hasOwnProperty('isAdmin') || !body.hasOwnProperty('realname') || !body.hasOwnProperty('email')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.pw !== 'string' || typeof body.username !== 'string' || typeof body.isAdmin !== 'number' || typeof body.realname !== 'string' || typeof body.email !== 'string' || !email_reg.test(body.email)) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        userCore.createUser(user, body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    }

    static updateUser({ user, body }, res) {
        if (user.priv !== 1 && user.username !== body.username) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
        if (!(body.hasOwnProperty('pw') || body.hasOwnProperty('email')) || !body.hasOwnProperty('username')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.username !== 'string') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if (body.pw !== undefined && typeof body.pw !== 'string') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        if (body.email !== undefined && (typeof body.email !== 'string' || !email_reg.test(body.email))) {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        userCore.updateUser(body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static async changeRights({ user, body }, res) {
        if (user.priv !== 1) {
            const remoteControlOpened = await new Promise((resolve) => {
                const ws = new WebSocket(config.remoteControlEndPoint, {
                    perMessageDeflate: false
                });
                ws.on('open', function open() {
                    resolve(true);
                });
            
                ws.on('error', function incoming(data) {
                    resolve(false);
                });
            });
            if (!remoteControlOpened) {
                res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
                return;
            }
        }
        if (!body.hasOwnProperty('id') || !body.hasOwnProperty('adminPriv')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if (typeof body.id !== 'number' || typeof body.adminPriv !== 'number') {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
        userCore.changeRights(body).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
            return false;
        });
    }

    static deleteUser({ body, user }, res) {
        if (!body.hasOwnProperty('username')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        if ((user.username !== body.username && user.priv === 1) ||
            user.username === body.username) {
            userCore.deleteUser(user, { username: body.username }).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
                return false;
            });
        } else {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        }
    }

    static eraseUser({ user, body }, res) {
        if (user.priv === 1 && body.hasOwnProperty('id') && typeof body.id === 'number') {
            userCore.eraseUser(body.id).then((result) => {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch((error) => {
                res.status(400).json(ErrorHelper(message.errorMessages.ERASEFAILED, error));
                return false;
            });
        } else if (user.priv !== 1) {
            res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
            return;
        } else if (!body.hasOwnProperty('id')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        } else {
            res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
            return;
        }
    }

    static loginUser(req, res) {
        if (!req.body.hasOwnProperty('pw') || !req.body.hasOwnProperty('username')) {
            res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
            return;
        }
        userCore.loginUser(req.body).then((result) => {
            req.login(result, (err) => {
                if (err) {
                    res.status(400).send(ErrorHelper('Failed to login', err));
                    return false;
                }
                delete result.pw;
                delete result.salt;
                delete result.iteration;
                res.status(200).json({ status: 'OK', message: 'Successfully logged in', account: { ...result, remote_control: config.remoteControlEndPoint } });
            });
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(error));
            return false;
        });
    }

    static logoutUser(req, res) {
        // userCore.logoutUser(req.user).then(() => {
        req.session.destroy((err) => {
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
    }

    /**
     * @fn whoAmI
     * @desc Based on the current session,
     * returns which user if logged in if any
     * @param req Express.js request object
     * @param res Express.js response object
     */
    static whoAmI({ user, optimiseCSRFToken }, res) {
        let Iam = user;
        if (Iam === undefined || Iam === null) {
            res.status(404);
            res.json(ErrorHelper('An unknown unicorn'));
        }
        else {
            res.set('CSRF-Token', optimiseCSRFToken);
            res.status(200);
            res.json({...Iam, remote_control: config.remoteControlEndPoint });
        }
    }
}

export default UserController;
