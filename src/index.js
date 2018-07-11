let express = require('express');
let os = require('os');
let config = require('../config/optimise.config');
let OptimiseServer = require('./optimiseServer');

let web_app = express();
let optimise_server = new OptimiseServer(config);

optimise_server.start().then(function (optimise_router) {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use(optimise_router);
    web_app.listen(config.port, function (error) {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
}, function (error) {
    console.error(error); // eslint-disable-line no-console
});
