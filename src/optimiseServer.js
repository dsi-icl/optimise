//External node module imports
const express = require('express');
const body_parser = require('body-parser');

const optimiseOptions = require('./core/options');
const knex = require('./utils/db-connection');
const { migrate } = require('../src/utils/db-handler');
const ErrorHelper = require('./utils/error_helper');

function OptimiseServer(config) {
    this.config = new optimiseOptions(config);
    this.app = express();

    // Bind member functions
    this.start = OptimiseServer.prototype.start.bind(this);
    this.stop = OptimiseServer.prototype.stop.bind(this);
    this.setupUsers = OptimiseServer.prototype.setupUsers.bind(this);
    this.setupPatients = OptimiseServer.prototype.setupPatients.bind(this);
    this.setupVisits = OptimiseServer.prototype.setupVisits.bind(this);
    this.setupDemographics = OptimiseServer.prototype.setupDemographics.bind(this);
    this.setupClinicalEvents = OptimiseServer.prototype.setupClinicalEvents.bind(this);
    this.setupTreatments = OptimiseServer.prototype.setupTreatments.bind(this);
    this.setupTests = OptimiseServer.prototype.setupTests.bind(this);
    this.setupData = OptimiseServer.prototype.setupData.bind(this);
    this.setupExport = OptimiseServer.prototype.setupExport.bind(this);
    this.setupLogs = OptimiseServer.prototype.setupLogs.bind(this);

    // Define config in global scope (needed for server extensions)
    global.config = this.config;

    // Configure EXPRESS.JS router
    // Remove unwanted express headers
    this.app.set('x-powered-by', false);
    // Allow CORS requests when enabled
    if (this.config.enableCors === true) {
        this.app.use(function (__unused__req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }
    // Middleware imports
    this.requestMiddleware = require('./utils/requestMiddleware');
}

/**
 * @fn start
 * @desc Start the OptimiseServer service, routes are setup and
 * automatic status update is triggered.
 * @return {Promise} Resolve to a native Express.js router ready to use on success.
 * In case of error, an ErrorStack is rejected.
 */
OptimiseServer.prototype.start = function () {
    let _this = this;
    return new Promise(function (resolve, reject) {

        // Keeping a pointer to the original mounting point of the server
        _this.app.use(function (req, __unused__res, next) {
            req.optimiseRootUrl = req.baseUrl;
            next();
        });

        // Init third party middleware for parsing HTTP requests body
        _this.app.use(body_parser.urlencoded({ extended: true }));
        _this.app.use(body_parser.json());

        // Adding session checks and monitoring
        _this.app.use('/', _this.requestMiddleware.verifySessionAndPrivilege);
        _this.app.use('/', _this.requestMiddleware.addActionToCollection);

        // Setup remaining route using controllers
        _this.setupUsers();
        _this.setupPatients();
        _this.setupVisits();
        _this.setupDemographics();
        _this.setupClinicalEvents();
        _this.setupTreatments();
        _this.setupTests();
        _this.setupData();
        _this.setupExport();
        _this.setupLogs();

        _this.app.all('/*', function (__unused__req, res) {
            res.status(400);
            res.json(ErrorHelper('Bad request'));
        });

        // All good, return the express app router
        migrate('bare').then(() => resolve(_this.app)).catch(err => reject(err));
    });
};

/**
 * @fn stop
 * @desc Stops the optimise server service. After a call to stop, all references on the
 * express router MUST be released and this service endpoints are expected to fail.
 * @return {Promise} Resolve to true on success, ErrorStack otherwise
 */
OptimiseServer.prototype.stop = function () {
    return new Promise(function (resolve, reject) {
        knex.destroy().then(() => resolve(true)).catch((err) => reject(err)); // Everything is stopped
    });
};

/**
 * @fn setupUsers
 * @desc Initialize the users related routes
 */
OptimiseServer.prototype.setupUsers = function () {
    // Import the controller
    this.routeUsers = require('./routes/userRoute');

    // Modules
    this.app.use('/users', this.routeUsers);
};

/**
 * @fn setupPatients
 * @desc Initialize the patients related routes
 */
OptimiseServer.prototype.setupPatients = function () {
    // Import the controller
    this.routePatients = require('./routes/patientRoute');

    // Modules
    this.app.use('/patients', this.routePatients);
};

/**
 * @fn setupVisits
 * @desc Initialize the visits related routes
 */
OptimiseServer.prototype.setupVisits = function () {
    // Import the controller
    this.routeVisits = require('./routes/visitRoute');

    // Modules
    this.app.use('/visits', this.routeVisits);
};

/**
 * @fn setupDemographics
 * @desc Initialize the demographics related routes
 */
OptimiseServer.prototype.setupDemographics = function () {
    // Import the controller
    this.routeDemographics = require('./routes/demographicRoute');

    // Modules
    this.app.use('/demographics', this.routeDemographics);
};

/**
 * @fn setupClinicalEvents
 * @desc Initialize the clinicalEvents related routes
 */
OptimiseServer.prototype.setupClinicalEvents = function () {
    // Import the controller
    this.routeClinicalEvents = require('./routes/clinicalEventRoute');

    // Modules
    this.app.use('/clinicalEvents', this.routeClinicalEvents);
};

/**
 * @fn setupTreatments
 * @desc Initialize the treatments related routes
 */
OptimiseServer.prototype.setupTreatments = function () {
    // Import the controller
    this.routeTreatments = require('./routes/treatmentRoute');

    // Modules
    this.app.use('/treatments', this.routeTreatments);
};

/**
 * @fn setupTests
 * @desc Initialize the tests related routes
 */
OptimiseServer.prototype.setupTests = function () {
    // Import the controller
    this.routeTests = require('./routes/testRoute');

    // Modules
    this.app.use('/tests', this.routeTests);
};

/**
 * @fn setupData
 * @desc Initialize the data related routes
 */
OptimiseServer.prototype.setupData = function () {
    // Import the controller
    this.dataController = require('./controllers/dataController');
    this.availableFieldController = require('./controllers/availableFieldController');

    // Modules
    this.app.route('/data/:dataType')
        .post(this.dataController._RouterAddOrUpdate)
        .delete(this.dataController._RouterDeleteData)
        .get(this.availableFieldController.getFields);
};

/**
 * @fn setupExport
 * @desc Initialize the export related routes
 */
OptimiseServer.prototype.setupExport = function () {
    // Import the controller
    this.routeExport = require('./routes/exportDataRoute');

    // Modules
    this.app.use('/export', this.routeExport);
};

/**
 * @fn setupLogs
 * @desc Initialize the logs related routes
 */
OptimiseServer.prototype.setupLogs = function () {
    // Import the controller
    this.routeLogs = require('./routes/actionRoute');

    // Modules
    this.app.use('/logs', this.routeLogs);
};

module.exports = OptimiseServer;