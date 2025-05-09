import js from '@eslint/js';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: false, // ✅ typescript-eslint 에러 해결
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'simple-import-sort': simpleImportSort,
      react: react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,

      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^.+\\.?(css|scss|sass|less)$'],
            ['^react', '^@?\\w'],
            [
              '^@/backend/domain',
              '^@/backend/usecases',
              '^@/backend/infra',
              '^@/backend',
            ],
            ['^@/app'],
            ['^@/components'],
            ['^@/utils'],
            ['^@/assets'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(types|interfaces)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      
    },
    settings: {
      react: {
        version: 'detect', // ✅ 경고 해결
      },
    },
  },
];
