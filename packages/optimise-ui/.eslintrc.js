module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    extends: ['react-app'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
            modules: true,
            legacyDecorators: true
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
        'array-bracket-spacing': ['error', 'never'],
        'space-infix-ops': 'error',
        'space-in-parens': 'error',
        'space-unary-ops': 'error',
        'no-trailing-spaces': 'warn',
        'no-irregular-whitespace': 'error',
        'no-multiple-empty-lines': ['error', { "max": 2, "maxBOF": 0 }],
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
        'arrow-body-style': ['error', 'as-needed'],
        'no-case-declarations': 'warn',
        'no-eq-null': 'error',
        'key-spacing': ["error", { "beforeColon": false, "afterColon": true }]
    }
};