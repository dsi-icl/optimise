/*eslint no-console: "off"*/

const OptimiseServer = require('../src/optimiseServer');
const { erase, migrate } = require('../src/utils/db-handler');
const knex = require('../src/utils/db-connection');
const NodeEnvironment = require('jest-environment-node');

let optimiseServer = null;
let optimiseRouter = null;

class OptimiseNodeEnvironment extends NodeEnvironment {

    constructor(config) {
        super(config);
    }

    static globalSetup() {
        process.env.NODE_ENV = 'test';
        console.log('\n');
        return erase()
            .then(() => migrate('testing'))
            .then(() => {
                optimiseServer = new OptimiseServer({});
                return optimiseServer.start();
            }).then((optimise_router) => {
                optimiseRouter = optimise_router;
                return true;
            }).catch(err => {
                console.error(err);
            });
    }

    static globalTeardown() {
        optimiseServer.stop()
            .then(() => erase())
            .then(() => knex.destroy())
            .catch(err => {
                console.error(err);
            });
    }

    async setup() {
        super.setup();
        this.global.optimiseRouter = optimiseRouter;
    }

    async teardown() {
        super.teardown();
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = OptimiseNodeEnvironment;