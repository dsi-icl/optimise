//External node module imports
import express from 'express';
import expressSession from 'express-session';
import knexSessionConnect from 'connect-session-knex';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import body_parser from 'body-parser';
import csrf from 'csurf';
import passport from 'passport';
import optimiseOptions from './core/options';
import dbcon from './utils/db-connection';
import { migrate } from '../src/utils/db-handler';
import ErrorHelper from './utils/error_helper';

import requestMiddleware from './utils/requestMiddleware';
import UserController from './controllers/userController';
import PatientRoute from './routes/patientRoute';
import ComorbidityRoute from './routes/comorbidityRoute';
import VisitRoute from './routes/visitRoute';
import DemographicRoute from './routes/demographicRoute';
import ClinicalEventRoute from './routes/clinicalEventRoute';
import TreatmentRoute from './routes/treatmentRoute';
import ConcomitantMedRoute from './routes/concomitantMedRoute';
import TestRoute from './routes/testRoute';
import FieldsRoute from './routes/fieldsRoute';
import DataController from './controllers/dataController';
import AvailableFieldController from './controllers/availableFieldController';
import ExportDataRoute from './routes/exportDataRoute';
import InfoRoute from './routes/infoRoute';
import ActionRoute from './routes/actionRoute';
import PatientPiiRoute from './routes/patientPiiRoute';
import MeddraRoute from './routes/meddraRoute';
import MeddraController from './controllers/meddraController';
import ICD11Controller from './controllers/icd11Controller';
import PatientDiagnosisRoute from './routes/patientDiagnosisRoute';
import SyncRoute from './routes/syncRoute';

