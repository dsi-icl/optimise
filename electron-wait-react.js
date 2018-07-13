/* eslint no-console: "off" */
const net = require('net');
const optimiseConfig = require('./config/optimise.config');

process.env.ELECTRON_START_URL = `http://localhost:${optimiseConfig.port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({ port: optimiseConfig.port }, () => {
    client.end();
    if (!startedElectron) {
        console.log('Starting electron ...');
        startedElectron = true;
        const exec = require('child_process').exec;
        exec('npm run electron');
    }
}
);

tryConnection();

client.on('error', () => {
    setTimeout(tryConnection, 1000);
});