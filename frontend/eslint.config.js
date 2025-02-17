import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
// import react from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  pluginReact.configs.flat.recommended,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 12,
      parser: tsParser,
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'react/require-default-props': 'off',
      'dot-notation': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
        },
      ],
      'no-param-reassign': [
        2,
        {
          props: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-unused-vars': 'off',
      'react/no-unstable-nested-components': 'off',
      'react/no-children-prop': 'off',
      'react/jsx-props-no-spreading': 0,
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'no-plusplus': 'warn',
      'no-console': 0,
      'react/state-in-constructor': 0,
      indent: 0,
      'linebreak-style': 0,
      'react/prop-types': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.tsx'],
        },
      ],
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          semi: true,
          endOfLine: 'auto',
          parser: 'typescript',
          usePrettierrc: false,
        },
      ],
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
];
