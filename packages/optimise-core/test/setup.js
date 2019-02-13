const OptimiseNodeEnvironment = require('./environment');

module.exports = async (jestConfig) => await OptimiseNodeEnvironment.globalSetup(jestConfig);