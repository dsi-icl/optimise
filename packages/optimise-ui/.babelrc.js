module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                loose: true
                // targets: {
                //     esmodules: true
                // }
            }
        ],
        [
            '@babel/preset-react'
        ]
    ],
    plugins: [
        '@babel/plugin-syntax-jsx',
        ['@babel/plugin-proposal-decorators', {
            legacy: true
            // decoratorsBeforeExport: true
        }],
        ['@babel/plugin-transform-private-property-in-object', {
            loose: true
        }],
        ['@babel/plugin-transform-private-methods', {
            loose: true
        }]
    ]
};
