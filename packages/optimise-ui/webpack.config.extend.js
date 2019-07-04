// This files aims to enable the compilation of proposal decorators in legacy mode with CRA2
module.exports = (webpackConfig, __unused__env, { __unused__paths }) => {

    // CRA2 prevents usage of ESLint config file
    delete webpackConfig.module.rules[1].use[0].options.useEslintrc;

    // CRA2 does not add decorator proposal
    webpackConfig.module.rules[2].oneOf[1].options.plugins.unshift([
        require.resolve('@babel/plugin-proposal-decorators'),
        {
            legacy: true
        }
    ]);

    webpackConfig.module.rules[2].oneOf.splice(0, 0, {
        test: /\.md$/,
        use: require.resolve('markdown-image-loader'),
    });

    return webpackConfig;
};
