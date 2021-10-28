module.exports = {
    plugins: [
        "@babel/plugin-syntax-jsx",
        ["@babel/plugin-proposal-decorators", {
            legacy: true,
            // decoratorsBeforeExport: true
        }]
    ]
}