/** @format */

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'dist/**', 'coverage/**'],
  },
  ...compat.config({
    // extends: [
    //   ...compat.extends('next/core-web-vitals', 'next/typescript'),
    // ],
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_', // ← penting untuk catch!
        },
      ],
    },
  }),
];

eslintConfig.push({
  files: ['src/components/shared/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/modules/*', '@/modules/**', '../modules/*', '../../modules/*'],
      },
    ],
  },
});

export default eslintConfig;
