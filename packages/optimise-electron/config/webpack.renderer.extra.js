// const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const reactWebpack = require('react-scripts-rewired/config/webpack.config.js');


// const {
//   createCompiler
// } = require('react-dev-utils/WebpackDevServerUtils');



// const webpackMain = require('electron-webpack/webpack.renderer.config.js')
// const { inspect } = require('util')

// webpackMain().then(config => {
//     console.log(inspect(config, {
//         showHidden: false,
//         depth: null,
//         colors: true
//     }))
// })
// process.env.BABEL_ENV = 'development';
// process.env.NODE_ENV = 'development';

// let config = reactWebpack(process.env.NODE_ENV);
// config.context = path.join(__dirname, '../../optimise-ui/src')

module.exports = config;
//{
    // context: path.join(__dirname, '/../dist/main/static'),
    // plugins: [
    //     new CopyWebpackPlugin([
    //         { context: '../optimise-ui/build', from: '**/*', to: './ui', force: true }
    //     ], {
    //             debug: 'info'
    //         })
    // ]
//}