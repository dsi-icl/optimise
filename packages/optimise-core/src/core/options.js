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

    config.optimiseDBLocation = configuration.optimiseDBLocation ? configuration.optimiseDBLocation : 'db/optimise-db.sqlite';
    config.optimiseUiFolder = configuration.optimiseUiFolder ? configuration.optimiseUiFolder : './node-modules/optimise-ui';
    config.port = configuration.port ? configuration.port : 3030;
    config.development = configuration.development ? configuration.development : false;
    config.enableCors = configuration.enableCors ? configuration.enableCors : true;
    config.exportGenerationFolder = configuration.exportGenerationFolder ? configuration.exportGenerationFolder : './temp/';
    config.sessionSecret = configuration.sessionSecret ? configuration.sessionSecret : crypto.randomBytes(48).toString('hex');
    config.remoteControlEndPoint = configuration.remoteControlEndPoint ? configuration.remoteControlEndPoint : 'ws://localhost:9000';

    return config;
};

export default Options;
