/**
 * @fn Options
 * @param configuration JS configuration object
 * @desc Complete the configuration object with default values
 * @constructor
 */
let Options = function (configuration = {}) {
    //Get all the attributes
    let config = {};

    for (let attr in configuration)
        config[attr] = configuration[attr];

    config.optimiseDBLocation = configuration.optimiseDBLocation ? configuration.optimiseDBLocation : 'db/optimise-db.sqlite';
    config.optimiseUiFolder = configuration.optimiseUiFolder ? configuration.optimiseUiFolder : './node-modules/optimise-ui';
    config.port = configuration.port ? configuration.port : 3030;
    config.development = configuration.development ? configuration.development : false;
    config.enableCors = configuration.enableCors ? configuration.enableCors : true;
    config.exportGenerationFolder = configuration.exportGenerationFolder ? configuration.exportGenerationFolder : './temp/';

    return config;
};

export default Options;