let { merge: webpackMerge } = require('webpack-merge');
let commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map'
});
