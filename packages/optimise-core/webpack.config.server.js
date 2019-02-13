const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    entry: (process.env.NODE_ENV === 'development' ?
        {
            server: ['webpack/hot/poll?1000', './src/index']
        } : {
            core: ['./src/optimiseServer']
        }
    ),
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'node',
    externals: [nodeExternals({
        whitelist: process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : undefined
    })],
    module: {
        rules: [
            {
                test: /knex(\\|\/)lib(\\|\/)dialects(\\|\/)sqlite3(\\|\/)index\.js$/,
                use: {
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            { search: 'return require(\'sqlite3\')', replace: 'return require(\'optimise-sqlite\')' }
                        ],
                    },
                },
            },
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                loader: 'native-ext-loader',
                options: {
                    rewritePath: process.env.NODE_ENV === 'development' ? undefined : '.'
                }
            }
        ]
    },
    plugins: (process.env.NODE_ENV === 'development' ? [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat([
        new webpack.NormalModuleReplacementPlugin(/pg-connection-string/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/node-pre-gyp/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, `${__dirname}/src/utils/noop.js`),
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
        filename: 'server.js',
        libraryTarget: process.env.NODE_ENV === 'development' ? undefined : 'umd'
    },
    node: {
        // We are doing this because of a bug in SwaggerUI
        __filename: false,
        __dirname: true
    }
};