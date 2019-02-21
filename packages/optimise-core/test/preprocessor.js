const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'entry',
                targets: {
                    esmodules: true
                }
            }
        ]
    ],
    plugins: [
        'require-context-hook',
        '@babel/plugin-syntax-dynamic-import'
    ],
    babelrc: false,
    configFile: false
});