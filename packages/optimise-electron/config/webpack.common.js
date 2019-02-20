var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'renderer': './src/renderer.js'
    },

    resolve: {
        extensions: ['.js']
    },

    externals: {
        sqlite3: 'commonjs sqlite3',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /\.spec\.js$/,
                use: 'babel-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({ template: '../optimise-ui/build/index.html' }),
        new CopyWebpackPlugin([
            { force: true, context: '../optimise-ui/build', from: '**', to: '.', ignore: '*html' },
            { force: true, context: '../optimise-core/build', from: '**', to: '.' },
        ])
    ],

    target: 'electron-renderer'
};
