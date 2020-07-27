const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true
                }
            }
        ]
    ],
    plugins: [
        'require-context-hook',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-syntax-dynamic-import'
    ],
    babelrc: false,
    configFile: false
});