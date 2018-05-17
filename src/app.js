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








app.post('/api/visits/data', VisitDataController.addVisitData);
app.all('/api/demogdata/:dataType', DemographicDataController._Router);



app.route('/api/visits')
   .get(VisitController.getVisitsOfPatient)
   .post(VisitController.createVisit)
   .delete(VisitController.deleteVisit);

app.route('/api/available/:dataType')
   .get(AvailableFieldController.getFields);

app.all('/api/patients', PatientController._Router);

app.route('/api/patientProfile/:patientId')
   .get(PatientController.getPatientProfileById);    //not yet written

app.all('/api/users', UserController._Router) //Method: POST/PUT/DELETE/  Not yet written: GET (only admin)

app.route('/internalapi/userlogin')
   .post(UserController.userLogin);

app.route('/internalapi/userlogout')
   .post(UserController.userLogout);

module.exports = app;