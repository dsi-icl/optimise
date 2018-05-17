const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

/////////////////////////////query has to add where deleted = 0!!!!!
///remove priv from res!


const RequestMiddleware = require('./utils/requestMiddleware');

const PatientController = require('./controllers/patientController');
const VisitController = require('./controllers/visitController');
const UserController = require('./controllers/userController');
const DemographicDataController = require('./controllers/demographicDataController');
const VisitDataController = require('./controllers/visitDataController');
const AvailableFieldController = require('./controllers/availableFieldController');


app.use('/api/', RequestMiddleware.verifySessionAndPrivilege);
app.use('/internalapi/userlogout', RequestMiddleware.verifySessionAndPrivilege);   //appends {username, priv, token} to req.requester if token is valid, rejects request to client otherwise
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //don't know if to keep or not


app.get('/api/available/:dataType', AvailableFieldController._Router);
app.get('/api/patients', PatientController.searchPatientsById);
app.post('/api/patients/create', PatientController.createPatient);
app.get('/api/patients/:patientID', PatientController.getPatientById);
app.get('/api/visits', VisitController.getVisitsOfPatient);
app.post('/api/visits/create', VisitController.createVisit);
app.post('/api/visits/data', VisitDataController.addVisitData);
app.delete('/api/visits/delete', VisitController.deleteVisit);
app.post('/api/users/create', UserController.createUser);
app.all('/api/demogdata/:dataType', DemographicDataController._Router);

app.delete('/api/patients/delete/', PatientController.setPatientAsDeleted);
app.delete('/api/users/delete/', UserController.setUserAsDeleted);

app.post('/api/users/changePassword', UserController.changePassword);    //automatically logged out after changing password

app.post('/internalapi/userlogin', UserController.userLogin);
app.post('/internalapi/userlogout', UserController.userLogout);
module.exports = app;