const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        renderer: './src/renderer.js'
    },

    resolve: {
        extensions: ['.js']
    },

    externals: {
        sqlite3: 'commonjs sqlite3'
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
        new HtmlWebpackPlugin({ template: '../optimise-ui/build/index.html', inject: 'head' }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    force: true,
                    context: '../optimise-ui/build',
                    from: '**',
                    to: '.',
                    transform(content, absoluteFrom) {
                        const contentString = Buffer.from(content).toString();
                        if (absoluteFrom.endsWith('.js'))
                            return contentString.replaceAll('/assets/', 'assets/');
                        return content;
                    },
                    globOptions: {
                        ignore: ['**/index.html']
                    }
                },
                {
                    force: true,
                    context: '../optimise-core/build',
                    from: '**',
                    to: '.'
                }
            ]
        })
    ],

    target: 'electron-renderer'
};
