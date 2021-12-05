const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
    presets: [
        [
            '@babel/env',
            {
                targets: {
                    node: 'current'
                }
            }
        ]
    ],
    plugins: [
        'require-context-hook'
    ],
    babelrc: false,
    configFile: false
});