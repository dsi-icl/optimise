const express = require('express');
const OptimiseServer = require('optimise-core');
const path = require('path');
const config = require('../config/optimise.config')

let root = express();
let optimise = new OptimiseServer(config);

optimise.start().then(function (router) {
    // linking optimise's router on /api
    root.use('/api', router);
    root.use(express.static('../build'));
    // Referencing any other requests to the /public/index.html 
    root.use('/*', function (req, res, next) {
        if (req.originalUrl === '/api')
            next();
        else
            res.sendFile(path.resolve('build/index.html'));
    });
    root.listen(config.port, function (error) {
        if (error != undefined || error != null) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
    });
}, function (error) {
    console.error(error);
});
