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
        if (process.env.NODE_ENV !== 'production') console.log('\n');
        return new Promise(function (resolve, reject) {
            erase().then(() => migrate('testing').then(() => resolve(true)).catch(err => reject(err))).catch(err => reject(err));
        }).then(() => {
            optimiseServer = new OptimiseServer({});
            return optimiseServer.start();
        }).then((optimise_router) => {
            optimiseRouter = optimise_router;
            return true;
        });
    }

    static globalTeardown() {
        optimiseServer.stop().then(() =>
            Promise(function (resolve, reject) {
                erase().then(() => knex.destroy().then(() => resolve(true))).catch(err => reject(err));
            })
        );
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