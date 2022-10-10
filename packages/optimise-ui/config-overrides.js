module.exports = function override(webpackConfig) {

    // CRA2 does not add decorator proposal
    webpackConfig.module.rules[2].oneOf[1].options.plugins.unshift([
        require.resolve('@babel/plugin-proposal-decorators'),
        {
            legacy: true
        }
    ]);

    webpackConfig.module.rules[2].oneOf.splice(0, 0, {
        test: /\.md$/,
        use: require.resolve('markdown-image-loader')
    });

    return webpackConfig;
};