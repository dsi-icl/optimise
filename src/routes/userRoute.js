/**
 * Route user
 * @description Redirect request from /internalapi and /api/users to the proper controller call 
 */

const express = require('express');
const user = express();
const bodyParser = require("body-parser");

const UserController = require('../controllers/userController');

user.set('x-powered-by', false);
user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ extended: true }));

// Log the user in
// real path is /internapi/userlogin
user.route('/userlogin')
   .post(UserController.userLogin);

// Log the user out
// real path is /internapi/userlogout
user.route('/userlogout')
   .post(UserController.userLogout);

// Interacts with the user in the DB 
// (POST : create / DELETE : delete / PUT : modify)
// Real path is /api/users
user.use('/', UserController._Router);

module.exports = user;