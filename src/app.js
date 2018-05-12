const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

/////////////////////////////query has to add where deleted = 0!!!!!


const RequestMiddleware = require('./utils/requestMiddleware');

const PatientController = require('./controllers/patientController');
const VisitController = require('./controllers/visitController');
const UserController = require('./controllers/userController');


app.use('/api/', RequestMiddleware.verifySessionAndPrivilege);   //appends {username, priv, token} to req.priv if token is valid, rejects request to client otherwise
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //don't know if to keep or not



app.get('/api/patients', PatientController.searchPatientsById);
app.post('/api/patient/create', PatientController.createPatient);
app.get('/api/patient/:patientID', PatientController.getPatientById);
app.get('/api/visits', VisitController.getVisitsOfPatient);
app.post('/api/users/create', UserController.createUser);

app.delete('/api/patient/delete/', PatientController.setPatientAsDeleted);
app.delete('/api/users/delete/', UserController.setUserAsDeleted);

app.post('/internalapi/userlogin', UserController.userLogin);

module.exports = app;