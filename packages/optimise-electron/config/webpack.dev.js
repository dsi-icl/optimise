var { merge: webpackMerge } = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
});
