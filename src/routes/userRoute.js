/**
 * Route user
 * @description Redirect request from /internalapi to the proper controller call 
 */

const express = require('express');
const user = express();
const bodyParser = require("body-parser");

const UserController = require('../controllers/userController');

user.set('x-powered-by', false);
user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ extended: true }));

user.route('')
    .post(UserController._Router);

user.route('/userlogin')
   .post(UserController.userLogin);

user.route('/userlogout')
   .post(UserController.userLogout);

module.exports = user;