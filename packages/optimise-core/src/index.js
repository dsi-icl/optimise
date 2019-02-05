let express = require('express');
let os = require('os');
let config = require('../config/optimise.config');
let OptimiseServer = require('./optimiseServer');

let web_app = express();
let optimise_server = new OptimiseServer(config);

optimise_server.start().then((optimise_router) => {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use('/api', optimise_router);
    web_app.listen(config.port, (error) => {
        if (error) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
    return true;
}).catch((error) => {
    console.error(error); // eslint-disable-line no-console
    return false;
});
