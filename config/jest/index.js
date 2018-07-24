/* eslint no-console: "off" */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const paths = require('../../config/paths');

module.exports = (rootDir) => {
    // Use this instead of `paths.testsSetup` to avoid putting
    // an absolute filename into configuration after ejecting.
    const setupTestsFile = fs.existsSync(paths.testsSetup)
        ? '<rootDir>/src/setupTests.js'
        : undefined;

    // TODO: I don't know if it's safe or not to just use / as path separator
    // in Jest configs. We need help from somebody with Windows to determine this.
    const config = {
        collectCoverageFrom: [
            "src/**/*.{js,jsx,mjs}"
        ],
        setupFiles: [
            "<rootDir>/config/polyfills.js",
            "<rootDir>/config/enzyme-adapter.js"
        ],
        setupTestFrameworkScriptFile: setupTestsFile,
        testMatch: [
            "**/__tests__/**/*.{js,jsx,mjs}",
            "**/?(*.)(spec|test).{js,jsx,mjs}"
        ],
        roots: [
            "<rootDir>/src"
        ],
        testEnvironment: "node",
        testURL: "http://localhost",
        transform: {
            "^.+\\.(js|jsx|mjs)$": "<rootDir>/config/jest/babelTransform.js",
            "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
            "^.+\\.(graphql)$": "<rootDir>/config/jest/graphqlTransform.js",
            "^(?!.*\\.(js|jsx|mjs|css|json|graphql)$)": "<rootDir>/config/jest/fileTransform.js"
        },
        transformIgnorePatterns: [
            "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$",
            "^.+\\.module\\.(css|sass|scss)$"
        ],
        moduleNameMapper: {
            "^react-native$": "react-native-web",
            "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
        },
        moduleFileExtensions: [
            "web.js",
            "js",
            "json",
            "web.jsx",
            "jsx",
            "node",
            "mjs"
        ]
    };
    if (rootDir) {
        config.rootDir = rootDir;
    }

    const overrides = Object.assign({}, require(paths.appPackageJson).jest);
    const supportedKeys = [
        'collectCoverageFrom',
        'coverageReporters',
        'coverageThreshold',
        'resetMocks',
        'resetModules',
        'snapshotSerializers',
        'watchPathIgnorePatterns',
    ];
    if (overrides) {
        supportedKeys.forEach(key => {
            if (overrides.hasOwnProperty(key)) {
                config[key] = overrides[key];
                delete overrides[key];
            }
        });
        const unsupportedKeys = Object.keys(overrides);
        if (unsupportedKeys.length) {
            const isOverridingSetupFile =
                unsupportedKeys.indexOf('setupTestFrameworkScriptFile') > -1;

            if (isOverridingSetupFile) {
                console.error(
                    chalk.red(
                        'We detected ' +
                        chalk.bold('setupTestFrameworkScriptFile') +
                        ' in your package.json.\n\n' +
                        'Remove it from Jest configuration, and put the initialization code in ' +
                        chalk.bold('src/setupTests.js') +
                        '.\nThis file will be loaded automatically.\n'
                    )
                );
            } else {
                console.error(
                    chalk.red(
                        '\nOut of the box, Optimise only supports overriding ' +
                        'these Jest options:\n\n' +
                        supportedKeys
                            .map(key => chalk.bold('  \u2022 ' + key))
                            .join('\n') +
                        '.\n\n' +
                        'These options in your package.json Jest configuration ' +
                        'are not currently supported by Optimise:\n\n' +
                        unsupportedKeys
                            .map(key => chalk.bold('  \u2022 ' + key))
                            .join('\n') +
                        '\n'
                    )
                );
            }

            process.exit(1);
        }
    }
    return config;
};