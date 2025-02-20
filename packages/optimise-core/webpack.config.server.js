const webpack = require('webpack');
const path = require('path');
// const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

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
    watch: process.env.NODE_ENV === 'development',
    target: 'node',
    externals: [
        //     nodeExternals({
        //     whitelist: process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : undefined
        // }),
        {
            'express': 'commonjs express',
            'sqlite3': 'commonjs sqlite3',
            'bufferutil': 'commonjs bufferutil',
            'utf-8-validate': 'commonjs utf-8-validate'
        }],
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        plugins: ['@babel/plugin-syntax-dynamic-import']
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: (process.env.NODE_ENV === 'development' ? [
        new RunScriptWebpackPlugin({
            name: 'server.js'
        }),
        new webpack.HotModuleReplacementPlugin()
    ] : []).concat([
        new webpack.NormalModuleReplacementPlugin(/pg-connection-string/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/node-pre-gyp/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/migrations\/migrate/, `${__dirname}/src/utils/noop.js`),
        new webpack.NormalModuleReplacementPlugin(/migrations\/seed/, `${__dirname}/src/utils/noop.js`),
        new webpack.IgnorePlugin({ resourceRegExp: new RegExp('^(.*mssql.*|.*mariasql|.*oracle.*|.*mysql.*|.*pg.*|.*postgres.*|.*redshift.*|.*better-sqlite3.*|.*cockroach.*|node-pre-gyp|tedious)$') }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                BUILD_TARGET: JSON.stringify('server')
            }
        })
    ]),
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'server.js',
        library: process.env.NODE_ENV === 'development' ? undefined : 'optimise-core',
        libraryTarget: process.env.NODE_ENV === 'development' ? undefined : 'umd',
        umdNamedDefine: process.env.NODE_ENV === 'development' ? undefined : true
    },
    stats: {
        errorDetails: true
    }
};