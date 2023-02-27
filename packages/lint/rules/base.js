module.exports = {
  plugins: ['import', 'prettier'],
  extends: ['eslint-config-ali', 'eslint:recommended', 'plugin:prettier/recommended', './custom'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
};
