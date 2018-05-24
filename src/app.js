const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

/////////////////////////////query has to add where deleted = 0!!!!!
///remove priv from res!
///export data to cdisk

/*
 * ===============================================
 *
 * REBUILD WIP.
 * TO ADD NEW REQUEST REFERS TO THE ROUTE FILE
 * EXAMPLE : /api/tests/ --> ./routes/testRoute.js
 * 
 * ===============================================
 */

const RequestMiddleware = require('./utils/requestMiddleware');

// ROUTES
const users = require('./routes/userRoute');
const visits = require('./routes/visitRoute');
const treatments = require('./routes/treatmentRoute');
const tests = require('./routes/testRoute');
const patients = require('./routes/patientRoute');

// CONTROLLERS
const PatientController = require('./controllers/patientController');
const VisitController = require('./controllers/visitController');
const UserController = require('./controllers/userController');
const DemographicDataController = require('./controllers/demographicDataController');
const DataController = require('./controllers/dataController');
const AvailableFieldController = require('./controllers/availableFieldController');
const TreatmentController = require('./controllers/treatmentController');
const TestController = require('./controllers/testController');
const CeController = require('./controllers/ceController');

app.use('/', RequestMiddleware.addActionToCollection);
app.use('/api/', RequestMiddleware.verifySessionAndPrivilege);
app.use('/internalapi/userlogout', RequestMiddleware.verifySessionAndPrivilege);   //appends {username, priv, token} to req.requester if token is valid, rejects request to client otherwise
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //don't know if to keep or not

app.route('/api/users')
app.route('/internalapi/', users);
app.route('/api/visits/', visits);
app.route('/api/treatments/', treatments);
app.route('/api/tests/', tests);
app.route('/api/patients', patients);

app.all('/api/demogdata/:dataType', DemographicDataController._Router);

app.route('/api/:dataType/data')
   .post(DataController._RouterAddOrUpdate)
   .delete(DataController._RouterDeleteData);

/*app.route('/api/visits')
   .get(VisitController.getVisitsOfPatient)
   .post(VisitController.createVisit)
   .delete(VisitController.deleteVisit);

app.route('/api/treatments')
   .post(TreatmentController.createTreatment)
   .put(TreatmentController.editTreatment);

app.route('/api/treatments/addTermination')
   .post(TreatmentController.addTerminationDate);

*/app.route('/api/clinicalEvents')
   .post(CeController.createCe);

/*app.route('/api/tests')
   .post(TestController.createTest)
   .delete(TestController.deleteTest);

app.route('/api/tests/addOccurredDate')
   .post(TestController.addActualOccurredDate);

*/app.route('/api/available/:dataType')
   .get(AvailableFieldController.getFields);

//app.all('/api/patients', PatientController._Router);
/*app.route('/api/patients')
   .get(PatientController.searchPatients)
   .post(PatientController.createPatient)
   .delete(PatientController.setPatientAsDeleted);*/

app.route('/api/patientProfile/:patientId')
   .get(PatientController.getPatientProfileById);    //not yet written

   // put this request as internal
app.all('/api/users', UserController._Router) //Method: POST/PUT/DELETE/  Not yet written: GET (only admin)

/*app.route('/internalapi/userlogin')
   .post(UserController.userLogin);

app.route('/internalapi/userlogout')
   .post(UserController.userLogout); */

module.exports = app;