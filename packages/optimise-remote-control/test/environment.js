/* eslint no-console: "off" */
import { erase, migrate } from '../src/utils/db-handler';
import seed from './seed';
const OptimiseSyncServer = require('../src/optimiseAssistServer').default;
const NodeEnvironment = require('jest-environment-node').default;

let optimiseSyncServer = null;
let optimiseSyncRouter = null;

class OptimiseNodeEnvironment extends NodeEnvironment {
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

    async setup() {
        this.global.optimiseSyncRouter = optimiseSyncRouter;
    }

    async teardown() {
        return;
    }
}

module.exports = OptimiseNodeEnvironment;
