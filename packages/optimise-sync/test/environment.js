/*eslint no-console: "off"*/
import { erase, migrate } from '../src/utils/db-handler';
import seed from './seed';
const OptimiseSyncServer = require('../src/optimiseSyncServer').default;
const NodeEnvironment = require('jest-environment-node');

let optimiseSyncServer = null;
let optimiseSyncRouter = null;

class OptimiseNodeEnvironment extends NodeEnvironment {

    constructor(config, context) {
        super(config, context);
    }

    static async globalSetup() {
        process.env.NODE_ENV = 'test';
        optimiseSyncServer = new OptimiseSyncServer({});
        await erase();
        await seed(await migrate());
        optimiseSyncRouter = await optimiseSyncServer.start();
    }

    static async globalTeardown() {
        await optimiseSyncServer.stop();
    }

    async setup(__unused__jestConfig) {
        this.global.optimiseSyncRouter = optimiseSyncRouter;
    }

    async teardown(__unused__jestConfig) {
        return;
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = OptimiseNodeEnvironment;