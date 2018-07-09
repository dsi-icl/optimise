/**
 * Root of the controllers
 * @description Redirects each URL path to the correct controller and monitor the activity of a user.
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const RequestMiddleware = require('./utils/requestMiddleware');

// ROUTES
const users = require('./routes/userRoute');
const visits = require('./routes/visitRoute');
const treatments = require('./routes/treatmentRoute');
const tests = require('./routes/testRoute');
const patients = require('./routes/patientRoute');
const ce = require('./routes/clinicalEventRoute');
const demog = require('./routes/demographicRoute');

// CONTROLLERS
const DataController = require('./controllers/dataController');
const AvailableFieldController = require('./controllers/availableFieldController');

// app Header initialisation.
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  //don't know if to keep or not

// Monitoring and rughts verification
//app.use('/', RequestMiddleware.addActionToCollection);
app.use('/', RequestMiddleware.verifySessionAndPrivilege);

// Modules
app.use('/api/users', users); //Method: POST/PUT/DELETE/GET
app.use('/internalapi/', users);
app.use('/api/visits/', visits);
app.use('/api/treatments/', treatments);
app.use('/api/tests/', tests);
app.use('/api/patients', patients);
app.use('/api/patientProfile/', patients);
app.use('/api/clinicalEvents', ce);

app.use('/api/demogdata/', demog);

app.route('/api/:dataType/data')
    .post(DataController._RouterAddOrUpdate)
    .delete(DataController._RouterDeleteData);

app.route('/api/available/:dataType')
    .get(AvailableFieldController.getFields);

module.exports = app;