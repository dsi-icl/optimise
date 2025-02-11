const express = require('express');
const { default: rateLimit } = require('express-rate-limit');
const compression = require('compression');
const OptimiseServer = require('./server').default;
const path = require('path');
const fs = require('fs');

const root = express();
const optimise = new OptimiseServer();

optimise.start().then(router => {

    console.log(fs.readdirSync(`${__dirname}/static`));

    // For production activating reponse compression
    root.use(compression());

    // Plug rate limitation
    root.use(rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 500
    }));

    // Linking optimise's router on /api
    root.use('/api', router);

    // Binding static resources folder
    root.use('/', express.static(path.normalize(`${__dirname}/static`), {
        redirect: false,
        fallthrough: true
    }));

    // Referencing any other requests to the /public/index.html
    root.use('*', (__unused__req, res) => {
        res.sendFile(path.resolve('static/index.html'));
    });

    root.listen(3030, error => {
        if (error !== undefined && error !== null) {
            console.error(error); // eslint-disable-line no-console
            return;
        }
    });

    return;
}).catch((err) => {
    console.error(err);
});