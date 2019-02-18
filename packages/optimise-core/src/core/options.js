/**
 * @fn Options
 * @param configuration JS configuration object
 * @desc Complete the configuration object with default values
 * @constructor
 */
let Options = function (configuration = {}) {
    //Get all the attributes
    for (let attr in configuration)
        this[attr] = configuration[attr];

    this.optimiseDBLocation = configuration.optimiseDBLocation ? configuration.optimiseDBLocation : 'db/optimise-db.sqlite';
    this.optimiseUiFolder = configuration.optimiseUiFolder ? configuration.optimiseUiFolder : './node-modules/optimise-ui';
    this.port = configuration.port ? configuration.port : 3030;
    this.development = configuration.development ? configuration.development : false;
    this.enableCors = configuration.enableCors ? configuration.enableCors : true;
    this.exportGenerationFolder = configuration.exportGenerationFolder ? configuration.exportGenerationFolder : './temp/';
};

export default Options;