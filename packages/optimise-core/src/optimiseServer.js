//External node module imports
import express from 'express';
import expressSession from 'express-session';
import knexSessionConnect from 'connect-session-knex';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../docs/swagger.json';
import body_parser from 'body-parser';
import csrf from 'csurf';
import passport from 'passport';
import optimiseOptions from './core/options';
import dbcon from './utils/db-connection';
import { migrate } from '../src/utils/db-handler';
import ErrorHelper from './utils/error_helper';

const knexSession = knexSessionConnect(expressSession);

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
        this.requestMiddleware = require('./utils/requestMiddleware').default;
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

                // This is awaiting for #286
                // _this.app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

                // Setup sessions with third party middleware
                const knexSessionStore = new knexSession({
                    knex: dbcon(),
                    tablename: 'SESSIONS'
                })

                _this.app.use(expressSession({
                    secret: _this.config.sessionSecret,
                    saveUninitialized: false,
                    resave: false,
                    cookie: { secure: false },
                    store: knexSessionStore
                }));

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

                // Setup CSRF protecting middleware
                _this.app.use(csrf())

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
                _this.setupComorbidities();
                _this.setupFields();
                _this.setupData();
                _this.setupExport();
                _this.setupMeddraUpload();
                _this.setupInfo();
                _this.setupLogs();
                _this.setupPPII();
                _this.setupPatientDiagnosis();
                _this.setupMeddra();
                _this.setupICD11();
                _this.setupSync();

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
        return dbcon().destroy();
    }

    /**
     * @fn setupUsers
     * @desc Initialize the users related routes
     */
    setupUsers() {

        // Import the controller
        const UserController = require('./controllers/userController').default;

        //Passport session serialize and deserialize
        passport.serializeUser(UserController.serializeUser);
        passport.deserializeUser(UserController.deserializeUser);

        this.app.route('/whoami')
            .get(UserController.whoAmI); //GET current session user

        // Log the user in
        this.app.route('/users/login').post(UserController.loginUser);

        // Log the user out
        this.app.route('/users/logout').post(UserController.logoutUser);

        // Interacts with the user in the DB
        // (POST : create / DELETE : delete / PUT : modify)
        // Real path is /users
        this.app.route('/users')
            .get(UserController.getUser)
            .post(UserController.createUser)
            .put(UserController.updateUser)
            .patch(UserController.changeRights)
            .delete(UserController.deleteUser);
    }

    /**
     * @fn setupPatients
     * @desc Initialize the patients related routes
     */
    setupPatients() {
        // Import the controller
        this.routePatients = require('./routes/patientRoute').default;

        // Modules
        this.app.use('/patients', this.routePatients);
    }

    /**
     * @fn setupComorbidities
     * @desc Initialize the comorbidity related routes
     */
    setupComorbidities() {
        // Import the controller
        this.routeComorbidities = require('./routes/comorbidityRoute').default;

        // Modules
        this.app.use('/comorbidities', this.routeComorbidities);
    }

    /**
     * @fn setupVisits
     * @desc Initialize the visits related routes
     */
    setupVisits() {
        // Import the controller
        this.routeVisits = require('./routes/visitRoute').default;

        // Modules
        this.app.use('/visits', this.routeVisits);
    }

    /**
     * @fn setupDemographics
     * @desc Initialize the demographics related routes
     */
    setupDemographics() {
        // Import the controller
        this.routeDemographics = require('./routes/demographicRoute').default;

        // Modules
        this.app.use('/demographics', this.routeDemographics);
    }

    /**
     * @fn setupClinicalEvents
     * @desc Initialize the clinicalEvents related routes
     */
    setupClinicalEvents() {
        // Import the controller
        this.routeClinicalEvents = require('./routes/clinicalEventRoute').default;

        // Modules
        this.app.use('/clinicalEvents', this.routeClinicalEvents);
    }

    /**
     * @fn setupTreatments
     * @desc Initialize the treatments related routes
     */
    setupTreatments() {
        // Import the controller
        this.routeTreatments = require('./routes/treatmentRoute').default;

        // Modules
        this.app.use('/treatments', this.routeTreatments);
    }

    /**
     * @fn setupTests
     * @desc Initialize the tests related routes
     */
    setupTests() {
        // Import the controller
        this.routeTests = require('./routes/testRoute').default;

        // Modules
        this.app.use('/tests', this.routeTests);
    }

    /**
     * @fn setupFields
     * @desc Initialize the available fields related routes
     */
    setupFields() {
        //Import the controller
        this.routeFields = require('./routes/fieldsRoute').default;

        // Modules
        this.app.use('/available', this.routeFields);
    }

    /**
     * @fn setupData
     * @desc Initialize the data related routes
     */
    setupData() {
        // Import the controller
        const DataController = require('./controllers/dataController').default;
        const AvailableFieldController = require('./controllers/availableFieldController').default;

        // Modules
        this.app.route('/data/:dataType')
            .post(DataController._RouterAddOrUpdate)
            .delete(DataController._RouterDeleteData)
            .get(AvailableFieldController.getFields);
    }

    /**
     * @fn setupExport
     * @desc Initialize the export related routes
     */
    setupExport() {
        // Import the controller
        this.routeExport = require('./routes/exportDataRoute').default;

        // Modules
        this.app.use('/export', this.routeExport);
    }

    /**
     * @fn setupInfo
     * @desc Initialize the info related routes
     */
    setupInfo() {
        // Import the controller
        this.infoLogs = require('./routes/infoRoute').default;

        // Modules
        this.app.use('/info', this.infoLogs);
    }

    /**
     * @fn setupLogs
     * @desc Initialize the logs related routes
     */
    setupLogs() {
        // Import the controller
        this.routeLogs = require('./routes/actionRoute').default;

        // Modules
        this.app.use('/logs', this.routeLogs);
    }

    /**
     * @fn setupPPII
     * @desc Initialize the PPII related routes
     */
    setupPPII() {
        // Import the controller
        this.routePPII = require('./routes/patientPiiRoute').default;

        // Modules
        this.app.use('/patientPii', this.routePPII);
    }

    /*
    * @fn setupMeddraUpload
    * @desc Initialize the meddra upload related routes
    */
    setupMeddraUpload() {
        // Import the controller
        this.routeMeddraUpload = require('./routes/meddraRoute').default;

        // Modules
        this.app.use('/uploadMeddra', this.routeMeddraUpload);
    }

    /**
     * @function setupMeddra initialize the route for meddra
     */
    setupMeddra() {

        // initializing the meddra controller
        const MeddraController = require('./controllers/meddraController').default;

        this.app.route('/meddra')
            .get(MeddraController.getMeddraField);
    }

    setupICD11() {
        // initializing the meddra controller
        const ICD11Controller = require('./controllers/icd11Controller.js').default;

        this.app.route('/icd11')
            .get(ICD11Controller.getICD11Field);
    }

    /**
     * @fn setupPatientDiagnosis
     * @desc Initialize the Patient Diagnosis related routes
     */
    setupPatientDiagnosis() {
        // Import the controller
        this.routePatientDiagnosis = require('./routes/patientDiagnosisRoute').default;

        // Modules
        this.app.use('/patientDiagnosis', this.routePatientDiagnosis);
    }

    /**
     * @fn setupSync
     * @desc Initialize the synchronization related routes
     */
    setupSync() {
        // Import the controller
        this.routeSync = require('./routes/syncRoute').default;

        // Modules
        this.app.use('/sync', this.routeSync);
    }
}

export default OptimiseServer;