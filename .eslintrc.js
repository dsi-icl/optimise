module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['react-app'],
    env: {
        browser: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true
        }
    },
    rules: {
        quotes: ['error', 'single'],
        eqeqeq: ['error', 'always'],
        indent: ['warn', 4],
        'block-spacing': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'prefer-template': ['warn'],
        'no-var': ['error'],
        'arrow-body-style': ['error', 'as-needed']
    }
};