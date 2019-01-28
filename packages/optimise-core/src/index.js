import http from 'http';
import app from './server';

const server = http.createServer(app);
let currentApp = app;
server.listen(3030);

if (module.hot) {
    module.hot.accept('./server', () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app;
    });
}

/*
let http = require('http');
let os = require('os');
let config = require('../config/optimise.config');
let OptimiseServer = require('./optimiseServer');

let optimise_server = new OptimiseServer(config);
let server = null;
let currentApp = null;

optimise_server.start().then((optimise_router) => {

    server = http.createServer(optimise_router);
    currentApp = optimise_router;
    server.listen(3000);
    console.log(`Listening at http://${os.hostname()}:${config.port}/`); // eslint-disable-line no-console
    return true;
}).catch((error) => {
    console.error(error); // eslint-disable-line no-console
    return false;
});

if (module.hot) {
    module.hot.accept('./optimiseServer', () => {
        optimise_server.start().then((optimise_router) => {
            server.removeListener('request', currentApp);
            server.on('request', optimise_router);
            currentApp = optimise_router;
            return true;
        }).catch((error) => {
            console.error(error); // eslint-disable-line no-console
            return false;
        });
    });
}
*/