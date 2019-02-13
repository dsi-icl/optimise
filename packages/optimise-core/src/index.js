let express = require('express');
let os = require('os');
let config = require('../config/optimise.config');
import OptimiseServer from './optimiseServer';

let web_app = express();
let optimise_server = new OptimiseServer(config);

optimise_server.start().then((optimise_router) => {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use('/api', optimise_router);
    web_app.listen(config.port, (error) => {
        if (error) {
            console.error('An error occurred while starting the HTTP server.', error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
    return true;
}).catch((error) => {
    console.error('An error occurred while starting the Optimise core.', error); // eslint-disable-line no-console
    return false;
});
