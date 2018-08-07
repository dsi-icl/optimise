const express = require('express');
const compression = require('compression');
const OptimiseServer = require('optimise-core');
const path = require('path');
const config = require('../config/optimise.config');

let root = express();
let optimise = new OptimiseServer(config);

optimise.start().then((router) => {

    // For production activating reponse compression
    root.use(compression());

    // Linking optimise's router on /api
    root.use('/api', router);

    // Binding static resources folder
    root.use(express.static(path.normalize(`${__dirname}/../build`)));

    // Referencing any other requests to the /public/index.html
    root.use('/', function (__unused__req, res) {
        res.sendFile(path.resolve('build/index.html'));
    });

    root.listen(config.port, function (error) {
        if (error !== undefined || error !== null) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
    });
}).catch((error) => {
    console.error(error);
});
