import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import babelParser from '@babel/eslint-parser';
import babelPlugin from '@babel/eslint-plugin';
import pluginReact from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import testingLibrary from 'eslint-plugin-testing-library';
import stylistic from '@stylistic/eslint-plugin';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import nxPlugin from '@nx/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        name: 'Ignored files',
        ignores: ['**/node_modules',
            '**/dist',
            '**/coverage',
            '**/build',
            '**/public',
            '**/tmp',
            '**/temp',
            '**/logs',
            '**/.cache',
            '**/.nx',
            '**/.next',
            '**/.nuxt',
            '**/.vercel',
            '**/.output'
        ]
    },
    {
        name: 'Setup Babel',
        files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        plugins: { '@babel': babelPlugin },
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    babelrc: false,
                    configFile: false,
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-syntax-jsx',
                        ['@babel/plugin-proposal-decorators', {
                            legacy: true
                            // decoratorsBeforeExport: true
                        }],
                        ['@babel/plugin-transform-private-property-in-object', {
                            loose: true
                        }],
                        ['@babel/plugin-transform-private-methods', {
                            loose: true
                        }]
                    ]
                }
            }
        }
    },
    {
        name: 'Setup ESTS',
        files: ['**/ts,mts,cts,tsx}'],
        languageOptions: {
            parser: tsParser
        }
    },
    {
        name: 'JavaScript recommended',
        files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        ignores: ['**/jquery.min.js', '**/bootstrap.min.js'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },
        rules: {
            'no-unused-vars': ['error', {
                args: 'after-used',
                varsIgnorePattern: '^__unused',
                argsIgnorePattern: '^__unused',
                destructuredArrayIgnorePattern: '^__unused',
                caughtErrorsIgnorePattern: '^__unused'
            }]
        }
    },
    {
        name: 'Nx Boundaries',
        files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        ignores: ['**/eslint.config.mjs'],
        // @ts-ignore
        plugins: { '@nx': nxPlugin },
        rules: {
            '@nx/enforce-module-boundaries': [
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
            ]
        }
    },
    {
        name: 'React',
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    {
        name: 'React Compiler',
        ...reactCompiler.configs.recommended
    },
    {
        name: 'JSX Runtime',
        ...pluginReact.configs.flat['jsx-runtime']
    },
    {
        name: 'Testing Library',
        ...testingLibrary.configs['flat/react'],
        files: ['**/*test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*spec.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest
            }
        }
    },
    {
        name: 'Disable legacy rules',
        ...stylistic.configs['disable-legacy']
    },
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended']
    },
    {
        files: ['**/*.{md,mdx}'],
        plugins: { markdown },
        language: 'markdown/gfm',
        extends: ['markdown/recommended']
    },
    {
        files: ['**/*.css'],
        ignores: ['**/bootstrap.min.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
        rules: {
            'css/no-invalid-properties': 'off',
            'css/no-important': 'off',
            'css/use-baseline': 'off'
        }
    },
    {
        name: 'Stylistic rules',
        files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
        ignores: ['**/jquery.min.js', '**/bootstrap.min.js'],
        plugins: { '@stylistic': stylistic },
        rules: {
            ...stylistic.configs['recommended'].rules,
            '@stylistic/indent': 'off',
            '@stylistic/indent-binary-ops': 'off',
            '@stylistic/jsx-indent-props': 'off',
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/semi-style': ['error', 'last'],
            '@stylistic/comma-style': ['error', 'last'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/jsx-wrap-multilines': 'off',
            '@stylistic/max-statements-per-line': 'off'
        }
    },
    {
        name: 'Disable problematic rules',
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        rules: {
            'react/prop-types': 'off',
            'no-prototype-builtins': 'off'
        }
    }
]);
