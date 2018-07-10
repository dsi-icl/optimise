/**
 * Route user
 * @description Redirect request from /internalapi and /api/users to the proper controller call
 */

const express = require('express');
const user = express();

const UserCtrl = require('../controllers/userController');
const UserController = new UserCtrl();

// Log the user in
// real path is /internapi/userlogin
user.route('/userlogin')
    .post(UserController.loginUser);

// Log the user out
// real path is /internapi/userlogout
user.route('/userlogout')
    .post(UserController.logoutUser);

// Interacts with the user in the DB
// (POST : create / DELETE : delete / PUT : modify)
// Real path is /api/users
user.route('/')
    .get(UserController.getUser)
    .post(UserController.createUser)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser);

module.exports = user;