const path = require('path');
const prettierOptions = require(path.resolve(__dirname, 'prettier.config.cjs'));

module.exports = {
  extends: [
    'react-app',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  plugins: ['prettier', 'react', 'jest'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
  },
  overrides: [
    {
      files: ['src/**/*.ts?(x)'],
      rules: {
        'prettier/prettier': ['warn', prettierOptions],
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-anonymous-default-export': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
