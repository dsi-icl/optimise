/* eslint no-console: "off" */
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    console.error(err.stack);
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const chalk = require('chalk');

// Publish if on CI or in coverage mode
if (!process.env.CI) {
    console.error(
        chalk.red('It does not appear this is a continuous integration environment.\n' +
            'Optimise is automatically published upon successful integration.\n')
    );
    process.exit(1);
}

// Verify we are not already in the middle of a publish
let lastArg = '';
if (process.env.npm_config_argv)
    lastArg = JSON.parse(process.env.npm_config_argv).original.pop();
const bypass = '--optimise-bypass';

if (lastArg === bypass)
    process.exit(0);

const fs = require('fs');
const spawn = require('react-dev-utils/crossSpawn');
const semver = require('semver');
const paths = require('../config/paths');

const packageInfo = require(paths.appPackageJson);
let result = spawn.sync('yarn', ['info', packageInfo.name, '--json']);

if (result.signal) {
    console.error(
        chalk.red('There was an error retreiving remote package information.\n')
    );
    process.exit(1);
}

const yarnLatestVersion = JSON.parse(result.stdout.toString()).data.version;

// Compare the version of current package and the remote
if (semver.gt(packageInfo.version, yarnLatestVersion) === true) {

    console.log(chalk.cyan(`This is a newer version of ${packageInfo.name} (v${packageInfo.version})`));

    // Check the environment for NPM authentication token
    if (!process.env.NPM_TOKEN) {
        console.error(
            chalk.red('Your environment variable NPM_TOKEN is missing.\n'),
        );
        process.exit(1);
    }

    // Compare the version of current package and the remote
    try {
        fs.writeFileSync(`${process.env.HOME}/.npmrc`, `//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`, function (err) {
            if (err) {
                throw err;
            }
        });
    } catch (err) {
        console.error(
            chalk.red('We could not initialize your ~/.npmrc file. See below.\n\n'),
            err
        );
        process.exit(1);
    }

    // Launching the actual publication
    result = spawn.sync('npm', ['publish', bypass]);
    if (result.signal || result.status) {
        console.error(
            chalk.red('There was an error publishing your package.\n'),
            result.stderr.toString()
        );
        process.exit(result.status);
    }
} else {
    console.log(`Repository package has already reach v${packageInfo.version}.`);
}
process.exit(0);
