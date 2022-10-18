import crypto from 'crypto';

/**
 * @fn Options
 * @param configuration JS configuration object
 * @desc Complete the configuration object with default values
 * @constructor
 */
const Options = function (configuration = {}) {
    //Get all the attributes
    const config = {};

    for (const attr in configuration)
        config[attr] = configuration[attr];

    config.port = configuration.port ? configuration.port : 3050;
    config.development = configuration.development ? configuration.development : false;
    config.mongo = configuration.mongo ? configuration.mongo : 'mongodb://mongodb0.example.com:27017/admin';
    config.sessionSecret = configuration.sessionSecret ? configuration.sessionSecret : crypto.randomBytes(48).toString('hex');

    return config;
};

export default Options;