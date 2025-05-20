import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import * as globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort,
      react,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['position', 'args', 'rotation', 'scale', 'map'],
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
            ['^\\.\\.(?!/?$)', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(types|interfaces)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
