/**
 * Route user
 * @description Redirect request from /users to the proper controller call
 */

const express = require('express');
const user = express();

const UserCtrl = require('../controllers/userController');
const UserController = new UserCtrl();

// Log the user in
user.route('/login')
    .post(UserController.loginUser);

// Log the user out
user.route('/logout')
    .post(UserController.logoutUser);

// Interacts with the user in the DB
// (POST : create / DELETE : delete / PUT : modify)
// Real path is /users
user.route('/')
    .get(UserController.getUser)
    .post(UserController.createUser)
    .put(UserController.updateUser)
    .delete(UserController.deleteUser);

module.exports = user;