const express = require('express');
const user = express();
const UserController = require('../controllers/userController');

user.route('/userlogin')
   .post(UserController.userLogin);

user.route('/userlogout')
   .post(UserController.userLogout);

module.exports = user;