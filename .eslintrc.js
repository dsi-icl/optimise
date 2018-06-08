module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['react-app'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true
        }
    },
    rules: {
        quotes: ['error', 'single'],
        eqeqeq: ['error', 'always'],
        indent: ['error', 4]
    }
};