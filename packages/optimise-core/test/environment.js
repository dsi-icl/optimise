/*eslint no-console: "off"*/
import { erase, migrate } from '../src/utils/db-handler';
import seed from './seed';
const OptimiseServer = require('../src/optimiseServer').default;
const NodeEnvironment = require('jest-environment-node');

let optimiseServer = null;
let optimiseRouter = null;

class OptimiseNodeEnvironment extends NodeEnvironment {

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

    async setup() {
        this.global.optimiseRouter = optimiseRouter;
    }

    async teardown() {
        return;
    }

    runScript(script) {
        return super.runScript(script);
    }
}

module.exports = OptimiseNodeEnvironment;