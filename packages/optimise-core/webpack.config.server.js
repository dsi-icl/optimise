const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    entry: (process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : [])[
        './src/index'
    ],
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'node',
    externals: [nodeExternals({
        whitelist: process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : undefined
    })],
    module: {
        rules: [
            {
                test: /sqlite3(\\|\/)lib(\\|\/)sqlite3\.js$/,
                use: {
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            { search: 'var binding_path = binary.find(path.resolve(path.join(__dirname,\'../package.json\')));', replace: '' },
                            { search: 'require(binding_path);', replace: 'require(\'node_sqlite3.node\')' },
                        ],
                    },
                },
            },
            {
                test: /\.js?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: 'node-loader'
            }
        ]
    },
    plugins: (process.env.NODE_ENV === 'development' ? [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat([
        new webpack.NormalModuleReplacementPlugin(/node_sqlite3\.node/, `${__dirname}/../../node_modules/optimise-sqlite/binaries/sqlite3-win32/node-v67-win32-x64/node_sqlite3.node`),
        new webpack.NormalModuleReplacementPlugin(/pg-connection-string/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/node-pre-gyp/, `${__dirname}/src/utils/noop.js`),
        // new webpack.NormalModuleReplacementPlugin(/sqlite3[\\\\/]lib[\\\\/]binding/, `${__dirname}/node_modules/optimise-sqlite/binaries/toto.js`),
        // new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, `${__dirname}/src/utils/noop.js`),
        // new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, `${__dirname}/src/utils/noop.js`),
        new webpack.IgnorePlugin(new RegExp('^(mssql.*|mariasql|.*oracle.*|mysql.*|pg.*|node-pre-gyp|tedious)$')),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'BUILD_TARGET': JSON.stringify('server')
            }
        }),
    ]),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'server.js'
    },
    node: {
        __filename: false,
        __dirname: true
    }
};