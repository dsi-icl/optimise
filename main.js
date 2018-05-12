const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

/////////////////////////////query has to add where deleted = 0!!!!!




const PatientController = require('./src/controllers/patientController');
const VisitController = require('./src/controllers/visitController');
const UserController = require('./src/controllers/userController');

app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //don't know if to keep or not



app.get('/api/patients', PatientController.searchPatientsById);
app.get('/api/patient/:patientID', PatientController.getPatientById);
app.get('/api/visits', VisitController.getVisitsOfPatient);
app.post('/api/users/create', UserController.createUser);


app.post('/internalapi/userlogin', UserController.userLogin);


app.listen(3000, ()=>{console.log('listening on port 3000!')});