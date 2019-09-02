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

    config.port = configuration.port ? configuration.port : 3050;
    config.development = configuration.development ? configuration.development : false;
    config.mongo = configuration.mongo ? configuration.mongo : 'mongodb://mongodb0.example.com:27017/admin';

    return config;
};

export default Options;