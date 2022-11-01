const jsonRules = {
    indent: [
        'error',
        4,
        {
            SwitchCase: 1,
            ignoredNodes: ['VariableDeclaration[declarations.length=0]']
        }
    ]
};

const javascriptRules = {
    ...jsonRules,
    '@nrwl/nx/enforce-module-boundaries': [
        'error',
        {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
                {
                    sourceTag: '*',
                    onlyDependOnLibsWithTags: ['*']
                }
            ]
        }
    ],
    'react/style-prop-object': 'off',
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'no-extra-semi': 'error',
    'no-unused-vars': ['warn', { args: 'after-used', varsIgnorePattern: '^__unused' }],
    'semi': ['error', 'always'],
    'no-prototype-builtins': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used', varsIgnorePattern: '^__unused' }]
};

// const typescriptRules = {
//     ...javascriptRules,
//     'no-unused-vars': 'off',
//     '@typescript-eslint/no-unused-vars': ['error', { args: 'after-used', varsIgnorePattern: '^__unused' }]
// };

module.exports = {
    root: true,
    parserOptions: {
        tsconfigRootDir: __dirname
    },
    ignorePatterns: ['**/*', '!**/*.json', '!**/*.js', '!**/*.ts', '!scripts', '!tools', '!.vscode'],
    plugins: ['@nrwl/nx', 'json'],
    overrides: [
        // {
        //     files: ['*.ts', '*.tsx'],
        //     extends: ['plugin:@nrwl/nx/typescript'],
        //     rules: typescriptRules
        // },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nrwl/nx/javascript'],
            rules: javascriptRules
        },
        {
            files: ['*.json'],
            extends: ['plugin:json/recommended'],
            rules: jsonRules
        }
    ]
};
