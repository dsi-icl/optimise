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
            core: ['./src/optimiseAssistServer']
        }
    ),
    target: 'node',
    externals: [
        //     nodeExternals({
        //     whitelist: process.env.NODE_ENV === 'development' ? ['webpack/hot/poll?1000'] : undefined
        // }),
        {
            'express': 'commonjs express',
            'mongodb': 'commonjs mongodb',
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
        library: process.env.NODE_ENV === 'development' ? undefined : 'optimise-remote-control',
        libraryTarget: process.env.NODE_ENV === 'development' ? undefined : 'umd',
        umdNamedDefine: process.env.NODE_ENV === 'development' ? undefined : true
    }
};