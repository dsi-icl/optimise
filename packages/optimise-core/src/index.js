import http from 'http';
import express from 'express';
import os from 'os';
import config from '../config/optimise.config';
import OptimiseServer from './optimiseServer';

let web_app;
let web_server;
let optimise_server = new OptimiseServer(config);

const setup = () => {
    web_app = express();
    // Remove unwanted express headers
    web_app.set('x-powered-by', false);
    return web_app;
};

optimise_server.start().then((optimise_router) => {

    web_app = setup();
    web_app.use('/api', optimise_router);
    web_server = http.createServer(web_app);
    web_server.listen(config.port, (error) => {
        if (error) {
            console.error('An error occurred while starting the HTTP server.', error); // eslint-disable-line no-console
            return;
        }
        console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    });
    return true;
}).catch((error) => {
    console.error('An error occurred while starting the Optimise core.', error); // eslint-disable-line no-console
    console.error(error.stack); // eslint-disable-line no-console
    return false;
});

if (module.hot) {
    module.hot.accept('./optimiseServer', () => {
        if (web_app !== undefined)
            web_server.removeListener('request', web_app);
        optimise_server = new OptimiseServer(config);
        optimise_server.start().then((optimise_router) => {
            web_app = setup();
            web_app.use('/api', optimise_router);
            web_server.on('request', web_app);
            return true;
        }).catch((error) => {
            console.error('An error occurred while reloading the Optimise core.', error); // eslint-disable-line no-console
            console.error(error.stack); // eslint-disable-line no-console
            return false;
        });
    });
}
