module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['react-app'],
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true
        }
    },
    rules: {
        'eqeqeq': 'error',
        'no-var': 'error',
        'no-alert': 'error',
        'no-console': 'warn',
        'indent': [
            'warn',
            4,
            {
                'SwitchCase': 1
            }
        ],
        'quotes': [
            'warn',
            'single'
        ],
        'semi': [
            'warn',
            'always'
        ],
        'strict': [
            'warn',
            'global'
        ],
        'space-infix-ops': 'error',
        'space-in-parens': 'error',
        'space-unary-ops': 'error',
        'no-trailing-spaces': 'warn',
        'no-irregular-whitespace': 'error',
        'no-unused-vars': [
            'warn',
            {
                'vars': 'all',
                'args': 'all',
                'argsIgnorePattern': '^__unused__'
            }
        ]
    }
};