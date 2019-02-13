//External node module imports
const express = require('express');
const expressSession = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
const body_parser = require('body-parser');
const passport = require('passport');

const optimiseOptions = require('./core/options');
import dbcon from './utils/db-connection';
import { migrate } from '../src/utils/db-handler';
const ErrorHelper = require('./utils/error_helper');

class OptimiseServer {
    constructor(config) {
        this.config = new optimiseOptions(config);
        this.app = express();

        // Define config in global scope (needed for server extensions)
        global.config = this.config;

        // Configure EXPRESS.JS router
        // Remove unwanted express headers
        this.app.set('x-powered-by', false);
        // Allow CORS requests when enabled
        if (this.config.enableCors === true) {
            this.app.use((__unused__req, res, next) => {
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
    start() {
        let _this = this;
        return new Promise((resolve, reject) => {

            // Operate database migration if necessary
            migrate().then(() => {

                _this.app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

                // Setup sessions with third party middleware
                _this.app.use(expressSession({
                    secret: 'optimise',
                    saveUninitialized: false,
                    resave: false,
                    cookie: { secure: false },
                    store: _this.mongoStore
                })
                );

                _this.app.use(passport.initialize());
                _this.app.use(passport.session());

                // Keeping a pointer to the original mounting point of the server
                _this.app.use((req, __unused__res, next) => {
                    req.optimiseRootUrl = req.baseUrl;
                    next();
                });

                // Init third party middleware for parsing HTTP requests body
                _this.app.use(body_parser.urlencoded({
                    extended: true
                }));
                _this.app.use(body_parser.json());

                // Adding session checks and monitoring
                _this.app.use('/', _this.requestMiddleware.addActionToCollection);
                _this.app.use('/', _this.requestMiddleware.verifySessionAndPrivilege);

                // Setup remaining route using controllers
                _this.setupUsers();
                _this.setupPatients();
                _this.setupVisits();
                _this.setupDemographics();
                _this.setupClinicalEvents();
                _this.setupTreatments();
                _this.setupTests();
                _this.setupFields();
                _this.setupData();
                _this.setupExport();
                _this.setupLogs();
                _this.setupPPII();
                _this.setupPatientDiagnosis();
                _this.setupMeddra();

                _this.app.all('/*', (__unused__req, res) => {
                    res.status(400);
                    res.json(ErrorHelper('Bad request'));
                });

                // Return the Express application
                return resolve(_this.app);

            }).catch(err => reject(err));
        });
    }

    /**
     * @fn stop
     * @desc Stops the optimise server service. After a call to stop, all references on the
     * express router MUST be released and this service endpoints are expected to fail.
     * @return {Promise} Resolve to true on success, ErrorStack otherwise
     */
    stop() {
        return dbcon.destroy();
    }

    /**
     * @fn setupUsers
     * @desc Initialize the users related routes
     */
    setupUsers() {

        // Import the controller
        const UserController = require('./controllers/userController');
        this.userCtrl = new UserController();

        //Passport session serialize and deserialize
        passport.serializeUser(this.userCtrl.serializeUser);
        passport.deserializeUser(this.userCtrl.deserializeUser);

        this.app.route('/whoami')
            .get(this.userCtrl.whoAmI); //GET current session user

        // Log the user in
        this.app.route('/users/login').post(this.userCtrl.loginUser);

        // Log the user out
        this.app.route('/users/logout').post(this.userCtrl.logoutUser);

        // Interacts with the user in the DB
        // (POST : create / DELETE : delete / PUT : modify)
        // Real path is /users
        this.app.route('/users')
            .get(this.userCtrl.getUser)
            .post(this.userCtrl.createUser)
            .put(this.userCtrl.updateUser)
            .patch(this.userCtrl.changeRights)
            .delete(this.userCtrl.deleteUser);
    }

    /**
     * @fn setupPatients
     * @desc Initialize the patients related routes
     */
    setupPatients() {
        // Import the controller
        this.routePatients = require('./routes/patientRoute');

        // Modules
        this.app.use('/patients', this.routePatients);
    }

    /**
     * @fn setupVisits
     * @desc Initialize the visits related routes
     */
    setupVisits() {
        // Import the controller
        this.routeVisits = require('./routes/visitRoute');

        // Modules
        this.app.use('/visits', this.routeVisits);
    }

    /**
     * @fn setupDemographics
     * @desc Initialize the demographics related routes
     */
    setupDemographics() {
        // Import the controller
        this.routeDemographics = require('./routes/demographicRoute');

        // Modules
        this.app.use('/demographics', this.routeDemographics);
    }

    /**
     * @fn setupClinicalEvents
     * @desc Initialize the clinicalEvents related routes
     */
    setupClinicalEvents() {
        // Import the controller
        this.routeClinicalEvents = require('./routes/clinicalEventRoute');

        // Modules
        this.app.use('/clinicalEvents', this.routeClinicalEvents);
    }

    /**
     * @fn setupTreatments
     * @desc Initialize the treatments related routes
     */
    setupTreatments() {
        // Import the controller
        this.routeTreatments = require('./routes/treatmentRoute');

        // Modules
        this.app.use('/treatments', this.routeTreatments);
    }

    /**
     * @fn setupTests
     * @desc Initialize the tests related routes
     */
    setupTests() {
        // Import the controller
        this.routeTests = require('./routes/testRoute');

        // Modules
        this.app.use('/tests', this.routeTests);
    }

    /**
     * @fn setupFields
     * @desc Initialize the available fields related routes
     */setupFields() {
        //Import the controller
        this.routeFields = require('./routes/fieldsRoute');

        // Modules
        this.app.use('/available', this.routeFields);
    }

    /**
     * @fn setupData
     * @desc Initialize the data related routes
     */
    setupData() {
        // Import the controller
        const DataController = require('./controllers/dataController');
        const AvailableFieldController = require('./controllers/availableFieldController');

        this.dataCtrl = new DataController();
        this.availableFieldCtrl = new AvailableFieldController();

        // Modules
        this.app.route('/data/:dataType')
            .post(this.dataCtrl._RouterAddOrUpdate)
            .delete(this.dataCtrl._RouterDeleteData)
            .get(this.availableFieldCtrl.getFields);
    }

    /**
     * @fn setupExport
     * @desc Initialize the export related routes
     */
    setupExport() {
        // Import the controller
        this.routeExport = require('./routes/exportDataRoute');

        // Modules
        this.app.use('/export', this.routeExport);
    }

    /**
     * @fn setupLogs
     * @desc Initialize the logs related routes
     */
    setupLogs() {
        // Import the controller
        this.routeLogs = require('./routes/actionRoute');

        // Modules
        this.app.use('/logs', this.routeLogs);
    }

    /**
     * @fn setupPPII
     * @desc Initialize the PPII related routes
     */
    setupPPII() {
        // Import the controller
        this.routePPII = require('./routes/patientPiiRoute');

        // Modules
        this.app.use('/patientPii', this.routePPII);
    }

    /**
     * @function setupMeddra initialize the route for meddra
     */
    setupMeddra() {

        // initializing the meddra controller
        const MeddraController = require('./controllers/meddraController');

        this.meddraCtrl = new MeddraController();

        this.app.route('/meddra')
            .get(this.meddraCtrl.getMeddraField);
    }

    /**
     * @fn setupPatientDiagnosis
     * @desc Initialize the Patient Diagnosis related routes
     */
    setupPatientDiagnosis() {
        // Import the controller
        this.routePatientDiagnosis = require('./routes/patientDiagnosisRoute');

        // Modules
        this.app.use('/patientDiagnosis', this.routePatientDiagnosis);
    }
}

export default OptimiseServer;