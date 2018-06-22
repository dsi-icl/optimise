module.exports = {
    root: true,
    parser: 'babel-eslint',
    extends: ['eslint:recommended'],
    env: {
        browser: false,
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
                'SwitchCase': 4
            }
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
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
        ],
        'block-spacing': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'prefer-template': 'warn',
        'no-var': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'no-case-declarations': 'warn',
        'no-eq-null': 'error'
    }
};