const knexSession = knexSessionConnect(expressSession);
const csrfHandle = csrf();

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
        this.requestMiddleware = requestMiddleware;
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

                // Adding API documentation
                _this.app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

                // Setup sessions with third party middleware
                const knexSessionStore = new knexSession({
                    knex: dbcon(),
                    tablename: 'SESSIONS'
                });

                _this.app.use(expressSession({
                    secret: _this.config.sessionSecret,
                    saveUninitialized: false,
                    resave: false,
                    cookie: { secure: false },
                    store: knexSessionStore
                }));

                _this.app.use(passport.initialize());
                _this.app.use(passport.session());

                //Passport session serialize and deserialize
                passport.serializeUser(UserController.serializeUser);
                passport.deserializeUser(UserController.deserializeUser);

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

                // Setup public endpoints
                _this.setupNoCSRFPoints();
                _this.setupSync();

                // Setup CSRF protecting middleware
                _this.app.use(csrfHandle);
                _this.app.use((error, __unused__req, res, next) => {
                    if (!error)
                        next();
                    else {
                        if (error.code === 'EBADCSRFTOKEN') {
                            // Handle CSRF token errors here
                            res.status(403);
                            res.json(ErrorHelper('Form tempered with'));
                        } else {
                            next(error);
                        }
                    }
                });
                _this.app.use((req, __unused__res, next) => {
                    req.optimiseCSRFToken = req.csrfToken();
                    next();
                });

                // Setup remaining route using controllers
                _this.setupIDProbe();
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
                _this.setupConcomitantMeds();

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
        try {
            return dbcon().destroy();
        } catch (__unused__exception) {
            return Promise.resolve();
        }
    }

    /**
     * @fn setupNoCSRFPoints
     * @desc Initialize the routes accessible prior CSRF protection
     */
    setupNoCSRFPoints() {

        // Log the user in
        this.app.route('/users/login').post(UserController.loginUser(this.config.remoteControlEndPoint));

        // Log the user out
        this.app.route('/users/logout').post(UserController.logoutUser);

    }

    /**
     * @fn setupIDProbe
     * @desc Initialize the current ID routes
     */
    setupIDProbe() {

        //Passport session serialize and deserialize
        passport.serializeUser(UserController.serializeUser);
        passport.deserializeUser(UserController.deserializeUser);

        this.app.route('/whoami')
            .get(UserController.whoAmI(this.config.remoteControlEndPoint)); //GET current session user

    }

    /**
     * @fn setupUsers
     * @desc Initialize the users related routes
     */
    setupUsers() {

        // Interacts with the user in the DB
        // (POST : create / DELETE : delete / PUT : modify)
        // Real path is /users
        this.app.route('/users')
            .get(UserController.getUser)
            .post(UserController.createUser)
            .put(UserController.updateUser)
            .patch(UserController.changeRights(this.config.remoteControlEndPoint))
            .delete(UserController.deleteUser);
    }

    /**
     * @fn setupPatients
     * @desc Initialize the patients related routes
     */
    setupPatients() {
        this.app.use('/patients', PatientRoute);
    }

    /**
     * @fn setupComorbidities
     * @desc Initialize the comorbidity related routes
     */
    setupComorbidities() {
        this.app.use('/comorbidities', ComorbidityRoute);
    }

    /**
     * @fn setupComorbidities
     * @desc Initialize the comorbidity related routes
     */
    setupConcomitantMeds() {
        this.app.use('/concomitantMeds', ConcomitantMedRoute);
    }

    /**
     * @fn setupVisits
     * @desc Initialize the visits related routes
     */
    setupVisits() {
        this.app.use('/visits', VisitRoute);
    }

    /**
     * @fn setupDemographics
     * @desc Initialize the demographics related routes
     */
    setupDemographics() {
        this.app.use('/demographics', DemographicRoute);
    }

    /**
     * @fn setupClinicalEvents
     * @desc Initialize the clinicalEvents related routes
     */
    setupClinicalEvents() {
        this.app.use('/clinicalEvents', ClinicalEventRoute);
    }

    /**
     * @fn setupTreatments
     * @desc Initialize the treatments related routes
     */
    setupTreatments() {
        this.app.use('/treatments', TreatmentRoute);
    }

    /**
     * @fn setupTests
     * @desc Initialize the tests related routes
     */
    setupTests() {
        this.app.use('/tests', TestRoute);
    }

    /**
     * @fn setupFields
     * @desc Initialize the available fields related routes
     */
    setupFields() {
        this.app.use('/available', FieldsRoute);
    }

    /**
     * @fn setupData
     * @desc Initialize the data related routes
     */
    setupData() {
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
        this.app.use('/export', ExportDataRoute);
    }

    /**
     * @fn setupInfo
     * @desc Initialize the info related routes
     */
    setupInfo() {
        this.app.use('/info', InfoRoute);
    }

    /**
     * @fn setupLogs
     * @desc Initialize the logs related routes
     */
    setupLogs() {
        this.app.use('/logs', ActionRoute);
    }

    /**
     * @fn setupPPII
     * @desc Initialize the PPII related routes
     */
    setupPPII() {
        this.app.use('/patientPii', PatientPiiRoute);
    }

    /*
    * @fn setupMeddraUpload
    * @desc Initialize the meddra upload related routes
    */
    setupMeddraUpload() {
        this.app.use('/uploadMeddra', MeddraRoute);
    }

    /**
     * @function setupMeddra initialize the route for meddra
     */
    setupMeddra() {
        this.app.route('/meddra')
            .get(MeddraController.getMeddraField);
    }

    /**
     * @function setupICD11 initialize the route for ICD11
     */
    setupICD11() {
        this.app.route('/icd11')
            .get(ICD11Controller.getICD11Field);
    }

    /**
     * @fn setupPatientDiagnosis
     * @desc Initialize the Patient Diagnosis related routes
     */
    setupPatientDiagnosis() {
        this.app.use('/patientDiagnosis', PatientDiagnosisRoute);
    }

    /**
     * @fn setupSync
     * @desc Initialize the synchronization related routes
     */
    setupSync() {
        this.app.use('/sync', SyncRoute);
    }
}

export default OptimiseServer;
