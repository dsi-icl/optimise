// const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const webpackMain = require('electron-webpack/webpack.main.config.js')
const { inspect } = require('util')

webpackMain().then(config => {
    // console.log(inspect(config, {
    //     showHidden: false,
    //     depth: null,
    //     colors: true
    // }))
})

module.exports = {
    // context: path.join(__dirname, '/../dist/main/static'),
    plugins: [
        new CopyWebpackPlugin([
            { context: '../optimise-core/build/', from: '*', to: './', force: true },
            // { context: '../optimise-ui/build', from: '**/*', to: './ui', force: true }
        ], {
                debug: 'info'
            }),
        // new webpack.NormalModuleReplacementPlugin(/pg-connection-string/, `${__dirname}/../../optimise-core/src/utils/noop.js`),
        // new webpack.NormalModuleReplacementPlugin(/node-pre-gyp/, `${__dirname}/../../optimise-core/src/utils/noop.js`),
        // new webpack.NormalModuleReplacementPlugin(/\.\.\/migrate/, `${__dirname}/../../optimise-core/src/utils/noop.js`),
        // new webpack.NormalModuleReplacementPlugin(/\.\.\/seed/, `${__dirname}/../../optimise-core/src/utils/noop.js`),
        // new webpack.IgnorePlugin(new RegExp('^(mssql.*|mariasql|.*oracle.*|mysql.*|pg.*|node-pre-gyp|tedious)$')),
    ]
}