import express from 'express';
import os from 'os';
import config from '../config/optimise.config';
import OptimiseSyncServer from './optimiseSyncServer';

let web_app = express();
let optimise_sync_server = new OptimiseSyncServer(config);

optimise_sync_server.start().then((optimise_sync_router) => {
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    web_app.use('/api', optimise_sync_router);
    web_app.listen(config.port, (error) => {
        if (error) {
            console.error('An error occurred while starting the HTTP server.', error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
    return true;
}).catch((error) => {
    console.error('An error occurred while starting the Optimise sync.', error); // eslint-disable-line no-console
    console.error(error.stack); // eslint-disable-line no-console
    return false;
});
