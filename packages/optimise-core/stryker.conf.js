module.exports = function (config) {
    config.set({
        mutator: 'javascript',
        packageManager: 'yarn',
        reporters: ['html', 'clear-text', 'progress', 'dashboard'],
        testRunner: 'jest',
        coverageAnalysis: 'off',
        maxConcurrentTestRunners: 4,
        timeoutMS: 30000,
        jest: {
            enableFindRelatedTests: false
        }
    });
};
