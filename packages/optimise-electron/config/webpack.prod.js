let { merge: webpackMerge } = require('webpack-merge');
let commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',
});