/*eslint no-console: "off"*/
const OptimiseSyncServer = require('../src/optimiseSyncServer').default;
import { erase, migrate } from '../src/utils/db-handler';
import seed from './seed';
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

    async setup(jestConfig) {
        super.setup(jestConfig);
        this.global.optimiseSyncRouter = optimiseSyncRouter;
    }

    async teardown(jestConfig) {
        super.teardown(jestConfig);
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = OptimiseNodeEnvironment;