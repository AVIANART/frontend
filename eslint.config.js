// @ts-check

import eslint from '@eslint/js';
import tsEsLint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin';
import vueEsLint from 'eslint-plugin-vue';
import vueEsLintParser from 'vue-eslint-parser';

export default [
    eslint.configs.recommended,
    ...tsEsLint.configs.recommended,
    stylisticTs.configs['recommended-flat'],
    ...vueEsLint.configs['flat/recommended'],
    {
        ignores: ['**/*.vue'],
        plugins: {
            '@stylistic': stylisticTs,
        },
        rules: {
            'semi': 'off',
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': 'off',
            '@stylistic/eol-last': 'off',
            '@stylistic/quotes': ['warn', 'single'],
            '@stylistic/indent': ['warn', 4],
            '@stylistic/no-multiple-empty-lines': 'off',
            '@stylistic/keyword-spacing': ['warn', { overrides: { for: { after: false }, switch: { after: false }, if: { after: false } } }],
            'vue/max-attributes-per-line': 'off',
            'vue/html-indent': ['warn', 4],
            'vue/singleline-html-element-content-newline': 'off',
            'vue/script-indent': ['error', 4, {
                baseIndent: 1,
                switchCase: 1,
                ignores: []
            }]
        },
        languageOptions: {
            parser: vueEsLintParser,
            parserOptions: {
                parser: tsEsLint.parser,
                EXPERIMENTAL_useProjectService: true
            }
        }
    },
    {
        files: ['**/*.vue'],
        plugins: {
            '@stylistic': stylisticTs,
        },
        rules: {
            'semi': 'off',
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': 'off',
            '@stylistic/eol-last': 'off',
            '@stylistic/quotes': ['warn', 'single'],
            '@stylistic/indent': 'off',
            '@stylistic/no-multiple-empty-lines': 'off',
            '@stylistic/keyword-spacing': ['warn', { overrides: { for: { after: false }, switch: { after: false }, if: { after: false } } }],
            'vue/no-mutating-props': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/html-indent': ['warn', 4],
            'vue/singleline-html-element-content-newline': 'off',
            'vue/script-indent': ['error', 4, {
                baseIndent: 1,
                switchCase: 1,
                ignores: []
            }]
        },
        languageOptions: {
            parser: vueEsLintParser,
            parserOptions: {
                parser: tsEsLint.parser,
                EXPERIMENTAL_useProjectService: true
            }
        }
    }
];