/*eslint no-console: "off"*/
const OptimiseServer = require('../src/optimiseServer').default;
import { erase, migrate } from '../src/utils/db-handler';
import seed from './seed';
const NodeEnvironment = require('jest-environment-node');

let optimiseServer = null;
let optimiseRouter = null;

class OptimiseNodeEnvironment extends NodeEnvironment {

    constructor(config, context) {
        super(config, context);
    }

    static async globalSetup() {
        process.env.NODE_ENV = 'test';
        optimiseServer = new OptimiseServer({});
        await erase();
        await seed(await migrate());
        optimiseRouter = await optimiseServer.start();
    }

    static async globalTeardown() {
        await optimiseServer.stop();
    }

    async setup(__unused__jestConfig) {
        this.global.optimiseRouter = optimiseRouter;
    }

    async teardown(__unused__jestConfig) {
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = OptimiseNodeEnvironment;